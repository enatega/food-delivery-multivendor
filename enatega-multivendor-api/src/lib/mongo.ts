import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from './logger.js';

mongoose.set('strictQuery', true);
// Query-selector injection is prevented at the boundary: every argument is typed by GraphQL
// and validated by zod, so user input never reaches a filter as an object.

export async function connectMongo(uri = env.MONGODB_URI): Promise<typeof mongoose> {
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
  mongoose.connection.on('reconnected', () => logger.info('MongoDB reconnected'));
  mongoose.connection.on('error', (err) => logger.error({ err }, 'MongoDB error'));

  const maxAttempts = 10;
  for (let attempt = 1; ; attempt++) {
    try {
      await mongoose.connect(uri, {
        maxPoolSize: env.MONGODB_MAX_POOL_SIZE,
        serverSelectionTimeoutMS: 10_000,
        autoIndex: true,
      });
      logger.info({ host: mongoose.connection.host, db: mongoose.connection.name }, 'MongoDB connected');
      return mongoose;
    } catch (err) {
      if (attempt >= maxAttempts) throw err;
      const delay = Math.min(1000 * 2 ** attempt, 15_000);
      logger.warn({ err, attempt, delay }, 'MongoDB connection failed, retrying');
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

export async function disconnectMongo(): Promise<void> {
  await mongoose.disconnect();
}

export function mongoReady(): boolean {
  return mongoose.connection.readyState === 1;
}

/** True when the connected deployment supports multi-document transactions (replica set / sharded). */
let txSupport: boolean | undefined;
export async function supportsTransactions(): Promise<boolean> {
  if (txSupport !== undefined) return txSupport;
  try {
    const hello = await mongoose.connection.db!.admin().command({ hello: 1 });
    txSupport = Boolean(hello.setName || hello.msg === 'isdbgrid');
  } catch {
    txSupport = false;
  }
  return txSupport;
}

/** Runs `fn` inside a transaction when supported, otherwise without one. */
export async function withTransaction<T>(fn: (session: mongoose.ClientSession | undefined) => Promise<T>): Promise<T> {
  if (!(await supportsTransactions())) return fn(undefined);
  const session = await mongoose.startSession();
  try {
    let result!: T;
    await session.withTransaction(async () => {
      result = await fn(session);
    });
    return result;
  } finally {
    await session.endSession();
  }
}
