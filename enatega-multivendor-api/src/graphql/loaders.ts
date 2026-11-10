import DataLoader from 'dataloader';
import type { Model } from 'mongoose';
import { Types } from 'mongoose';
import { Addon, Category, Food, Option, Order, Owner, Restaurant, Review, Rider, User, Zone } from '../models/index.js';

const toKey = (id: unknown): string => String(id);

function byId<T extends { _id: unknown }>(model: Model<any>, select?: string) {
  return new DataLoader<string, T | null>(
    async (ids) => {
      const valid = ids.filter((id) => Types.ObjectId.isValid(id));
      const q = model.find({ _id: { $in: valid } });
      if (select) q.select(select);
      const docs = (await q.lean()) as unknown as T[];
      const map = new Map(docs.map((d) => [toKey(d._id), d]));
      return ids.map((id) => map.get(id) ?? null);
    },
    { cacheKeyFn: toKey },
  );
}

function manyByRestaurant<T extends { restaurant: unknown }>(model: Model<any>, sort: Record<string, 1 | -1>, extra: object = {}) {
  return new DataLoader<string, T[]>(
    async (restaurantIds) => {
      const valid = restaurantIds.filter((id) => Types.ObjectId.isValid(id));
      const docs = (await model
        .find({ restaurant: { $in: valid }, ...extra })
        .sort(sort)
        .lean()) as unknown as T[];
      const map = new Map<string, T[]>();
      for (const d of docs) {
        const k = toKey(d.restaurant);
        if (!map.has(k)) map.set(k, []);
        map.get(k)!.push(d);
      }
      return restaurantIds.map((id) => map.get(id) ?? []);
    },
    { cacheKeyFn: toKey },
  );
}

/** Per-request batched loaders (lean documents). */
export function createLoaders() {
  return {
    user: byId<any>(User, '-password'),
    owner: byId<any>(Owner, '-password'),
    restaurant: byId<any>(Restaurant, '-password'),
    rider: byId<any>(Rider, '-password'),
    zone: byId<any>(Zone),
    review: byId<any>(Review),
    order: byId<any>(Order),
    food: byId<any>(Food),
    categoriesByRestaurant: manyByRestaurant<any>(Category, { order: 1, createdAt: 1 }),
    foodsByRestaurant: manyByRestaurant<any>(Food, { order: 1, createdAt: 1 }, { isDeleted: { $ne: true } }),
    addonsByRestaurant: manyByRestaurant<any>(Addon, { createdAt: 1 }),
    optionsByRestaurant: manyByRestaurant<any>(Option, { createdAt: 1 }),
  };
}

export type Loaders = ReturnType<typeof createLoaders>;
