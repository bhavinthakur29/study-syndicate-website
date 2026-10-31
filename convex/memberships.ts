import { ConvexError, v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
} from "./_generated/server";
import { requireAdmin } from "./lib/auth";
import { logAudit } from "./lib/audit";
import { DAY } from "./lib/dates";
import { paidFor } from "./lib/payments";
import { safe } from "./lib/result";

async function freeCabin(ctx: MutationCtx, number: number) {
  const cabin = await ctx.db
    .query("cabins")
    .withIndex("by_number", (q) => q.eq("number", number))
    .unique();
  if (cabin && cabin.status === "occupied")
    await ctx.db.patch(cabin._id, { status: "available" });
}

export function checkAmount(n: number) {
  if (!Number.isInteger(n) || n < 0 || n > 100000) {
    throw new ConvexError("Amount must be a whole number of rupees");
  }
}

export function checkDates(start: number, end: number) {
  if (!Number.isFinite(start) || !Number.isFinite(end))
    throw new ConvexError("Invalid dates");
  if (end <= start)
    throw new ConvexError("End date must be after the start date");
  if (end - start > 400 * DAY)
    throw new ConvexError("A membership can't be longer than about 13 months");
  const now = Date.now();
  if (start < now - 800 * DAY || start > now + 365 * DAY)
    throw new ConvexError("Start date looks wrong");
}

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db
      .query("memberships")
      .withIndex("by_status_end", (q) => q.eq("status", "active"))
      .take(200);
    return Promise.all(
      rows.map(async (r) => {
        const paid = await paidFor(ctx, r._id, r.memberId);
        return {
          ...r,
          memberName: (await ctx.db.get(r.memberId))?.name ?? "Unknown",
          paid,
          balance: r.amountDue - paid,
        };
      }),
    );
  },
});

export const assign = mutation({
  args: {
    memberId: v.id("members"),
    cabinNumber: v.number(),
    plan: v.union(v.literal("offer"), v.literal("monthly")),
    amountDue: v.number(),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, a) =>
    safe(async () => {
      const admin = await requireAdmin(ctx);
      checkAmount(a.amountDue);
      checkDates(a.startDate, a.endDate);

      const member = await ctx.db.get(a.memberId);
      if (!member || member.status !== "active")
        throw new ConvexError("Member not found or inactive");

      const existing = await ctx.db
        .query("memberships")
        .withIndex("by_member", (q) => q.eq("memberId", a.memberId))
        .collect();
      if (existing.some((m) => m.status === "active")) {
        throw new ConvexError("This member already has an active membership");
      }

      const cabin = await ctx.db
        .query("cabins")
        .withIndex("by_number", (q) => q.eq("number", a.cabinNumber))
        .unique();
      if (!cabin) throw new ConvexError("Cabin not found");
      if (cabin.status !== "available")
        throw new ConvexError(`Cabin ${a.cabinNumber} is not available`);

      const id = await ctx.db.insert("memberships", { ...a, status: "active" });
      await ctx.db.patch(cabin._id, { status: "occupied" });
      await logAudit(
        ctx,
        admin.email,
        "create",
        "memberships",
        id,
        `Assigned cabin ${a.cabinNumber} to ${member.name}`,
      );
      return id;
    }),
});

export const edit = mutation({
  args: {
    id: v.id("memberships"),
    cabinNumber: v.number(),
    plan: v.union(v.literal("offer"), v.literal("monthly")),
    amountDue: v.number(),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: (ctx, a) =>
    safe(async () => {
      const admin = await requireAdmin(ctx);
      checkAmount(a.amountDue);
      checkDates(a.startDate, a.endDate);

      const m = await ctx.db.get(a.id);
      if (!m || m.status !== "active")
        throw new ConvexError("Only a current booking can be edited");

      const paid = await paidFor(ctx, a.id, m.memberId);
      if (a.amountDue < paid) {
        throw new ConvexError(
          `The fee can't be less than what has already been received (₹${paid.toLocaleString("en-IN")})`,
        );
      }

      // Everything is checked before anything is written.
      const moving = a.cabinNumber !== m.cabinNumber;
      const newCabin = moving
        ? await ctx.db
            .query("cabins")
            .withIndex("by_number", (q) => q.eq("number", a.cabinNumber))
            .unique()
        : null;
      if (moving) {
        if (!newCabin) throw new ConvexError("Cabin not found");
        if (newCabin.status !== "available")
          throw new ConvexError(`Cabin ${a.cabinNumber} is not available`);
      }

      const changed = [
        moving && "cabin",
        a.plan !== m.plan && "plan",
        a.amountDue !== m.amountDue && "fee",
        a.startDate !== m.startDate && "start date",
        a.endDate !== m.endDate && "end date",
      ].filter(Boolean);
      if (changed.length === 0) return;

      await ctx.db.patch(a.id, {
        cabinNumber: a.cabinNumber,
        plan: a.plan,
        amountDue: a.amountDue,
        startDate: a.startDate,
        endDate: a.endDate,
      });
      if (newCabin) {
        await freeCabin(ctx, m.cabinNumber);
        await ctx.db.patch(newCabin._id, { status: "occupied" });
      }

      const member = await ctx.db.get(m.memberId);
      await logAudit(
        ctx,
        admin.email,
        "update",
        "memberships",
        a.id,
        `Edited booking of ${member?.name ?? "member"}: ${changed.join(", ")}`,
      );
    }),
});

export const cancel = mutation({
  args: { id: v.id("memberships") },
  handler: async (ctx, { id }) =>
    safe(async () => {
      const admin = await requireAdmin(ctx);
      const m = await ctx.db.get(id);
      if (!m || m.status !== "active")
        throw new ConvexError("Membership is not active");

      await ctx.db.patch(id, { status: "cancelled" });
      await freeCabin(ctx, m.cabinNumber);
      const member = await ctx.db.get(m.memberId);
      await logAudit(
        ctx,
        admin.email,
        "cancel",
        "memberships",
        id,
        `Ended membership of ${member?.name ?? "member"} (cabin ${m.cabinNumber})`,
      );
    }),
});

// Called by the daily cron, not by browsers.
export const expireDue = internalMutation({
  args: {},
  handler: async (ctx) => {
    const due = await ctx.db
      .query("memberships")
      .withIndex("by_status_end", (q) =>
        q.eq("status", "active").lt("endDate", Date.now()),
      )
      .take(200);

    for (const m of due) {
      await ctx.db.patch(m._id, { status: "expired" });
      await freeCabin(ctx, m.cabinNumber);
      await logAudit(
        ctx,
        "system",
        "expire",
        "memberships",
        m._id,
        `Membership ended on schedule (cabin ${m.cabinNumber})`,
      );
    }
    return `Expired ${due.length}`;
  },
});
