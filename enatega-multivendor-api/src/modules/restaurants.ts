import { Types } from 'mongoose';
import { z } from 'zod';
import { defineModule } from '../graphql/module.js';
import type { GraphQLContext } from '../graphql/context.js';
import { looseEnum, optBool, optNum, optStr } from '../graphql/zod.js';
import {
  hasPermission,
  optionalCustomer,
  requireAdmin,
  requireOwner,
  requireRestaurantAccess,
  requireStore,
  scopedRestaurantIds,
} from '../auth/guards.js';
import { assertStrongPassword, hashPassword } from '../auth/password.js';
import { badInput, conflict, forbidden, must, notFound } from '../lib/errors.js';
import { circlePolygon, closeRings } from '../lib/geo.js';
import { pageArgs, pageResult, searchRegex } from '../lib/query.js';
import { Cuisine, Food, Order, Restaurant, Review } from '../models/index.js';
import { point } from '../models/common.js';
import { audit } from '../services/audit.js';
import {
  cloneRestaurant,
  deliversToFilter,
  PUBLIC_RESTAURANT_FILTER,
  uniqueSlug,
  withDistance,
  zoneForPoint,
} from '../services/restaurants.js';

const timeParts = z
  .union([z.array(z.union([z.string(), z.number()])), z.string()])
  .transform((v) => {
    const parts = Array.isArray(v) ? v.map(String) : String(v).split(':');
    const [h = '00', m = '00'] = parts.length === 1 && parts[0]!.includes(':') ? parts[0]!.split(':') : parts;
    return [h.padStart(2, '0').slice(0, 2), m.padStart(2, '0').slice(0, 2)];
  })
  .refine(([h, m]) => Number(h) >= 0 && Number(h) <= 24 && Number(m) >= 0 && Number(m) < 60, 'invalid time');

const TimingsInput = z.object({
  day: z.string().trim().toUpperCase().max(10),
  times: z.array(z.object({ startTime: timeParts, endTime: timeParts })).max(10).default([]),
});

const ScheduleTypeInput = z.object({
  _id: optStr(40),
  day: z.string().trim().max(10),
  isOpen: optBool,
  times: z
    .array(
      z.object({
        _id: optStr(40),
        id: optStr(40),
        startTime: z.union([z.string(), z.array(z.string())]).transform((v) => (Array.isArray(v) ? v.join(':') : v)),
        endTime: z.union([z.string(), z.array(z.string())]).transform((v) => (Array.isArray(v) ? v.join(':') : v)),
        maxOrder: optNum,
        maxOrders: optNum,
      }),
    )
    .max(24)
    .default([]),
});

const RestaurantInput = z.object({
  _id: optStr(40),
  name: z.string().trim().min(1).max(120),
  address: optStr(500),
  phone: optStr(30),
  image: optStr(2000),
  logo: optStr(2000),
  deliveryTime: optNum,
  minimumOrder: optNum,
  username: optStr(60),
  password: optStr(128),
  shopType: optStr(60),
  cuisines: z.array(z.string().max(80)).max(50).optional(),
  tags: z.array(z.string().max(60)).max(50).optional(),
  orderPrefix: optStr(10),
  salesTax: optNum,
  tax: optNum,
  deliveryDistance: optNum,
  deliveryFee: optNum,
  minDeliveryFee: optNum,
  slug: optStr(80),
  isAvailable: optBool,
  freeDelivery: optBool,
  acceptVouchers: optBool,
  city: optStr(120),
  postCode: optStr(20),
});

const CoordinatesInput = z
  .object({ latitude: z.coerce.number().min(-90).max(90), longitude: z.coerce.number().min(-180).max(180) })
  .refine((c) => !(c.latitude === 0 && c.longitude === 0), 'coordinates are required');

const BussinessDetailsInput = z.object({
  bankName: optStr(120),
  accountName: optStr(120),
  accountCode: optStr(60),
  accountNumber: z.preprocess((v) => (v == null ? v : String(v)), optStr(60)),
  bussinessRegNo: z.preprocess((v) => (v == null ? v : String(v)), optStr(60)),
  companyRegNo: z.preprocess((v) => (v == null ? v : String(v)), optStr(60)),
  taxRate: optNum,
});

const isDashboard = (ctx: GraphQLContext) => {
  const t = ctx.auth.error ? undefined : ctx.auth.claims?.typ;
  return t === 'owner' || t === 'restaurant';
};

