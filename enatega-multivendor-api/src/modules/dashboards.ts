import { Types } from 'mongoose';
import { defineModule } from '../graphql/module.js';
import type { GraphQLContext } from '../graphql/context.js';
import { hasPermission, requireAdmin, requireOwner, requireRestaurantAccess } from '../auth/guards.js';
import { forbidden } from '../lib/errors.js';
import { dateRange, monthlySeries, pageArgs, pageResult, round2, searchRegex, yearRange } from '../lib/query.js';
import { Order, Owner, Restaurant, Review, Rider, User } from '../models/index.js';

const SOLD = ['DELIVERED', 'COMPLETED'];
const oid = (id: string) => new Types.ObjectId(id);

async function countByMonth(model: typeof User | typeof Rider | typeof Restaurant | typeof Owner, match: Record<string, unknown>, year: number) {
  const rows = await (model as typeof User).aggregate<{ _id: number; value: number }>([
    { $match: { ...match, createdAt: yearRange(year) } },
    { $group: { _id: { $month: '$createdAt' }, value: { $sum: 1 } } },
  ]);
  return monthlySeries(rows);
}

const pct = (now: number, before: number) => (before === 0 ? (now > 0 ? 100 : 0) : round2(((now - before) / before) * 100));

async function salesSummary(match: Record<string, unknown>) {
  const [row] = await Order.aggregate<{ orders: number; sales: number; delivery: number }>([
    { $match: match },
    { $group: { _id: null, orders: { $sum: 1 }, sales: { $sum: '$orderAmount' }, delivery: { $sum: '$deliveryCharges' } } },
  ]);
  return {
    total_orders: row?.orders ?? 0,
    total_sales: round2(row?.sales ?? 0),
    total_sales_without_delivery: round2((row?.sales ?? 0) - (row?.delivery ?? 0)),
    total_delivery_fee: round2(row?.delivery ?? 0),
  };
}

async function paymentBreakdown(match: Record<string, unknown>) {
  const [all, cod, card, pickup, delivery] = await Promise.all([
    salesSummary(match),
    salesSummary({ ...match, paymentMethod: 'COD' }),
    salesSummary({ ...match, paymentMethod: { $in: ['STRIPE', 'PAYPAL'] } }),
    Order.countDocuments({ ...match, isPickedUp: true }),
    Order.countDocuments({ ...match, isPickedUp: { $ne: true } }),
  ]);
  return {
    ...all,
    pickup_total_orders: pickup,
    delivery_total_orders: delivery,
    pickup_orders: pickup,
    delivery_orders: delivery,
    pickup: { total_orders: pickup },
    delivery: { total_orders: delivery },
    all: { _type: 'all', data: all },
    cod: { _type: 'cod', data: cod },
    card: { _type: 'card', data: card },
  };
}

async function vendorRestaurantIds(ctx: GraphQLContext, vendorId: string) {
  const p = await requireOwner(ctx);
  if (p.userType === 'VENDOR' && p.id !== vendorId) throw forbidden();
  if (p.userType === 'RESTAURANT') throw forbidden();
  if (p.userType === 'STAFF' && !hasPermission(p, 'Vendors')) throw forbidden();
  return (await Restaurant.find({ owner: vendorId, isDeleted: { $ne: true } } as Record<string, unknown>).select('_id name').lean()).map((r) => ({ id: r._id, name: r.name }));
}

async function storeDetails(ids: { id: unknown; name: string }[], range?: Record<string, unknown>) {
  const rows = await Order.aggregate<{ _id: unknown; totalOrders: number; totalSales: number; pickUpCount: number; deliveryCount: number }>([
    { $match: { restaurant: { $in: ids.map((i) => i.id) }, orderStatus: { $in: SOLD }, ...(range ? { createdAt: range } : {}) } },
    {
      $group: {
        _id: '$restaurant',
        totalOrders: { $sum: 1 },
        totalSales: { $sum: '$orderAmount' },
        pickUpCount: { $sum: { $cond: ['$isPickedUp', 1, 0] } },
        deliveryCount: { $sum: { $cond: ['$isPickedUp', 0, 1] } },
      },
    },
  ]);
  const map = new Map(rows.map((r) => [String(r._id), r]));
  return ids.map((i) => {
    const r = map.get(String(i.id));
    return { _id: i.id, restaurantName: i.name, totalOrders: r?.totalOrders ?? 0, totalSales: round2(r?.totalSales ?? 0), pickUpCount: r?.pickUpCount ?? 0, deliveryCount: r?.deliveryCount ?? 0 };
  });
}

