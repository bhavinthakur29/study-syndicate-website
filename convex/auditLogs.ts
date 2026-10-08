import { query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

export const recent = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return ctx.db
      .query("auditLogs")
      .withIndex("by_time")
      .order("desc")
      .take(300);
  },
});