/** Fields that only dashboard / store callers may read. */
const dashboardOnly =
  <K extends string>(key: K) =>
  (r: Record<string, unknown>, _a: unknown, ctx: GraphQLContext) =>
    isDashboard(ctx) ? r[key] : null;

function inputToRestaurant(i: z.infer<typeof RestaurantInput>) {
  const out: Record<string, unknown> = {};
  for (const k of ['name', 'address', 'phone', 'image', 'logo', 'deliveryTime', 'minimumOrder', 'shopType', 'cuisines', 'tags', 'orderPrefix', 'isAvailable', 'freeDelivery', 'acceptVouchers', 'city', 'postCode'] as const) {
    if (i[k] !== undefined) out[k] = i[k];
  }
  if (i.username) out.username = i.username.toLowerCase();
  const tax = i.salesTax ?? i.tax;
  if (tax !== undefined) out.tax = tax;
  if (i.deliveryDistance !== undefined || i.deliveryFee !== undefined || i.minDeliveryFee !== undefined) {
    out.deliveryInfo = { deliveryDistance: i.deliveryDistance, deliveryFee: i.deliveryFee, minDeliveryFee: i.minDeliveryFee };
  }
  return out;
}

async function scopeFilter(ctx: GraphQLContext): Promise<Record<string, unknown>> {
  const p = await requireOwner(ctx);
  const ids = scopedRestaurantIds(p);
  if (!ids) {
    if (!hasPermission(p, 'Stores') && !hasPermission(p, 'Orders') && !hasPermission(p, 'Commission Rate') && !hasPermission(p, 'Dispatch')) throw forbidden();
    return { isDeleted: { $ne: true } };
  }
  return { _id: { $in: ids }, isDeleted: { $ne: true } };
}

async function discover(args: { latitude?: number; longitude?: number; shopType?: string | null }, extra: Record<string, unknown> = {}) {
  const filter: Record<string, unknown> = { ...PUBLIC_RESTAURANT_FILTER, ...deliversToFilter(args.latitude, args.longitude), ...extra };
  if (args.shopType) filter.shopType = args.shopType;
  return filter;
}

const sortAvailableFirst = <T extends { isAvailable?: boolean | null; distanceWithCurrentLocation?: number }>(list: T[]) =>
  [...list].sort((a, b) => Number(Boolean(b.isAvailable)) - Number(Boolean(a.isAvailable)) || (a.distanceWithCurrentLocation ?? 0) - (b.distanceWithCurrentLocation ?? 0));

