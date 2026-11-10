import { Types } from 'mongoose';
import { z } from 'zod';
import { defineModule } from '../graphql/module.js';
import type { GraphQLContext } from '../graphql/context.js';
import { looseEnum, objectId, optBool, optNum, optStr, pagination } from '../graphql/zod.js';
import { optionalCustomer, requireAdmin, requireRestaurantAccess } from '../auth/guards.js';
import { badInput, conflict, must } from '../lib/errors.js';
import { escapeRegex, pageArgs, pageResult, searchRegex } from '../lib/query.js';
import { Banner, BannerRestaurant, Coupon, Cuisine, Food, Restaurant, Review, ShopType, Taxation, Tipping } from '../models/index.js';
import { audit } from '../services/audit.js';
import { slugify } from '../services/restaurants.js';

const dateish = z.preprocess((v) => {
  if (v === null || v === undefined || v === '') return undefined;
  if (typeof v === 'string' && /^\d{10,}$/.test(v)) return new Date(Number(v));
  return new Date(v as string);
}, z.date().optional());

const CouponInput = z.object({
  _id: optStr(40),
  title: z.string().trim().min(2).max(40),
  discount: z.coerce.number().min(0).max(100),
  enabled: optBool,
  couponType: optStr(20),
  lifeTimeActive: optBool,
  startDate: dateish,
  endDate: dateish,
});

const CuisineInput = z.object({
  _id: optStr(40),
  name: z.string().trim().min(1).max(80),
  description: optStr(500),
  image: optStr(2000),
  shopType: optStr(60),
});

const ShopTypeInput = z.object({
  _id: optStr(40),
  name: z.string().trim().min(1).max(80),
  slug: optStr(80),
  image: optStr(2000),
  isActive: optBool,
});

const BannerInput = z.object({
  _id: optStr(40),
  title: optStr(200),
  description: optStr(1000),
  action: optStr(100),
  screen: optStr(200),
  file: optStr(2000),
  parameters: z.preprocess((v) => (Array.isArray(v) || (v && typeof v === 'object') ? JSON.stringify(v) : v), optStr(2000)),
  buttonText: optStr(60),
  slug: optStr(120),
  shopType: optStr(60),
});

const BannerRestaurantInput = z.object({
  _id: optStr(40),
  restaurant: objectId,
  title: optStr(200),
  description: optStr(1000),
  file: optStr(2000),
  foodId: optStr(40),
  displayImage: optStr(2000),
  isActive: optBool,
});

function couponValidNow(c: { enabled?: boolean | null; lifeTimeActive?: boolean | null; startDate?: Date | null; endDate?: Date | null }) {
  if (!c.enabled) return false;
  if (c.lifeTimeActive) return true;
  const now = Date.now();
  if (c.startDate && c.startDate.getTime() > now) return false;
  if (c.endDate && c.endDate.getTime() < now) return false;
  return true;
}

/** Finds a usable coupon by code (restaurant-specific first, then platform-wide). */
export async function findValidCoupon(code: string, restaurantId?: string | null) {
  const title = String(code ?? '').trim().toUpperCase();
  if (!title) return null;
  const candidates = await Coupon.find({
    title,
    $or: [{ restaurant: null }, ...(restaurantId && Types.ObjectId.isValid(restaurantId) ? [{ restaurant: restaurantId }] : [])],
  } as Record<string, unknown>).lean();
  candidates.sort((a, b) => Number(Boolean(b.restaurant)) - Number(Boolean(a.restaurant)));
  return candidates.find(couponValidNow) ?? null;
}

async function couponPage(filter: Record<string, unknown>, args: { page?: number; limit?: number; search?: string; enabled?: boolean; startDate?: string; endDate?: string }) {
  const { page, limit, skip } = pageArgs(args.page, args.limit);
  const re = searchRegex(args.search);
  if (re) filter.title = re;
  if (typeof args.enabled === 'boolean') filter.enabled = args.enabled;
  if (args.startDate) filter.startDate = { $gte: new Date(args.startDate) };
  if (args.endDate) filter.endDate = { $lte: new Date(args.endDate) };
  const [data, total] = await Promise.all([Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), Coupon.countDocuments(filter)]);
  return pageResult(data, total, page, limit);
}

