import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const seedCabins = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("cabins").first();
    if (existing) return "Cabins already seeded";
    for (let number = 1; number <= 72; number++) {
      await ctx.db.insert("cabins", { number, status: "available" });
    }
    return "Seeded 72 cabins";
  },
});

export const seedAdmin = internalMutation({
  args: { email: v.string(), name: v.string() },
  handler: async (ctx, { email, name }) => {
    const e = email.trim().toLowerCase();
    const existing = await ctx.db
      .query("staffUsers")
      .withIndex("by_email", (q) => q.eq("email", e))
      .unique();
    if (existing) return "Already exists";
    await ctx.db.insert("staffUsers", {
      email: e,
      name,
      role: "admin",
      active: true,
    });
    await ctx.db.insert("auditLogs", {
      actor: "system",
      action: "create",
      entity: "staffUsers",
      entityId: e,
      summary: `Admin ${e} created from the command line`,
      at: Date.now(),
    });
    return "Admin created";
  },
});
