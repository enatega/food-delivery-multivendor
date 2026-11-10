import client from 'prom-client';

export const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry, prefix: 'enatega_' });

export const httpRequestDuration = new client.Histogram({
  name: 'enatega_http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status'] as const,
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [registry],
});

export const graphqlOperations = new client.Counter({
  name: 'enatega_graphql_operations_total',
  help: 'GraphQL operations executed',
  labelNames: ['type', 'name', 'status'] as const,
  registers: [registry],
});

export const graphqlDuration = new client.Histogram({
  name: 'enatega_graphql_operation_duration_seconds',
  help: 'GraphQL operation duration',
  labelNames: ['type', 'name'] as const,
  buckets: [0.005, 0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [registry],
});

export const wsConnections = new client.Gauge({
  name: 'enatega_ws_connections',
  help: 'Open WebSocket connections',
  labelNames: ['protocol'] as const,
  registers: [registry],
});

export const ordersPlaced = new client.Counter({
  name: 'enatega_orders_placed_total',
  help: 'Orders placed',
  labelNames: ['payment_method'] as const,
  registers: [registry],
});