async function saveCoupon(ctx: GraphQLContext, input: z.infer<typeof CouponInput>, restaurant: string | null) {
  if (input.startDate && input.endDate && input.startDate > input.endDate) throw badInput('Start date must be before end date.');
  const data = {
    title: input.title.toUpperCase(),
    discount: input.discount,
    enabled: input.enabled ?? true,
    couponType: input.couponType ?? 'percentage',
    lifeTimeActive: input.lifeTimeActive ?? false,
    startDate: input.startDate,
    endDate: input.endDate,
    restaurant,
  };
  const dup: Record<string, unknown> = { title: data.title, restaurant };
  if (input._id) dup._id = { $ne: input._id };
  if (await Coupon.exists(dup)) throw conflict('A coupon with this code already exists.');
  const coupon = input._id
    ? must(await Coupon.findOneAndUpdate({ _id: input._id, restaurant } as Record<string, unknown>, data, { new: true }), 'Coupon')
    : await Coupon.create(data);
  await audit(ctx, input._id ? 'EDIT_COUPON' : 'CREATE_COUPON', 'Coupon', coupon._id, data);
  return coupon;
}

async function singleton<T>(model: { findOne: () => { lean: () => Promise<T | null> } }): Promise<T | null> {
  return model.findOne().lean();
}

