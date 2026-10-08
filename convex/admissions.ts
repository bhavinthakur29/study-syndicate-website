import { ConvexError, v } from "convex/values";
import { mutation, type MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { requireAdmin } from "./lib/auth";
import { logAudit } from "./lib/audit";
import { safe } from "./lib/result";
import { DAY, addMonthsIST } from "./lib/dates";
import { nextReceiptNo, paidFor } from "./lib/payments";
import { text } from "./lib/validate";
import { memberFields, sanitize } from "./members";
import { checkAmount, checkDates } from "./memberships";

const method = v.union(v.literal("cash"), v.literal("upi"));

function checkPaid(paidNow: number, max: number, paidOn: number) {
  if (!Number.isInteger(paidNow) || paidNow < 0)
    throw new ConvexError("Fee received must be a whole number of rupees");
  if (paidNow > max)
    throw new ConvexError(
      `Fee received can't be more than the amount due (₹${max.toLocaleString("en-IN")})`,
    );
  if (paidNow > 0) {
    const now = Date.now();
    if (!Number.isFinite(paidOn) || paidOn > now + DAY)
      throw new ConvexError("The payment date can't be in the future");
    if (paidOn < now - 800 * DAY)
      throw new ConvexError("The payment date looks wrong");
  }
}

async function takePayment(
  ctx: MutationCtx,
  p: {
    memberId: Id<"members">;
    membershipId: Id<"memberships">;
    name: string;
    amount: number;
    method: "cash" | "upi";
    reference?: string;
    paidOn: number;
    by: string;
  },
) {
  const reference =
    p.method === "upi" ? text(p.reference, "Reference", 40) : undefined;
  const receiptNo = await nextReceiptNo(ctx);
  const id = await ctx.db.insert("payments", {
    memberId: p.memberId,
    membershipId: p.membershipId,
    amount: p.amount,
    method: p.method,
    reference,
    receiptNo,
    receivedAt: p.paidOn,
    recordedBy: p.by,
    status: "received",
  });
  await logAudit(
    ctx,
    p.by,
    "create",
    "payments",
    id,
    `Fee ₹${p.amount} (${p.method}) from ${p.name}, receipt ${receiptNo}`,
  );
  return receiptNo;
}

export const admit = mutation({
  args: {
    memberId: v.optional(v.id("members")),
    newMember: v.optional(v.object(memberFields)),
    cabinNumber: v.number(),
    plan: v.union(v.literal("offer"), v.literal("monthly")),
    amountDue: v.number(),
    startDate: v.number(),
    endDate: v.number(),
    paidNow: v.number(),
    method,
    reference: v.optional(v.string()),
    paidOn: v.number(),
  },
  handler: (ctx, a) =>
    safe(async () => {
      const admin = await requireAdmin(ctx);
      if (!a.memberId === !a.newMember)
        throw new ConvexError("Choose an existing student or enter a new one");

      checkAmount(a.amountDue);
      checkDates(a.startDate, a.endDate);
      checkPaid(a.paidNow, a.amountDue, a.paidOn);

      // Everything is checked before anything is written.
      const existingId = a.memberId;
      const clean = a.newMember ? sanitize(a.newMember) : null;
      let name: string;
      let phone: string;

      if (existingId) {
        const m = await ctx.db.get(existingId);
        if (!m || m.status !== "active")
          throw new ConvexError("Student not found or not active");
        const bookings = await ctx.db
          .query("memberships")
          .withIndex("by_member", (q) => q.eq("memberId", existingId))
          .collect();
        if (bookings.some((b) => b.status === "active"))
          throw new ConvexError(
            "This student already has an active cabin booking",
          );
        name = m.name;
        phone = m.phone;
      } else {
        const c = clean!;
        const dup = await ctx.db
          .query("members")
          .withIndex("by_phone", (q) => q.eq("phone", c.phone))
          .first();
        if (dup)
          throw new ConvexError(
            "A student with this mobile number already exists. Choose them from the list instead.",
          );
        name = c.name;
        phone = c.phone;
      }

      const cabin = await ctx.db
        .query("cabins")
        .withIndex("by_number", (q) => q.eq("number", a.cabinNumber))
        .unique();
      if (!cabin) throw new ConvexError("Cabin not found");
      if (cabin.status !== "available")
        throw new ConvexError(`Cabin ${a.cabinNumber} is not available`);

      let memberId: Id<"members">;
      if (existingId) {
        memberId = existingId;
      } else {
        memberId = await ctx.db.insert("members", {
          ...clean!,
          status: "active",
          joinedAt: Math.min(a.startDate, Date.now()),
        });
        await logAudit(
          ctx,
          admin.email,
          "create",
          "members",
          memberId,
          `Added student ${name}`,
        );
      }

      const membershipId = await ctx.db.insert("memberships", {
        memberId,
        cabinNumber: a.cabinNumber,
        plan: a.plan,
        amountDue: a.amountDue,
        startDate: a.startDate,
        endDate: a.endDate,
        status: "active",
      });
      await ctx.db.patch(cabin._id, { status: "occupied" });
      await logAudit(
        ctx,
        admin.email,
        "create",
        "memberships",
        membershipId,
        `Admitted ${name} to cabin ${a.cabinNumber}`,
      );

      let receiptNo: string | null = null;
      if (a.paidNow > 0) {
        receiptNo = await takePayment(ctx, {
          memberId,
          membershipId,
          name,
          amount: a.paidNow,
          method: a.method,
          reference: a.reference,
          paidOn: a.paidOn,
          by: admin.email,
        });
      }

      return {
        memberName: name,
        phone,
        cabinNumber: a.cabinNumber,
        endDate: a.endDate,
        receiptNo,
        paid: a.paidNow,
        balance: a.amountDue - a.paidNow,
      };
    }),
});

export const renew = mutation({
  args: {
    id: v.id("memberships"),
    months: v.number(),
    amount: v.number(),
    paidNow: v.number(),
    method,
    reference: v.optional(v.string()),
  },
  handler: (ctx, a) =>
    safe(async () => {
      const admin = await requireAdmin(ctx);
      if (!Number.isInteger(a.months) || a.months < 1 || a.months > 12)
        throw new ConvexError("Months must be between 1 and 12");
      checkAmount(a.amount);

      const m = await ctx.db.get(a.id);
      if (!m || m.status !== "active")
        throw new ConvexError("Only an active cabin booking can be renewed");
      const member = await ctx.db.get(m.memberId);
      if (!member) throw new ConvexError("Student not found");

      const endDate = addMonthsIST(m.endDate, a.months);
      if (endDate < Date.now())
        throw new ConvexError(
          "That would still end in the past. End this booking and book the cabin again.",
        );

      const paid = await paidFor(ctx, a.id, m.memberId);
      const newDue = m.amountDue + a.amount;
      const paidOn = Date.now();
      checkPaid(a.paidNow, newDue - paid, paidOn);

      await ctx.db.patch(a.id, { endDate, amountDue: newDue });
      await logAudit(
        ctx,
        admin.email,
        "extend",
        "memberships",
        a.id,
        `Renewed ${member.name} (cabin ${m.cabinNumber}) for ${a.months} month(s)`,
      );

      let receiptNo: string | null = null;
      if (a.paidNow > 0) {
        receiptNo = await takePayment(ctx, {
          memberId: m.memberId,
          membershipId: a.id,
          name: member.name,
          amount: a.paidNow,
          method: a.method,
          reference: a.reference,
          paidOn,
          by: admin.email,
        });
      }
      return {
        memberName: member.name,
        phone: member.phone,
        cabinNumber: m.cabinNumber,
        endDate,
        receiptNo,
        balance: newDue - paid - a.paidNow,
      };
    }),
});
