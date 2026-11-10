import { Types } from 'mongoose';
import { distanceKm } from '../lib/geo.js';
import { Addon, Category, Food, Option, Restaurant, SubCategory, Zone } from '../models/index.js';

export function slugify(s: string): string {
  return (
    s
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'store'
  );
}

export async function uniqueSlug(name: string, excludeId?: unknown): Promise<string> {
  const base = slugify(name);
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`;
    const filter: Record<string, unknown> = { slug: candidate };
    if (excludeId) filter._id = { $ne: excludeId };
    if (!(await Restaurant.exists(filter))) return candidate;
  }
  return `${base}-${new Types.ObjectId().toHexString().slice(-6)}`;
}

/** Zone whose polygon contains the given point (or null). */
export async function zoneForPoint(lng: number, lat: number) {
  return Zone.findOne({ isActive: true, location: { $geoIntersects: { $geometry: { type: 'Point', coordinates: [lng, lat] } } } })
    .select('_id tax')
    .lean();
}

/** Adds `distanceWithCurrentLocation` (km) to restaurants when coordinates are known. */
export function withDistance<T extends { location?: { coordinates?: number[] | null } | null }>(list: T[], lat?: number | null, lng?: number | null) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return list;
  return list.map((r) => {
    const c = r.location?.coordinates;
    return c && c.length === 2 ? { ...r, distanceWithCurrentLocation: Math.round(distanceKm(lat, lng, c[1]!, c[0]!) * 100) / 100 } : r;
  });
}

/** Mongo filter for restaurants that deliver to the point. */
export function deliversToFilter(lat?: number | null, lng?: number | null): Record<string, unknown> {
  if (typeof lat !== 'number' || typeof lng !== 'number' || (lat === 0 && lng === 0)) return {};
  return { deliveryBounds: { $geoIntersects: { $geometry: { type: 'Point', coordinates: [lng, lat] } } } };
}

export const PUBLIC_RESTAURANT_FILTER = { isActive: true, isDeleted: { $ne: true } };

/** Copies a restaurant with its full menu. Returns the new restaurant. */
export async function cloneRestaurant(sourceId: string, ownerId: string) {
  const src = await Restaurant.findById(sourceId).select('+password').lean();
  if (!src) return null;
  const { _id, createdAt, updatedAt, slug, username, unique_restaurant_id, ...rest } = src as typeof src & { createdAt?: Date; updatedAt?: Date };
  void createdAt;
  void updatedAt;
  void unique_restaurant_id;
  const suffix = new Types.ObjectId().toHexString().slice(-5);
  const copy = await Restaurant.create({
    ...rest,
    owner: ownerId,
    name: `${src.name} (copy)`,
    slug: await uniqueSlug(`${slug ?? src.name}-copy`),
    username: username ? `${username}-${suffix}` : undefined,
    unique_restaurant_id: new Types.ObjectId().toHexString(),
    orderId: 0,
    orderCount: 0,
    reviewCount: 0,
    reviewAverage: 0,
    currentWalletAmount: 0,
    totalWalletAmount: 0,
    withdrawnWalletAmount: 0,
    stripeAccountId: undefined,
    stripeDetailsSubmitted: false,
    notificationToken: undefined,
    tokenVersion: 0,
    clonedFrom: _id,
  });
  const optionMap = new Map<string, string>();
  for (const o of await Option.find({ restaurant: _id }).lean()) {
    const n = await Option.create({ ...o, _id: undefined, restaurant: copy._id });
    optionMap.set(String(o._id), String(n._id));
  }
  const addonMap = new Map<string, string>();
  for (const a of await Addon.find({ restaurant: _id }).lean()) {
    const n = await Addon.create({ ...a, _id: undefined, restaurant: copy._id, options: a.options.map((id) => optionMap.get(id) ?? id) });
    addonMap.set(String(a._id), String(n._id));
  }
  for (const c of await Category.find({ restaurant: _id }).lean()) {
    const nc = await Category.create({ ...c, _id: undefined, restaurant: copy._id });
    const subMap = new Map<string, string>();
    for (const s of await SubCategory.find({ parentCategoryId: String(c._id) }).lean()) {
      const ns = await SubCategory.create({ title: s.title, parentCategoryId: String(nc._id) });
      subMap.set(String(s._id), String(ns._id));
    }
    const foods = await Food.find({ category: c._id, isDeleted: { $ne: true } }).lean();
    if (foods.length) {
      await Food.insertMany(
        foods.map((f) => ({
          ...f,
          _id: undefined,
          restaurant: copy._id,
          category: nc._id,
          subCategory: f.subCategory ? (subMap.get(f.subCategory) ?? f.subCategory) : undefined,
          orderCount: 0,
          variations: f.variations.map((v) => ({ ...v, _id: undefined, addons: v.addons.map((id) => addonMap.get(id) ?? id) })),
        })),
      );
    }
  }
  return copy;
}
