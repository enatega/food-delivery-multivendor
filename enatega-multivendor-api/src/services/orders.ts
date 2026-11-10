import { Types } from 'mongoose';
import { badInput, conflict } from '../lib/errors.js';
import { distanceKm } from '../lib/geo.js';
import { logger } from '../lib/logger.js';
import { pubsub, topics } from '../lib/pubsub.js';
import { round2 } from '../lib/query.js';
import {
  Addon,
  Earning,
  Food,
  FINAL_STATUSES,
  Option,
  Order,
  Restaurant,
  Rider,
  User,
  WebNotification,
  type OrderDoc,
  type OrderStatus,
} from '../models/index.js';
import { refundPayment } from './payments.js';
import { sendPush } from './push.js';

export interface OrderLineInput {
  food: string;
  variation: string;
  quantity: number;
  addons?: { _id: string; options: string[] }[];
  specialInstructions?: string;
}

/** Builds order item snapshots from DB prices (client prices are never trusted). */
export async function buildOrderItems(restaurantId: string, lines: OrderLineInput[]) {
  if (!lines.length) throw badInput('Your cart is empty.');
  const foodIds = [...new Set(lines.map((l) => l.food))];
  const foods = await Food.find({ _id: { $in: foodIds }, restaurant: restaurantId, isDeleted: { $ne: true } } as Record<string, unknown>).lean();
  const foodMap = new Map(foods.map((f) => [String(f._id), f]));
  const addonIds = [...new Set(lines.flatMap((l) => (l.addons ?? []).map((a) => a._id)))];
  const optionIds = [...new Set(lines.flatMap((l) => (l.addons ?? []).flatMap((a) => a.options)))];
  const [addons, options] = await Promise.all([
    Addon.find({ _id: { $in: addonIds.filter((id) => Types.ObjectId.isValid(id)) }, restaurant: restaurantId } as Record<string, unknown>).lean(),
    Option.find({ _id: { $in: optionIds.filter((id) => Types.ObjectId.isValid(id)) }, restaurant: restaurantId } as Record<string, unknown>).lean(),
  ]);
  const addonMap = new Map(addons.map((a) => [String(a._id), a]));
  const optionMap = new Map(options.map((o) => [String(o._id), o]));

  return lines.map((line) => {
    const food = foodMap.get(line.food);
    if (!food || food.isActive === false) throw badInput('An item in your cart is no longer available. Please refresh your cart.');
    if (food.isOutOfStock) throw badInput(`"${food.title}" is out of stock.`);
    const variation = food.variations.find((v) => String(v._id) === String(line.variation));
    if (!variation) throw badInput(`The selected size of "${food.title}" is no longer available.`);
    if (variation.isOutOfStock) throw badInput(`"${food.title} ${variation.title ?? ''}" is out of stock.`);
    if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 100) throw badInput('Invalid quantity.');

    let optionsTotal = 0;
    const itemAddons = (line.addons ?? []).map((sel) => {
      const addon = addonMap.get(sel._id);
      if (!addon || !variation.addons.includes(sel._id)) throw badInput(`An add-on of "${food.title}" is no longer available.`);
      const chosen = [...new Set(sel.options)];
      if (chosen.length < (addon.quantityMinimum ?? 0) || chosen.length > (addon.quantityMaximum ?? Infinity)) {
        throw badInput(`Please choose between ${addon.quantityMinimum} and ${addon.quantityMaximum} option(s) for "${addon.title}".`);
      }
      const opts = chosen.map((oid) => {
        const o = optionMap.get(oid);
        if (!o || !addon.options.includes(oid)) throw badInput(`An option of "${addon.title}" is no longer available.`);
        if (o.isOutOfStock) throw badInput(`"${o.title}" is out of stock.`);
        optionsTotal += o.price ?? 0;
        return { _id: o._id, title: o.title, description: o.description, price: o.price ?? 0 };
      });
      return { _id: addon._id, title: addon.title, description: addon.description, quantityMinimum: addon.quantityMinimum, quantityMaximum: addon.quantityMaximum, options: opts };
    });
    // Required add-ons must be present.
    for (const aid of variation.addons) {
      const addon = addonMap.get(aid);
      if (addon && (addon.quantityMinimum ?? 0) > 0 && !itemAddons.some((a) => String(a._id) === aid)) {
        throw badInput(`Please choose an option for "${addon.title}".`);
      }
    }
    const unitPrice = round2((variation.price ?? 0) + optionsTotal);
    return {
      food: food._id,
      category: food.category,
      title: food.title,
      description: food.description,
      image: food.image,
      quantity: line.quantity,
      specialInstructions: line.specialInstructions?.slice(0, 500),
      variation: { _id: variation._id, title: variation.title, price: variation.price, discounted: variation.discounted },
      addons: itemAddons,
      unitPrice,
    };
  });
}

