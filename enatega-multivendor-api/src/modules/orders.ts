import { Types } from 'mongoose';
import { z } from 'zod';
import { defineModule } from '../graphql/module.js';
import type { GraphQLContext } from '../graphql/context.js';
import { objectId, optBool, optStr } from '../graphql/zod.js';
import {
  hasPermission,
  requireAdmin,
  requireClaims,
  requireCustomer,
  requireOwner,
  requireRestaurantAccess,
  requireRider,
  requireStore,
  scopedRestaurantIds,
} from '../auth/guards.js';
import { badInput, conflict, forbidden, must, notFound } from '../lib/errors.js';
import { ordersPlaced } from '../lib/metrics.js';
import { pubsub, topics } from '../lib/pubsub.js';
import { dateRange, offsetArgs, pageArgs, pageResult, round2, searchRegex } from '../lib/query.js';
import {
  ACTIVE_STATUSES,
  ChatMessage,
  FINAL_STATUSES,
  Food,
  LiveActivitySession,
  Order,
  Restaurant,
  Review,
  Rider,
  User,
  WebNotification,
  type OrderDoc,
  type OrderStatus,
} from '../models/index.js';
import { point } from '../models/common.js';
import { getConfig, getSecrets } from '../services/config.js';
import {
  applyStatus,
  assertTransition,
  buildOrderItems,
  computeEta,
  isVisibleToStore,
  nextOrderNumber,
  notifyStoreNewOrder,
  publishOrder,
  publishZoneOrder,
} from '../services/orders.js';
import { computeTotals, deliveryFee } from '../services/pricing.js';
import { sendPush } from '../services/push.js';
import { zoneForPoint } from '../services/restaurants.js';
import { audit } from '../services/audit.js';
import { findValidCoupon } from './catalog.js';
import { placeSingleVendorOrder } from './single-vendor.js';

const OrderInput = z.object({
  food: objectId,
  variation: objectId,
  quantity: z.coerce.number().int().min(1).max(100),
  addons: z
    .array(z.object({ _id: objectId, options: z.array(objectId).max(50).default([]) }))
    .max(30)
    .nullish()
    .transform((v) => v ?? []),
  specialInstructions: optStr(500),
});

export const PlaceOrderAddress = z.object({
  label: optStr(60),
  deliveryAddress: optStr(500),
  details: optStr(500),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  isDemoDefaultLocation: optBool,
  demoZoneId: optStr(40),
});

const ReviewInput = z.object({
  order: objectId,
  rating: z.coerce.number().int().min(1).max(5),
  description: optStr(2000),
  comments: optStr(2000),
});

const ChatMessageInput = z.object({
  message: z.string().trim().max(2000).default(''),
  image: optStr(2000),
  user: z.object({ id: optStr(40), name: optStr(120) }).optional(),
});

const ScheduleData = z.object({
  scheduleTimeId: optStr(40),
  isScheduled: optBool,
  dayId: optStr(40),
  date: optStr(40),
  startTime: optStr(20),
  endTime: optStr(20),
});

const PAYMENT_METHODS = ['COD', 'STRIPE', 'PAYPAL'] as const;

type Viewer =
  | { kind: 'customer'; id: string }
  | { kind: 'rider'; id: string; zone?: string }
  | { kind: 'store'; id: string }
  | { kind: 'owner'; restaurantIds?: string[] };

async function viewer(ctx: GraphQLContext): Promise<Viewer> {
  const claims = requireClaims(ctx);
  if (claims.typ === 'customer') return { kind: 'customer', id: String((await requireCustomer(ctx))._id) };
  if (claims.typ === 'rider') {
    const r = await requireRider(ctx);
    return { kind: 'rider', id: String(r._id), zone: r.zone ? String(r.zone) : undefined };
  }
  if (claims.typ === 'restaurant') return { kind: 'store', id: String((await requireStore(ctx))._id) };
  const p = await requireOwner(ctx);
  if (p.userType === 'STAFF' && !hasPermission(p, 'Orders') && !hasPermission(p, 'Dispatch') && !hasPermission(p, 'Users')) throw forbidden();
  return { kind: 'owner', restaurantIds: scopedRestaurantIds(p) };
}

function canSee(v: Viewer, o: { user?: unknown; rider?: unknown; restaurant?: unknown; zone?: unknown; orderStatus?: string; isPickedUp?: boolean | null }) {
  switch (v.kind) {
    case 'customer':
      return String(o.user) === v.id;
    case 'rider':
      return String(o.rider) === v.id || (!o.rider && o.orderStatus === 'ACCEPTED' && !o.isPickedUp && Boolean(v.zone) && String(o.zone) === v.zone);
    case 'store':
      return String(o.restaurant) === v.id;
    case 'owner':
      return !v.restaurantIds || v.restaurantIds.includes(String(o.restaurant));
  }
}

