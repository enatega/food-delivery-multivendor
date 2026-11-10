import Stripe from 'stripe';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { getConfig, getSecrets } from './config.js';

let stripeClient: { key: string; client: Stripe } | null = null;

export async function getStripe(): Promise<Stripe | null> {
  const { stripeSecretKey } = await getSecrets();
  if (!stripeSecretKey) return null;
  if (!stripeClient || stripeClient.key !== stripeSecretKey) {
    stripeClient = { key: stripeSecretKey, client: new Stripe(stripeSecretKey, { maxNetworkRetries: 2, timeout: 20_000 }) };
  }
  return stripeClient.client;
}

/** Smallest currency unit multiplier (zero-decimal currencies per Stripe docs). */
const ZERO_DECIMAL = new Set(['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF']);
export const toMinorUnits = (amount: number, currency: string) =>
  ZERO_DECIMAL.has(currency.toUpperCase()) ? Math.round(amount) : Math.round(amount * 100);

export async function createStripeCheckout(order: { _id: unknown; orderId: string; orderAmount: number; user?: unknown }, customerEmail?: string | null) {
  const stripe = await getStripe();
  if (!stripe) throw new Error('Stripe is not configured');
  const cfg = await getConfig();
  const currency = (cfg.currency ?? 'USD').toLowerCase();
  const base = env.PUBLIC_API_URL.replace(/\/$/, '');
  return stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: customerEmail ?? undefined,
    client_reference_id: String(order._id),
    metadata: { orderId: String(order._id), orderNumber: order.orderId },
    payment_intent_data: { metadata: { orderId: String(order._id) } },
    line_items: [
      {
        quantity: 1,
        price_data: { currency, unit_amount: toMinorUnits(order.orderAmount, currency), product_data: { name: `Order ${order.orderId}` } },
      },
    ],
    success_url: `${base}/stripe/success?id=${String(order._id)}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/stripe/cancel?id=${String(order._id)}`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  });
}

/** Refunds an online payment. Never throws (logs and returns false). */
export async function refundPayment(order: { paymentMethod?: string | null; paymentIntentId?: string | null; paymentStatus?: string | null; _id: unknown }) {
  if (order.paymentStatus !== 'PAID' || !order.paymentIntentId) return false;
  try {
    if (order.paymentMethod === 'STRIPE') {
      const stripe = await getStripe();
      if (!stripe) return false;
      await stripe.refunds.create({ payment_intent: order.paymentIntentId }, { idempotencyKey: `refund-${String(order._id)}` });
      return true;
    }
    if (order.paymentMethod === 'PAYPAL') {
      const token = await paypalToken();
      const res = await fetch(`${await paypalBase()}/v2/payments/captures/${order.paymentIntentId}/refund`, {
        method: 'POST',
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'PayPal-Request-Id': `refund-${String(order._id)}` },
        body: '{}',
      });
      return res.ok;
    }
  } catch (err) {
    logger.error({ err, orderId: String(order._id) }, 'Refund failed');
  }
  return false;
}

async function paypalBase() {
  const s = await getSecrets();
  return s.paypalSandbox ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
}

export async function paypalToken(): Promise<string> {
  const s = await getSecrets();
  if (!s.paypalClientId || !s.paypalSecret) throw new Error('PayPal is not configured');
  const res = await fetch(`${await paypalBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      authorization: `Basic ${Buffer.from(`${s.paypalClientId}:${s.paypalSecret}`).toString('base64')}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`PayPal auth failed (${res.status})`);
  return ((await res.json()) as { access_token: string }).access_token;
}

export async function createPaypalOrder(order: { _id: unknown; orderId: string; orderAmount: number }) {
  const cfg = await getConfig();
  const token = await paypalToken();
  const base = env.PUBLIC_API_URL.replace(/\/$/, '');
  const res = await fetch(`${await paypalBase()}/v2/checkout/orders`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'PayPal-Request-Id': `order-${String(order._id)}` },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: String(order._id),
          custom_id: String(order._id),
          description: `Order ${order.orderId}`,
          amount: { currency_code: (cfg.currency ?? 'USD').toUpperCase(), value: order.orderAmount.toFixed(2) },
        },
      ],
      application_context: {
        return_url: `${base}/paypal/success?id=${String(order._id)}`,
        cancel_url: `${base}/paypal/cancel?id=${String(order._id)}`,
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING',
      },
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`PayPal order creation failed (${res.status})`);
  return (await res.json()) as { id: string; links: { rel: string; href: string }[] };
}

export async function capturePaypalOrder(paypalOrderId: string) {
  const token = await paypalToken();
  const res = await fetch(`${await paypalBase()}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'PayPal-Request-Id': `capture-${paypalOrderId}` },
    body: '{}',
    signal: AbortSignal.timeout(20_000),
  });
  const json = (await res.json()) as {
    status?: string;
    purchase_units?: { custom_id?: string; payments?: { captures?: { id: string; status: string; amount: { value: string } }[] } }[];
  };
  return { ok: res.ok && json.status === 'COMPLETED', json };
}
