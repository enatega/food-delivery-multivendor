import type { IncomingHttpHeaders } from 'node:http';
import { randomUUID } from 'node:crypto';
import { bearer, verifyAccessToken, type AccessClaims } from '../auth/jwt.js';
import { AppError } from '../lib/errors.js';
import { createLoaders, type Loaders } from './loaders.js';

export interface AuthState {
  claims?: AccessClaims;
  /** The presented bearer token (only set when it verified). */
  token?: string;
  /** Error raised while verifying the presented token; thrown lazily by guards. */
  error?: AppError;
}

export interface GraphQLContext {
  requestId: string;
  ip: string;
  userAgent?: string;
  clientType?: string;
  platform?: string;
  language?: string;
  nonce?: string;
  publicToken?: string | null;
  auth: AuthState;
  loaders: Loaders;
  /** Transport the operation arrived on. */
  transport: 'http' | 'ws';
  /** Per-request memo for loaded principals (see auth/guards.ts). */
  cache: Map<string, unknown>;
}

type HeaderBag = IncomingHttpHeaders | Record<string, unknown>;

function header(h: HeaderBag, name: string): string | undefined {
  const lower = name.toLowerCase();
  for (const [k, v] of Object.entries(h)) {
    if (k.toLowerCase() === lower) return Array.isArray(v) ? String(v[0]) : v == null ? undefined : String(v);
  }
  return undefined;
}

export function authFromToken(raw: string | null | undefined): AuthState {
  const token = bearer(raw ?? undefined);
  if (!token) return {};
  try {
    return { claims: verifyAccessToken(token), token };
  } catch (err) {
    return { error: err as AppError };
  }
}

export function buildContext(opts: {
  headers: HeaderBag;
  ip?: string;
  transport: 'http' | 'ws';
  requestId?: string;
}): GraphQLContext {
  const h = opts.headers;
  return {
    requestId: opts.requestId ?? header(h, 'x-request-id') ?? randomUUID(),
    ip: opts.ip ?? 'unknown',
    userAgent: header(h, 'user-agent'),
    clientType: header(h, 'x-client-type'),
    platform: header(h, 'x-platform'),
    language: header(h, 'accept-language'),
    nonce: header(h, 'nonce'),
    publicToken: bearer(header(h, 'bop-auth')),
    auth: authFromToken(header(h, 'authorization')),
    loaders: createLoaders(),
    transport: opts.transport,
    cache: new Map(),
  };
}