async function loadVisibleOrder(ctx: GraphQLContext, id: string) {
  if (!Types.ObjectId.isValid(id)) {
    // Some clients pass the human readable order number.
    const byNumber = await Order.findOne({ orderId: id });
    if (!byNumber) throw notFound('Order');
    if (!canSee(await viewer(ctx), byNumber)) throw forbidden();
    return byNumber;
  }
  const order = must(await Order.findById(id), 'Order');
  if (!canSee(await viewer(ctx), order)) throw forbidden();
  return order;
}

async function adminOrderFilter(ctx: GraphQLContext, permission: 'Orders' | 'Dispatch' = 'Orders') {
  const p = await requireOwner(ctx);
  const ids = scopedRestaurantIds(p);
  if (!ids && !hasPermission(p, permission) && !hasPermission(p, 'Orders')) throw forbidden();
  const filter: Record<string, unknown> = {};
  if (ids) filter.restaurant = { $in: ids };
  return filter;
}

function withSearch(filter: Record<string, unknown>, search?: string | null) {
  const re = searchRegex(search);
  if (re) filter.$or = [{ orderId: re }, { 'deliveryAddress.deliveryAddress': re }, { paymentMethod: re }];
  return filter;
}

async function paged(filter: Record<string, unknown>, page?: number | null, rows?: number | null) {
  const { page: p, limit, skip } = pageArgs(page, rows, 10);
  const [orders, total] = await Promise.all([Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), Order.countDocuments(filter)]);
  const r = pageResult(orders, total, p, limit);
  return { orders, totalCount: total, currentPage: r.currentPage, totalPages: r.totalPages, nextPage: r.nextPage, prevPage: r.prevPage };
}

export interface PlaceOrderArgs {
  restaurant?: string;
  orderInput?: z.infer<typeof OrderInput>[];
  paymentMethod: string;
  couponCode?: string;
  tipping?: number;
  address?: z.infer<typeof PlaceOrderAddress> & { _id?: string };
  orderDate?: string;
  isPickedUp?: boolean;
  instructions?: string;
  specialInstructions?: string;
  scheduleData?: z.infer<typeof ScheduleData>;
  isPriority?: boolean;
  idempotencyKey?: string;
  checkoutQuoteId?: string;
}

export function normalizePaymentMethod(method: string) {
  const m = String(method ?? '').trim().toUpperCase();
  const normalized = m === 'CASH' || m === 'COD' ? 'COD' : m === 'CARD' ? 'STRIPE' : m;
  if (!(PAYMENT_METHODS as readonly string[]).includes(normalized)) throw badInput('Unsupported payment method.');
  return normalized as (typeof PAYMENT_METHODS)[number];
}

export async function assertPaymentConfigured(method: string) {
  if (method === 'COD') return;
  const s = await getSecrets();
  if (method === 'STRIPE' && !s.stripeSecretKey) throw badInput('Card payments are not available right now.');
  if (method === 'PAYPAL' && (!s.paypalClientId || !s.paypalSecret)) throw badInput('PayPal is not available right now.');
}

/** Announces a newly placed (and payable) order to the store, admins and riders. */
export async function announceNewOrder(order: OrderDoc) {
  await publishOrder(order, 'new');
  if (isVisibleToStore(order)) {
    await notifyStoreNewOrder(order);
    await WebNotification.create({ audience: 'ADMIN', body: `New order ${order.orderId}`, navigateTo: '/general/dispatch' });
  }
}