export const restaurantsModule = defineModule({
  name: 'restaurants',
  inputs: {
    RestaurantInput,
    RestaurantProfileInput: RestaurantInput.extend({ name: optStr(120) }),
    TimingsInput,
    ScheduleTypeInput,
    CircleBoundsInput: z.object({ radius: z.coerce.number().positive().max(200) }),
    CoordinatesInput,
    BussinessDetailsInput,
    CommissionRateSortField: looseEnum(['NAME', 'COMMISSION_RATE'] as const),
    CommissionRateSortOrder: looseEnum(['ASC', 'DESC'] as const),
  },
  resolvers: {
    Query: {
      restaurant: async (_p, args: { id?: string; slug?: string }) => {
        const filter: Record<string, unknown> = { isDeleted: { $ne: true } };
        if (args.id && Types.ObjectId.isValid(args.id)) filter._id = args.id;
        else if (args.slug || args.id) filter.slug = String(args.slug ?? args.id).toLowerCase();
        else throw badInput('id or slug is required.');
        return must(await Restaurant.findOne(filter).lean(), 'Restaurant');
      },
      restaurants: async (_p, _a, ctx) => Restaurant.find(await scopeFilter(ctx)).sort({ createdAt: -1 }).lean(),
      restaurantsPaginated: async (_p, args: { page?: number; limit?: number; search?: string }, ctx) => {
        const filter = await scopeFilter(ctx);
        const re = searchRegex(args.search);
        if (re) filter.$or = [{ name: re }, { address: re }, { username: re }, { unique_restaurant_id: re }];
        const { page, limit, skip } = pageArgs(args.page, args.limit);
        const [data, total] = await Promise.all([Restaurant.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), Restaurant.countDocuments(filter)]);
        return pageResult(data, total, page, limit);
      },
      getClonedRestaurants: async (_p, _a, ctx) => Restaurant.find({ ...(await scopeFilter(ctx)), clonedFrom: { $exists: true } }).sort({ createdAt: -1 }).lean(),
      getClonedRestaurantsPaginated: async (_p, args: { page?: number; limit?: number; search?: string }, ctx) => {
        const filter = { ...(await scopeFilter(ctx)), clonedFrom: { $exists: true } } as Record<string, unknown>;
        const re = searchRegex(args.search);
        if (re) filter.name = re;
        const { page, limit, skip } = pageArgs(args.page, args.limit);
        const [data, total] = await Promise.all([Restaurant.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), Restaurant.countDocuments(filter)]);
        return pageResult(data, total, page, limit);
      },

      nearByRestaurants: async (_p, args: { latitude?: number; longitude?: number; shopType?: string }) => {
        const list = await Restaurant.find(await discover(args)).limit(500).lean();
        return { offers: [], sections: [], restaurants: sortAvailableFirst(withDistance(list, args.latitude, args.longitude)) };
      },
      nearByRestaurantsPreview: async (_p, args: { latitude?: number; longitude?: number; shopType?: string; page?: number; limit?: number }) => {
        const { limit, skip } = pageArgs(args.page, args.limit, 500);
        const list = await Restaurant.find(await discover(args)).select('-categories -password').skip(skip).limit(limit).lean();
        return { offers: [], sections: [], restaurants: sortAvailableFirst(withDistance(list, args.latitude, args.longitude)) };
      },
      nearByRestaurantsCuisines: async (_p, args: { latitude?: number; longitude?: number; shopType?: string }) => {
        const names = await Restaurant.distinct('cuisines', await discover(args));
        const filter: Record<string, unknown> = { name: { $in: names }, isActive: { $ne: false } };
        if (args.shopType) filter.shopType = args.shopType;
        return Cuisine.find(filter).sort({ name: 1 }).lean();
      },
      mostOrderedRestaurants: async (_p, args: { latitude: number; longitude: number }) =>
        withDistance(await Restaurant.find(await discover(args)).sort({ orderCount: -1 }).limit(20).lean(), args.latitude, args.longitude),
      mostOrderedRestaurantsPreview: async (_p, args: { latitude: number; longitude: number; shopType?: string; page?: number; limit?: number }) => {
        const { limit, skip } = pageArgs(args.page, args.limit, 20);
        return Restaurant.find(await discover(args)).sort({ orderCount: -1, reviewAverage: -1 }).skip(skip).limit(limit).lean();
      },
      recentOrderRestaurants: async (_p, args: { latitude: number; longitude: number }, ctx) => recentRestaurants(ctx, args),
      recentOrderRestaurantsPreview: async (_p, args: { latitude: number; longitude: number }, ctx) => recentRestaurants(ctx, args),
      topRatedVendors: async (_p, args: { latitude: number; longitude: number }) =>
        withDistance(await Restaurant.find({ ...(await discover(args)), reviewCount: { $gt: 0 } }).sort({ reviewAverage: -1, reviewCount: -1 }).limit(20).lean(), args.latitude, args.longitude),
      topRatedVendorsPreview: async (_p, args: { latitude: number; longitude: number }) =>
        Restaurant.find({ ...(await discover(args)), reviewCount: { $gt: 0 } }).sort({ reviewAverage: -1, reviewCount: -1 }).limit(20).lean(),
      userFavourite: async (_p, args: { latitude?: number; longitude?: number }, ctx) => {
        const user = await optionalCustomer(ctx);
        if (!user?.favourite?.length) return [];
        const ids = user.favourite.filter((id) => Types.ObjectId.isValid(id));
        return withDistance(await Restaurant.find({ _id: { $in: ids }, ...PUBLIC_RESTAURANT_FILTER }).lean(), args.latitude, args.longitude);
      },
      popularItems: async (_p, { restaurantId }: { restaurantId: string }) => popularFoodIds(restaurantId, 10),
      popularFoodItems: async (_p, { restaurantId }: { restaurantId: string }) => {
        const ids = (await popularFoodIds(restaurantId, 10)).map((p) => p.id);
        const flagged = await Food.find({ restaurant: restaurantId, isPopular: true, isDeleted: { $ne: true }, isActive: true }).limit(10).lean();
        const ordered = await Food.find({ _id: { $in: ids }, isDeleted: { $ne: true }, isActive: true }).lean();
        const seen = new Set<string>();
        return [...ordered, ...flagged].filter((f) => (seen.has(String(f._id)) ? false : (seen.add(String(f._id)), true))).slice(0, 10);
      },
      relatedItems: async (_p, { itemId, restaurantId }: { itemId: string; restaurantId: string }) => {
        if (!Types.ObjectId.isValid(itemId) || !Types.ObjectId.isValid(restaurantId)) return [];
        const food = await Food.findOne({ _id: itemId, restaurant: restaurantId }).select('category').lean();
        if (!food) return [];
        const related = await Food.find({ category: food.category, _id: { $ne: itemId }, isDeleted: { $ne: true }, isActive: true })
          .sort({ orderCount: -1 })
          .limit(10)
          .select('_id')
          .lean();
        return related.map((f) => String(f._id));
      },
      getRestaurantDeliveryZoneInfo: async (_p, { id }: { id: string }, ctx) => {
        await requireRestaurantAccess(ctx, id);
        const r = must(await Restaurant.findById(id).lean(), 'Restaurant');
        return { boundType: r.boundType, deliveryBounds: r.deliveryBounds, location: r.location, circleBounds: r.circleBounds, address: r.address, city: r.city, postCode: r.postCode };
      },
      getRestaurantSchedule: async (_p, { restaurantId }: { restaurantId: string }) => {
        const r = must(await Restaurant.findById(restaurantId).select('scheduleTimings').lean(), 'Restaurant');
        return r.scheduleTimings ?? [];
      },
      commissionRate: async (_p, args: { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: string }, ctx) => {
        await requireAdmin(ctx, 'Commission Rate');
        const { page, limit, skip } = pageArgs(args.page, args.limit);
        const filter: Record<string, unknown> = { isDeleted: { $ne: true } };
        const re = searchRegex(args.search);
        if (re) filter.name = re;
        const dir = args.sortOrder === 'DESC' ? -1 : 1;
        const sort: Record<string, 1 | -1> = args.sortBy === 'COMMISSION_RATE' ? { commissionRate: dir, name: 1 } : { name: dir };
        const [restaurant, total] = await Promise.all([Restaurant.find(filter).sort(sort).skip(skip).limit(limit).lean(), Restaurant.countDocuments(filter)]);
        const r = pageResult(restaurant, total, page, limit);
        return { restaurant, totalCount: total, currentPage: r.currentPage, totalPages: r.totalPages, nextPage: r.nextPage, prevPage: r.prevPage };
      },
    },
    Mutation: {
      createRestaurant: async (_p, args: { restaurant: z.infer<typeof RestaurantInput>; owner?: string }, ctx) => {
        const p = await requireOwner(ctx);
        let ownerId = args.owner;
        if (p.userType === 'VENDOR') ownerId = p.id;
        else if (!hasPermission(p, 'Stores')) throw forbidden();
        if (!ownerId || !Types.ObjectId.isValid(ownerId)) throw badInput('A vendor (owner) is required.');
        const i = args.restaurant;
        if (!i.username || !i.password) throw badInput('Username and password are required.');
        assertStrongPassword(i.password, 8);
        if (await Restaurant.exists({ username: i.username.toLowerCase() })) throw conflict('This username is already taken.');
        const r = await Restaurant.create({
          ...inputToRestaurant(i),
          owner: ownerId,
          password: await hashPassword(i.password),
          slug: await uniqueSlug(i.slug ?? i.name),
          unique_restaurant_id: new Types.ObjectId().toHexString(),
          orderPrefix: i.orderPrefix ?? i.name.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase(),
        });
        await audit(ctx, 'CREATE_RESTAURANT', 'Restaurant', r._id, { name: r.name, owner: ownerId });
        return r;
      },
      editRestaurant: async (_p, { restaurant: i }: { restaurant: z.infer<typeof RestaurantInput> & { name?: string } }, ctx) => {
        if (!i._id) throw badInput('Restaurant id (_id) is required.');
        await requireRestaurantAccess(ctx, i._id);
        const r = must(await Restaurant.findById(i._id), 'Restaurant');
        const update = inputToRestaurant(i as z.infer<typeof RestaurantInput>);
        if (update.username && update.username !== r.username && (await Restaurant.exists({ username: update.username, _id: { $ne: r._id } }))) {
          throw conflict('This username is already taken.');
        }
        if (i.slug && i.slug !== r.slug) update.slug = await uniqueSlug(i.slug, r._id);
        if (update.deliveryInfo) update.deliveryInfo = { ...((r.toObject().deliveryInfo as object) ?? {}), ...Object.fromEntries(Object.entries(update.deliveryInfo as object).filter(([, v]) => v !== undefined)) };
        r.set(update);
        if (i.password) {
          assertStrongPassword(i.password, 8);
          r.password = await hashPassword(i.password);
          r.tokenVersion = (r.tokenVersion ?? 0) + 1;
        }
        await r.save();
        await audit(ctx, 'EDIT_RESTAURANT', 'Restaurant', r._id, { ...update, password: i.password ? '[changed]' : undefined });
        return r;
      },
      deleteRestaurant: async (_p, { id }: { id: string }, ctx) => {
        await requireRestaurantAccess(ctx, id);
        const r = must(await Restaurant.findById(id), 'Restaurant');
        r.isActive = !r.isActive; // legacy semantics: toggles activation
        await r.save();
        await audit(ctx, r.isActive ? 'ACTIVATE_RESTAURANT' : 'DEACTIVATE_RESTAURANT', 'Restaurant', id);
        return r;
      },
      hardDeleteRestaurant: async (_p, { id }: { id: string }, ctx) => {
        await requireAdmin(ctx, 'Stores');
        const r = must(await Restaurant.findById(id), 'Restaurant');
        // Orders and earnings reference the store, so it is tombstoned rather than physically removed.
        r.set({ isDeleted: true, isActive: false, isAvailable: false, username: undefined, notificationToken: undefined, tokenVersion: (r.tokenVersion ?? 0) + 1 });
        await r.save();
        await Food.updateMany({ restaurant: r._id }, { isDeleted: true, isActive: false });
        await audit(ctx, 'DELETE_RESTAURANT', 'Restaurant', id);
        return true;
      },
      duplicateRestaurant: async (_p, { id, owner }: { id: string; owner: string }, ctx) => {
        await requireRestaurantAccess(ctx, id);
        const p = await requireOwner(ctx);
        const ownerId = p.userType === 'VENDOR' ? p.id : owner;
        const copy = must(await cloneRestaurant(id, ownerId), 'Restaurant');
        await audit(ctx, 'DUPLICATE_RESTAURANT', 'Restaurant', copy._id, { source: id });
        return copy;
      },
      toggleStoreAvailability: async (_p, { restaurantId }: { restaurantId: string }, ctx) => {
        await requireRestaurantAccess(ctx, restaurantId);
        const r = must(await Restaurant.findById(restaurantId), 'Restaurant');
        r.isAvailable = !r.isAvailable;
        await r.save();
        return r;
      },
      updateCommission: async (_p, { id, commissionRate }: { id: string; commissionRate: number }, ctx) => {
        await requireAdmin(ctx, 'Commission Rate');
        if (!(commissionRate >= 0 && commissionRate <= 100)) throw badInput('Commission rate must be between 0 and 100.');
        const r = must(await Restaurant.findByIdAndUpdate(id, { commissionRate }, { returnDocument: 'after' }), 'Restaurant');
        await audit(ctx, 'UPDATE_COMMISSION', 'Restaurant', id, { commissionRate });
        return r;
      },
      updateTimings: async (_p, { id, openingTimes }: { id: string; openingTimes: z.infer<typeof TimingsInput>[] }, ctx) => {
        await requireRestaurantAccess(ctx, id);
        return must(await Restaurant.findByIdAndUpdate(id, { openingTimes: openingTimes ?? [] }, { returnDocument: 'after' }), 'Restaurant');
      },
      updateScheduleTimings: async (_p, { id, scheduleTimings }: { id: string; scheduleTimings: z.infer<typeof ScheduleTypeInput>[] }, ctx) => {
        await requireRestaurantAccess(ctx, id);
        const normalized = (scheduleTimings ?? []).filter(Boolean).map((d) => ({
          day: d.day,
          isOpen: d.isOpen ?? true,
          times: d.times.map((t) => ({ startTime: [t.startTime], endTime: [t.endTime], maxOrder: t.maxOrder ?? t.maxOrders })),
        }));
        return must(await Restaurant.findByIdAndUpdate(id, { scheduleTimings: normalized }, { returnDocument: 'after' }), 'Restaurant');
      },
      updateDeliveryOptions: async (_p, args: { restId: string; pickup: boolean; delivery: boolean }, ctx) => {
        await requireRestaurantAccess(ctx, args.restId);
        if (!args.pickup && !args.delivery) throw badInput('At least one of pickup or delivery must be enabled.');
        return must(await Restaurant.findByIdAndUpdate(args.restId, { deliveryOptions: { pickup: args.pickup, delivery: args.delivery } }, { returnDocument: 'after' }), 'Restaurant');
      },
      updateDeliveryBoundsAndLocation: async (
        _p,
        args: { id: string; boundType: string; circleBounds?: { radius: number }; bounds?: number[][][]; location: z.infer<typeof CoordinatesInput>; address?: string; postCode?: string; city?: string },
        ctx,
      ) => {
        await requireRestaurantAccess(ctx, args.id);
        const { latitude, longitude } = args.location;
        const type = String(args.boundType).toLowerCase();
        let coordinates: number[][][];
        if (type === 'radius' || type === 'circle' || type === 'point') {
          const radius = args.circleBounds?.radius;
          if (!radius) throw badInput('circleBounds.radius is required for radius delivery zones.');
          coordinates = circlePolygon(longitude, latitude, radius);
        } else {
          if (!args.bounds?.[0] || args.bounds[0].length < 3) throw badInput('Polygon bounds need at least 3 points.');
          coordinates = closeRings(args.bounds.map((ring) => ring.map((p) => [Number(p[0]), Number(p[1])])));
        }
        const zone = await zoneForPoint(longitude, latitude);
        const update: Record<string, unknown> = {
          location: point(longitude, latitude),
          deliveryBounds: { type: 'Polygon', coordinates },
          boundType: type === 'point' ? 'radius' : type,
          circleBounds: args.circleBounds,
          zone: zone?._id ?? null,
        };
        for (const k of ['address', 'postCode', 'city'] as const) if (args[k] !== undefined) update[k] = args[k];
        const r = await Restaurant.findByIdAndUpdate(args.id, update, { returnDocument: 'after', runValidators: true });
        if (!r) throw notFound('Restaurant');
        return { success: true, message: 'Delivery zone updated', data: r };
      },
      updateRestaurantBussinessDetails: async (_p, { id, bussinessDetails }: { id: string; bussinessDetails?: z.infer<typeof BussinessDetailsInput> }, ctx) => {
        await requireRestaurantAccess(ctx, id);
        const r = must(await Restaurant.findByIdAndUpdate(id, { bussinessDetails: bussinessDetails ?? {} }, { returnDocument: 'after' }), 'Restaurant');
        return { success: true, message: 'Business details updated', data: r };
      },
      updateRestaurantDelivery: async (_p, args: { id: string; minDeliveryFee?: number; deliveryDistance?: number; deliveryFee?: number }, ctx) => {
        await requireRestaurantAccess(ctx, args.id);
        for (const k of ['minDeliveryFee', 'deliveryDistance', 'deliveryFee'] as const) {
          if (args[k] !== undefined && args[k] !== null && !(Number(args[k]) >= 0)) throw badInput(`${k} must be a positive number.`);
        }
        const r = must(
          await Restaurant.findByIdAndUpdate(
            args.id,
            { deliveryInfo: { minDeliveryFee: args.minDeliveryFee, deliveryDistance: args.deliveryDistance, deliveryFee: args.deliveryFee } },
            { returnDocument: 'after' },
          ),
          'Restaurant',
        );
        return { success: true, message: 'Delivery settings updated', data: r };
      },
      saveRestaurantToken: async (_p, args: { token?: string; isEnabled?: boolean }, ctx) => {
        const store = await requireStore(ctx);
        if (args.token !== undefined) store.notificationToken = args.token || undefined;
        if (typeof args.isEnabled === 'boolean') store.enableNotification = args.isEnabled;
        await store.save();
        return store;
      },
      uploadToken: async (_p, { id, pushToken }: { id: string; pushToken: string }, ctx) => {
        await requireRestaurantAccess(ctx, id);
        return must(await Restaurant.findByIdAndUpdate(id, { pushToken }, { returnDocument: 'after' }), 'Restaurant');
      },
    },
    Restaurant: {
      categories: async (r: { _id: unknown }, _a, ctx) => menuFor(String(r._id), ctx),
      addons: (r: { _id: unknown }, _a, ctx) => ctx.loaders.addonsByRestaurant.load(String(r._id)),
      options: (r: { _id: unknown }, _a, ctx) => ctx.loaders.optionsByRestaurant.load(String(r._id)),
      owner: (r: { owner?: unknown }, _a, ctx) => (r.owner && isDashboard(ctx) ? ctx.loaders.owner.load(String(r.owner)) : null),
      zone: (r: { zone?: unknown }, _a, ctx) => (r.zone ? ctx.loaders.zone.load(String(r.zone)) : null),
      rating: (r: { reviewAverage?: number }) => r.reviewAverage ?? 0,
      reviewData: async (r: { _id: unknown; reviewCount?: number; reviewAverage?: number }) => ({
        total: r.reviewCount ?? 0,
        ratings: r.reviewAverage ?? 0,
        reviews: await Review.find({ restaurant: String(r._id), isActive: true }).sort({ createdAt: -1 }).limit(50).lean(),
      }),
      deliveryOptions: (r: { deliveryOptions?: { delivery?: boolean; pickup?: boolean } }) => r.deliveryOptions ?? { delivery: true, pickup: true },
      hasBusinessDetails: (r: { bussinessDetails?: { accountNumber?: string } }) => Boolean(r.bussinessDetails?.accountNumber),
      username: dashboardOnly('username'),
      bussinessDetails: dashboardOnly('bussinessDetails'),
      currentWalletAmount: dashboardOnly('currentWalletAmount'),
      totalWalletAmount: dashboardOnly('totalWalletAmount'),
      withdrawnWalletAmount: dashboardOnly('withdrawnWalletAmount'),
      notificationToken: dashboardOnly('notificationToken'),
      pushToken: dashboardOnly('pushToken'),
      commissionRate: dashboardOnly('commissionRate'),
      restaurantUrl: (r: { slug?: string }) => (r.slug ? `/store/${r.slug}` : null),
    },
    RestaurantPreview: {
      rating: (r: { reviewAverage?: number }) => r.reviewAverage ?? 0,
      username: dashboardOnly('username'),
      notificationToken: dashboardOnly('notificationToken'),
      commissionRate: dashboardOnly('commissionRate'),
    },
    Review: {
      order: (r: { order?: unknown }, _a, ctx) => (r.order ? ctx.loaders.order.load(String(r.order)) : null),
      restaurant: (r: { restaurant?: unknown }, _a, ctx) => (r.restaurant ? ctx.loaders.restaurant.load(String(r.restaurant)) : null),
    },
  },
});

