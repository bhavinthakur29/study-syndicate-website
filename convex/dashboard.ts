import { query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";
import { paidFor } from "./lib/payments";
import { DAY, dayStartIST, monthStartIST } from "./lib/dates";

export const summary = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const now = Date.now();

    const cabins = await ctx.db.query("cabins").take(100);
    const members = await ctx.db.query("members").take(500);
    const active = await ctx.db
      .query("memberships")
      .withIndex("by_status_end", (q) => q.eq("status", "active"))
      .take(200);

    const monthPayments = await ctx.db
      .query("payments")
      .withIndex("by_received", (q) => q.gte("receivedAt", monthStartIST(now)))
      .take(1000);
    const received = monthPayments.filter((p) => p.status === "received");
    const dayStart = dayStartIST(now);
    const month = received.reduce((s, p) => s + p.amount, 0);
    const today = received
      .filter((p) => p.receivedAt >= dayStart)
      .reduce((s, p) => s + p.amount, 0);

    const rows = await Promise.all(
      active.map(async (m) => {
        const paid = await paidFor(ctx, m._id, m.memberId);
        const member = await ctx.db.get(m.memberId);
        return {
          id: m._id,
          memberName: member?.name ?? "Unknown",
          cabinNumber: m.cabinNumber,
          endDate: m.endDate,
          balance: m.amountDue - paid,
        };
      }),
    );

    const owing = rows
      .filter((r) => r.balance > 0)
      .sort((a, b) => b.balance - a.balance);
    const expiring = rows
      .filter((r) => r.endDate - now <= 7 * DAY)
      .sort((a, b) => a.endDate - b.endDate);

    return {
      cabins: {
        total: cabins.length,
        occupied: cabins.filter((c) => c.status === "occupied").length,
        available: cabins.filter((c) => c.status === "available").length,
      },
      activeMembers: members.filter((m) => m.status === "active").length,
      activeMemberships: active.length,
      collected: { today, month },
      dues: {
        total: owing.reduce((s, r) => s + r.balance, 0),
        count: owing.length,
        top: owing.slice(0, 5),
      },
      expiring: expiring.slice(0, 10),
    };
  },
});
