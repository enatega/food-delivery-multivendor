import { pino } from 'pino';
import { env, isProduction } from '../config/env.js';

export const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: 'enatega-api' },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers["bop-auth"]',
      'req.headers.cookie',
      '*.password',
      '*.token',
      '*.refreshToken',
      '*.secret',
      '*.otp',
    ],
    censor: '[REDACTED]',
  },
  ...(isProduction ? {} : { transport: undefined }),
});

export type Logger = typeof logger;
