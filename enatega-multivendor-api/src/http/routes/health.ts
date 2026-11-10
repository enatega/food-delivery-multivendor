import { Router } from 'express';
import { mongoReady } from '../../lib/mongo.js';
import { redisReady } from '../../lib/redis.js';
import { registry } from '../../lib/metrics.js';
import { env } from '../../config/env.js';
import { safeEqual } from '../../lib/crypto.js';

export const healthRouter = Router();

let shuttingDown = false;
export const markShuttingDown = () => {
  shuttingDown = true;
};

healthRouter.get('/health/live', (_req, res) => {
  res.json({ status: 'ok' });
});

healthRouter.get('/health/ready', async (_req, res) => {
  const [mongo, redis] = [mongoReady(), await redisReady()];
  const ok = mongo && redis && !shuttingDown;
  res.status(ok ? 200 : 503).json({ status: ok ? 'ok' : 'unavailable', mongo, redis, shuttingDown });
});

healthRouter.get('/metrics', async (req, res) => {
  const token = process.env.METRICS_TOKEN;
  if (token) {
    const given = (req.headers.authorization ?? '').replace(/^Bearer\s+/i, '');
    if (!safeEqual(given, token)) {
      res.status(401).end();
      return;
    }
  } else if (env.NODE_ENV === 'production') {
    // Without METRICS_TOKEN, metrics are only served to private-network scrapers.
    const ip = req.ip ?? '';
    if (!/^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|::ffff:(127|10)\.)/.test(ip)) {
      res.status(403).end();
      return;
    }
  }
  res.setHeader('content-type', registry.contentType);
  res.send(await registry.metrics());
});
