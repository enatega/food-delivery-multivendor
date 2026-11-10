import { env } from '../config/env.js';
import { kv } from '../lib/kv.js';
import { logger } from '../lib/logger.js';
import { Order } from '../models/index.js';
import { applyStatus } from '../services/orders.js';

interface Job {
  name: string;
  everyMs: number;
  run: () => Promise<void>;
}

/** Online payments that were never completed are cancelled after 30 minutes. */
async function expireUnpaidOrders() {
  const cutoff = new Date(Date.now() - 30 * 60_000);
  const stale = await Order.find({ paymentMethod: { $in: ['STRIPE', 'PAYPAL'] }, paymentStatus: 'PENDING', orderStatus: 'PENDING', createdAt: { $lt: cutoff } }).limit(200);
  for (const order of stale) await applyStatus(order, 'CANCELLED', { reason: 'Payment was not completed' });
  if (stale.length) logger.info({ count: stale.length }, 'Expired unpaid orders');
}

/** Optional: cancel orders the store did not accept in time (ORDER_ACCEPT_TIMEOUT_MINUTES). */
async function cancelUnaccepted() {
  if (!env.ORDER_ACCEPT_TIMEOUT_MINUTES) return;
  const cutoff = new Date(Date.now() - env.ORDER_ACCEPT_TIMEOUT_MINUTES * 60_000);
  const stale = await Order.find({
    orderStatus: 'PENDING',
    isScheduled: { $ne: true },
    createdAt: { $lt: cutoff },
    $or: [{ paymentMethod: 'COD' }, { paymentStatus: 'PAID' }],
  }).limit(200);
  for (const order of stale) await applyStatus(order, 'CANCELLEDBYREST', { reason: 'The store did not respond in time' });
  if (stale.length) logger.info({ count: stale.length }, 'Auto-cancelled unaccepted orders');
}

const jobs: Job[] = [
  { name: 'expire-unpaid-orders', everyMs: 60_000, run: expireUnpaidOrders },
  { name: 'cancel-unaccepted-orders', everyMs: 60_000, run: cancelUnaccepted },
];

const timers: NodeJS.Timeout[] = [];

/** Runs each job on an interval; a Redis lock ensures one instance runs it at a time. */
export function startJobs(): void {
  for (const job of jobs) {
    const tick = async () => {
      const lockTtl = Math.max(Math.floor(job.everyMs / 1000) - 1, 1);
      if (!(await kv.setNx(`lock:job:${job.name}`, String(process.pid), lockTtl))) return;
      try {
        await job.run();
      } catch (err) {
        logger.error({ err, job: job.name }, 'Background job failed');
      }
    };
    const t = setInterval(() => void tick(), job.everyMs);
    t.unref();
    timers.push(t);
  }
  logger.info({ jobs: jobs.map((j) => j.name) }, 'Background jobs started');
}

export function stopJobs(): void {
  for (const t of timers.splice(0)) clearInterval(t);
}
