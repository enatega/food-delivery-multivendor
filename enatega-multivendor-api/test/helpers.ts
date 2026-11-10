import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import mongoose from 'mongoose';
import WebSocket from 'ws';
import { connectMongo } from '../src/lib/mongo.js';
import { buildSchema } from '../src/graphql/schema.js';
import { createApp } from '../src/http/app.js';
import { attachWebSockets } from '../src/http/ws.js';
import { seedDemoData } from '../src/scripts/seed.js';

export interface TestServer {
  url: string;
  wsUrl: string;
  ids: Awaited<ReturnType<typeof seedDemoData>>;
  close: () => Promise<void>;
}

export async function startTestServer(): Promise<TestServer> {
  await connectMongo();
  // Clear data without dropping collections (keeps index files; cheaper and avoids fd churn).
  await Promise.all(Object.values(mongoose.models).map(async (m) => {
    await m.createCollection().catch(() => undefined);
    await m.syncIndexes();
    await m.deleteMany({});
  }));
  const ids = await seedDemoData();
  const schema = buildSchema();
  const httpServer: Server = createServer();
  const { app, apollo } = await createApp(httpServer, schema);
  httpServer.on('request', app);
  const closeWs = attachWebSockets(httpServer, schema);
  await new Promise<void>((r) => httpServer.listen(0, '127.0.0.1', r));
  const { port } = httpServer.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}`,
    wsUrl: `ws://127.0.0.1:${port}/graphql`,
    ids,
    close: async () => {
      await closeWs();
      await apollo.stop();
      await new Promise<void>((r) => httpServer.close(() => r()));
      await mongoose.disconnect();
    },
  };
}

export interface GqlResult<T = any> {
  data?: T;
  errors?: { message: string; extensions?: { code?: string } }[];
}

export async function gql<T = any>(server: TestServer, query: string, variables: Record<string, unknown> = {}, token?: string, headers: Record<string, string> = {}): Promise<GqlResult<T>> {
  const res = await fetch(`${server.url}/graphql`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}), ...headers },
    body: JSON.stringify({ query, variables }),
  });
  return (await res.json()) as GqlResult<T>;
}

/** Throws with the GraphQL errors when the operation failed. */
export async function ok<T = any>(server: TestServer, query: string, variables: Record<string, unknown> = {}, token?: string): Promise<T> {
  const r = await gql<T>(server, query, variables, token);
  if (r.errors?.length) throw new Error(`GraphQL error: ${JSON.stringify(r.errors)}`);
  return r.data!;
}

/**
 * Minimal client for the legacy `graphql-ws` (subscriptions-transport-ws) protocol used by the apps.
 * Resolves `next()` with the next data payload.
 */
export async function legacySubscribe(server: TestServer, query: string, variables: Record<string, unknown>, token: string) {
  const ws = new WebSocket(server.wsUrl, 'graphql-ws');
  const queue: unknown[] = [];
  const waiters: ((v: unknown) => void)[] = [];
  ws.on('message', (raw) => {
    const msg = JSON.parse(String(raw));
    if (msg.type === 'data' || msg.type === 'error') {
      const w = waiters.shift();
      if (w) w(msg.payload);
      else queue.push(msg.payload);
    }
  });
  await new Promise<void>((resolve, reject) => {
    ws.once('open', () => {
      ws.send(JSON.stringify({ type: 'connection_init', payload: { authorization: `Bearer ${token}` } }));
      ws.once('message', (raw) => {
        const msg = JSON.parse(String(raw));
        if (msg.type === 'connection_ack') resolve();
        else reject(new Error(`unexpected ${msg.type}`));
      });
    });
    ws.once('error', reject);
  });
  ws.send(JSON.stringify({ id: '1', type: 'start', payload: { query, variables } }));
  await new Promise((r) => setTimeout(r, 150));
  return {
    next: (timeoutMs = 4000) =>
      new Promise<any>((resolve, reject) => {
        if (queue.length) return resolve(queue.shift());
        const t = setTimeout(() => reject(new Error('subscription timeout')), timeoutMs);
        waiters.push((v) => {
          clearTimeout(t);
          resolve(v);
        });
      }),
    close: () => ws.close(),
  };
}
