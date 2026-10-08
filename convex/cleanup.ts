import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

// DEV ONLY. Never run this with --prod. Delete this file once real data is in.
export const wipeTestData = internalMutation({
  args: { confirm: v.literal("DELETE-ALL-TEST-DATA") },
  handler: async (ctx) => {
    for (const table of [
      "payments",
      "memberships",
      "members",
      "auditLogs",
      "counters",
    ] as const) {
      const rows = await ctx.db.query(table).collect();
      for (const r of rows) await ctx.db.delete(r._id);
    }
    const cabins = await ctx.db.query("cabins").collect();
    for (const c of cabins) await ctx.db.patch(c._id, { status: "available" });
    return "Test data cleared";
  },
});
