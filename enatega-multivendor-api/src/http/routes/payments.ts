import express, { Router, type Request, type Response } from 'express';
import type Stripe from 'stripe';
import { Types } from 'mongoose';
import { env } from '../../config/env.js';
import { authFromToken } from '../../graphql/context.js';
import { logger } from '../../lib/logger.js';
import { Order, Restaurant, User } from '../../models/index.js';
import { getSecrets } from '../../services/config.js';
import { capturePaypalOrder, createPaypalOrder, createStripeCheckout, getStripe } from '../../services/payments.js';
import { markOrderPaid } from '../../services/payment-flow.js';
import { announceNewOrder } from '../../modules/orders.js';
import { buildContext } from '../../graphql/context.js';
import { requireRestaurantAccess } from '../../auth/guards.js';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function page(res: Response, status: number, title: string, message: string) {
  res
    .status(status)
    .set('content-security-policy', "default-src 'none'; style-src 'unsafe-inline'")
    .type('html')
    .send(
      `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>` +
        `<body style="font-family:system-ui,sans-serif;display:flex;min-height:90vh;align-items:center;justify-content:center;text-align:center">` +
        `<div><h2>${esc(title)}</h2><p>${esc(message)}</p></div></body></html>`,
    );
}

async function payableOrder(id: unknown, method: 'STRIPE' | 'PAYPAL') {
  if (typeof id !== 'string' || !Types.ObjectId.isValid(id)) return null;
  const order = await Order.findById(id);
  if (!order || order.paymentMethod !== method) return null;
  return order;
}

export const paymentsRouter = Router();
export const webhookRouter = Router();

// --------------------------------------------------------------------------- Stripe
paymentsRouter.get('/stripe/create-checkout-session', async (req, res) => {
  try {
    const order = await payableOrder(req.query.id, 'STRIPE');
    if (!order) return page(res, 404, 'Order not found', 'This order cannot be paid.');
    if (order.paymentStatus === 'PAID') return res.redirect(303, `${env.PUBLIC_API_URL}/stripe/success?id=${order._id}`);
    if (order.orderStatus.startsWith('CANCELLED')) return page(res, 409, 'Order cancelled', 'This order was cancelled.');
    const user = await User.findById(order.user).select('email').lean();
    const session = await createStripeCheckout(order, user?.email);
    return res.redirect(303, session.url!);
  } catch (err) {
    logger.error({ err }, 'Stripe checkout session failed');
    return page(res, 502, 'Payment unavailable', 'We could not start the payment. Please try again.');
  }
});

paymentsRouter.get('/stripe/success', async (req, res) => {
  const order = await payableOrder(req.query.id, 'STRIPE');
  if (!order) return page(res, 404, 'Order not found', 'This order cannot be found.');
  // Confirm directly with Stripe (works even when webhooks are not configured).
  if (order.paymentStatus !== 'PAID' && typeof req.query.session_id === 'string') {
    try {
      const stripe = await getStripe();
      const session = await stripe!.checkout.sessions.retrieve(req.query.session_id);
      if (session.payment_status === 'paid' && session.metadata?.orderId === String(order._id)) {
        await markOrderPaid(String(order._id), { reference: String(session.payment_intent ?? session.id), amount: (session.amount_total ?? 0) / 100 }, announceNewOrder);
      }
    } catch (err) {
      logger.error({ err }, 'Stripe session verification failed');
    }
  }
  return page(res, 200, 'Payment successful', 'Thank you! You can return to the app.');
});

paymentsRouter.get('/stripe/cancel', (_req, res) => page(res, 200, 'Payment cancelled', 'Your payment was cancelled. You can return to the app.'));

/** Stripe Connect onboarding for a store (dashboard). Requires a dashboard / store token. */
paymentsRouter.post('/stripe/account', express.json(), async (req, res) => {
  try {
    const ctx = buildContext({ headers: req.headers, ip: req.ip, transport: 'http' });
    const restaurantId = String(req.body?.restaurantId ?? '');
    await requireRestaurantAccess(ctx, restaurantId);
    const stripe = await getStripe();
    if (!stripe) return res.status(503).json({ error: 'Stripe is not configured' });
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    if (!restaurant.stripeAccountId) {
      const account = await stripe.accounts.create({ type: 'express', metadata: { restaurantId } });
      restaurant.stripeAccountId = account.id;
      await restaurant.save();
    }
    const base = env.PUBLIC_API_URL.replace(/\/$/, '');
    const link = await stripe.accountLinks.create({
      account: restaurant.stripeAccountId,
      type: 'account_onboarding',
      refresh_url: `${base}/stripe/account/refresh?restaurantId=${restaurantId}`,
      return_url: `${base}/stripe/account/return?restaurantId=${restaurantId}`,
    });
    return res.json({ url: link.url });
  } catch (err) {
    const code = (err as { extensions?: { code?: string } }).extensions?.code;
    if (code) return res.status(code === 'FORBIDDEN' ? 403 : 401).json({ error: (err as Error).message });
    logger.error({ err }, 'Stripe account link failed');
    return res.status(502).json({ error: 'Stripe onboarding failed' });
  }
});

