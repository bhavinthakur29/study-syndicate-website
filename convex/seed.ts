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
