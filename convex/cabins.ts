import { query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db.query("cabins").withIndex("by_number").take(100);
    return rows.map((c) => ({ number: c.number, status: c.status }));
  },
});

// Public on purpose: returns two numbers only, nothing personal.
export const publicCounts = query({
  args: {},
  handler: async (ctx) => {
    const cabins = await ctx.db.query("cabins").take(200);
    return {
      total: cabins.length,
      available: cabins.filter((c) => c.status === "available").length,
    };
  },
});