/** Categories with nested foods. Inactive items are hidden from customer-facing callers. */
export async function menuFor(restaurantId: string, ctx: GraphQLContext) {
  const [categories, foods] = await Promise.all([
    ctx.loaders.categoriesByRestaurant.load(restaurantId),
    ctx.loaders.foodsByRestaurant.load(restaurantId),
  ]);
  const dashboard = isDashboard(ctx);
  const byCategory = new Map<string, unknown[]>();
  for (const f of foods) {
    if (!dashboard && f.isActive === false) continue;
    const k = String(f.category);
    if (!byCategory.has(k)) byCategory.set(k, []);
    byCategory.get(k)!.push(f);
  }
  return categories
    .filter((c: { isActive?: boolean }) => dashboard || c.isActive !== false)
    .map((c: { _id: unknown }) => ({ ...c, foods: byCategory.get(String(c._id)) ?? [] }));
}

async function popularFoodIds(restaurantId: string, limit: number) {
  if (!Types.ObjectId.isValid(restaurantId)) return [];
  const since = new Date(Date.now() - 90 * 24 * 3600 * 1000);
  const rows = await Order.aggregate<{ _id: unknown; count: number }>([
    { $match: { restaurant: new Types.ObjectId(restaurantId), createdAt: { $gte: since }, orderStatus: { $nin: ['CANCELLED', 'CANCELLEDBYREST'] } } },
    { $unwind: '$items' },
    { $group: { _id: '$items.food', count: { $sum: '$items.quantity' } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);
  return rows.filter((r) => r._id).map((r) => ({ id: String(r._id), count: r.count }));
}

async function recentRestaurants(ctx: GraphQLContext, args: { latitude: number; longitude: number }) {
  const user = await optionalCustomer(ctx);
  if (!user) return [];
  const ids = await Order.find({ user: user._id }).sort({ createdAt: -1 }).limit(50).distinct('restaurant');
  const list = await Restaurant.find({ _id: { $in: ids }, ...PUBLIC_RESTAURANT_FILTER }).limit(20).lean();
  return withDistance(list, args.latitude, args.longitude);
}
