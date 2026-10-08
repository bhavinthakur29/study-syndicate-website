import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAdmin } from "./lib/auth";
import { logAudit } from "./lib/audit";
import { safe } from "./lib/result";
import { toDateInput } from "./lib/dates";

const LIMIT = 3000;

// A mutation (not a query) so every export is written to the audit log.
export const exportData = mutation({
  args: {
    scope: v.union(
      v.literal("members"),
      v.literal("memberships"),
      v.literal("payments"),
      v.literal("everything"),
    ),
  },
  handler: (ctx, { scope }) =>
    safe(async () => {
      const admin = await requireAdmin(ctx);

      const members = await ctx.db.query("members").take(LIMIT + 1);
      const memberships =
        scope === "members"
          ? []
          : await ctx.db.query("memberships").take(LIMIT + 1);
      const payments =
        scope === "members"
          ? []
          : await ctx.db.query("payments").take(LIMIT + 1);

      if ([members, memberships, payments].some((r) => r.length > LIMIT)) {
        throw new ConvexError(
          "Too many records for an in-app export. Use the command-line backup instead.",
        );
      }

      const memberById = new Map(members.map((m) => [m._id, m]));
      const cabinByMembership = new Map(
        memberships.map((m) => [m._id, m.cabinNumber]),
      );
      const paidByMembership = new Map<string, number>();
      for (const p of payments) {
        if (p.status === "received") {
          paidByMembership.set(
            p.membershipId,
            (paidByMembership.get(p.membershipId) ?? 0) + p.amount,
          );
        }
      }

      const out = {
        members: members.map((m) => ({
          name: m.name,
          phone: m.phone,
          email: m.email ?? "",
          exam: m.exam ?? "",
          under18: m.isMinor ? "yes" : "no",
          guardianName: m.guardianName ?? "",
          guardianPhone: m.guardianPhone ?? "",
          status: m.status,
          joined: toDateInput(m.joinedAt),
          notes: m.notes ?? "",
        })),
        memberships: memberships.map((m) => {
          const paid = paidByMembership.get(m._id) ?? 0;
          return {
            member: memberById.get(m.memberId)?.name ?? "Unknown",
            cabin: m.cabinNumber,
            plan: m.plan,
            amountDue: m.amountDue,
            paid,
            balance: m.amountDue - paid,
            start: toDateInput(m.startDate),
            end: toDateInput(m.endDate),
            status: m.status,
          };
        }),
        payments: payments.map((p) => ({
          receiptNo: p.receiptNo,
          date: toDateInput(p.receivedAt),
          member: memberById.get(p.memberId)?.name ?? "Unknown",
          cabin: cabinByMembership.get(p.membershipId) ?? "",
          amount: p.amount,
          method: p.method,
          reference: p.reference ?? "",
          status: p.status,
          voidReason: p.voidReason ?? "",
          recordedBy: p.recordedBy,
        })),
      };

      await logAudit(
        ctx,
        admin.email,
        "export",
        "backup",
        scope,
        `Exported ${scope}: ${members.length} members, ${memberships.length} memberships, ${payments.length} payments`,
      );
      return out;
    }),
});
