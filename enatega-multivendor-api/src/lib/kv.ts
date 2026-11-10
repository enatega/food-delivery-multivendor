import { getRedis } from './redis.js';

/**
 * Small key/value store with TTL. Uses Redis when configured, otherwise an
 * in-process map (fine for development and single-instance deployments).
 */
const memory = new Map<string, { value: string; expiresAt: number }>();

function sweep(): void {
  const now = Date.now();
  for (const [k, v] of memory) if (v.expiresAt <= now) memory.delete(k);
}
setInterval(sweep, 60_000).unref();

export const kv = {
  async get(key: string): Promise<string | null> {
    const r = getRedis();
    if (r) return r.get(key);
    const hit = memory.get(key);
    if (!hit || hit.expiresAt <= Date.now()) return null;
    return hit.value;
  },
  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    const r = getRedis();
    if (r) {
      await r.set(key, value, 'EX', ttlSeconds);
      return;
    }
    memory.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  },
  /** Sets the key only if absent. Returns true when the key was set (distributed lock / idempotency). */
  async setNx(key: string, value: string, ttlSeconds: number): Promise<boolean> {
    const r = getRedis();
    if (r) return (await r.set(key, value, 'EX', ttlSeconds, 'NX')) === 'OK';
    const hit = memory.get(key);
    if (hit && hit.expiresAt > Date.now()) return false;
    memory.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
    return true;
  },
  async del(key: string): Promise<void> {
    const r = getRedis();
    if (r) {
      await r.del(key);
      return;
    }
    memory.delete(key);
  },
  /** Atomically increments a counter with a TTL set on first increment. */
  async incr(key: string, ttlSeconds: number): Promise<number> {
    const r = getRedis();
    if (r) {
      const n = await r.incr(key);
      if (n === 1) await r.expire(key, ttlSeconds);
      return n;
    }
    const hit = memory.get(key);
    const now = Date.now();
    const n = hit && hit.expiresAt > now ? Number(hit.value) + 1 : 1;
    memory.set(key, { value: String(n), expiresAt: hit && hit.expiresAt > now ? hit.expiresAt : now + ttlSeconds * 1000 });
    return n;
  },
};