async function placeMultiVendorOrder(ctx: GraphQLContext, args: PlaceOrderArgs) {
  const user = await requireCustomer(ctx);
  if (args.idempotencyKey) {
    const existing = await Order.findOne({ user: user._id, idempotencyKey: args.idempotencyKey });
    if (existing) return existing;
  }
  const paymentMethod = normalizePaymentMethod(args.paymentMethod);
  await assertPaymentConfigured(paymentMethod);
  const restaurant = await Restaurant.findOne({ _id: args.restaurant, isDeleted: { $ne: true } });
  if (!restaurant || !restaurant.isActive) throw badInput('This store is not available.');
  if (!restaurant.isAvailable) throw badInput('This store is not accepting orders right now.');

  const isPickedUp = Boolean(args.isPickedUp);
  if (isPickedUp && restaurant.deliveryOptions?.pickup === false) throw badInput('This store does not offer pickup.');
  if (!isPickedUp && restaurant.deliveryOptions?.delivery === false) throw badInput('This store does not offer delivery.');

  const cfg = await getConfig();
  const lat = args.address?.latitude;
  const lng = args.address?.longitude;
  if (!isPickedUp) {
    if (typeof lat !== 'number' || typeof lng !== 'number' || (lat === 0 && lng === 0)) throw badInput('A delivery address is required.');
    const demo = Boolean(args.address?.isDemoDefaultLocation && cfg.enableCustomerDemoMode);
    if (!demo && restaurant.deliveryBounds?.coordinates?.length) {
      const inside = await Restaurant.exists({
        _id: restaurant._id,
        deliveryBounds: { $geoIntersects: { $geometry: { type: 'Point', coordinates: [lng, lat] } } },
      });
      if (!inside) throw badInput("Sorry, this store doesn't deliver to your address.");
    }
  }

  const items = await buildOrderItems(String(restaurant._id), (args.orderInput ?? []).map((i) => ({ ...i, specialInstructions: i.specialInstructions })));
  const coupon = args.couponCode ? await findValidCoupon(args.couponCode, String(restaurant._id)) : null;
  if (args.couponCode && !coupon) throw badInput('Invalid or expired coupon code.');
  const delivery = isPickedUp ? 0 : deliveryFee(cfg, restaurant, { lat: lat!, lng: lng! });
  const totals = computeTotals({
    lines: items,
    couponPercent: coupon && coupon.couponType !== 'flat' ? coupon.discount : undefined,
    couponFlat: coupon && coupon.couponType === 'flat' ? coupon.discount : undefined,
    taxPercent: restaurant.tax ?? 0,
    delivery,
    tip: isPickedUp ? 0 : Math.min(Math.max(Number(args.tipping) || 0, 0), 10_000),
  });
  if (totals.itemsSubTotal < (restaurant.minimumOrder ?? 0)) {
    throw badInput(`The minimum order for this store is ${cfg.currencySymbol ?? ''}${restaurant.minimumOrder}.`);
  }

  const orderDate = args.orderDate ? new Date(args.orderDate) : new Date();
  if (Number.isNaN(orderDate.getTime())) throw badInput('Invalid order date.');
  const isScheduled = orderDate.getTime() > Date.now() + 10 * 60_000;
  if (isScheduled && orderDate.getTime() > Date.now() + 14 * 24 * 3600_000) throw badInput('Orders can be scheduled up to 14 days ahead.');

  const zone = restaurant.zone ?? (restaurant.location?.coordinates?.length ? (await zoneForPoint(restaurant.location.coordinates[0]!, restaurant.location.coordinates[1]!))?._id : undefined);

  const order = new Order({
    orderId: await nextOrderNumber(String(restaurant._id)),
    restaurant: restaurant._id,
    user: user._id,
    zone,
    items,
    deliveryAddress: isPickedUp
      ? { label: args.address?.label ?? 'Pickup', deliveryAddress: restaurant.address, details: 'Pickup from store', location: restaurant.location }
      : {
          label: args.address?.label,
          deliveryAddress: args.address?.deliveryAddress,
          details: args.address?.details,
          location: point(lng!, lat!),
        },
    paymentMethod,
    paymentStatus: 'PENDING',
    orderStatus: 'PENDING',
    orderState: 'PENDING',
    isPickedUp,
    isPriority: Boolean(args.isPriority),
    itemsSubTotal: totals.itemsSubTotal,
    couponCode: coupon?.title,
    couponDiscount: totals.couponDiscount,
    discountAmount: totals.couponDiscount,
    deliveryCharges: totals.deliveryCharges,
    originalDeliveryCharges: totals.deliveryCharges,
    taxationAmount: totals.taxationAmount,
    tipping: totals.tipping,
    orderAmount: totals.orderAmount,
    paidAmount: 0,
    commissionRate: restaurant.commissionRate ?? 0,
    instructions: (args.instructions ?? args.specialInstructions)?.slice(0, 1000),
    orderDate,
    isScheduled,
    expectedTime: new Date(orderDate.getTime() + (restaurant.deliveryTime ?? 30) * 60_000),
    idempotencyKey: args.idempotencyKey,
  });
  order.eta = computeEta(order, restaurant) as never;
  try {
    await order.save();
  } catch (err) {
    if ((err as { code?: number }).code === 11000 && args.idempotencyKey) {
      return must(await Order.findOne({ user: user._id, idempotencyKey: args.idempotencyKey }), 'Order');
    }
    throw err;
  }
  ordersPlaced.inc({ payment_method: paymentMethod });
  await Restaurant.updateOne({ _id: restaurant._id }, { $inc: { orderCount: 1 } });
  await Promise.all(items.map((i) => Food.updateOne({ _id: i.food }, { $inc: { orderCount: i.quantity } })));
  await announceNewOrder(order);
  return order;
}

