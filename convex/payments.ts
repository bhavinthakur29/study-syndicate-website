import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";
import { logAudit } from "./lib/audit";
import { nextReceiptNo, paidFor } from "./lib/payments";
import { text } from "./lib/validate";
import { DAY } from "./lib/dates";

export const recent = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db.query("payments").order("desc").take(100);
    return Promise.all(
      rows.map(async (p) => {
        const member = await ctx.db.get(p.memberId);
        const membership = await ctx.db.get(p.membershipId);
        return {
          ...p,
          memberName: member?.name ?? "Unknown",
          cabinNumber: membership?.cabinNumber ?? null,
        };
      }),
    );
  },
});

export const record = mutation({
  args: {
    membershipId: v.id("memberships"),
    amount: v.number(),
    method: v.union(v.literal("cash"), v.literal("upi")),
    reference: v.optional(v.string()),
    receivedAt: v.number(),
  },
  handler: async (ctx, a) => {
    const admin = await requireAdmin(ctx);

    if (!Number.isInteger(a.amount) || a.amount < 1 || a.amount > 100000) {
      throw new ConvexError("Amount must be a whole number of rupees");
    }
    const now = Date.now();
    if (!Number.isFinite(a.receivedAt) || a.receivedAt > now + DAY) {
      throw new ConvexError("The payment date can't be in the future");
    }
    if (a.receivedAt < now - 800 * DAY)
      throw new ConvexError("The payment date looks wrong");

    const membership = await ctx.db.get(a.membershipId);
    if (!membership || membership.status === "cancelled")
      throw new ConvexError("Membership not found");
    const member = await ctx.db.get(membership.memberId);
    if (!member) throw new ConvexError("Member not found");

    const paid = await paidFor(ctx, a.membershipId, membership.memberId);
    const balance = membership.amountDue - paid;
    if (a.amount > balance) {
      throw new ConvexError(
        `That is more than the balance due (₹${balance.toLocaleString("en-IN")})`,
      );
    }

    const reference =
      a.method === "upi" ? text(a.reference, "Reference", 40) : undefined;
    const receiptNo = await nextReceiptNo(ctx);

    const id = await ctx.db.insert("payments", {
      memberId: membership.memberId,
      membershipId: a.membershipId,
      amount: a.amount,
      method: a.method,
      reference,
      receiptNo,
      receivedAt: a.receivedAt,
      recordedBy: admin.email,
      status: "received",
    });
    await logAudit(
      ctx,
      admin.email,
      "create",
      "payments",
      id,
      `Recorded ₹${a.amount} (${a.method}) from ${member.name}, receipt ${receiptNo}`,
    );
    return receiptNo;
  },
});

export const voidPayment = mutation({
  args: { id: v.id("payments"), reason: v.string() },
  handler: async (ctx, { id, reason }) => {
    const admin = await requireAdmin(ctx);
    const why = text(reason, "Reason", 200, true)!;

    const p = await ctx.db.get(id);
    if (!p || p.status !== "received")
      throw new ConvexError("This payment can't be voided");

    await ctx.db.patch(id, { status: "void", voidReason: why });
    await logAudit(
      ctx,
      admin.email,
      "void",
      "payments",
      id,
      `Voided receipt ${p.receiptNo} (₹${p.amount}): ${why}`,
    );
  },
});
