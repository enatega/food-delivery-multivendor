import { Redis } from 'ioredis';
import { env } from '../config/env.js';
import { logger } from './logger.js';

let client: Redis | null = null;
const extra: Redis[] = [];

function create(name: string): Redis {
  const r = new Redis(env.REDIS_URL!, {
    connectionName: `enatega-api:${name}`,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false,
  });
  r.on('error', (err) => logger.error({ err, name }, 'Redis error'));
  return r;
}

/** Shared command client, or null when REDIS_URL is not configured. */
export function getRedis(): Redis | null {
  if (!env.REDIS_URL) return null;
  if (!client) client = create('main');
  return client;
}

/** Dedicated connection (pub/sub needs its own connections). */
export function createRedisConnection(name: string): Redis | null {
  if (!env.REDIS_URL) return null;
  const r = create(name);
  extra.push(r);
  return r;
}

export async function redisReady(): Promise<boolean> {
  const r = getRedis();
  if (!r) return true;
  try {
    return (await r.ping()) === 'PONG';
  } catch {
    return false;
  }
}

export async function closeRedis(): Promise<void> {
  await Promise.allSettled([client, ...extra].filter(Boolean).map((r) => r!.quit()));
  client = null;
  extra.length = 0;
}
