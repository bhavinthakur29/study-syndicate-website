import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Who may sign in. Staff exists in the schema now but has no screens yet.
  staffUsers: defineTable({
    email: v.string(), // always stored lowercase
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("staff")),
    active: v.boolean(),
  }).index("by_email", ["email"]),

  members: defineTable({
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    exam: v.optional(v.string()),
    isMinor: v.boolean(),
    guardianName: v.optional(v.string()),
    guardianPhone: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    notes: v.optional(v.string()),
    joinedAt: v.number(),
  }).index("by_phone", ["phone"]),

  cabins: defineTable({
    number: v.number(),
    status: v.union(
      v.literal("available"),
      v.literal("occupied"),
      v.literal("maintenance"),
    ),
  }).index("by_number", ["number"]),

  memberships: defineTable({
    memberId: v.id("members"),
    cabinNumber: v.number(),
    plan: v.string(),
    amountDue: v.number(), // whole rupees
    startDate: v.number(),
    endDate: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("expired"),
      v.literal("cancelled"),
    ),
  })
    .index("by_member", ["memberId"])
    .index("by_status_end", ["status", "endDate"]),

  // Append-only. A correction is a void, never an edit.
  payments: defineTable({
    memberId: v.id("members"),
    membershipId: v.id("memberships"),
    amount: v.number(), // whole rupees
    method: v.union(v.literal("cash"), v.literal("upi")),
    reference: v.optional(v.string()),
    receiptNo: v.string(),
    receivedAt: v.number(),
    recordedBy: v.string(),
    status: v.union(v.literal("received"), v.literal("void")),
    voidReason: v.optional(v.string()),
  }).index("by_member", ["memberId"]),

  auditLogs: defineTable({
    actor: v.string(),
    action: v.string(),
    entity: v.string(),
    entityId: v.string(),
    summary: v.string(),
    at: v.number(),
  }).index("by_time", ["at"]),
});
