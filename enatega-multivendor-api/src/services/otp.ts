import { env, isProduction } from '../config/env.js';
import { numericCode, safeEqual, sha256 } from '../lib/crypto.js';
import { rateLimited } from '../lib/errors.js';
import { kv } from '../lib/kv.js';
import { logger } from '../lib/logger.js';
import { getConfig } from './config.js';
import { sendMail, simpleHtml } from './email.js';
import { sendSms } from './sms.js';

export type OtpChannel = 'email' | 'phone';
export type OtpPurpose = 'verify' | 'reset';

const OTP_TTL = 10 * 60;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN = 30;

const norm = (channel: OtpChannel, target: string) => (channel === 'email' ? target.trim().toLowerCase() : target.replace(/[^\d+]/g, ''));
const key = (purpose: OtpPurpose, channel: OtpChannel, target: string) => `otp:${purpose}:${channel}:${sha256(norm(channel, target))}`;

function isDemo(target: string): boolean {
  return env.DEMO_ACCOUNTS.map((a) => a.toLowerCase()).includes(target.trim().toLowerCase());
}

/** Generates, stores (hashed) and delivers a one-time code. */
export async function sendOtp(channel: OtpChannel, target: string, purpose: OtpPurpose = 'verify'): Promise<boolean> {
  const k = key(purpose, channel, target);
  if (!(await kv.setNx(`${k}:cooldown`, '1', RESEND_COOLDOWN))) {
    throw rateLimited('Please wait a few seconds before requesting a new code.');
  }
  const code = numericCode(6);
  await kv.set(k, JSON.stringify({ h: sha256(code), a: 0 }), OTP_TTL);
  await kv.del(`${k}:verified`);

  const text = `Your verification code is ${code}. It expires in 10 minutes. If you did not request it, ignore this message.`;
  const delivered =
    channel === 'email'
      ? await sendMail({
          to: norm(channel, target),
          subject: purpose === 'reset' ? 'Password reset code' : 'Your verification code',
          text,
          html: simpleHtml(purpose === 'reset' ? 'Password reset' : 'Verification code', [`Your code is ${code}.`, 'It expires in 10 minutes.']),
        })
      : await sendSms(norm(channel, target), text);

  if (!delivered && !isProduction) logger.warn({ channel, purpose }, `[dev] OTP for ${norm(channel, target)}: ${code}`);
  return delivered || !isProduction;
}

/** Checks a code. On success the code is consumed and a short-lived "verified" marker is stored. */
export async function verifyOtp(channel: OtpChannel, target: string, code: string, purpose: OtpPurpose = 'verify'): Promise<boolean> {
  const clean = String(code ?? '').trim();
  if (!clean) return false;

  const cfg = await getConfig();
  const demoCode = env.DEMO_OTP ?? cfg.testOtp ?? undefined;
  if (demoCode && isDemo(target) && safeEqual(clean, demoCode)) return true;
  if (demoCode && !isProduction && safeEqual(clean, demoCode)) return true;

  const k = key(purpose, channel, target);
  const raw = await kv.get(k);
  if (!raw) return false;
  const state = JSON.parse(raw) as { h: string; a: number };
  if (state.a >= MAX_ATTEMPTS) {
    await kv.del(k);
    throw rateLimited('Too many incorrect codes. Please request a new one.');
  }
  if (!safeEqual(state.h, sha256(clean))) {
    await kv.set(k, JSON.stringify({ h: state.h, a: state.a + 1 }), OTP_TTL);
    return false;
  }
  await kv.del(k);
  await kv.set(`${k}:verified`, '1', 30 * 60);
  return true;
}

/** True when the target verified a code for `purpose` in the last 30 minutes. */
export async function wasRecentlyVerified(channel: OtpChannel, target: string, purpose: OtpPurpose = 'verify'): Promise<boolean> {
  return (await kv.get(`${key(purpose, channel, target)}:verified`)) === '1';
}

export async function consumeVerification(channel: OtpChannel, target: string, purpose: OtpPurpose): Promise<void> {
  await kv.del(`${key(purpose, channel, target)}:verified`);
}