export const catalogModule = defineModule({
  name: 'catalog',
  inputs: {
    CouponInput,
    CuisineInput,
    CreateShopTypeInput: ShopTypeInput,
    UpdateShopTypeInput: ShopTypeInput,
    FetchShopTypeFilter: z.object({ name: optStr(80), search: optStr(80), isActive: optBool }),
    FetchUniqueShopTypeInput: z.object({ id: optStr(40), _id: optStr(40), slug: optStr(80), name: optStr(80) }),
    DeleteTypeEnum: looseEnum(['SOFT', 'HARD'] as const),
    PaginationInput: pagination,
    BannerInput,
    BannerRestaurantInput,
    TaxationInput: z.object({ _id: optStr(40), taxationCharges: z.coerce.number().min(0).max(100), enabled: optBool }),
    TippingInput: z.object({ _id: optStr(40), tipVariations: z.array(z.coerce.number().min(0)).min(1).max(10), enabled: optBool }),
  },
  resolvers: {
    Query: {
      cuisines: async () => Cuisine.find().sort({ name: 1 }).lean(),
      cuisinesPaginated: async (_p, args: { page?: number; limit?: number; search?: string; shopType?: string }, ctx) => {
        await requireAdmin(ctx, 'Cuisine');
        const { page, limit, skip } = pageArgs(args.page, args.limit);
        const filter: Record<string, unknown> = {};
        const re = searchRegex(args.search);
        if (re) filter.name = re;
        if (args.shopType) filter.shopType = args.shopType;
        const [data, total] = await Promise.all([Cuisine.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(), Cuisine.countDocuments(filter)]);
        return pageResult(data, total, page, limit);
      },
      attachedCuisines: async () => {
        const names = await Restaurant.distinct('cuisines', { isActive: true, isDeleted: { $ne: true } });
        return Cuisine.find({ name: { $in: names } }).sort({ name: 1 }).lean();
      },
      fetchShopTypes: async (_p, args: { filter?: { name?: string; search?: string; isActive?: boolean }; pagination?: { page: number; limit: number; skip: number } }) => {
        const page = args.pagination?.page ?? 1;
        const limit = args.pagination?.limit ?? 10;
        const filter: Record<string, unknown> = { isDeleted: { $ne: true } };
        const re = searchRegex(args.filter?.search ?? args.filter?.name);
        if (re) filter.name = re;
        if (typeof args.filter?.isActive === 'boolean') filter.isActive = args.filter.isActive;
        const [data, total] = await Promise.all([ShopType.find(filter).sort({ createdAt: 1 }).skip((page - 1) * limit).limit(limit).lean(), ShopType.countDocuments(filter)]);
        const totalPages = Math.max(Math.ceil(total / limit), 1);
        return { data, total, page, pageSize: limit, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 };
      },
      fetchAllShopTypes: async () => ({ data: await ShopType.find({ isActive: true, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).lean() }),
      fetchShopTypeByUnique: async (_p, { dto }: { dto?: { id?: string; _id?: string; slug?: string; name?: string } }) => {
        const id = dto?.id ?? dto?._id;
        if (id && Types.ObjectId.isValid(id)) return ShopType.findById(id).lean();
        if (dto?.slug) return ShopType.findOne({ slug: dto.slug.toLowerCase() }).lean();
        if (dto?.name) return ShopType.findOne({ name: new RegExp(`^${escapeRegex(dto.name)}$`, 'i') }).lean();
        throw badInput('id, slug or name is required.');
      },
      reviews: async (_p, { restaurant }: { restaurant: string }) =>
        Review.find({ restaurant, isActive: true } as Record<string, unknown>).sort({ createdAt: -1 }).limit(200).lean(),
      reviewsByRestaurant: async (_p, { restaurant }: { restaurant: string }) => {
        const r = must(await Restaurant.findById(restaurant).select('reviewCount reviewAverage').lean(), 'Restaurant');
        const reviews = await Review.find({ restaurant, isActive: true } as Record<string, unknown>).sort({ createdAt: -1 }).limit(200).lean();
        return { total: r.reviewCount ?? reviews.length, ratings: r.reviewAverage ?? 0, reviews };
      },
      restaurantReviewsPaginated: async (_p, args: { restaurantId: string; page?: number; limit?: number; search?: string; minRating?: number; maxRating?: number }, ctx) => {
        await requireRestaurantAccess(ctx, args.restaurantId);
        const { page, limit, skip } = pageArgs(args.page, args.limit);
        const filter: Record<string, unknown> = { restaurant: args.restaurantId };
        const re = searchRegex(args.search);
        if (re) filter.$or = [{ description: re }, { comments: re }];
        if (args.minRating !== undefined || args.maxRating !== undefined) {
          filter.rating = { ...(args.minRating !== undefined ? { $gte: args.minRating } : {}), ...(args.maxRating !== undefined ? { $lte: args.maxRating } : {}) };
        }
        const [data, total] = await Promise.all([Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), Review.countDocuments(filter)]);
        return pageResult(data, total, page, limit);
      },
      coupons: async (_p, _a, ctx) => {
        await requireAdmin(ctx, 'Coupons');
        return Coupon.find({ restaurant: null } as Record<string, unknown>).sort({ createdAt: -1 }).lean();
      },
      couponsPaginated: async (_p, args: { page?: number; limit?: number; search?: string; enabled?: boolean; startDate?: string; endDate?: string }, ctx) => {
        await requireAdmin(ctx, 'Coupons');
        return couponPage({ restaurant: null }, args);
      },
      restaurantCoupons: async (_p, { restaurantId }: { restaurantId: string }, ctx) => {
        await requireRestaurantAccess(ctx, restaurantId);
        return Coupon.find({ restaurant: restaurantId } as Record<string, unknown>).sort({ createdAt: -1 }).lean();
      },
      restaurantCouponsPaginated: async (_p, args: { restaurantId: string; page?: number; limit?: number; search?: string; enabled?: boolean }, ctx) => {
        await requireRestaurantAccess(ctx, args.restaurantId);
        return couponPage({ restaurant: args.restaurantId }, args);
      },
      couponsbyRestaurant: async () => {
        const list = await Coupon.find({ restaurant: null, enabled: true } as Record<string, unknown>).sort({ createdAt: -1 }).lean();
        return list.filter(couponValidNow);
      },
      banners: async () => Banner.find({ isActive: { $ne: false } }).sort({ order: 1, createdAt: -1 }).lean(),
      bannerRestaurants: async (_p, { restaurantId }: { restaurantId?: string }) => {
        const filter: Record<string, unknown> = {};
        if (restaurantId) filter.restaurant = restaurantId;
        return BannerRestaurant.find(filter).sort({ createdAt: -1 }).lean();
      },
      bannerRestaurant: async (_p, { banner, restaurantId }: { banner: string; restaurantId: string }) =>
        must(await BannerRestaurant.findOne({ _id: banner, restaurant: restaurantId } as Record<string, unknown>).lean(), 'Banner'),
      taxes: async () => (await singleton(Taxation)) ?? { _id: null, taxationCharges: 0, enabled: false },
      tips: async () => (await singleton(Tipping)) ?? { _id: null, tipVariations: [5, 10, 15], enabled: true },
    },
    Mutation: {
      createCuisine: async (_p, { cuisineInput }: { cuisineInput: z.infer<typeof CuisineInput> }, ctx) => {
        await requireAdmin(ctx, 'Cuisine');
        if (await Cuisine.exists({ name: new RegExp(`^${escapeRegex(cuisineInput.name)}$`, 'i') })) throw conflict('Cuisine already exists.');
        const { _id, ...data } = cuisineInput;
        const c = await Cuisine.create(data);
        await audit(ctx, 'CREATE_CUISINE', 'Cuisine', c._id, data);
        return c;
      },
      editCuisine: async (_p, { cuisineInput }: { cuisineInput: z.infer<typeof CuisineInput> }, ctx) => {
        await requireAdmin(ctx, 'Cuisine');
        const { _id, ...data } = cuisineInput;
        const before = must(await Cuisine.findById(_id).lean(), 'Cuisine');
        const c = await Cuisine.findByIdAndUpdate(_id, data, { new: true });
        if (before.name !== data.name) await Restaurant.updateMany({ cuisines: before.name }, { $set: { 'cuisines.$': data.name } });
        await audit(ctx, 'EDIT_CUISINE', 'Cuisine', _id, data);
        return c;
      },
      deleteCuisine: async (_p, { id }: { id: string }, ctx) => {
        await requireAdmin(ctx, 'Cuisine');
        const c = must(await Cuisine.findByIdAndDelete(id), 'Cuisine');
        await Restaurant.updateMany({ cuisines: c.name }, { $pull: { cuisines: c.name } });
        await audit(ctx, 'DELETE_CUISINE', 'Cuisine', id);
        return id;
      },
      createShopType: async (_p, { dto }: { dto: z.infer<typeof ShopTypeInput> }, ctx) => {
        await requireAdmin(ctx, 'Shop Type');
        const slug = slugify(dto.slug ?? dto.name);
        if (await ShopType.exists({ slug })) throw conflict('A shop type with this name already exists.');
        const s = await ShopType.create({ name: dto.name, slug, image: dto.image, isActive: dto.isActive ?? true });
        await audit(ctx, 'CREATE_SHOP_TYPE', 'ShopType', s._id, { name: dto.name });
        return s;
      },
      updateShopType: async (_p, { dto }: { dto: z.infer<typeof ShopTypeInput> }, ctx) => {
        await requireAdmin(ctx, 'Shop Type');
        const s = must(await ShopType.findByIdAndUpdate(dto._id, { name: dto.name, image: dto.image, ...(typeof dto.isActive === 'boolean' ? { isActive: dto.isActive } : {}) }, { new: true }), 'Shop type');
        await audit(ctx, 'UPDATE_SHOP_TYPE', 'ShopType', s._id, { name: dto.name, isActive: dto.isActive });
        return s;
      },
      deleteShopType: async (_p, { id, type }: { id: string; type?: 'SOFT' | 'HARD' }, ctx) => {
        await requireAdmin(ctx, 'Shop Type');
        const s = must(await ShopType.findById(id), 'Shop type');
        if (type === 'HARD') {
          if (await Restaurant.exists({ shopType: s.slug, isDeleted: { $ne: true } })) throw badInput('This shop type is used by stores; deactivate it instead.');
          await s.deleteOne();
        } else {
          s.isActive = false;
          s.isDeleted = true;
          await s.save();
        }
        await audit(ctx, 'DELETE_SHOP_TYPE', 'ShopType', id, { type: type ?? 'SOFT' });
        return s;
      },

      createCoupon: async (_p, { couponInput }: { couponInput: z.infer<typeof CouponInput> }, ctx) => {
        await requireAdmin(ctx, 'Coupons');
        return saveCoupon(ctx, { ...couponInput, _id: undefined }, null);
      },
      editCoupon: async (_p, { couponInput }: { couponInput: z.infer<typeof CouponInput> }, ctx) => {
        await requireAdmin(ctx, 'Coupons');
        if (!couponInput._id) throw badInput('Coupon id is required.');
        return saveCoupon(ctx, couponInput, null);
      },
      deleteCoupon: async (_p, { id }: { id: string }, ctx) => {
        await requireAdmin(ctx, 'Coupons');
        must(await Coupon.findOneAndDelete({ _id: id, restaurant: null } as Record<string, unknown>), 'Coupon');
        await audit(ctx, 'DELETE_COUPON', 'Coupon', id);
        return id;
      },
      createRestaurantCoupon: async (_p, { restaurantId, couponInput }: { restaurantId: string; couponInput: z.infer<typeof CouponInput> }, ctx) => {
        await requireRestaurantAccess(ctx, restaurantId);
        return saveCoupon(ctx, { ...couponInput, _id: undefined }, restaurantId);
      },
      editRestaurantCoupon: async (_p, { restaurantId, couponInput }: { restaurantId: string; couponInput: z.infer<typeof CouponInput> }, ctx) => {
        await requireRestaurantAccess(ctx, restaurantId);
        if (!couponInput._id) throw badInput('Coupon id is required.');
        return saveCoupon(ctx, couponInput, restaurantId);
      },
      deleteRestaurantCoupon: async (_p, { restaurantId, couponId }: { restaurantId: string; couponId: string }, ctx) => {
        await requireRestaurantAccess(ctx, restaurantId);
        must(await Coupon.findOneAndDelete({ _id: couponId, restaurant: restaurantId } as Record<string, unknown>), 'Coupon');
        return couponId;
      },
      coupon: async (_p, { coupon, restaurantId }: { coupon: string; restaurantId?: string }, ctx) => {
        await optionalCustomer(ctx);
        const found = await findValidCoupon(coupon, restaurantId);
        if (!found) return { success: false, message: 'Invalid or expired coupon code.', coupon: null };
        return { success: true, message: 'Coupon applied', coupon: found };
      },

      createBanner: async (_p, { bannerInput }: { bannerInput: z.infer<typeof BannerInput> }, ctx) => {
        await requireAdmin(ctx, 'Banners');
        const { _id, ...data } = bannerInput;
        const b = await Banner.create(data);
        await audit(ctx, 'CREATE_BANNER', 'Banner', b._id);
        return b;
      },
      editBanner: async (_p, { bannerInput }: { bannerInput: z.infer<typeof BannerInput> }, ctx) => {
        await requireAdmin(ctx, 'Banners');
        const { _id, ...data } = bannerInput;
        const b = must(await Banner.findByIdAndUpdate(_id, data, { new: true }), 'Banner');
        await audit(ctx, 'EDIT_BANNER', 'Banner', _id);
        return b;
      },
      deleteBanner: async (_p, { id }: { id: string }, ctx) => {
        await requireAdmin(ctx, 'Banners');
        must(await Banner.findByIdAndDelete(id), 'Banner');
        await audit(ctx, 'DELETE_BANNER', 'Banner', id);
        return true;
      },
      createBannerRestaurant: async (_p, { bannerInput }: { bannerInput: z.infer<typeof BannerRestaurantInput> }, ctx) => {
        await requireRestaurantAccess(ctx, bannerInput.restaurant);
        const { _id, ...data } = bannerInput;
        return BannerRestaurant.create(data);
      },
      editBannerRestaurant: async (_p, { bannerInput }: { bannerInput: z.infer<typeof BannerRestaurantInput> }, ctx) => {
        await requireRestaurantAccess(ctx, bannerInput.restaurant);
        const { _id, ...data } = bannerInput;
        return must(await BannerRestaurant.findOneAndUpdate({ _id, restaurant: bannerInput.restaurant } as Record<string, unknown>, data, { new: true }), 'Banner');
      },
      deleteBannerRestaurant: async (_p, { id }: { id: string }, ctx) => {
        const b = must(await BannerRestaurant.findById(id), 'Banner');
        await requireRestaurantAccess(ctx, String(b.restaurant));
        await b.deleteOne();
        return true;
      },

      createTaxation: async (_p, { taxationInput }: { taxationInput: { taxationCharges: number; enabled?: boolean } }, ctx) => {
        await requireAdmin(ctx, 'Configuration');
        const t = await Taxation.findOneAndUpdate({}, { taxationCharges: taxationInput.taxationCharges, enabled: taxationInput.enabled ?? true }, { upsert: true, new: true });
        await audit(ctx, 'SAVE_TAXATION', 'Taxation', t._id, taxationInput);
        return t;
      },
      editTaxation: async (_p, { taxationInput }: { taxationInput: { taxationCharges: number; enabled?: boolean } }, ctx) => {
        await requireAdmin(ctx, 'Configuration');
        const t = await Taxation.findOneAndUpdate({}, { taxationCharges: taxationInput.taxationCharges, ...(typeof taxationInput.enabled === 'boolean' ? { enabled: taxationInput.enabled } : {}) }, { upsert: true, new: true });
        await audit(ctx, 'SAVE_TAXATION', 'Taxation', t._id, taxationInput);
        return t;
      },
      createTipping: async (_p, { tippingInput }: { tippingInput: { tipVariations: number[]; enabled?: boolean } }, ctx) => {
        await requireAdmin(ctx, 'Tipping');
        const t = await Tipping.findOneAndUpdate({}, { tipVariations: tippingInput.tipVariations, enabled: tippingInput.enabled ?? true }, { upsert: true, new: true });
        await audit(ctx, 'SAVE_TIPPING', 'Tipping', t._id, tippingInput);
        return t;
      },
      editTipping: async (_p, { tippingInput }: { tippingInput: { tipVariations: number[]; enabled?: boolean } }, ctx) => {
        await requireAdmin(ctx, 'Tipping');
        const t = await Tipping.findOneAndUpdate({}, { tipVariations: tippingInput.tipVariations, ...(typeof tippingInput.enabled === 'boolean' ? { enabled: tippingInput.enabled } : {}) }, { upsert: true, new: true });
        await audit(ctx, 'SAVE_TIPPING', 'Tipping', t._id, tippingInput);
        return t;
      },
    },
    BannerRestaurant: {
      foodImage: async (b: { foodId?: string }, _a, ctx) => (b.foodId && Types.ObjectId.isValid(b.foodId) ? (await ctx.loaders.food.load(b.foodId))?.image ?? null : null),
      foodTitle: async (b: { foodId?: string }, _a, ctx) => (b.foodId && Types.ObjectId.isValid(b.foodId) ? (await ctx.loaders.food.load(b.foodId))?.title ?? null : null),
      restaurant: (b: { restaurant?: unknown }) => (b.restaurant ? String(b.restaurant) : null),
    },
  },
});

void Food;
