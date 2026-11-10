import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { createRedisConnection } from './redis.js';
import { logger } from './logger.js';

/**
 * Topic naming: entity-scoped topics (e.g. `ORDER_UPDATED:<orderId>`) so that a
 * subscription only receives the events it needs, without fan-out filtering.
 */
export const topics = {
  customerOrders: (userId: string) => `CUSTOMER_ORDERS:${userId}`,
  restaurantOrders: (restaurantId: string) => `RESTAURANT_ORDERS:${restaurantId}`,
  riderAssignments: (riderId: string) => `RIDER_ASSIGNMENTS:${riderId}`,
  zoneOrders: (zoneId: string) => `ZONE_ORDERS:${zoneId}`,
  dispatcher: () => 'DISPATCHER',
  order: (orderId: string) => `ORDER_UPDATED:${orderId}`,
  orderTracking: (orderId: string) => `ORDER_TRACKING:${orderId}`,
  paymentSuccess: (userId: string) => `PAYMENT_SUCCESS:${userId}`,
  chat: (orderId: string) => `CHAT:${orderId}`,
  riderLocation: (riderId: string) => `RIDER_LOCATION:${riderId}`,
  riderUpdated: () => 'RIDER_UPDATED',
} as const;

interface PubSubEngineLike {
  publish(trigger: string, payload: unknown): Promise<void>;
  asyncIterator<T>(triggers: string | string[]): AsyncIterator<T>;
}

class MemoryEngine implements PubSubEngineLike {
  private readonly ps = new PubSub();
  publish(trigger: string, payload: unknown): Promise<void> {
    return this.ps.publish(trigger, payload as never);
  }
  asyncIterator<T>(triggers: string | string[]): AsyncIterator<T> {
    return this.ps.asyncIterableIterator<T>(triggers);
  }
}

class RedisEngine implements PubSubEngineLike {
  constructor(private readonly ps: RedisPubSub) {}
  publish(trigger: string, payload: unknown): Promise<void> {
    return this.ps.publish(trigger, payload);
  }
  asyncIterator<T>(triggers: string | string[]): AsyncIterator<T> {
    const anyPs = this.ps as unknown as {
      asyncIterableIterator?: <U>(t: string | string[]) => AsyncIterator<U>;
      asyncIterator: <U>(t: string | string[]) => AsyncIterator<U>;
    };
    return anyPs.asyncIterableIterator ? anyPs.asyncIterableIterator<T>(triggers) : anyPs.asyncIterator<T>(triggers);
  }
}

let engine: PubSubEngineLike | null = null;
let redisPs: RedisPubSub | null = null;

function getEngine(): PubSubEngineLike {
  if (engine) return engine;
  const publisher = createRedisConnection('pub');
  const subscriber = createRedisConnection('sub');
  if (publisher && subscriber) {
    redisPs = new RedisPubSub({ publisher, subscriber });
    engine = new RedisEngine(redisPs);
    logger.info('PubSub: Redis');
  } else {
    engine = new MemoryEngine();
    logger.info('PubSub: in-memory (single instance only)');
  }
  return engine;
}

export const pubsub = {
  async publish(topic: string, payload: unknown): Promise<void> {
    try {
      await getEngine().publish(topic, payload);
    } catch (err) {
      logger.error({ err, topic }, 'Failed to publish event');
    }
  },
  subscribe<T = unknown>(topic: string | string[]): AsyncIterator<T> {
    return getEngine().asyncIterator<T>(topic);
  },
  async close(): Promise<void> {
    if (redisPs) await redisPs.close();
  },
};
