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
