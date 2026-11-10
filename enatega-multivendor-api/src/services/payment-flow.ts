import { Types } from 'mongoose';
import { logger } from '../lib/logger.js';
import { pubsub, topics } from '../lib/pubsub.js';
import { Order } from '../models/index.js';

/**
 * Marks an online order as paid (idempotent) and announces it to the store.
 * `announce` is injected to avoid a module cycle with the orders module.
 */
export async function markOrderPaid(
  orderId: string,
  payment: { reference?: string | null; amount?: number | null },
  announce: (order: InstanceType<typeof Order>) => Promise<void>,
): Promise<boolean> {
  if (!Types.ObjectId.isValid(orderId)) return false;
  const order = await Order.findOneAndUpdate(
    { _id: orderId, paymentStatus: 'PENDING', orderStatus: { $nin: ['CANCELLED', 'CANCELLEDBYREST'] } },
    { paymentStatus: 'PAID', paymentIntentId: payment.reference ?? undefined, paidAmount: payment.amount ?? undefined },
    { returnDocument: 'after' },
  );
  if (!order) return false;
  if (payment.amount !== undefined && payment.amount !== null && Math.abs(payment.amount - order.orderAmount) > 0.01) {
    logger.warn({ orderId, paid: payment.amount, expected: order.orderAmount }, 'Paid amount differs from order amount');
  }
  await pubsub.publish(topics.paymentSuccess(String(order.user)), {
    subscriptionPaymentSuccess: {
      userId: String(order.user),
      orderId: order.orderId,
      orderObjId: String(order._id),
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
    },
  });
  await announce(order);
  return true;
}
