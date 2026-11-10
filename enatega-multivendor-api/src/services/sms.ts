import { logger } from '../lib/logger.js';
import { getSecrets } from './config.js';

/** Sends an SMS through Twilio. Returns false when Twilio is not configured. */
export async function sendSms(to: string, body: string): Promise<boolean> {
  const s = await getSecrets();
  if (!s.twilioEnabled || !s.twilioSid || !s.twilioToken || !s.twilioFrom) {
    logger.warn('SMS not sent: Twilio is not configured');
    return false;
  }
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(s.twilioSid)}/Messages.json`, {
      method: 'POST',
      headers: {
        authorization: `Basic ${Buffer.from(`${s.twilioSid}:${s.twilioToken}`).toString('base64')}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: s.twilioFrom, Body: body }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Twilio responded ${res.status}`);
    return true;
  } catch (err) {
    logger.error({ err }, 'Failed to send SMS');
    return false;
  }
}
