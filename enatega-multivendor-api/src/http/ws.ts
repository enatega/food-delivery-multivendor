import type { Server } from 'node:http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe, type GraphQLSchema } from 'graphql';
import { buildContext } from '../graphql/context.js';
import { logger } from '../lib/logger.js';
import { wsConnections } from '../lib/metrics.js';

const GRAPHQL_PATH = '/graphql';

/**
 * WebSocket endpoint for subscriptions. Supports both protocols on /graphql:
 *  - `graphql-transport-ws` (graphql-ws, modern clients)
 *  - `graphql-ws` (legacy subscriptions-transport-ws, used by the Enatega apps)
 * The protocol is chosen from the Sec-WebSocket-Protocol header.
 */
export function attachWebSockets(httpServer: Server, schema: GraphQLSchema) {
  const modern = new WebSocketServer({ noServer: true, maxPayload: 1024 * 1024 });
  const legacy = new WebSocketServer({ noServer: true, maxPayload: 1024 * 1024 });

  const modernCleanup = useServer(
    {
      schema,
      context: (ctx) =>
        buildContext({
          headers: { ...(ctx.connectionParams ?? {}), ...pickHeaders(ctx.extra.request.headers) },
          ip: ctx.extra.request.socket.remoteAddress,
          transport: 'ws',
        }),
      onConnect: () => {
        wsConnections.inc({ protocol: 'graphql-transport-ws' });
        return true;
      },
      onDisconnect: () => {
        wsConnections.dec({ protocol: 'graphql-transport-ws' });
      },
    },
    modern,
  );

  const legacyServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      keepAlive: 15_000,
      onConnect: (connectionParams: Record<string, unknown> | undefined, _socket: unknown, connCtx: { request: { headers: Record<string, unknown>; socket: { remoteAddress?: string } } }) => {
        wsConnections.inc({ protocol: 'graphql-ws' });
        return { connectionParams: connectionParams ?? {}, headers: pickHeaders(connCtx.request.headers), ip: connCtx.request.socket.remoteAddress };
      },
      onDisconnect: () => {
        wsConnections.dec({ protocol: 'graphql-ws' });
      },
      onOperation: (_msg: unknown, params: Record<string, unknown>, socket: { upgradeReq?: unknown }) => {
        const base = (params.context ?? {}) as { connectionParams?: Record<string, unknown>; headers?: Record<string, unknown>; ip?: string };
        void socket;
        return {
          ...params,
          context: buildContext({ headers: { ...(base.connectionParams ?? {}), ...(base.headers ?? {}) }, ip: base.ip, transport: 'ws' }),
        };
      },
    } as never,
    legacy as never,
  );

  httpServer.on('upgrade', (req, socket, head) => {
    const { pathname } = new URL(req.url ?? '/', 'http://localhost');
    if (pathname !== GRAPHQL_PATH && pathname !== `${GRAPHQL_PATH}/`) {
      socket.destroy();
      return;
    }
    const protocols = String(req.headers['sec-websocket-protocol'] ?? '')
      .split(',')
      .map((p) => p.trim());
    const target = protocols.includes('graphql-transport-ws') ? modern : legacy;
    target.handleUpgrade(req, socket, head, (ws) => target.emit('connection', ws, req));
  });

  logger.info('WebSocket subscriptions enabled (graphql-transport-ws + legacy graphql-ws)');

  return async () => {
    legacyServer.close();
    await modernCleanup.dispose();
    for (const ws of [...modern.clients, ...legacy.clients]) ws.terminate();
    modern.close();
    legacy.close();
  };
}

/** Only forward the connection headers that matter for auth/observability (never cookies). */
function pickHeaders(h: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of ['user-agent', 'x-request-id', 'x-client-type', 'x-platform', 'accept-language']) if (h[k]) out[k] = h[k];
  return out;
}
