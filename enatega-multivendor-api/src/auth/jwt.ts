import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { invalidToken, tokenExpired } from '../lib/errors.js';

export type PrincipalKind = 'customer' | 'rider' | 'restaurant' | 'owner';
/** Dashboard account types (admin web). */
export type OwnerType = 'ADMIN' | 'STAFF' | 'VENDOR' | 'RESTAURANT';

export interface AccessClaims {
  sub: string;
  typ: PrincipalKind;
  /** Owner account type, only for typ=owner. */
  ut?: OwnerType;
  /** Token version: bumping it on the account invalidates every issued token. */
  tv: number;
}

interface RefreshClaims extends AccessClaims {
  kind: 'refresh';
}

const ISSUER = 'enatega-api';

function ttlFor(kind: PrincipalKind): string {
  return kind === 'owner' ? env.JWT_DASHBOARD_ACCESS_TTL : env.JWT_ACCESS_TTL;
}

export interface IssuedToken {
  token: string;
  expiresAt: Date;
}

function sign(payload: object, secret: string, expiresIn: string, audience: string): IssuedToken {
  const token = jwt.sign(payload, secret, {
    expiresIn: expiresIn as SignOptions['expiresIn'],
    issuer: ISSUER,
    audience,
    algorithm: 'HS256',
  });
  const decoded = jwt.decode(token) as { exp: number };
  return { token, expiresAt: new Date(decoded.exp * 1000) };
}

export function signAccessToken(claims: AccessClaims): IssuedToken {
  return sign(claims, env.JWT_SECRET, ttlFor(claims.typ), 'access');
}

export function signRefreshToken(claims: AccessClaims): IssuedToken {
  return sign({ ...claims, kind: 'refresh' }, env.JWT_REFRESH_SECRET, env.JWT_REFRESH_TTL, 'refresh');
}

function verify<T>(token: string, secret: string, audience: string): T {
  try {
    return jwt.verify(token, secret, { issuer: ISSUER, audience, algorithms: ['HS256'] }) as T;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) throw tokenExpired();
    throw invalidToken();
  }
}

export function verifyAccessToken(token: string): AccessClaims {
  const claims = verify<AccessClaims>(token, env.JWT_SECRET, 'access');
  if (!claims.sub || !claims.typ) throw invalidToken();
  return claims;
}

export function verifyRefreshToken(token: string): AccessClaims {
  const claims = verify<RefreshClaims>(token, env.JWT_REFRESH_SECRET, 'refresh');
  if (claims.kind !== 'refresh') throw invalidToken();
  return { sub: claims.sub, typ: claims.typ, ut: claims.ut, tv: claims.tv };
}

/** Short-lived token used in password-reset flows after an OTP was verified. */
export function signPurposeToken(subject: string, purpose: string, ttl = '15m'): string {
  return sign({ sub: subject, purpose }, env.JWT_SECRET, ttl, `purpose:${purpose}`).token;
}

export function verifyPurposeToken(token: string, purpose: string): string {
  const c = verify<{ sub: string; purpose: string }>(token, env.JWT_SECRET, `purpose:${purpose}`);
  if (c.purpose !== purpose) throw invalidToken();
  return c.sub;
}

/** Public access token (metricsGeneral handshake), bound to the client's nonce. */
export function signPublicToken(nonceHash: string, ttlSeconds: number): IssuedToken {
  return sign({ n: nonceHash }, env.JWT_SECRET, `${ttlSeconds}s`, 'public');
}

export function verifyPublicToken(token: string): { n: string } {
  return jwt.verify(token, env.JWT_SECRET, { issuer: ISSUER, audience: 'public', algorithms: ['HS256'] }) as { n: string };
}

export function bearer(header: string | undefined | null): string | null {
  if (!header) return null;
  const m = /^Bearer\s+(.+)$/i.exec(header.trim());
  const token = m ? m[1]!.trim() : header.trim();
  return token && token !== 'null' && token !== 'undefined' ? token : null;
}