export const dashboardsModule = defineModule({
  name: 'dashboards',
  resolvers: {
    Query: {
      getDashboardUsers: async (_p, _a, ctx) => {
        await requireAdmin(ctx);
        const [usersCount, vendorsCount, restaurantsCount, ridersCount] = await Promise.all([
          User.countDocuments({ deletedAt: { $exists: false } }),
          Owner.countDocuments({ userType: 'VENDOR', isDeleted: { $ne: true } }),
          Restaurant.countDocuments({ isDeleted: { $ne: true } }),
          Rider.countDocuments({ isDeleted: { $ne: true } }),
        ]);
        return { usersCount, vendorsCount, restaurantsCount, ridersCount };
      },
      getDashboardUsersByYear: async (_p, { year }: { year: number }, ctx) => {
        await requireAdmin(ctx);
        const [usersCount, vendorsCount, restaurantsCount, ridersCount] = await Promise.all([
          countByMonth(User, {}, year),
          countByMonth(Owner, { userType: 'VENDOR' }, year),
          countByMonth(Restaurant, {}, year),
          countByMonth(Rider, {}, year),
        ]);
        const sum = (a: number[]) => a.reduce((s, n) => s + n, 0);
        const [pu, pv, pr, pd] = await Promise.all([
          User.countDocuments({ createdAt: yearRange(year - 1) }),
          Owner.countDocuments({ userType: 'VENDOR', createdAt: yearRange(year - 1) }),
          Restaurant.countDocuments({ createdAt: yearRange(year - 1) }),
          Rider.countDocuments({ createdAt: yearRange(year - 1) }),
        ]);
        return {
          usersCount,
          vendorsCount,
          restaurantsCount,
          ridersCount,
          percentageChange: { usersPercent: pct(sum(usersCount), pu), vendorsPercent: pct(sum(vendorsCount), pv), restaurantsPercent: pct(sum(restaurantsCount), pr), ridersPercent: pct(sum(ridersCount), pd) },
        };
      },
      getDashboardOrdersByType: async (_p, _a, ctx) => {
        await requireAdmin(ctx, 'Orders');
        const [delivery, pickup] = await Promise.all([Order.countDocuments({ isPickedUp: { $ne: true } }), Order.countDocuments({ isPickedUp: true })]);
        return [
          { label: 'Delivery', value: delivery },
          { label: 'Pickup', value: pickup },
        ];
      },
      getDashboardSalesByType: async (_p, _a, ctx) => {
        await requireAdmin(ctx, 'Orders');
        const [d, p] = await Promise.all([salesSummary({ orderStatus: { $in: SOLD }, isPickedUp: { $ne: true } }), salesSummary({ orderStatus: { $in: SOLD }, isPickedUp: true })]);
        return [
          { label: 'Delivery', value: d.total_sales },
          { label: 'Pickup', value: p.total_sales },
        ];
      },
      getVendorDashboardStatsCardDetails: async (_p, args: { vendorId: string; dateKeyword?: string; starting_date?: string; ending_date?: string }, ctx) => {
        const ids = await vendorRestaurantIds(ctx, args.vendorId);
        const range = dateRange(args.dateKeyword, args.starting_date, args.ending_date);
        const s = await salesSummary({ restaurant: { $in: ids.map((i) => i.id) }, orderStatus: { $in: SOLD }, ...(range ? { createdAt: range } : {}) });
        const deliveries = await Order.countDocuments({ restaurant: { $in: ids.map((i) => i.id) }, orderStatus: { $in: SOLD }, isPickedUp: { $ne: true }, ...(range ? { createdAt: range } : {}) } as Record<string, unknown>);
        return { totalRestaurants: ids.length, totalOrders: s.total_orders, totalSales: s.total_sales, totalDeliveries: deliveries };
      },
      getVendorDashboardGrowthDetailsByYear: async (_p, { vendorId, year }: { vendorId: string; year: number }, ctx) => {
        const ids = await vendorRestaurantIds(ctx, vendorId);
        const match = { restaurant: { $in: ids.map((i) => i.id) }, orderStatus: { $in: SOLD }, createdAt: yearRange(year) };
        const [orders, sales] = await Promise.all([
          Order.aggregate<{ _id: number; value: number }>([{ $match: match }, { $group: { _id: { $month: '$createdAt' }, value: { $sum: 1 } } }]),
          Order.aggregate<{ _id: number; value: number }>([{ $match: match }, { $group: { _id: { $month: '$createdAt' }, value: { $sum: '$orderAmount' } } }]),
        ]);
        return { totalRestaurants: await countByMonth(Restaurant, { owner: oid(vendorId) }, year), totalOrders: monthlySeries(orders), totalSales: monthlySeries(sales) };
      },
      getRestaurantDashboardOrdersSalesStats: async (_p, args: { restaurant: string; starting_date?: string; ending_date?: string; dateKeyword?: string }, ctx) => {
        await requireRestaurantAccess(ctx, args.restaurant);
        const range = dateRange(args.dateKeyword ?? 'custom', args.starting_date, args.ending_date);
        const match = { restaurant: oid(args.restaurant), orderStatus: { $in: SOLD }, ...(range ? { createdAt: range } : {}) };
        const [s, cod, card] = await Promise.all([
          salesSummary(match),
          Order.countDocuments({ ...match, paymentMethod: 'COD' } as Record<string, unknown>),
          Order.countDocuments({ ...match, paymentMethod: { $in: ['STRIPE', 'PAYPAL'] } } as Record<string, unknown>),
        ]);
        return { totalOrders: s.total_orders, totalSales: s.total_sales, totalCODOrders: cod, totalCardOrders: card };
      },
      getRestaurantDashboardSalesOrderCountDetailsByYear: async (_p, { restaurant, year }: { restaurant: string; year: number }, ctx) => {
        await requireRestaurantAccess(ctx, restaurant);
        const match = { restaurant: oid(restaurant), orderStatus: { $in: SOLD }, createdAt: yearRange(year) };
        const [orders, sales] = await Promise.all([
          Order.aggregate<{ _id: number; value: number }>([{ $match: match }, { $group: { _id: { $month: '$createdAt' }, value: { $sum: 1 } } }]),
          Order.aggregate<{ _id: number; value: number }>([{ $match: match }, { $group: { _id: { $month: '$createdAt' }, value: { $sum: '$orderAmount' } } }]),
        ]);
        return { salesAmount: monthlySeries(sales), ordersCount: monthlySeries(orders) };
      },
      getRestaurantDashboardOrderSalesDetailsByPaymentMethod: async (_p, args: { restaurant: string; starting_date?: string; ending_date?: string; dateKeyword?: string }, ctx) => {
        await requireRestaurantAccess(ctx, args.restaurant);
        const range = dateRange(args.dateKeyword ?? 'custom', args.starting_date, args.ending_date);
        return paymentBreakdown({ restaurant: oid(args.restaurant), orderStatus: { $in: SOLD }, ...(range ? { createdAt: range } : {}) });
      },
      getDashboardOrderSalesDetailsByPaymentMethod: async (_p, args: { restaurant: string; starting_date?: string; ending_date?: string }, ctx) => {
        const range = dateRange('custom', args.starting_date, args.ending_date);
        const match: Record<string, unknown> = { orderStatus: { $in: SOLD }, ...(range ? { createdAt: range } : {}) };
        if (args.restaurant && Types.ObjectId.isValid(args.restaurant)) {
          await requireRestaurantAccess(ctx, args.restaurant);
          match.restaurant = oid(args.restaurant);
        } else await requireAdmin(ctx, 'Orders');
        return paymentBreakdown(match);
      },
      getLiveMonitorData: async (_p, args: { id: string; dateKeyword?: string; starting_date?: string; ending_date?: string }, ctx) => {
        const range = dateRange(args.dateKeyword, args.starting_date, args.ending_date);
        let restaurantIds: unknown[] | undefined;
        if (args.id && Types.ObjectId.isValid(args.id)) {
          const p = await requireOwner(ctx);
          if (p.userType === 'ADMIN' || p.userType === 'STAFF' || p.id === args.id) {
            const owned = await Restaurant.find({ owner: args.id } as Record<string, unknown>).select('_id').lean();
            restaurantIds = owned.length ? owned.map((r) => r._id) : [oid(args.id)];
          } else {
            await requireRestaurantAccess(ctx, args.id);
            restaurantIds = [oid(args.id)];
          }
        } else await requireAdmin(ctx, 'Orders');
        const scope: Record<string, unknown> = restaurantIds ? { restaurant: { $in: restaurantIds } } : {};
        const created = range ? { createdAt: range } : {};
        const [online, cancelled, delayed, rating] = await Promise.all([
          Restaurant.countDocuments({ isActive: true, isAvailable: true, isDeleted: { $ne: true }, ...(restaurantIds ? { _id: { $in: restaurantIds } } : {}) }),
          Order.countDocuments({ ...scope, ...created, orderStatus: { $in: ['CANCELLED', 'CANCELLEDBYREST'] } }),
          Order.countDocuments({ ...scope, ...created, orderStatus: { $in: ['ACCEPTED', 'ASSIGNED', 'PICKED'] }, expectedTime: { $lt: new Date() } }),
          Review.aggregate<{ avg: number }>([{ $match: { ...scope, ...created } }, { $group: { _id: null, avg: { $avg: '$rating' } } }]),
        ]);
        return { online_stores: online, cancelled_orders: cancelled, delayed_orders: delayed, ratings: round2(rating[0]?.avg ?? 0) };
      },
      getStoreDetailsByVendorId: async (_p, args: { id: string; dateKeyword?: string; starting_date?: string; ending_date?: string }, ctx) => {
        const ids = await vendorRestaurantIds(ctx, args.id);
        return storeDetails(ids, dateRange(args.dateKeyword, args.starting_date, args.ending_date));
      },
      getStoreDetailsByVendorIdPaginated: async (
        _p,
        args: { id: string; dateKeyword?: string; starting_date?: string; ending_date?: string; page?: number; limit?: number; search?: string },
        ctx,
      ) => {
        let ids = await vendorRestaurantIds(ctx, args.id);
        const re = searchRegex(args.search);
        if (re) ids = ids.filter((i) => re.test(i.name));
        const { page, limit, skip } = pageArgs(args.page, args.limit);
        const data = await storeDetails(ids.slice(skip, skip + limit), dateRange(args.dateKeyword, args.starting_date, args.ending_date));
        return pageResult(data, ids.length, page, limit);
      },
    },
  },
});
