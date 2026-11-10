import express, { type ErrorRequestHandler, type Express, type RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { randomUUID } from 'node:crypto';
import { pinoHttp } from 'pino-http';
import { rateLimit } from 'express-rate-limit';
import { RedisStore, type RedisReply } from 'rate-limit-redis';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import type { Server } from 'node:http';
import type { GraphQLSchema } from 'graphql';
import { env, introspectionEnabled, isProduction } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { getRedis } from '../lib/redis.js';
import { httpRequestDuration } from '../lib/metrics.js';
import { buildContext, type GraphQLContext } from '../graphql/context.js';
import { aliasLimit, depthLimit } from '../graphql/validation.js';
import { authRateLimitPlugin, observabilityPlugin, publicAccessPlugin } from '../graphql/plugins.js';
import { healthRouter } from './routes/health.js';
import { restRouter, rawBodyRoutes } from './routes/index.js';
import { UPLOADS_ROOT } from '../services/storage.js';

/** Headers sent by the Enatega client apps. */
const ALLOWED_HEADERS = [
  'authorization',
  'content-type',
  'accept',
  'accept-language',
  'apollo-require-preflight',
  'x-apollo-operation-name',
  'x-request-id',
  'x-client-type',
  'x-platform',
  'x-skip-public-auth',
  'nonce',
  'bop-auth',
  'userid',
  'isauth',
];

function corsOptions(): cors.CorsOptions {
  const origins = env.CORS_ORIGINS;
  return {
    origin: origins.includes('*') ? true : (origin, cb) => cb(null, !origin || origins.includes(origin)),
    credentials: true,
    allowedHeaders: ALLOWED_HEADERS,
    maxAge: 600,
  };
}

const requestTiming: RequestHandler = (req, res, next) => {
  const end = httpRequestDuration.startTimer({ method: req.method });
  res.on('finish', () => end({ route: req.route?.path ?? (req.path.startsWith('/graphql') ? '/graphql' : 'other'), status: res.statusCode }));
  next();
};

export async function createApp(httpServer: Server, schema: GraphQLSchema): Promise<{ app: Express; apollo: ApolloServer<GraphQLContext> }> {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', /^\d+$/.test(env.TRUST_PROXY) ? Number(env.TRUST_PROXY) : env.TRUST_PROXY);

  app.use((req, res, next) => {
    const id = (req.headers['x-request-id'] as string) || randomUUID();
    req.headers['x-request-id'] = id;
    res.setHeader('x-request-id', id);
    next();
  });
  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => req.headers['x-request-id'] as string,
      autoLogging: { ignore: (req) => (req.url ?? '').startsWith('/health') || req.url === '/metrics' },
      customLogLevel: (_req, res, err) => (err || res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info'),
      serializers: { req: (req) => ({ id: req.id, method: req.method, url: req.url }), res: (res) => ({ statusCode: res.statusCode }) },
    }),
  );
  app.use(requestTiming);
  app.use(
    helmet({
      contentSecurityPolicy: false, // JSON API; HTML pages (payment redirects) set their own CSP
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(cors(corsOptions()));
  app.use(compression());

  app.use(healthRouter);

  const redis = getRedis();
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      limit: env.RATE_LIMIT_MAX,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      skip: (req) => req.path.startsWith('/health') || req.path === '/metrics' || req.path.startsWith('/stripe/webhook'),
      store: redis
        ? new RedisStore({ prefix: 'rl:http:', sendCommand: (...args: string[]) => redis.call(args[0]!, ...args.slice(1)) as Promise<RedisReply> })
        : undefined,
      handler: (_req, res) => {
        res.status(429).json({ errors: [{ message: 'Too many requests. Please try again later.', extensions: { code: 'RATE_LIMITED' } }] });
      },
    }),
  );

  // Routes that need the raw request body (payment webhooks) must be mounted before JSON parsing.
  app.use(rawBodyRoutes);
  app.use(express.json({ limit: env.REQUEST_BODY_LIMIT }));
  app.use(express.urlencoded({ extended: false, limit: '1mb' }));

  if (env.STORAGE_DRIVER === 'local') {
    app.use('/uploads', express.static(UPLOADS_ROOT, { maxAge: '30d', immutable: true, index: false, dotfiles: 'deny' }));
  }

  app.use(restRouter);

  const apollo = new ApolloServer<GraphQLContext>({
    schema,
    introspection: introspectionEnabled,
    csrfPrevention: true,
    includeStacktraceInErrorResponses: env.NODE_ENV === 'development',
    validationRules: [depthLimit(env.GRAPHQL_MAX_DEPTH), aliasLimit(env.GRAPHQL_MAX_ALIASES)],
    parseOptions: { maxTokens: env.GRAPHQL_MAX_TOKENS },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      observabilityPlugin,
      publicAccessPlugin,
      authRateLimitPlugin,
      ...(isProduction && !introspectionEnabled ? [ApolloServerPluginLandingPageDisabled()] : []),
    ],
    formatError: (formatted, error) => {
      const code = formatted.extensions?.code;
      if (isProduction && (code === 'INTERNAL_SERVER_ERROR' || !code)) {
        return { message: 'Internal server error', extensions: { code: 'INTERNAL_SERVER_ERROR' } };
      }
      void error;
      return formatted;
    },
  });
  await apollo.start();

  app.use(
    '/graphql',
    expressMiddleware(apollo, {
      context: async ({ req }) => buildContext({ headers: req.headers, ip: req.ip, transport: 'http', requestId: req.headers['x-request-id'] as string }),
    }),
  );

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    const status = typeof err?.status === 'number' ? err.status : 500;
    if (status >= 500) req.log?.error({ err }, 'Unhandled HTTP error');
    res.status(status).json({ error: status >= 500 ? 'Internal server error' : err.message });
  };
  app.use(errorHandler);

  return { app, apollo };
}
