import { createServer } from 'node:http';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { connectMongo, disconnectMongo } from './lib/mongo.js';
import { closeRedis, getRedis } from './lib/redis.js';
import { pubsub } from './lib/pubsub.js';
import { buildSchema } from './graphql/schema.js';
import { createApp } from './http/app.js';
import { attachWebSockets } from './http/ws.js';
import { markShuttingDown } from './http/routes/health.js';
import { startJobs, stopJobs } from './jobs/scheduler.js';
import { ensureBootstrapData } from './scripts/bootstrap.js';

async function main() {
  await connectMongo();
  getRedis();
  await ensureBootstrapData();

  const schema = buildSchema({ strictInputs: process.env.STRICT_INPUTS !== "false" });
  const httpServer = createServer();
  httpServer.keepAliveTimeout = 65_000; // > typical load balancer idle timeout
  httpServer.headersTimeout = 66_000;
  httpServer.requestTimeout = 60_000;

  const { app, apollo } = await createApp(httpServer, schema);
  httpServer.on('request', app);
  const closeWs = attachWebSockets(httpServer, schema);

  await new Promise<void>((resolve) => httpServer.listen(env.PORT, env.HOST, resolve));
  logger.info({ port: env.PORT, env: env.NODE_ENV }, `Enatega API listening on ${env.HOST}:${env.PORT} (GraphQL at /graphql)`);

  if (env.JOBS_ENABLED) startJobs();

  let stopping = false;
  const shutdown = async (signal: string) => {
    if (stopping) return;
    stopping = true;
    logger.info({ signal }, 'Shutting down gracefully');
    markShuttingDown();
    const force = setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 25_000);
    force.unref();
    try {
      stopJobs();
      await closeWs();
      await apollo.stop(); // drains in-flight HTTP requests
      await new Promise<void>((resolve) => httpServer.close(() => resolve()));
      await pubsub.close();
      await closeRedis();
      await disconnectMongo();
      logger.info('Shutdown complete');
      process.exit(0);
    } catch (err) {
      logger.error({ err }, 'Error during shutdown');
      process.exit(1);
    }
  };
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled promise rejection');
});
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception');
  process.exit(1);
});

main().catch((err) => {
  logger.fatal({ err }, 'Failed to start');
  process.exit(1);
});