export async function nextOrderNumber(restaurantId: string): Promise<string> {
  const r = await Restaurant.findByIdAndUpdate(restaurantId, { $inc: { orderId: 1 } }, { returnDocument: 'after' }).select('orderId orderPrefix name');
  if (!r) throw badInput('Restaurant not found.');
  const prefix = (r.orderPrefix || r.name.replace(/[^A-Za-z]/g, '').slice(0, 3) || 'ORD').toUpperCase();
  return `${prefix}-${String(r.orderId).padStart(5, '0')}`;
}

/** Online orders are hidden from stores/riders until paid. */
export const isVisibleToStore = (o: { paymentMethod?: string | null; paymentStatus?: string | null }) =>
  (o.paymentMethod ?? 'COD').toUpperCase() === 'COD' || o.paymentStatus === 'PAID';

const ALLOWED: Record<string, OrderStatus[]> = {
  PENDING: ['ACCEPTED', 'CANCELLED', 'CANCELLEDBYREST'],
  ACCEPTED: ['ASSIGNED', 'PICKED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'CANCELLEDBYREST'],
  ASSIGNED: ['ACCEPTED', 'PICKED', 'CANCELLED', 'CANCELLEDBYREST'],
  PICKED: ['DELIVERED', 'COMPLETED', 'CANCELLED'],
  DELIVERED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
  CANCELLEDBYREST: [],
};

export function assertTransition(from: string, to: OrderStatus, admin = false) {
  if (from === to) return;
  if (admin && !FINAL_STATUSES.includes(from as OrderStatus)) return;
  if (!(ALLOWED[from] ?? []).includes(to)) throw conflict(`Order cannot move from ${from} to ${to}.`);
}

const AVG_SPEED_KMH = 25;

/** Recomputes the order ETA from store preparation and rider/route distance. */
export function computeEta(order: OrderDoc, restaurant: { location?: { coordinates?: number[] | null } | null; deliveryTime?: number | null } | null, riderLoc?: { lat: number; lng: number; at?: Date }) {
  const now = new Date();
  const rc = restaurant?.location?.coordinates;
  const dc = order.deliveryAddress?.location?.coordinates;
  const origin = rc && rc.length === 2 ? { latitude: rc[1]!, longitude: rc[0]! } : undefined;
  const destination = dc && dc.length === 2 ? { latitude: dc[1]!, longitude: dc[0]! } : undefined;
  const prepMinutes = order.selectedPrepTime ?? restaurant?.deliveryTime ?? 20;
  const readyAt = order.preparationTime ?? new Date((order.acceptedAt ?? order.createdAt ?? now).getTime() + prepMinutes * 60_000);
  const status = order.orderStatus as OrderStatus;
  let phase = 'PREPARING';
  if (order.isScheduled && status === 'PENDING') phase = 'SCHEDULED';
  else if (status === 'ACCEPTED' || status === 'ASSIGNED') phase = readyAt <= now ? 'READY_FOR_PICKUP' : 'PREPARING';
  if (status === 'ASSIGNED' && riderLoc) phase = 'EN_ROUTE_TO_STORE';
  if (status === 'PICKED') phase = 'EN_ROUTE_TO_CUSTOMER';
  if (FINAL_STATUSES.includes(status)) phase = status === 'DELIVERED' || status === 'COMPLETED' ? 'DELIVERED' : 'CANCELLED';

  let travelKm = origin && destination ? distanceKm(origin.latitude, origin.longitude, destination.latitude, destination.longitude) : 3;
  let source = 'STORE';
  let start = readyAt > now ? readyAt : now;
  if (riderLoc && destination && status === 'PICKED') {
    travelKm = distanceKm(riderLoc.lat, riderLoc.lng, destination.latitude, destination.longitude);
    source = 'ROUTE';
    start = now;
  } else if (riderLoc && origin && status === 'ASSIGNED') {
    const toStoreMin = (distanceKm(riderLoc.lat, riderLoc.lng, origin.latitude, origin.longitude) / AVG_SPEED_KMH) * 60;
    const riderAtStore = new Date(now.getTime() + toStoreMin * 60_000);
    start = riderAtStore > readyAt ? riderAtStore : readyAt;
    source = 'ROUTE';
  }
  const durationSeconds = order.isPickedUp ? 0 : Math.round((travelKm / AVG_SPEED_KMH) * 3600);
  const arrival = new Date(start.getTime() + durationSeconds * 1000);
  return {
    phase,
    source,
    readyAt,
    estimatedArrivalAt: order.isPickedUp ? readyAt : arrival,
    baseArrivalAt: order.eta?.baseArrivalAt ?? arrival,
    windowStartAt: new Date(arrival.getTime() - 5 * 60_000),
    windowEndAt: new Date(arrival.getTime() + 10 * 60_000),
    calculatedAt: now,
    lastLocationAt: riderLoc?.at ?? order.eta?.lastLocationAt,
    durationSeconds,
    distanceMeters: Math.round(travelKm * 1000),
    version: (order.eta?.version ?? 0) + 1,
    origin,
    destination,
  };
}

/** Publishes an order change to every interested subscription. */
export async function publishOrder(order: OrderDoc | Record<string, any>, origin: 'new' | 'update' | 'remove' = 'update') {
  const o = typeof (order as OrderDoc).toObject === 'function' ? (order as OrderDoc).toObject() : order;
  const id = String(o._id);
  const userId = String(o.user);
  await Promise.all([
    pubsub.publish(topics.customerOrders(userId), { orderStatusChanged: { userId, origin, order: o, rawOrder: o } }),
    pubsub.publish(topics.order(id), { subscriptionOrder: o }),
    pubsub.publish(topics.dispatcher(), { subscriptionDispatcher: o }),
    pubsub.publish(topics.orderTracking(id), {
      subscriptionOrderTracking: { orderId: o.orderId, status: o.orderStatus, eta: o.eta, riderLocation: null },
    }),
    isVisibleToStore(o) ? pubsub.publish(topics.restaurantOrders(String(o.restaurant)), { subscribePlaceOrder: { userId, origin, order: o } }) : undefined,
    o.rider ? pubsub.publish(topics.riderAssignments(String(o.rider)), { subscriptionAssignRider: { origin, order: o } }) : undefined,
  ]);
}

/** Announces an order to riders of its zone (new delivery job) or retracts it. */
export async function publishZoneOrder(order: OrderDoc | Record<string, any>, origin: 'new' | 'remove') {
  const o = typeof (order as OrderDoc).toObject === 'function' ? (order as OrderDoc).toObject() : order;
  if (!o.zone || o.isPickedUp) return;
  await pubsub.publish(topics.zoneOrders(String(o.zone)), { subscriptionZoneOrders: { zoneId: String(o.zone), origin, order: o } });
  if (origin === 'new') {
    const riders = await Rider.find({ zone: o.zone, available: true, isActive: true, isDeleted: { $ne: true }, notificationToken: { $type: 'string' } })
      .select('notificationToken')
      .lean();
    await sendPush(riders.map((r) => r.notificationToken), {
      title: 'New delivery available',
      body: `Order ${o.orderId} is ready to be picked up.`,
      data: { type: 'order', orderId: String(o._id) },
      channelId: 'default',
    });
  }
}

const STATUS_MESSAGES: Record<string, string> = {
  ACCEPTED: 'Your order was accepted and is being prepared.',
  ASSIGNED: 'A rider has been assigned to your order.',
  PICKED: 'Your order is on its way!',
  DELIVERED: 'Your order was delivered. Enjoy!',
  COMPLETED: 'Your order is complete.',
  CANCELLED: 'Your order was cancelled.',
  CANCELLEDBYREST: 'Sorry, the store could not accept your order.',
};

export async function notifyCustomer(order: OrderDoc) {
  const msg = STATUS_MESSAGES[order.orderStatus];
  if (!msg) return;
  const user = await User.findById(order.user).select('notificationToken webNotificationToken isOrderNotification').lean();
  if (!user || user.isOrderNotification === false) return;
  await sendPush([user.notificationToken, user.webNotificationToken], {
    title: `Order ${order.orderId}`,
    body: msg,
    data: { type: 'order', orderId: String(order._id), status: order.orderStatus },
  });
}

export async function notifyStoreNewOrder(order: OrderDoc) {
  const r = await Restaurant.findById(order.restaurant).select('notificationToken enableNotification owner name').lean();
  if (r?.enableNotification !== false) {
    await sendPush([r?.notificationToken], {
      title: 'New order',
      body: `Order ${order.orderId} - ${order.items.length} item(s)`,
      data: { type: 'order', orderId: String(order._id) },
      channelId: 'order',
    });
  }
  if (r?.owner) await WebNotification.create({ owner: r.owner, audience: 'OWNER', body: `New order ${order.orderId} at ${r.name}`, navigateTo: '/admin/store/orders' });
}

/**
 * Credits store / rider / platform earnings once an order is delivered.
 * Idempotent: guarded by `order.settled` and the unique index on Earning.order.
 */
export async function settleOrder(orderId: unknown) {
  const order = await Order.findOneAndUpdate({ _id: orderId, settled: false }, { settled: true }, { returnDocument: 'after' });
  if (!order) return;
  try {
    const itemsTotal = round2(order.itemsSubTotal ?? 0);
    const commission = round2((itemsTotal * (order.commissionRate ?? 0)) / 100);
    // Platform coupons are funded by the platform, restaurant coupons by the store.
    const storeTotal = round2(itemsTotal - commission);
    const riderTotal = order.isPickedUp ? 0 : round2((order.deliveryCharges ?? 0) + (order.tipping ?? 0));
    const platformTotal = round2(commission + (order.taxationAmount ?? 0) + (order.serviceFee ?? 0) - (order.couponDiscount ?? 0));
    await Earning.create({
      order: order._id,
      orderId: order.orderId,
      orderType: order.isPickedUp ? 'PICKUP' : 'DELIVERY',
      paymentMethod: order.paymentMethod,
      orderTotal: order.orderAmount,
      deliveredAt: order.deliveredAt ?? new Date(),
      platformEarnings: {
        marketplaceCommission: commission,
        deliveryCommission: 0,
        tax: order.taxationAmount ?? 0,
        platformFee: order.serviceFee ?? 0,
        totalEarnings: platformTotal,
      },
      riderEarnings: { riderId: order.rider, deliveryFee: order.isPickedUp ? 0 : order.deliveryCharges, tip: order.isPickedUp ? 0 : order.tipping, totalEarnings: riderTotal },
      storeEarnings: { storeId: order.restaurant, orderAmount: itemsTotal, totalEarnings: storeTotal },
    });
    await Restaurant.updateOne({ _id: order.restaurant }, { $inc: { currentWalletAmount: storeTotal, totalWalletAmount: storeTotal } });
    if (order.rider && riderTotal > 0) await Rider.updateOne({ _id: order.rider }, { $inc: { currentWalletAmount: riderTotal, totalWalletAmount: riderTotal } });
  } catch (err) {
    if ((err as { code?: number }).code === 11000) return; // already settled by a concurrent call
    await Order.updateOne({ _id: order._id }, { settled: false });
    logger.error({ err, orderId: String(order._id) }, 'Order settlement failed');
    throw err;
  }
}

/** Applies status side effects (timestamps, ETA, refunds, settlement), saves and publishes. */
export async function applyStatus(order: OrderDoc, to: OrderStatus, opts: { reason?: string; prepMinutes?: number; riderId?: unknown } = {}) {
  const now = new Date();
  const from = order.orderStatus;
  order.orderStatus = to;
  order.orderState = to;
  switch (to) {
    case 'ACCEPTED': {
      order.acceptedAt ??= now;
      const minutes = opts.prepMinutes ?? order.selectedPrepTime ?? 20;
      order.selectedPrepTime = minutes;
      order.preparationTime = new Date(now.getTime() + minutes * 60_000);
      order.expectedTime = order.preparationTime;
      break;
    }
    case 'ASSIGNED':
      order.assignedAt = now;
      if (opts.riderId) order.rider = opts.riderId as never;
      break;
    case 'PICKED':
      order.pickedAt = now;
      break;
    case 'DELIVERED':
    case 'COMPLETED':
      order.deliveredAt ??= now;
      order.completionTime = now;
      order.isActive = false;
      if ((order.paymentMethod ?? 'COD').toUpperCase() === 'COD') {
        order.paymentStatus = 'PAID';
        order.paidAmount = order.orderAmount;
      }
      break;
    case 'CANCELLED':
    case 'CANCELLEDBYREST':
      order.cancelledAt = now;
      order.isActive = false;
      order.reason = opts.reason ?? order.reason;
      break;
  }
  const restaurant = await Restaurant.findById(order.restaurant).select('location deliveryTime').lean();
  order.eta = computeEta(order, restaurant) as never;
  await order.save();

  if (to === 'CANCELLED' || to === 'CANCELLEDBYREST') {
    if (await refundPayment(order)) {
      order.paymentStatus = 'REFUNDED';
      await order.save();
    }
    if (order.rider) await Rider.updateOne({ _id: order.rider }, { $set: { available: true } }).catch(() => undefined);
  }
  if (to === 'DELIVERED' || to === 'COMPLETED') await settleOrder(order._id);

  await publishOrder(order, FINAL_STATUSES.includes(to) ? 'update' : 'update');
  if (to === 'ACCEPTED' && from === 'PENDING' && !order.rider) await publishZoneOrder(order, 'new');
  if ((to === 'ASSIGNED' || FINAL_STATUSES.includes(to)) && from === 'ACCEPTED') await publishZoneOrder(order, 'remove');
  await notifyCustomer(order);
  return order;
}
