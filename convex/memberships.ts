import { ConvexError, v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
} from "./_generated/server";
import { requireAdmin } from "./lib/auth";
import { logAudit } from "./lib/audit";
import { DAY, addMonthsIST } from "./lib/dates";

async function freeCabin(ctx: MutationCtx, number: number) {
  const cabin = await ctx.db
    .query("cabins")
    .withIndex("by_number", (q) => q.eq("number", number))
    .unique();
  if (cabin && cabin.status === "occupied")
    await ctx.db.patch(cabin._id, { status: "available" });
}

function checkAmount(n: number) {
  if (!Number.isInteger(n) || n < 0 || n > 100000) {
    throw new ConvexError("Amount must be a whole number of rupees");
  }
}

function checkDates(start: number, end: number) {
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
      rows.map(async (r) => ({
        ...r,
        memberName: (await ctx.db.get(r.memberId))?.name ?? "Unknown",
      })),
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
  handler: async (ctx, a) => {
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
  },
});

export const extend = mutation({
  args: { id: v.id("memberships"), months: v.number(), amount: v.number() },
  handler: async (ctx, { id, months, amount }) => {
    const admin = await requireAdmin(ctx);
    if (!Number.isInteger(months) || months < 1 || months > 12) {
      throw new ConvexError("Months must be between 1 and 12");
    }
    checkAmount(amount);

    const m = await ctx.db.get(id);
    if (!m || m.status !== "active")
      throw new ConvexError("Only an active membership can be extended");

    const endDate = addMonthsIST(m.endDate, months);
    if (endDate < Date.now()) {
      throw new ConvexError(
        "That would still end in the past. End this membership and create a new one.",
      );
    }

    await ctx.db.patch(id, { endDate, amountDue: m.amountDue + amount });
    const member = await ctx.db.get(m.memberId);
    await logAudit(
      ctx,
      admin.email,
      "extend",
      "memberships",
      id,
      `Extended ${member?.name ?? "member"} (cabin ${m.cabinNumber}) by ${months} month(s)`,
    );
  },
});

export const cancel = mutation({
  args: { id: v.id("memberships") },
  handler: async (ctx, { id }) => {
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
  },
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
