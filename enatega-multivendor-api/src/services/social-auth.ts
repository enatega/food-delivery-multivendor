import { createPublicKey, type JsonWebKey } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { env, isProduction } from '../config/env.js';
import { sha256 } from '../lib/crypto.js';
import { badInput } from '../lib/errors.js';
import { kv } from '../lib/kv.js';
import { logger } from '../lib/logger.js';
import { getConfig } from './config.js';

export interface SocialProfile {
  subject: string;
  email?: string;
  emailVerified: boolean;
  name?: string;
  picture?: string;
}

const google = new OAuth2Client();

async function googleAudiences(): Promise<string[]> {
  const c = await getConfig();
  return [c.webClientID, c.androidClientID, c.iOSClientID, c.expoClientID, ...(env.GOOGLE_CLIENT_IDS ?? [])].filter(
    (v): v is string => Boolean(v),
  );
}

export async function verifyGoogleIdToken(idToken: string): Promise<SocialProfile> {
  const audience = await googleAudiences();
  if (audience.length === 0 && isProduction) throw badInput('Google sign-in is not configured.');
  try {
    const ticket = await google.verifyIdToken({ idToken, audience: audience.length ? audience : undefined });
    const p = ticket.getPayload();
    if (!p?.sub) throw new Error('missing subject');
    if (audience.length === 0) logger.warn('Google token audience not checked: configure Google client IDs');
    return { subject: p.sub, email: p.email?.toLowerCase(), emailVerified: Boolean(p.email_verified), name: p.name, picture: p.picture };
  } catch (err) {
    logger.info({ err }, 'Google token verification failed');
    throw badInput('Google sign-in could not be verified. Please try again.');
  }
}

let appleKeys: { keys: (JsonWebKey & { kid: string })[]; at: number } | null = null;
async function getAppleKey(kid: string) {
  if (!appleKeys || Date.now() - appleKeys.at > 6 * 3600_000 || !appleKeys.keys.some((k) => k.kid === kid)) {
    const res = await fetch('https://appleid.apple.com/auth/keys', { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`Apple JWKS ${res.status}`);
    appleKeys = { keys: ((await res.json()) as { keys: (JsonWebKey & { kid: string })[] }).keys, at: Date.now() };
  }
  const jwk = appleKeys.keys.find((k) => k.kid === kid);
  if (!jwk) throw new Error('Unknown Apple key');
  return createPublicKey({ key: jwk, format: 'jwk' });
}

/** Issues a one-time nonce for Sign in with Apple (valid 10 minutes). */
export async function issueAppleNonce(nonce: string): Promise<void> {
  await kv.set(`apple-nonce:${sha256(nonce)}`, '1', 600);
}

export async function verifyAppleIdToken(idToken: string, rawNonce?: string | null): Promise<SocialProfile> {
  try {
    const decoded = jwt.decode(idToken, { complete: true });
    if (!decoded || typeof decoded === 'string' || !decoded.header.kid) throw new Error('malformed token');
    const key = await getAppleKey(decoded.header.kid);
    const audience = env.APPLE_BUNDLE_IDS?.length ? (env.APPLE_BUNDLE_IDS as [string, ...string[]]) : undefined;
    if (!audience && isProduction) throw new Error('APPLE_BUNDLE_IDS not configured');
    const claims = jwt.verify(idToken, key, { algorithms: ['RS256'], issuer: 'https://appleid.apple.com', audience }) as {
      sub: string;
      email?: string;
      email_verified?: boolean | string;
      nonce?: string;
    };
    if (rawNonce) {
      const ok = claims.nonce === rawNonce || claims.nonce === sha256(rawNonce);
      if (!ok) throw new Error('nonce mismatch');
      // Server-issued nonces are single use.
      const key = `apple-nonce:${sha256(rawNonce)}`;
      if (await kv.get(key)) await kv.del(key);
    }
    return {
      subject: claims.sub,
      email: claims.email?.toLowerCase(),
      emailVerified: claims.email_verified === true || claims.email_verified === 'true',
    };
  } catch (err) {
    logger.info({ err }, 'Apple token verification failed');
    throw badInput('Apple sign-in could not be verified. Please try again.');
  }
}
