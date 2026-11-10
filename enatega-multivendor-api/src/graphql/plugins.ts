import type { ApolloServerPlugin } from '@apollo/server';
import { env } from '../config/env.js';
import { verifyPublicToken } from '../auth/jwt.js';
import { sha256 } from '../lib/crypto.js';
import { publicTokenInvalid, rateLimited } from '../lib/errors.js';
import { kv } from '../lib/kv.js';
import { logger } from '../lib/logger.js';
import { graphqlDuration, graphqlOperations } from '../lib/metrics.js';
import type { GraphQLContext } from './context.js';

/** Logs and measures every operation. */
export const observabilityPlugin: ApolloServerPlugin<GraphQLContext> = {
  async requestDidStart({ contextValue }) {
    const start = process.hrtime.bigint();
    return {
      async willSendResponse({ operation, operationName, errors }) {
        const type = operation?.operation ?? 'unknown';
        const name = operationName ?? 'anonymous';
        const seconds = Number(process.hrtime.bigint() - start) / 1e9;
        graphqlDuration.observe({ type, name }, seconds);
        graphqlOperations.inc({ type, name, status: errors?.length ? 'error' : 'ok' });
        if (seconds > 2) logger.warn({ requestId: contextValue.requestId, operationName: name, seconds }, 'Slow GraphQL operation');
      },
      async didEncounterErrors({ errors, operationName }) {
        for (const err of errors) {
          const code = err.extensions?.code;
          if (!code || code === 'INTERNAL_SERVER_ERROR') {
            logger.error({ err: err.originalError ?? err, requestId: contextValue.requestId, operationName }, 'GraphQL resolver error');
          } else {
            logger.debug({ code, message: err.message, operationName }, 'GraphQL client error');
          }
        }
      },
    };
  },
};

const OPEN_OPERATIONS = new Set(['metricsGeneral', '_health']);

/**
 * Public access token (bop-auth + nonce), required for requests without a valid
 * user token when PUBLIC_ACCESS_REQUIRED=true.
 */
export const publicAccessPlugin: ApolloServerPlugin<GraphQLContext> = {
  async requestDidStart() {
    return {
      async didResolveOperation({ contextValue, operation }) {
        if (!env.PUBLIC_ACCESS_REQUIRED) return;
        if (contextValue.auth.claims && !contextValue.auth.error) return;
        if (!operation) return;
        const rootFields = operation.selectionSet.selections
          .filter((s) => s.kind === 'Field')
          .map((s) => (s.kind === 'Field' ? s.name.value : ''));
        if (rootFields.length > 0 && rootFields.every((f) => OPEN_OPERATIONS.has(f) || f.startsWith('__'))) return;
        const token = contextValue.publicToken;
        const nonce = contextValue.nonce;
        if (!token || !nonce) throw publicTokenInvalid('missing public token (bop-auth) or nonce');
        try {
          const claims = verifyPublicToken(token);
          if (claims.n !== sha256(nonce)) throw new Error('nonce mismatch');
        } catch {
          throw publicTokenInvalid('invalid or expired public token');
        }
      },
    };
  },
};

/** Operations that receive a strict per-IP limit (credential stuffing / OTP abuse protection). */
const SENSITIVE_OPERATIONS: Record<string, number> = {
  login: 1,
  ownerLogin: 1,
  riderLogin: 1,
  restaurantLogin: 1,
  createUser: 1,
  sendOtpToEmail: 1,
  sendOtpToPhoneNumber: 1,
  verifyOtp: 1,
  forgotPassword: 1,
  resetPassword: 1,
  changePassword: 1,
  emailExist: 1,
  phoneExist: 1,
  refreshToken: 1,
  checkReferralCodeExists: 1,
  coupon: 1,
};

export const authRateLimitPlugin: ApolloServerPlugin<GraphQLContext> = {
  async requestDidStart() {
    return {
      async didResolveOperation({ contextValue, operation }) {
        if (!operation) return;
        for (const sel of operation.selectionSet.selections) {
          if (sel.kind !== 'Field' || !SENSITIVE_OPERATIONS[sel.name.value]) continue;
          const key = `rl:auth:${sel.name.value}:${contextValue.ip}`;
          const n = await kv.incr(key, 15 * 60);
          if (n > env.AUTH_RATE_LIMIT_MAX) throw rateLimited('Too many attempts. Please wait a few minutes and try again.');
        }
      },
    };
  },
};
