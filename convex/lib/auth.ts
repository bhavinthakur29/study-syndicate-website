import type { MutationCtx, QueryCtx } from "../_generated/server";

export async function getStaff(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.email || identity.emailVerified === false) return null;

  const email = identity.email.toLowerCase();
  const user = await ctx.db
    .query("staffUsers")
    .withIndex("by_email", (q) => q.eq("email", email))
    .unique();

  return user && user.active ? user : null;
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const user = await getStaff(ctx);
  if (!user || user.role !== "admin") throw new Error("Not authorized");
  return user;
}
