import { Types } from 'mongoose';
import { z } from 'zod';
import { defineModule } from '../graphql/module.js';
import type { GraphQLContext } from '../graphql/context.js';
import { optBool, optNum, optStr, polygon } from '../graphql/zod.js';
import { hasPermission, requireAdmin, requireClaims, requireOwner, requireRestaurantAccess, requireRider, requireStore } from '../auth/guards.js';
import { assertStrongPassword, hashPassword } from '../auth/password.js';
import { badInput, conflict, forbidden, must } from '../lib/errors.js';
import { closeRings } from '../lib/geo.js';
import { kv } from '../lib/kv.js';
import { pubsub, topics } from '../lib/pubsub.js';
import { dateRange, escapeRegex, pageArgs, pageResult, round2, searchRegex } from '../lib/query.js';
import { shortCode } from '../lib/crypto.js';
import { Earning, Order, Restaurant, Rider, Transaction, WithdrawRequest, Zone, type RiderDoc } from '../models/index.js';
import { point } from '../models/common.js';
import { audit } from '../services/audit.js';
import { getConfig } from '../services/config.js';
import { computeEta } from '../services/orders.js';

const RiderInput = z.object({
  _id: optStr(40),
  name: z.string().trim().min(1).max(120),
  username: z.string().trim().toLowerCase().min(3).max(60),
  password: optStr(128),
  phone: optStr(30),
  email: z.preprocess((v) => (v === '' || v === null ? undefined : v), z.string().trim().toLowerCase().email().optional()),
  image: optStr(2000),
  zone: optStr(40),
  vehicleType: optStr(30),
  available: optBool,
  isActive: optBool,
  accountNumber: optStr(60),
});

const ZoneInput = z.object({
  _id: optStr(40),
  title: z.string().trim().min(1).max(120),
  description: optStr(500),
  coordinates: polygon,
  tax: optNum,
  isActive: optBool,
});

const hhmm = z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'time must be HH:mm');
const DayScheduleInput = z.object({
  day: z.string().trim().max(10),
  enabled: optBool,
  slots: z.array(z.object({ startTime: hhmm, endTime: hhmm })).max(10).default([]),
});

async function riderAccess(ctx: GraphQLContext, riderId?: string | null): Promise<{ self: boolean; rider: RiderDoc }> {
  const claims = requireClaims(ctx);
  if (claims.typ === 'rider') {
    const me = await requireRider(ctx);
    if (riderId && riderId !== String(me._id)) throw forbidden();
    return { self: true, rider: me };
  }
  await requireAdmin(ctx, 'Riders');
  if (!riderId) throw badInput('Rider id is required.');
  return { self: false, rider: must(await Rider.findOne({ _id: riderId, isDeleted: { $ne: true } }), 'Rider') };
}

async function requireRidersList(ctx: GraphQLContext) {
  const p = await requireOwner(ctx);
  if (!hasPermission(p, 'Riders') && !hasPermission(p, 'Dispatch') && !hasPermission(p, 'Orders')) throw forbidden();
}

/** Resolves the wallet owner for finance queries: self for riders/stores, any for admins. */
async function financeScope(ctx: GraphQLContext, userType?: string | null, userId?: string | null) {
  const claims = requireClaims(ctx);
  if (claims.typ === 'rider') return { userType: 'RIDER' as const, userId: String((await requireRider(ctx))._id) };
  if (claims.typ === 'restaurant') return { userType: 'STORE' as const, userId: String((await requireStore(ctx))._id) };
  const p = await requireOwner(ctx);
  if (p.userType === 'RESTAURANT') return { userType: 'STORE' as const, userId: p.id };
  if (p.userType === 'VENDOR') {
    if (userId && !p.restaurantIds.includes(userId)) throw forbidden();
    return { userType: 'STORE' as const, userId: userId ?? undefined, storeIds: p.restaurantIds };
  }
  if (!hasPermission(p, 'Withdraw Request') && !hasPermission(p, 'Orders')) throw forbidden();
  const t = (userType ?? 'ALL').toUpperCase();
  return { userType: t === 'ALL' ? undefined : (t as 'RIDER' | 'STORE'), userId: userId ?? undefined };
}

