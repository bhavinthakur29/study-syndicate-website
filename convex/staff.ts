import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getStaff } from "./lib/auth";
import { logAudit } from "./lib/audit";
import { safe } from "./lib/result";
import { text } from "./lib/validate";

export const me = query({
  args: {},
  handler: async (ctx) => {
    const user = await getStaff(ctx);
    return user
      ? { name: user.name, email: user.email, role: user.role }
      : null;
  },
});

export const updateName = mutation({
  args: { name: v.string() },
  handler: (ctx, { name }) =>
    safe(async () => {
      const user = await getStaff(ctx);
      if (!user) throw new Error("Not authorized");
      const clean = text(name, "Name", 60, true)!;
      await ctx.db.patch(user._id, { name: clean });
      await logAudit(
        ctx,
        user.email,
        "update",
        "staffUsers",
        user._id,
        "Changed own display name",
      );
    }),
});
