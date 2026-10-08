import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";
import { logAudit } from "./lib/audit";
import { email, phone, text } from "./lib/validate";
import { safe } from "./lib/result";

const memberFields = {
  name: v.string(),
  phone: v.string(),
  email: v.optional(v.string()),
  exam: v.optional(v.string()),
  isMinor: v.boolean(),
  guardianName: v.optional(v.string()),
  guardianPhone: v.optional(v.string()),
  notes: v.optional(v.string()),
};

type Input = {
  name: string;
  phone: string;
  email?: string;
  exam?: string;
  isMinor: boolean;
  guardianName?: string;
  guardianPhone?: string;
  notes?: string;
};

function sanitize(a: Input) {
  const guardianName = a.isMinor
    ? text(a.guardianName, "Guardian name", 80, true)
    : undefined;
  const guardianPhone =
    a.isMinor && a.guardianPhone
      ? phone(a.guardianPhone, "Guardian phone")
      : undefined;
  if (a.isMinor && !guardianPhone)
    throw new ConvexError("Guardian phone is required for minors");

  return {
    name: text(a.name, "Name", 80, true)!,
    phone: phone(a.phone, "Phone"),
    email: email(a.email),
    exam: text(a.exam, "Exam", 80),
    isMinor: a.isMinor,
    guardianName,
    guardianPhone,
    notes: text(a.notes, "Notes", 500),
  };
}

export const list = query({
  args: {
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("all"),
    ),
  },
  handler: async (ctx, { status }) => {
    await requireAdmin(ctx);
    const rows = await ctx.db.query("members").order("desc").take(500);
    const active = await ctx.db
      .query("memberships")
      .withIndex("by_status_end", (q) => q.eq("status", "active"))
      .take(200);
    const holders = new Set(active.map((m) => m.memberId));
    const shown =
      status === "all" ? rows : rows.filter((m) => m.status === status);
    return shown.map((m) => ({
      ...m,
      hasActiveMembership: holders.has(m._id),
    }));
  },
});

export const create = mutation({
  args: memberFields,
  handler: async (ctx, args) =>
    safe(async () => {
      const admin = await requireAdmin(ctx);
      const data = sanitize(args);

      const dup = await ctx.db
        .query("members")
        .withIndex("by_phone", (q) => q.eq("phone", data.phone))
        .first();
      if (dup)
        throw new ConvexError("A member with this phone number already exists");

      const id = await ctx.db.insert("members", {
        ...data,
        status: "active",
        joinedAt: Date.now(),
      });
      await logAudit(
        ctx,
        admin.email,
        "create",
        "members",
        id,
        `Added member ${data.name}`,
      );
      return id;
    }),
});

export const update = mutation({
  args: { id: v.id("members"), ...memberFields },
  handler: async (ctx, { id, ...args }) =>
    safe(async () => {
      const admin = await requireAdmin(ctx);
      const existing = await ctx.db.get(id);
      if (!existing) throw new ConvexError("Member not found");
      const data = sanitize(args);

      if (data.phone !== existing.phone) {
        const dup = await ctx.db
          .query("members")
          .withIndex("by_phone", (q) => q.eq("phone", data.phone))
          .first();
        if (dup && dup._id !== id)
          throw new ConvexError("Another member already has this phone number");
      }

      const changed = (Object.keys(data) as (keyof typeof data)[]).filter(
        (k) => data[k] !== existing[k],
      );
      await ctx.db.patch(id, data);
      await logAudit(
        ctx,
        admin.email,
        "update",
        "members",
        id,
        `Updated member ${data.name}${changed.length ? ` (fields: ${changed.join(", ")})` : " (no changes)"}`,
      );
    }),
});

export const setStatus = mutation({
  args: {
    id: v.id("members"),
    status: v.union(v.literal("active"), v.literal("inactive")),
  },
  handler: async (ctx, { id, status }) =>
    safe(async () => {
      const admin = await requireAdmin(ctx);
      const member = await ctx.db.get(id);
      if (!member) throw new ConvexError("Member not found");

      if (status === "inactive") {
        const memberships = await ctx.db
          .query("memberships")
          .withIndex("by_member", (q) => q.eq("memberId", id))
          .collect();
        if (memberships.some((m) => m.status === "active")) {
          throw new ConvexError(
            "End or cancel this member's active membership first",
          );
        }
      }

      await ctx.db.patch(id, { status });
      await logAudit(
        ctx,
        admin.email,
        status === "inactive" ? "deactivate" : "reactivate",
        "members",
        id,
        `${status === "inactive" ? "Deactivated" : "Reactivated"} member ${member.name}`,
      );
    }),
});
