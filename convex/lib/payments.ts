import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

// Sum of non-void payments for one membership.
export async function paidFor(
  ctx: QueryCtx | MutationCtx,
  membershipId: Id<"memberships">,
  memberId: Id<"members">,
) {
  const rows = await ctx.db
    .query("payments")
    .withIndex("by_member", (q) => q.eq("memberId", memberId))
    .collect();
  return rows
    .filter((p) => p.membershipId === membershipId && p.status === "received")
    .reduce((sum, p) => sum + p.amount, 0);
}

export async function nextReceiptNo(ctx: MutationCtx) {
  const year = new Date(Date.now() + 19_800_000).getUTCFullYear(); // IST year
  const name = `receipt-${year}`;
  const counter = await ctx.db
    .query("counters")
    .withIndex("by_name", (q) => q.eq("name", name))
    .unique();

  let n = 1;
  if (counter) {
    n = counter.value + 1;
    await ctx.db.patch(counter._id, { value: n });
  } else {
    await ctx.db.insert("counters", { name, value: n });
  }
  return `SSL-${year}-${String(n).padStart(4, "0")}`;
}
