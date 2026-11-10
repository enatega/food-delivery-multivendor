import { createHash } from 'node:crypto';
import { Types } from 'mongoose';
import { round2 } from '../lib/query.js';
import { Category, Food, FoodDeal, Restaurant } from '../models/index.js';

let storeCache: { id: string; at: number } | null = null;

/** The store served in single-vendor mode (the oldest active, non-deleted store). */
export async function getSingleVendorStore() {
  if (storeCache && Date.now() - storeCache.at < 60_000) {
    const cached = await Restaurant.findById(storeCache.id).lean();
    if (cached && !cached.isDeleted) return cached;
  }
  const r = await Restaurant.findOne({ isDeleted: { $ne: true }, isActive: true }).sort({ createdAt: 1 }).lean();
  if (r) storeCache = { id: String(r._id), at: Date.now() };
  return r;
}

export type DealLean = {
  _id: unknown;
  title: string;
  discountType?: string | null;
  discountValue: number;
  food: unknown;
  variation?: unknown;
  section?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  isActive?: boolean | null;
};

export function activeDealFilter(extra: Record<string, unknown> = {}) {
  const now = new Date();
  return {
    isActive: true,
    $and: [
      { $or: [{ startDate: null }, { startDate: { $exists: false } }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: null }, { endDate: { $exists: false } }, { endDate: { $gte: now } }] },
    ],
    ...extra,
  };
}

export async function activeDealsFor(foodIds: unknown[]): Promise<DealLean[]> {
  if (!foodIds.length) return [];
  return FoodDeal.find(activeDealFilter({ food: { $in: foodIds } }) as Record<string, unknown>).lean() as Promise<DealLean[]>;
}

export function dealForVariation(deals: DealLean[], foodId: unknown, variationId: unknown): DealLean | undefined {
  return (
    deals.find((d) => String(d.food) === String(foodId) && d.variation && String(d.variation) === String(variationId)) ??
    deals.find((d) => String(d.food) === String(foodId) && !d.variation)
  );
}

export function applyDeal(price: number, deal?: DealLean): number {
  if (!deal) return round2(price);
  const v = Number(deal.discountValue) || 0;
  const p = deal.discountType === 'FIXED' ? price - v : price * (1 - v / 100);
  return round2(Math.max(p, 0));
}

export const dealView = (d?: DealLean | null) =>
  d
    ? {
        id: d._id,
        title: d.title,
        name: d.title,
        discountType: d.discountType ?? 'PERCENTAGE',
        discountValue: d.discountValue,
        type: d.discountType ?? 'PERCENTAGE',
        value: d.discountValue,
        isActive: d.isActive ?? true,
        startDate: d.startDate,
        endDate: d.endDate,
      }
    : null;

type FoodLean = {
  _id: unknown;
  title: string;
  description?: string | null;
  image?: string | null;
  category: unknown;
  subCategory?: string | null;
  isOutOfStock?: boolean | null;
  variations: { _id: unknown; title?: string | null; price: number; discounted?: number | null; isOutOfStock?: boolean | null; addons?: string[] }[];
};

/** Maps foods to the `CategoryProduct` / `HomeFoodItem` shape with active deals applied. */
export async function productViews(foods: FoodLean[], favourites: Set<string> = new Set()) {
  const deals = await activeDealsFor(foods.map((f) => f._id));
  return foods.map((f) => ({
    id: f._id,
    title: f.title,
    description: f.description,
    image: f.image,
    categoryId: String(f.category),
    subCategory: f.subCategory,
    isOutOfStock: Boolean(f.isOutOfStock) || f.variations.every((v) => v.isOutOfStock),
    isFavourite: favourites.has(String(f._id)),
    variations: f.variations.map((v) => {
      const deal = dealForVariation(deals, f._id, v._id);
      return {
        id: v._id,
        _id: v._id,
        title: v.title,
        name: v.title,
        price: v.price,
        discounted: deal ? applyDeal(v.price, deal) : v.discounted,
        isOutOfStock: Boolean(v.isOutOfStock),
        outofstock: Boolean(v.isOutOfStock),
        deal: dealView(deal),
      };
    }),
  }));
}

export const PUBLIC_FOOD = { isDeleted: { $ne: true }, isActive: true };

export async function catalogVersion(restaurantId: unknown): Promise<string> {
  const q = { restaurant: String(restaurantId) } as Record<string, unknown>;
  const [f, c, d]: ({ updatedAt?: Date } | null)[] = await Promise.all([
    Food.findOne(q).sort({ updatedAt: -1 }).select('updatedAt').lean(),
    Category.findOne(q).sort({ updatedAt: -1 }).select('updatedAt').lean(),
    FoodDeal.findOne(q).sort({ updatedAt: -1 }).select('updatedAt').lean(),
  ]);
  return createHash('sha1')
    .update([f?.updatedAt, c?.updatedAt, d?.updatedAt].map((x) => (x ? new Date(x).getTime() : 0)).join(':'))
    .digest('hex')
    .slice(0, 12);
}

export const isId = (v: unknown): v is string => typeof v === 'string' && Types.ObjectId.isValid(v);
