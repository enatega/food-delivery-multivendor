import { env } from '../config/env.js';
import { decryptSecret } from '../lib/crypto.js';
import { Configuration, type ConfigurationDoc } from '../models/index.js';

let cached: { doc: ConfigurationDoc; at: number } | null = null;
const TTL_MS = 15_000;

/** Returns the singleton configuration document (created on first use). */
export async function getConfig(): Promise<ConfigurationDoc> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.doc;
  let doc = await Configuration.findOne({ singleton: 'config' });
  if (!doc) {
    doc = await Configuration.findOneAndUpdate(
      { singleton: 'config' },
      { $setOnInsert: { singleton: 'config' } },
      { upsert: true, new: true },
    );
  }
  cached = { doc: doc!, at: Date.now() };
  return doc!;
}

export function invalidateConfig(): void {
  cached = null;
}

/** Effective third-party credentials: admin-saved values win, env vars are the fallback. */
export async function getSecrets() {
  const c = await getConfig();
  return {
    stripeSecretKey: decryptSecret(c.secretKey) ?? env.STRIPE_SECRET_KEY,
    stripePublishableKey: c.publishableKey ?? undefined,
    paypalClientId: c.clientId ?? env.PAYPAL_CLIENT_ID,
    paypalSecret: decryptSecret(c.clientSecret) ?? env.PAYPAL_SECRET,
    paypalSandbox: c.clientId ? Boolean(c.sandbox) : env.PAYPAL_SANDBOX,
    twilioSid: c.twilioAccountSid ?? env.TWILIO_ACCOUNT_SID,
    twilioToken: decryptSecret(c.twilioAuthToken) ?? env.TWILIO_AUTH_TOKEN,
    twilioFrom: c.twilioPhoneNumber ?? env.TWILIO_PHONE_NUMBER,
    twilioEnabled: Boolean(c.twilioEnabled) || Boolean(env.TWILIO_ACCOUNT_SID && !c.twilioAccountSid),
    sendGridKey: decryptSecret(c.sendGridApiKey) ?? decryptSecret(c.sendGridPassword) ?? env.SENDGRID_API_KEY,
    sendGridEnabled: Boolean(c.sendGridEnabled) || Boolean(env.SENDGRID_API_KEY && !c.sendGridApiKey),
    sendGridFrom: c.sendGridEmail ?? env.MAIL_FROM,
    sendGridFromName: c.sendGridEmailName ?? undefined,
    smtpUser: c.email ?? env.SMTP_USER,
    smtpPassword: decryptSecret(c.password) ?? env.SMTP_PASSWORD,
    smtpFromName: c.emailName ?? undefined,
    emailEnabled: Boolean(c.enableEmail) || Boolean(env.SMTP_HOST),
    googleMapsKey: c.googleMapsApiKey ?? c.googleApiKey ?? env.GOOGLE_MAPS_API_KEY,
  };
}