paymentsRouter.get('/stripe/account/return', async (req, res) => {
  const id = String(req.query.restaurantId ?? '');
  const restaurant = Types.ObjectId.isValid(id) ? await Restaurant.findById(id) : null;
  if (restaurant?.stripeAccountId) {
    try {
      const stripe = await getStripe();
      const account = await stripe!.accounts.retrieve(restaurant.stripeAccountId);
      restaurant.stripeDetailsSubmitted = Boolean(account.details_submitted);
      await restaurant.save();
    } catch (err) {
      logger.error({ err }, 'Stripe account verification failed');
    }
  }
  return page(res, 200, 'Stripe setup', restaurant?.stripeDetailsSubmitted ? 'Your Stripe account is connected. You can close this page.' : 'Stripe setup is not complete yet.');
});
paymentsRouter.get('/stripe/account/refresh', (_req, res) => page(res, 200, 'Stripe setup', 'The onboarding link expired. Please start again from the dashboard.'));

webhookRouter.post('/stripe/webhook', express.raw({ type: 'application/json', limit: '1mb' }), async (req: Request, res: Response) => {
  const stripe = await getStripe();
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) return res.status(503).end();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, String(req.headers['stripe-signature'] ?? ''), env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).send('Invalid signature');
  }
  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const s = event.data.object;
        if (s.payment_status === 'paid' && s.metadata?.orderId) {
          await markOrderPaid(s.metadata.orderId, { reference: String(s.payment_intent ?? s.id), amount: (s.amount_total ?? 0) / 100 }, announceNewOrder);
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const status = event.type === 'customer.subscription.deleted' ? 'canceled' : sub.status === 'active' || sub.status === 'trialing' ? 'active' : sub.status;
        const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end ?? sub.items?.data?.[0]?.current_period_end;
        await User.updateOne(
          { 'subscription.stripeSubscriptionId': sub.id },
          { 'subscription.status': status, ...(periodEnd ? { 'subscription.currentPeriodEnd': new Date(periodEnd * 1000) } : {}) },
        );
        break;
      }
      case 'account.updated': {
        const acct = event.data.object;
        await Restaurant.updateOne({ stripeAccountId: acct.id }, { stripeDetailsSubmitted: Boolean(acct.details_submitted) });
        break;
      }
    }
    return res.json({ received: true });
  } catch (err) {
    logger.error({ err, type: event.type }, 'Stripe webhook handling failed');
    return res.status(500).end();
  }
});

// --------------------------------------------------------------------------- PayPal
paymentsRouter.get('/paypal', async (req, res) => {
  try {
    const order = await payableOrder(req.query.id, 'PAYPAL');
    if (!order) return page(res, 404, 'Order not found', 'This order cannot be paid.');
    if (order.paymentStatus === 'PAID') return page(res, 200, 'Already paid', 'This order is already paid.');
    const pp = await createPaypalOrder(order);
    const approve = pp.links.find((l) => l.rel === 'approve' || l.rel === 'payer-action');
    if (!approve) throw new Error('No PayPal approval link');
    return res.redirect(303, approve.href);
  } catch (err) {
    logger.error({ err }, 'PayPal order creation failed');
    return page(res, 502, 'Payment unavailable', 'We could not start the PayPal payment. Please try again.');
  }
});

paymentsRouter.get('/paypal/success', async (req, res) => {
  const order = await payableOrder(req.query.id, 'PAYPAL');
  const token = typeof req.query.token === 'string' ? req.query.token : null;
  if (!order || !token) return page(res, 404, 'Order not found', 'This order cannot be found.');
  try {
    const { ok, json } = await capturePaypalOrder(token);
    const unit = json.purchase_units?.[0];
    const capture = unit?.payments?.captures?.[0];
    if (ok && unit?.custom_id === String(order._id) && capture) {
      await markOrderPaid(String(order._id), { reference: capture.id, amount: Number(capture.amount.value) }, announceNewOrder);
      return page(res, 200, 'Payment successful', 'Thank you! You can return to the app.');
    }
  } catch (err) {
    logger.error({ err }, 'PayPal capture failed');
  }
  return page(res, 402, 'Payment failed', 'The PayPal payment could not be completed.');
});
paymentsRouter.get('/paypal/cancel', (_req, res) => page(res, 200, 'Payment cancelled', 'Your payment was cancelled. You can return to the app.'));

void getSecrets;
void authFromToken;
