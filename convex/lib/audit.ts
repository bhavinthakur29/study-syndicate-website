import type { MutationCtx } from "../_generated/server";

export async function logAudit(
  ctx: MutationCtx,
  actor: string,
  action: string,
  entity: string,
  entityId: string,
  summary: string,
) {
  await ctx.db.insert("auditLogs", {
    actor,
    action,
    entity,
    entityId,
    summary,
    at: Date.now(),
  });
}
