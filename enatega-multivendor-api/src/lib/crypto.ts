import { createCipheriv, createDecipheriv, createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';

function deriveKey(raw: string): Buffer {
  if (/^[0-9a-f]{64}$/i.test(raw)) return Buffer.from(raw, 'hex');
  const b64 = Buffer.from(raw, 'base64');
  if (b64.length === 32) return b64;
  return createHash('sha256').update(raw).digest();
}

const KEY = deriveKey(env.ENCRYPTION_KEY);
const PREFIX = 'enc:v1:';

/** AES-256-GCM encryption for secrets at rest. */
export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', KEY, iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return PREFIX + Buffer.concat([iv, tag, enc]).toString('base64');
}

export function decryptSecret(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  if (!value.startsWith(PREFIX)) return value;
  const buf = Buffer.from(value.slice(PREFIX.length), 'base64');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const data = buf.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', KEY, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
}

export const sha256 = (s: string): string => createHash('sha256').update(s).digest('hex');

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export const randomToken = (bytes = 32): string => randomBytes(bytes).toString('base64url');

export function numericCode(digits = 6): string {
  return String(randomInt(0, 10 ** digits)).padStart(digits, '0');
}

const ALPHANUM = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function shortCode(length = 8): string {
  let s = '';
  for (let i = 0; i < length; i++) s += ALPHANUM[randomInt(0, ALPHANUM.length)];
  return s;
}