async function earningsGraph(match: Record<string, unknown>, who: 'rider' | 'store', args: { page?: number; limit?: number; startDate?: string; endDate?: string }) {
  const range = dateRange('custom', args.startDate, args.endDate);
  if (range) match.createdAt = range;
  const { skip, limit } = pageArgs(args.page, args.limit, 30);
  const totalPath = who === 'rider' ? '$riderEarnings.totalEarnings' : '$storeEarnings.totalEarnings';
  const rows = await Earning.aggregate([
    { $match: match },
    { $lookup: { from: 'orders', localField: 'order', foreignField: '_id', as: 'o', pipeline: [{ $project: { assignedAt: 1, deliveredAt: 1, orderAmount: 1 } }] } },
    { $addFields: { o: { $first: '$o' }, day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } } },
    {
      $group: {
        _id: '$day',
        earningsArray: {
          $push: {
            date: '$createdAt',
            tip: '$riderEarnings.tip',
            deliveryFee: '$riderEarnings.deliveryFee',
            totalEarnings: totalPath,
            totalOrderAmount: '$orderTotal',
            orderDetails: { orderId: '$orderId', orderType: '$orderType', paymentMethod: '$paymentMethod' },
          },
        },
        totalDeliveries: { $sum: 1 },
        totalEarningsSum: { $sum: totalPath },
        totalTipsSum: { $sum: { $ifNull: ['$riderEarnings.tip', 0] } },
        totalMs: { $sum: { $cond: [{ $and: ['$o.assignedAt', '$o.deliveredAt'] }, { $subtract: ['$o.deliveredAt', '$o.assignedAt'] }, 0] } },
      },
    },
    { $sort: { _id: -1 } },
    { $facet: { data: [{ $skip: skip }, { $limit: limit }], count: [{ $count: 'n' }] } },
  ]);
  const data = rows[0]?.data ?? [];
  return {
    totalCount: rows[0]?.count?.[0]?.n ?? 0,
    earnings: data.map((d: any) => ({
      _id: d._id,
      date: d._id,
      earningsArray: d.earningsArray,
      totalDeliveries: d.totalDeliveries,
      totalEarningsSum: round2(d.totalEarningsSum),
      totalTipsSum: round2(d.totalTipsSum),
      totalHours: round2(d.totalMs / 3_600_000),
    })),
  };
}

function scopeFilter(scope: Awaited<ReturnType<typeof financeScope>>, riderField: string, storeField: string) {
  const f: Record<string, unknown> = {};
  if (scope.userType === 'RIDER') {
    if (scope.userId) f[riderField] = new Types.ObjectId(scope.userId);
    else f[riderField] = { $ne: null };
  } else if (scope.userType === 'STORE') {
    if (scope.userId) f[storeField] = new Types.ObjectId(scope.userId);
    else if ('storeIds' in scope && scope.storeIds) f[storeField] = { $in: scope.storeIds.map((id) => new Types.ObjectId(id)) };
    else f[storeField] = { $ne: null };
  }
  return f;
}

/** Throttled (1/s per rider) re-publication of tracking info for the rider's active orders. */
async function publishRiderLocation(rider: RiderDoc) {
  if (!(await kv.setNx(`rider-loc:${rider._id}`, '1', 1))) return;
  const c = rider.location?.coordinates;
  await pubsub.publish(topics.riderLocation(String(rider._id)), { subscriptionRiderLocation: rider.toObject() });
  if (!c || c.length !== 2) return;
  const riderLocation = { latitude: c[1], longitude: c[0], ...(rider.lastLocation ?? {}) };
  const active = await Order.find({ rider: rider._id, orderStatus: { $in: ['ASSIGNED', 'PICKED'] } });
  for (const order of active) {
    const restaurant = await Restaurant.findById(order.restaurant).select('location deliveryTime').lean();
    order.eta = computeEta(order, restaurant, { lat: c[1]!, lng: c[0]!, at: new Date() }) as never;
    await order.save();
    await pubsub.publish(topics.orderTracking(String(order._id)), {
      subscriptionOrderTracking: { orderId: order.orderId, status: order.orderStatus, riderLocation, eta: order.eta },
    });
  }
}