async function updateRestaurantRating(restaurantId: unknown) {
  const [agg] = await Review.aggregate<{ avg: number; count: number }>([
    { $match: { restaurant: new Types.ObjectId(String(restaurantId)), isActive: true } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await Restaurant.updateOne({ _id: restaurantId }, { reviewAverage: round2(agg?.avg ?? 0), reviewCount: agg?.count ?? 0 });
}

async function chatParticipant(ctx: GraphQLContext, orderId: string) {
  const order = must(await Order.findById(orderId), 'Order');
  const claims = requireClaims(ctx);
  if (claims.typ === 'customer') {
    const user = await requireCustomer(ctx);
    if (String(order.user) !== String(user._id)) throw forbidden();
    return { order, senderType: 'customer' as const, id: String(user._id), name: user.name ?? 'Customer' };
  }
  if (claims.typ === 'rider') {
    const rider = await requireRider(ctx);
    if (String(order.rider) !== String(rider._id)) throw forbidden();
    return { order, senderType: 'rider' as const, id: String(rider._id), name: rider.name };
  }
  throw forbidden();
}

const chatView = (m: { _id: unknown; message?: string | null; image?: string | null; user?: { id?: string | null; name?: string | null } | null; createdAt?: Date }) => ({
  id: m._id,
  message: m.message,
  image: m.image,
  user: { id: m.user?.id, name: m.user?.name },
  createdAt: m.createdAt,
});

export const ordersModule = defineModule({
  name: 'orders',
  inputs: { OrderInput, ReviewInput, ChatMessageInput, ScheduleData },
  resolvers: {
    Query: {
      orders: async (_p, args: { offset?: number; page?: number; limit?: number }, ctx) => {
        const user = await requireCustomer(ctx);
        const { skip, limit } = args.page ? pageArgs(args.page, args.limit, 20) : offsetArgs(args.offset, args.limit, 20);
        return Order.find({ user: user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
      },
      order: async (_p, { id }: { id: string }, ctx) => loadVisibleOrder(ctx, id),
      orderDetails: async (_p, { id }: { id: string }, ctx) => loadVisibleOrder(ctx, id),
      getUsersActiveOrders: async (_p, args: { page?: number; limit?: number; offset?: number }, ctx) => {
        const user = await requireCustomer(ctx);
        const { skip, limit } = args.offset !== undefined && args.offset !== null ? offsetArgs(args.offset, args.limit, 20) : pageArgs(args.page, args.limit, 20);
        return Order.find({ user: user._id, orderStatus: { $in: ACTIVE_STATUSES } }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
      },
      getUsersPastOrders: async (_p, args: { page?: number; limit?: number; offset?: number }, ctx) => {
        const user = await requireCustomer(ctx);
        const { skip, limit } = args.offset !== undefined && args.offset !== null ? offsetArgs(args.offset, args.limit, 20) : pageArgs(args.page, args.limit, 20);
        return Order.find({ user: user._id, orderStatus: { $in: FINAL_STATUSES } }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
      },
      scheduledOrders: async (_p, args: { offset?: number; limit?: number }, ctx) => {
        const user = await requireCustomer(ctx);
        const { skip, limit } = offsetArgs(args.offset, args.limit, 20);
        return Order.find({ user: user._id, isScheduled: true, orderStatus: { $in: ACTIVE_STATUSES } }).sort({ orderDate: 1 }).skip(skip).limit(limit).lean();
      },
      orderTracking: async (_p, { id }: { id: string }, ctx) => {
        const order = await loadVisibleOrder(ctx, id);
        const rider = order.rider ? await Rider.findById(order.rider).select('location lastLocation').lean() : null;
        const c = rider?.location?.coordinates;
        return {
          orderId: order.orderId,
          status: order.orderStatus,
          eta: order.eta,
          riderLocation: c?.length === 2 ? { latitude: c[1], longitude: c[0], ...(rider?.lastLocation ?? {}) } : null,
        };
      },
      chat: async (_p, { order }: { order: string }, ctx) => {
        await chatParticipant(ctx, order);
        return (await ChatMessage.find({ order }).sort({ createdAt: 1 }).limit(500).lean()).map(chatView);
      },
      restaurantOrders: async (_p, args: { offset?: number; limit?: number }, ctx) => {
        const store = await requireStore(ctx);
        const { skip, limit } = offsetArgs(args.offset, args.limit, 100);
        return Order.find({
          restaurant: store._id,
          $or: [{ paymentMethod: 'COD' }, { paymentStatus: { $in: ['PAID', 'REFUNDED'] } }],
          createdAt: { $gte: new Date(Date.now() - 14 * 24 * 3600_000) },
        })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
      },
      riderOrders: async (_p, args: { offset?: number; limit?: number }, ctx) => {
        const rider = await requireRider(ctx);
        const { skip, limit } = offsetArgs(args.offset, args.limit, 100);
        const or: Record<string, unknown>[] = [{ rider: rider._id, createdAt: { $gte: new Date(Date.now() - 7 * 24 * 3600_000) } }];
        if (rider.zone && rider.available) {
          or.push({ zone: rider.zone, rider: null, orderStatus: 'ACCEPTED', isPickedUp: false, $or: [{ paymentMethod: 'COD' }, { paymentStatus: 'PAID' }] });
        }
        return Order.find({ $or: or }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
      },
      allOrders: async (_p, { page }: { page?: number }, ctx) => {
        const filter = await adminOrderFilter(ctx);
        const { skip, limit } = pageArgs(page, 50, 50);
        return Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
      },
      allOrdersPaginated: async (
        _p,
        args: { page?: number; rows?: number; dateKeyword?: string; starting_date?: string; ending_date?: string; orderStatus?: string[]; search?: string; restaurantId?: string; riderId?: string },
        ctx,
      ) => {
        const filter = withSearch(await adminOrderFilter(ctx), args.search);
        const range = dateRange(args.dateKeyword, args.starting_date, args.ending_date);
        if (range) filter.createdAt = range;
        if (args.orderStatus?.length) filter.orderStatus = { $in: args.orderStatus.map((s) => s.toUpperCase()) };
        if (args.restaurantId) {
          if (filter.restaurant && !(filter.restaurant as { $in: string[] }).$in.includes(args.restaurantId)) throw forbidden();
          filter.restaurant = args.restaurantId;
        }
        if (args.riderId) filter.rider = args.riderId;
        return paged(filter, args.page, args.rows);
      },
      allOrdersWithoutPagination: async (_p, args: { dateKeyword?: string; starting_date?: string; ending_date?: string }, ctx) => {
        const filter = await adminOrderFilter(ctx);
        const range = dateRange(args.dateKeyword, args.starting_date, args.ending_date);
        if (range) filter.createdAt = range;
        return Order.find(filter).sort({ createdAt: -1 }).limit(5000).lean();
      },
      getActiveOrders: async (_p, args: { restaurantId?: string; page?: number; rowsPerPage?: number; actions?: string[]; search?: string }, ctx) => {
        const filter = withSearch(await adminOrderFilter(ctx, 'Dispatch'), args.search);
        filter.orderStatus = { $in: args.actions?.length ? args.actions.map((a) => a.toUpperCase()) : ACTIVE_STATUSES };
        if (args.restaurantId) {
          await requireRestaurantAccess(ctx, args.restaurantId);
          filter.restaurant = args.restaurantId;
        }
        const res = await paged(filter, args.page, args.rowsPerPage);
        return { orders: res.orders, totalCount: res.totalCount };
      },
      ordersByRestId: async (_p, args: { restaurant: string; page?: number; rows?: number; search?: string; orderStatus?: string[] }, ctx) => {
        await requireRestaurantAccess(ctx, args.restaurant);
        const filter = withSearch({ restaurant: args.restaurant }, args.search);
        if (args.orderStatus?.length) filter.orderStatus = { $in: args.orderStatus.map((s) => s.toUpperCase()) };
        return paged(filter, args.page, args.rows);
      },
      ordersByRestIdWithoutPagination: async (_p, args: { restaurant: string; search?: string }, ctx) => {
        await requireRestaurantAccess(ctx, args.restaurant);
        return Order.find(withSearch({ restaurant: args.restaurant }, args.search)).sort({ createdAt: -1 }).limit(5000).lean();
      },
      ordersByUser: async (_p, args: { userId: string; page?: number; limit?: number }, ctx) => {
        await requireAdmin(ctx, 'Users');
        return paged({ user: args.userId }, args.page, args.limit);
      },
      orderFilterOptions: async (_p, _a, ctx) => {
        const filter = await adminOrderFilter(ctx);
        const restaurants = await Restaurant.find({ isDeleted: { $ne: true }, ...(filter.restaurant ? { _id: filter.restaurant } : {}) })
          .select('name image address')
          .sort({ name: 1 })
          .lean();
        const riders = await Rider.find({ isDeleted: { $ne: true } }).select('name username phone available').sort({ name: 1 }).lean();
        return { restaurants, riders };
      },
    },
    Mutation: {
      placeOrder: async (_p, args: PlaceOrderArgs, ctx) => {
        if (!args.restaurant || !args.orderInput?.length) return placeSingleVendorOrder(ctx, args);
        return placeMultiVendorOrder(ctx, args);
      },
      abortOrder: async (_p, { id }: { id: string }, ctx) => {
        const user = await requireCustomer(ctx);
        const order = must(await Order.findOne({ _id: id, user: user._id }), 'Order');
        if (order.orderStatus !== 'PENDING') throw conflict('This order can no longer be cancelled. Please contact support.');
        return applyStatus(order, 'CANCELLED', { reason: 'Cancelled by customer' });
      },
      reviewOrder: async (_p, { reviewInput }: { reviewInput: z.infer<typeof ReviewInput> }, ctx) => {
        const user = await requireCustomer(ctx);
        const order = must(await Order.findOne({ _id: reviewInput.order, user: user._id }), 'Order');
        if (!['DELIVERED', 'COMPLETED'].includes(order.orderStatus)) throw badInput('You can review an order after it is delivered.');
        if (order.review) throw conflict('This order has already been reviewed.');
        const review = await Review.create({
          order: order._id,
          restaurant: order.restaurant,
          user: user._id,
          rating: reviewInput.rating,
          description: reviewInput.description,
          comments: reviewInput.comments,
        });
        order.review = review._id;
        await order.save();
        await updateRestaurantRating(order.restaurant);
        return order;
      },

      acceptOrder: async (_p, { _id, time }: { _id: string; time?: string }, ctx) => {
        const order = must(await Order.findById(_id), 'Order');
        await requireRestaurantAccess(ctx, String(order.restaurant));
        if (!isVisibleToStore(order)) throw conflict('This order is awaiting payment.');
        assertTransition(order.orderStatus, 'ACCEPTED');
        const minutes = time ? Math.min(Math.max(parseInt(time, 10) || 0, 1), 240) : undefined;
        order.isRinged = false;
        return applyStatus(order, 'ACCEPTED', { prepMinutes: minutes });
      },
      cancelOrder: async (_p, { _id, reason }: { _id: string; reason: string }, ctx) => {
        const order = must(await Order.findById(_id), 'Order');
        await requireRestaurantAccess(ctx, String(order.restaurant));
        assertTransition(order.orderStatus, 'CANCELLEDBYREST');
        order.isRinged = false;
        return applyStatus(order, 'CANCELLEDBYREST', { reason: String(reason ?? '').slice(0, 500) || 'Cancelled by store' });
      },
      orderPickedUp: async (_p, { _id }: { _id: string }, ctx) => {
        const order = must(await Order.findById(_id), 'Order');
        await requireRestaurantAccess(ctx, String(order.restaurant));
        if (order.isPickedUp) {
          assertTransition(order.orderStatus, 'DELIVERED');
          return applyStatus(order, 'DELIVERED');
        }
        // Delivery order handed to the rider.
        assertTransition(order.orderStatus, 'PICKED');
        return applyStatus(order, 'PICKED');
      },
      muteRing: async (_p, { orderId }: { orderId?: string }, ctx) => {
        const store = await requireStore(ctx);
        const filter: Record<string, unknown> = { restaurant: store._id, isRinged: true };
        if (orderId) filter[Types.ObjectId.isValid(orderId) ? '_id' : 'orderId'] = orderId;
        await Order.updateMany(filter, { isRinged: false });
        return true;
      },

      assignOrder: async (_p, { id }: { id: string }, ctx) => {
        const rider = await requireRider(ctx);
        if (!rider.available) throw badInput('Go online to accept orders.');
        const now = new Date();
        const order = await Order.findOneAndUpdate(
          { _id: id, rider: null, orderStatus: 'ACCEPTED', isPickedUp: false, ...(rider.zone ? { zone: rider.zone } : {}) },
          { rider: rider._id, orderStatus: 'ASSIGNED', orderState: 'ASSIGNED', assignedAt: now, isRiderRinged: false },
          { returnDocument: 'after' },
        );
        if (!order) throw conflict('This order was already taken by another rider.');
        await publishZoneOrder(order, 'remove');
        return applyStatus(order, 'ASSIGNED', { riderId: rider._id });
      },
      updateOrderStatusRider: async (_p, { id, status }: { id: string; status: string }, ctx) => {
        const rider = await requireRider(ctx);
        const order = must(await Order.findOne({ _id: id, rider: rider._id }), 'Order');
        const to = String(status).toUpperCase() as OrderStatus;
        if (!['PICKED', 'DELIVERED'].includes(to)) throw badInput('Riders can only mark orders as PICKED or DELIVERED.');
        assertTransition(order.orderStatus, to);
        return applyStatus(order, to);
      },

      assignRider: async (_p, { id, riderId }: { id: string; riderId: string }, ctx) => {
        await requireAdmin(ctx, 'Dispatch');
        const order = must(await Order.findById(id), 'Order');
        if (FINAL_STATUSES.includes(order.orderStatus as OrderStatus)) throw conflict('This order is already closed.');
        if (order.isPickedUp) throw badInput('Pickup orders do not need a rider.');
        const rider = must(await Rider.findOne({ _id: riderId, isActive: true, isDeleted: { $ne: true } }), 'Rider');
        const previous = order.rider ? String(order.rider) : null;
        if (previous && previous !== String(rider._id)) {
          await pubsub.publish(topics.riderAssignments(previous), { subscriptionAssignRider: { origin: 'remove', order: order.toObject() } });
        }
        if (order.orderStatus === 'PENDING') {
          order.acceptedAt = new Date();
          order.preparationTime = new Date(Date.now() + (order.selectedPrepTime ?? 20) * 60_000);
        }
        order.isRiderRinged = true;
        const to: OrderStatus = order.orderStatus === 'PICKED' ? 'PICKED' : 'ASSIGNED';
        order.rider = rider._id;
        const saved = await applyStatus(order, to, { riderId: rider._id });
        await publishZoneOrder(saved, 'remove');
        await sendPush([rider.notificationToken], { title: 'New order assigned', body: `Order ${order.orderId} was assigned to you.`, data: { type: 'order', orderId: String(order._id) } });
        await audit(ctx, 'ASSIGN_RIDER', 'Order', id, { riderId });
        return saved;
      },
      updateStatus: async (_p, { id, orderStatus }: { id: string; orderStatus: string }, ctx) => {
        await requireAdmin(ctx, 'Orders');
        const order = must(await Order.findById(id), 'Order');
        const to = String(orderStatus).toUpperCase() as OrderStatus;
        if (!['PENDING', 'ACCEPTED', 'ASSIGNED', 'PICKED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'CANCELLEDBYREST'].includes(to)) throw badInput('Unknown order status.');
        assertTransition(order.orderStatus, to, true);
        if (to === 'ASSIGNED' && !order.rider) throw badInput('Assign a rider first.');
        const saved = await applyStatus(order, to, { reason: to.startsWith('CANCELLED') ? 'Cancelled by admin' : undefined });
        await audit(ctx, 'UPDATE_ORDER_STATUS', 'Order', id, { orderStatus: to });
        return saved;
      },

      sendChatMessage: async (_p, { message, orderId }: { message: z.infer<typeof ChatMessageInput>; orderId: string }, ctx) => {
        const who = await chatParticipant(ctx, orderId);
        if (!message.message && !message.image) throw badInput('Message is empty.');
        if (FINAL_STATUSES.includes(who.order.orderStatus as OrderStatus) && Date.now() - (who.order.updatedAt?.getTime() ?? 0) > 3600_000) {
          throw badInput('Chat is closed for this order.');
        }
        const msg = await ChatMessage.create({ order: who.order._id, message: message.message, image: message.image, senderType: who.senderType, user: { id: who.id, name: who.name } });
        const view = chatView(msg.toObject());
        await pubsub.publish(topics.chat(String(who.order._id)), { subscriptionNewMessage: view });
        const recipientToken =
          who.senderType === 'customer'
            ? (await Rider.findById(who.order.rider).select('notificationToken').lean())?.notificationToken
            : (await User.findById(who.order.user).select('notificationToken').lean())?.notificationToken;
        await sendPush([recipientToken], {
          title: who.senderType === 'customer' ? `Message from ${who.name}` : 'Message from your rider',
          body: message.message || 'Sent a photo',
          data: { type: 'chat', orderId: String(who.order._id) },
        });
        return { success: true, message: 'Message sent', data: view };
      },
      registerLiveActivitySession: async (
        _p,
        args: { orderId: string; activityId: string; platform: string; pushToken: string; schemaVersion?: number; language?: string },
        ctx,
      ) => {
        const user = await requireCustomer(ctx);
        must(await Order.exists({ _id: args.orderId, user: user._id }), 'Order');
        await LiveActivitySession.findOneAndUpdate(
          { order: args.orderId, activityId: args.activityId },
          { user: user._id, platform: args.platform, pushToken: args.pushToken, schemaVersion: args.schemaVersion, language: args.language },
          { upsert: true },
        );
        return { success: true, message: 'Live activity registered' };
      },
      removeLiveActivitySession: async (_p, args: { orderId: string; activityId: string }, ctx) => {
        const user = await requireCustomer(ctx);
        await LiveActivitySession.deleteOne({ order: args.orderId, activityId: args.activityId, user: user._id });
        return { success: true, message: 'Live activity removed' };
      },
    },
    Subscription: {
      orderStatusChanged: {
        subscribe: async (_p: unknown, { userId }: { userId: string }, ctx: GraphQLContext) => {
          const user = await requireCustomer(ctx);
          if (String(user._id) !== userId) throw forbidden();
          return pubsub.subscribe(topics.customerOrders(userId));
        },
      },
      subscribePlaceOrder: {
        subscribe: async (_p: unknown, { restaurant }: { restaurant: string }, ctx: GraphQLContext) => {
          await requireRestaurantAccess(ctx, restaurant);
          return pubsub.subscribe(topics.restaurantOrders(restaurant));
        },
      },
      subscriptionAssignRider: {
        subscribe: async (_p: unknown, { riderId }: { riderId: string }, ctx: GraphQLContext) => {
          const claims = requireClaims(ctx);
          if (claims.typ === 'rider') {
            const rider = await requireRider(ctx);
            if (String(rider._id) !== riderId) throw forbidden();
          } else await requireAdmin(ctx, 'Dispatch');
          return pubsub.subscribe(topics.riderAssignments(riderId));
        },
      },
      subscriptionZoneOrders: {
        subscribe: async (_p: unknown, { zoneId }: { zoneId: string }, ctx: GraphQLContext) => {
          const rider = await requireRider(ctx);
          if (String(rider.zone) !== zoneId) throw forbidden();
          return pubsub.subscribe(topics.zoneOrders(zoneId));
        },
      },
      subscriptionDispatcher: {
        subscribe: async (_p: unknown, _a: unknown, ctx: GraphQLContext) => {
          await requireAdmin(ctx, 'Dispatch');
          return pubsub.subscribe(topics.dispatcher());
        },
      },
      subscriptionOrder: {
        subscribe: async (_p: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
          await loadVisibleOrder(ctx, id);
          return pubsub.subscribe(topics.order(id));
        },
      },
      subscriptionOrderTracking: {
        subscribe: async (_p: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
          const order = await loadVisibleOrder(ctx, id);
          return pubsub.subscribe(topics.orderTracking(String(order._id)));
        },
      },
      subscriptionPaymentSuccess: {
        subscribe: async (_p: unknown, { userId }: { userId: string }, ctx: GraphQLContext) => {
          const user = await requireCustomer(ctx);
          if (String(user._id) !== userId) throw forbidden();
          return pubsub.subscribe(topics.paymentSuccess(userId));
        },
      },
      subscriptionNewMessage: {
        subscribe: async (_p: unknown, { order }: { order: string }, ctx: GraphQLContext) => {
          await chatParticipant(ctx, order);
          return pubsub.subscribe(topics.chat(order));
        },
      },
    },
    Order: {
      id: (o: { _id: unknown }) => o._id,
      restaurant: (o: { restaurant?: unknown }, _a, ctx) => (o.restaurant ? ctx.loaders.restaurant.load(String(o.restaurant)) : null),
      user: (o: { user?: unknown }, _a, ctx) => {
        if (!o.user) return null;
        if (typeof o.user === 'object' && !(o.user instanceof Types.ObjectId) && 'name' in (o.user as object)) return o.user; // sanitized public view
        return ctx.loaders.user.load(String(o.user));
      },
      rider: (o: { rider?: unknown }, _a, ctx) => (o.rider ? ctx.loaders.rider.load(String(o.rider)) : null),
      zone: (o: { zone?: unknown }, _a, ctx) => (o.zone ? ctx.loaders.zone.load(String(o.zone)) : null),
      review: (o: { review?: unknown }, _a, ctx) => (o.review ? ctx.loaders.review.load(String(o.review)) : null),
      status: (o: { orderStatus?: string }) => !['PENDING', 'CANCELLED', 'CANCELLEDBYREST'].includes(o.orderStatus ?? 'PENDING'),
      deliveryType: (o: { isPickedUp?: boolean }) => (o.isPickedUp ? 'PICKUP' : 'DELIVERY'),
      scheduledAt: (o: { isScheduled?: boolean; orderDate?: Date }) => (o.isScheduled ? o.orderDate : null),
      orderState: (o: { orderStatus?: string; preparationTime?: Date }) =>
        o.orderStatus === 'ACCEPTED' && o.preparationTime && new Date(o.preparationTime).getTime() <= Date.now() ? 'READY_FOR_PICKUP' : o.orderStatus,
    },
    OrderAddress: { id: (a: { _id?: unknown }) => a._id ?? null },
    Item: { id: (i: { _id: unknown }) => i._id, food: (i: { food?: unknown }) => (i.food ? String(i.food) : null) },
    ItemVariation: { id: (v: { _id: unknown }) => v._id },
    ItemAddon: { id: (a: { _id: unknown }) => a._id },
    ItemOption: { id: (o: { _id: unknown }) => o._id },
  },
});
