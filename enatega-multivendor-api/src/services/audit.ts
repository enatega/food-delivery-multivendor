import type { GraphQLContext } from '../graphql/context.js';
import { logger } from '../lib/logger.js';
import { AuditLog } from '../models/index.js';

/** Records an administrative action. Never throws. */
export async function audit(
  ctx: GraphQLContext,
  action: string,
  targetType: string,
  targetId: unknown,
  changes?: Record<string, unknown>,
): Promise<void> {
  try {
    const claims = ctx.auth.claims;
    const admin = claims?.typ === 'owner' && claims.ut !== 'RESTAURANT' ? claims.sub : undefined;
    const safe = changes ? JSON.parse(JSON.stringify(changes, (k, v) => (/password|secret|token/i.test(k) ? '[REDACTED]' : v))) : undefined;
    await AuditLog.create({ admin, action, targetType, targetId: targetId ? String(targetId) : undefined, changes: safe });
  } catch (err) {
    logger.error({ err, action }, 'Failed to write audit log');
  }
}