export const ridersModule = defineModule({
  name: 'riders',
  inputs: {
    RiderInput,
    ZoneInput,
    DayScheduleInput,
    LicenseDetailsInput: z.object({ number: optStr(60), expiryDate: optStr(40), image: optStr(2000) }),
    VehicleDetailsInput: z.object({ number: optStr(60), image: optStr(2000) }),
  },
  resolvers: {
    Query: {
      rider: async (_p, { id }: { id?: string }, ctx) => {
        const claims = requireClaims(ctx);
        if (claims.typ === 'rider') {
          const me = await requireRider(ctx);
          if (id && id !== String(me._id)) throw forbidden();
          return me;
        }
        if (claims.typ === 'customer') {
          // Customers may see the rider of their own active order (name / phone / location).
          if (!id) throw badInput('Rider id is required.');
          const owns = await Order.exists({ user: claims.sub, rider: id, orderStatus: { $in: ['ASSIGNED', 'PICKED'] } });
          if (!owns) throw forbidden();
          return must(await Rider.findById(id).select('name phone image vehicleType location').lean(), 'Rider');
        }
        await requireRidersList(ctx);
        return must(await Rider.findOne({ _id: id, isDeleted: { $ne: true } }).lean(), 'Rider');
      },
      riders: async (_p, _a, ctx) => {
        await requireRidersList(ctx);
        return Rider.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).lean();
      },
      availableRiders: async (_p, _a, ctx) => {
        await requireRidersList(ctx);
        return Rider.find({ isDeleted: { $ne: true }, isActive: true, available: true }).sort({ name: 1 }).lean();
      },
      ridersByZone: async (_p, { id }: { id: string }, ctx) => {
        await requireRidersList(ctx);
        return Rider.find({ zone: id, isDeleted: { $ne: true }, isActive: true } as Record<string, unknown>).sort({ name: 1 }).lean();
      },
      ridersPaginated: async (_p, args: { page?: number; limit?: number; search?: string; zone?: string; available?: boolean; isActive?: boolean }, ctx) => {
        await requireRidersList(ctx);
        const { page, limit, skip } = pageArgs(args.page, args.limit);
        const filter: Record<string, unknown> = { isDeleted: { $ne: true } };
        const re = searchRegex(args.search);
        if (re) filter.$or = [{ name: re }, { username: re }, { phone: re }];
        if (args.zone) filter.zone = args.zone;
        if (typeof args.available === 'boolean') filter.available = args.available;
        if (typeof args.isActive === 'boolean') filter.isActive = args.isActive;
        const [data, total] = await Promise.all([Rider.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), Rider.countDocuments(filter)]);
        return pageResult(data, total, page, limit);
      },
      zones: async (_p, _a, ctx) => {
        const claims = ctx.auth.error ? undefined : ctx.auth.claims;
        const admin = claims?.typ === 'owner';
        return Zone.find(admin ? {} : { isActive: true }).sort({ title: 1 }).lean();
      },
      zonesPaginated: async (_p, args: { page?: number; limit?: number; search?: string; isActive?: boolean }, ctx) => {
        await requireAdmin(ctx, 'Zone');
        const { page, limit, skip } = pageArgs(args.page, args.limit);
        const filter: Record<string, unknown> = {};
        const re = searchRegex(args.search);
        if (re) filter.title = re;
        if (typeof args.isActive === 'boolean') filter.isActive = args.isActive;
        const [data, total] = await Promise.all([Zone.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), Zone.countDocuments(filter)]);
        return pageResult(data, total, page, limit);
      },
      riderCurrentWithdrawRequest: async (_p, { riderId }: { riderId?: string }, ctx) => {
        const { rider } = await riderAccess(ctx, riderId);
        return WithdrawRequest.findOne({ rider: rider._id, status: 'REQUESTED' }).sort({ createdAt: -1 }).lean();
      },
      storeCurrentWithdrawRequest: async (_p, { storeId }: { storeId?: string }, ctx) => {
        const scope = await financeScope(ctx, 'STORE', storeId);
        const id = scope.userId ?? storeId;
        if (!id) throw badInput('storeId is required.');
        return WithdrawRequest.findOne({ store: id, status: 'REQUESTED' } as Record<string, unknown>).sort({ createdAt: -1 }).lean();
      },
      riderEarningsGraph: async (_p, args: { riderId: string; page?: number; limit?: number; startDate?: string; endDate?: string }, ctx) => {
        const { rider } = await riderAccess(ctx, args.riderId);
        return earningsGraph({ 'riderEarnings.riderId': rider._id }, 'rider', args);
      },
      storeEarningsGraph: async (_p, args: { storeId: string; page?: number; limit?: number; startDate?: string; endDate?: string }, ctx) => {
        await requireRestaurantAccess(ctx, args.storeId);
        return earningsGraph({ 'storeEarnings.storeId': new Types.ObjectId(args.storeId) }, 'store', args);
      },
      earnings: async (
        _p,
        args: { userId?: string; userType?: string; orderType?: string; paymentMethod?: string; search?: string; pagination?: { skip: number; limit: number }; dateFilter?: { starting_date?: string; ending_date?: string } },
        ctx,
      ) => {
        const scope = await financeScope(ctx, args.userType, args.userId);
        const match = scopeFilter(scope, 'riderEarnings.riderId', 'storeEarnings.storeId');
        if (args.orderType && args.orderType !== 'ALL') match.orderType = args.orderType;
        if (args.paymentMethod && args.paymentMethod !== 'ALL') match.paymentMethod = args.paymentMethod;
        const range = dateRange('custom', args.dateFilter?.starting_date, args.dateFilter?.ending_date);
        if (range) match.createdAt = range;
        if (args.search) match.orderId = new RegExp(escapeRegex(args.search.slice(0, 60)), 'i');
        const skip = args.pagination?.skip ?? 0;
        const limit = args.pagination?.limit ?? 10;
        const [earnings, total, totals] = await Promise.all([
          Earning.find(match).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('riderEarnings.riderId', 'name username').populate('storeEarnings.storeId', 'name username').lean(),
          Earning.countDocuments(match),
          Earning.aggregate([
            { $match: match },
            { $group: { _id: null, platformTotal: { $sum: '$platformEarnings.totalEarnings' }, riderTotal: { $sum: '$riderEarnings.totalEarnings' }, storeTotal: { $sum: '$storeEarnings.totalEarnings' } } },
          ]),
        ]);
        const g = totals[0] ?? {};
        return {
          success: true,
          message: null,
          data: { earnings, grandTotalEarnings: { platformTotal: round2(g.platformTotal ?? 0), riderTotal: round2(g.riderTotal ?? 0), storeTotal: round2(g.storeTotal ?? 0) } },
          pagination: { total },
        };
      },
      transactionHistory: async (
        _p,
        args: { userType?: string; userId?: string; search?: string; pagination?: { skip: number; limit: number }; dateFilter?: { starting_date?: string; ending_date?: string } },
        ctx,
      ) => {
        const scope = await financeScope(ctx, args.userType, args.userId);
        const filter = scopeFilter(scope, 'rider', 'store');
        const range = dateRange('custom', args.dateFilter?.starting_date, args.dateFilter?.ending_date);
        if (range) filter.createdAt = range;
        if (args.search) filter.transactionId = new RegExp(escapeRegex(args.search.slice(0, 60)), 'i');
        const skip = args.pagination?.skip ?? 0;
        const limit = args.pagination?.limit ?? 10;
        const [data, total] = await Promise.all([Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), Transaction.countDocuments(filter)]);
        return { data, pagination: { total } };
      },
      withdrawRequests: async (_p, args: { userType?: string; userId?: string; pagination?: { skip: number; limit: number }; search?: string }, ctx) => {
        const scope = await financeScope(ctx, args.userType, args.userId);
        const filter = scopeFilter(scope, 'rider', 'store');
        if (args.search) filter.requestId = new RegExp(escapeRegex(args.search.slice(0, 60)), 'i');
        const skip = args.pagination?.skip ?? 0;
        const limit = args.pagination?.limit ?? 10;
        const [data, total] = await Promise.all([WithdrawRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), WithdrawRequest.countDocuments(filter)]);
        return { success: true, message: null, data, pagination: { total } };
      },
    },
    Mutation: {
      createRider: async (_p, { riderInput }: { riderInput: z.infer<typeof RiderInput> }, ctx) => {
        await requireAdmin(ctx, 'Riders');
        if (!riderInput.password) throw badInput('Password is required.');
        assertStrongPassword(riderInput.password);
        if (await Rider.exists({ username: riderInput.username })) throw conflict('This username is already taken.');
        if (riderInput.zone) must(await Zone.exists({ _id: riderInput.zone }), 'Zone');
        const { _id, password, ...data } = riderInput;
        const rider = await Rider.create({ ...data, password: await hashPassword(password!), available: data.available ?? true });
        await audit(ctx, 'CREATE_RIDER', 'Rider', rider._id, { username: rider.username, zone: data.zone });
        return rider;
      },
      editRider: async (_p, { riderInput }: { riderInput: z.infer<typeof RiderInput> }, ctx) => {
        const { self, rider } = await riderAccess(ctx, riderInput._id);
        if (self) {
          // Riders can only update their own profile basics.
          rider.set({ name: riderInput.name, phone: riderInput.phone, vehicleType: riderInput.vehicleType ?? rider.vehicleType, image: riderInput.image ?? rider.image });
        } else {
          if (riderInput.username !== rider.username && (await Rider.exists({ username: riderInput.username, _id: { $ne: rider._id } }))) throw conflict('This username is already taken.');
          if (riderInput.zone) must(await Zone.exists({ _id: riderInput.zone }), 'Zone');
          const { _id, password, ...data } = riderInput;
          rider.set(Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)));
          if (password) {
            assertStrongPassword(password);
            rider.password = await hashPassword(password);
            rider.tokenVersion = (rider.tokenVersion ?? 0) + 1;
          }
          if (riderInput.isActive === false) rider.tokenVersion = (rider.tokenVersion ?? 0) + 1;
        }
        await rider.save();
        if (!self) await audit(ctx, 'EDIT_RIDER', 'Rider', rider._id);
        await pubsub.publish(topics.riderUpdated(), { riderUpdated: rider.toObject() });
        return rider;
      },
      deleteRider: async (_p, { id }: { id: string }, ctx) => {
        await requireAdmin(ctx, 'Riders');
        if (await Order.exists({ rider: id, orderStatus: { $in: ['ASSIGNED', 'PICKED'] } } as Record<string, unknown>)) throw conflict('This rider has orders in progress.');
        const rider = must(await Rider.findByIdAndUpdate(id, { isDeleted: true, isActive: false, available: false, $inc: { tokenVersion: 1 } }, { returnDocument: 'after' }), 'Rider');
        await audit(ctx, 'DELETE_RIDER', 'Rider', id);
        return rider;
      },
      toggleAvailablity: async (_p, { id }: { id?: string }, ctx) => {
        const { self, rider } = await riderAccess(ctx, id);
        rider.available = !rider.available;
        await rider.save();
        if (!self) await audit(ctx, 'TOGGLE_RIDER_AVAILABILITY', 'Rider', rider._id, { available: rider.available });
        await pubsub.publish(topics.riderUpdated(), { riderUpdated: rider.toObject() });
        return rider;
      },
      updateRiderBussinessDetails: async (_p, { bussinessDetails, id }: { bussinessDetails?: Record<string, unknown>; id: string }, ctx) => {
        const { rider } = await riderAccess(ctx, id);
        rider.set('bussinessDetails', bussinessDetails ?? {});
        if (bussinessDetails?.accountNumber) rider.accountNumber = String(bussinessDetails.accountNumber);
        await rider.save();
        return rider;
      },
      updateRiderLicenseDetails: async (_p, { id, licenseDetails }: { id: string; licenseDetails?: Record<string, unknown> }, ctx) => {
        const { rider } = await riderAccess(ctx, id);
        rider.set('licenseDetails', licenseDetails ?? {});
        await rider.save();
        return rider;
      },
      updateRiderVehicleDetails: async (_p, { id, vehicleDetails }: { id: string; vehicleDetails?: Record<string, unknown> }, ctx) => {
        const { rider } = await riderAccess(ctx, id);
        rider.set('vehicleDetails', vehicleDetails ?? {});
        await rider.save();
        return rider;
      },
      updateRiderLocation: async (_p, args: { latitude: string; longitude: string; accuracy?: number; heading?: number; speed?: number; deviceTimestamp?: string }, ctx) => {
        const rider = await requireRider(ctx);
        const lat = Number(args.latitude);
        const lng = Number(args.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) throw badInput('Invalid coordinates.');
        const recordedAt = args.deviceTimestamp ? new Date(/^\d+$/.test(args.deviceTimestamp) ? Number(args.deviceTimestamp) : args.deviceTimestamp) : new Date();
        rider.set({
          location: point(lng, lat),
          lastLocation: { accuracy: args.accuracy, heading: args.heading, speed: args.speed, recordedAt: Number.isNaN(recordedAt.getTime()) ? new Date() : recordedAt },
        });
        await rider.save();
        await publishRiderLocation(rider);
        return rider;
      },
      updateWorkSchedule: async (_p, args: { riderId: string; workSchedule: z.infer<typeof DayScheduleInput>[]; timeZone: string }, ctx) => {
        const { rider } = await riderAccess(ctx, args.riderId);
        try {
          new Intl.DateTimeFormat('en-US', { timeZone: args.timeZone });
        } catch {
          throw badInput('Invalid time zone.');
        }
        rider.set({ workSchedule: args.workSchedule.map((d) => ({ day: d.day, enabled: d.enabled ?? true, slots: d.slots })), timeZone: args.timeZone });
        await rider.save();
        return rider;
      },

      createZone: async (_p, { zone }: { zone: z.infer<typeof ZoneInput> }, ctx) => {
        await requireAdmin(ctx, 'Zone');
        const z = await Zone.create({ title: zone.title, description: zone.description, tax: zone.tax ?? 0, isActive: zone.isActive ?? true, location: { type: 'Polygon', coordinates: closeRings(zone.coordinates) } });
        await audit(ctx, 'CREATE_ZONE', 'Zone', z._id, { title: zone.title });
        return z;
      },
      editZone: async (_p, { zone }: { zone: z.infer<typeof ZoneInput> }, ctx) => {
        await requireAdmin(ctx, 'Zone');
        const z = must(
          await Zone.findByIdAndUpdate(
            zone._id,
            {
              title: zone.title,
              description: zone.description,
              ...(zone.tax !== undefined ? { tax: zone.tax } : {}),
              ...(zone.isActive !== undefined ? { isActive: zone.isActive } : {}),
              location: { type: 'Polygon', coordinates: closeRings(zone.coordinates) },
            },
            { returnDocument: 'after', runValidators: true },
          ),
          'Zone',
        );
        await audit(ctx, 'EDIT_ZONE', 'Zone', z._id, { title: zone.title });
        return z;
      },
      deleteZone: async (_p, { id }: { id: string }, ctx) => {
        await requireAdmin(ctx, 'Zone');
        if (await Rider.exists({ zone: id, isDeleted: { $ne: true } } as Record<string, unknown>)) throw conflict('Riders are assigned to this zone. Move them first.');
        const z = must(await Zone.findByIdAndDelete(id), 'Zone');
        await Restaurant.updateMany({ zone: id } as Record<string, unknown>, { $unset: { zone: 1 } });
        await audit(ctx, 'DELETE_ZONE', 'Zone', id);
        return z;
      },

      createWithdrawRequest: async (_p, { requestAmount, userId }: { requestAmount: number; userId?: string }, ctx) => {
        if (!(requestAmount > 0)) throw badInput('Amount must be greater than zero.');
        const claims = requireClaims(ctx);
        let kind: 'RIDER' | 'STORE';
        let ownerId: string;
        if (claims.typ === 'rider') {
          kind = 'RIDER';
          ownerId = String((await requireRider(ctx))._id);
        } else if (claims.typ === 'restaurant' || (claims.typ === 'owner' && claims.ut === 'RESTAURANT')) {
          kind = 'STORE';
          ownerId = String((await requireStore(ctx))._id);
        } else {
          if (!userId) throw badInput('userId is required.');
          await requireRestaurantAccess(ctx, userId);
          kind = 'STORE';
          ownerId = userId;
        }
        const field = kind === 'RIDER' ? 'rider' : 'store';
        const wallet = kind === 'RIDER' ? await Rider.findById(ownerId).select('currentWalletAmount').lean() : await Restaurant.findById(ownerId).select('currentWalletAmount').lean();
        if (await WithdrawRequest.exists({ [field]: ownerId, status: 'REQUESTED' })) throw conflict('You already have a pending withdrawal request.');
        if (requestAmount > (wallet?.currentWalletAmount ?? 0)) throw badInput('Requested amount exceeds your available balance.');
        const req = await WithdrawRequest.create({ requestId: `WR-${shortCode(8)}`, requestAmount: round2(requestAmount), userType: kind, [field]: ownerId });
        return req;
      },
      updateWithdrawReqStatus: async (_p, { id, status }: { id: string; status: string }, ctx) => {
        await requireAdmin(ctx, 'Withdraw Request');
        const s = String(status).toUpperCase();
        if (!['TRANSFERRED', 'CANCELLED'].includes(s)) throw badInput('Status must be TRANSFERRED or CANCELLED.');
        const req = must(await WithdrawRequest.findOneAndUpdate({ _id: id, status: 'REQUESTED' }, { status: s }, { returnDocument: 'after' }), 'Pending withdraw request');
        if (s === 'TRANSFERRED') {
          const isRider = req.userType === 'RIDER';
          const Model = isRider ? Rider : Restaurant;
          const ownerId = isRider ? req.rider : req.store;
          const owner = await (Model as typeof Rider).findOneAndUpdate(
            { _id: ownerId, currentWalletAmount: { $gte: req.requestAmount } },
            { $inc: { currentWalletAmount: -req.requestAmount, withdrawnWalletAmount: req.requestAmount } },
            { returnDocument: 'after' },
          );
          if (!owner) {
            req.status = 'REQUESTED';
            await req.save();
            throw conflict('Insufficient wallet balance for this transfer.');
          }
          const cfg = await getConfig();
          await Transaction.create({
            transactionId: `TX-${shortCode(10)}`,
            amountCurrency: cfg.currency,
            amountTransferred: req.requestAmount,
            status: 'TRANSFERRED',
            userType: req.userType,
            userId: String(ownerId),
            toBank: (owner as unknown as { bussinessDetails?: Record<string, unknown> }).bussinessDetails as never,
            rider: isRider ? ownerId : undefined,
            store: isRider ? undefined : ownerId,
            withdrawRequest: req._id,
          });
        }
        await audit(ctx, 'UPDATE_WITHDRAW_REQUEST', 'WithdrawRequest', id, { status: s });
        return { success: true, message: `Request ${s.toLowerCase()}`, data: req };
      },
    },
    Subscription: {
      subscriptionRiderLocation: {
        subscribe: async (_p: unknown, { riderId }: { riderId: string }, ctx: GraphQLContext) => {
          const claims = requireClaims(ctx);
          if (claims.typ === 'customer') {
            const ok = await Order.exists({ user: claims.sub, rider: riderId, orderStatus: { $in: ['ASSIGNED', 'PICKED'] } } as Record<string, unknown>);
            if (!ok) throw forbidden();
          } else if (claims.typ === 'rider') {
            if (claims.sub !== riderId) throw forbidden();
          } else await requireRidersList(ctx);
          return pubsub.subscribe(topics.riderLocation(riderId));
        },
      },
      riderUpdated: {
        subscribe: async (_p: unknown, _a: unknown, ctx: GraphQLContext) => {
          await requireRidersList(ctx);
          return pubsub.subscribe(topics.riderUpdated());
        },
      },
    },
    Rider: {
      zone: (r: { zone?: unknown }, _a, ctx) => (r.zone ? ctx.loaders.zone.load(String(r.zone)) : null),
      assigned: async (r: { _id: unknown }, _a, ctx) => {
        const key = 'busyRiders';
        let busy = ctx.cache.get(key) as Promise<Set<string>> | undefined;
        if (!busy) {
          busy = Order.distinct('rider', { orderStatus: { $in: ['ASSIGNED', 'PICKED'] } }).then((ids) => new Set(ids.map(String)));
          ctx.cache.set(key, busy);
        }
        return (await busy).has(String(r._id));
      },
    },
    WithdrawRequest: {
      rider: (w: { rider?: unknown }, _a, ctx) => (w.rider ? ctx.loaders.rider.load(String(w.rider)) : null),
      store: (w: { store?: unknown }, _a, ctx) => (w.store ? ctx.loaders.restaurant.load(String(w.store)) : null),
    },
    Transaction: {
      rider: (t: { rider?: unknown }, _a, ctx) => (t.rider ? ctx.loaders.rider.load(String(t.rider)) : null),
      store: (t: { store?: unknown }, _a, ctx) => (t.store ? ctx.loaders.restaurant.load(String(t.store)) : null),
    },
  },
});
