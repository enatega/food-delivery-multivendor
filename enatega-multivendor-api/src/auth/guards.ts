import { Types } from 'mongoose';
import type { GraphQLContext } from '../graphql/context.js';
import { forbidden, invalidToken, unauthenticated, notFound, badInput } from '../lib/errors.js';
import { Owner, Restaurant, Rider, User, type RestaurantDoc, type RiderDoc, type UserDoc } from '../models/index.js';
import type { AccessClaims, OwnerType } from './jwt.js';

/** Staff permission codes (match enatega-multivendor-admin/lib/utils/constants/permissions.ts). */
export type Permission =
  | 'Admin'
  | 'Vendors'
  | 'Stores'
  | 'Riders'
  | 'Users'
  | 'Staff'
  | 'Configuration'
  | 'Orders'
  | 'Coupons'
  | 'Cuisine'
  | 'Banners'
  | 'Tipping'
  | 'Commission Rate'
  | 'Withdraw Request'
  | 'Notification'
  | 'Zone'
  | 'Dispatch'
  | 'Shop Type';

export interface OwnerPrincipal {
  id: string;
  userType: OwnerType;
  email?: string;
  name?: string;
  permissions: string[];
  /** Restaurants this principal may manage (VENDOR: owned; RESTAURANT: itself). Empty for ADMIN/STAFF. */
  restaurantIds: string[];
}

export function requireClaims(ctx: GraphQLContext): AccessClaims {
  if (ctx.auth.error) throw ctx.auth.error;
  if (!ctx.auth.claims) throw unauthenticated();
  return ctx.auth.claims;
}

export function optionalClaims(ctx: GraphQLContext): AccessClaims | undefined {
  return ctx.auth.error ? undefined : ctx.auth.claims;
}

async function memo<T>(ctx: GraphQLContext, key: string, load: () => Promise<T>): Promise<T> {
  if (ctx.cache.has(key)) return ctx.cache.get(key) as T;
  const p = load();
  ctx.cache.set(key, p);
  try {
    return await p;
  } catch (err) {
    ctx.cache.delete(key);
    throw err;
  }
}

function checkVersion(claims: AccessClaims, doc: { tokenVersion?: number | null } | null): void {
  if (!doc) throw invalidToken('Account no longer exists.');
  if ((doc.tokenVersion ?? 0) !== (claims.tv ?? 0)) throw invalidToken('Session was revoked. Please log in again.');
}

export async function requireCustomer(ctx: GraphQLContext): Promise<UserDoc> {
  const claims = requireClaims(ctx);
  if (claims.typ !== 'customer') throw forbidden('Customer account required.');
  return memo(ctx, `customer:${claims.sub}`, async () => {
    const user = await User.findById(claims.sub);
    checkVersion(claims, user);
    if (!user!.isActive || user!.status === 'blocked' || user!.deletedAt) throw invalidToken('Account is disabled.');
    return user!;
  });
}

export async function optionalCustomer(ctx: GraphQLContext): Promise<UserDoc | null> {
  const claims = optionalClaims(ctx);
  if (!claims || claims.typ !== 'customer') return null;
  try {
    return await requireCustomer(ctx);
  } catch {
    return null;
  }
}

export async function requireRider(ctx: GraphQLContext): Promise<RiderDoc> {
  const claims = requireClaims(ctx);
  if (claims.typ !== 'rider') throw forbidden('Rider account required.');
  return memo(ctx, `rider:${claims.sub}`, async () => {
    const rider = await Rider.findById(claims.sub);
    checkVersion(claims, rider);
    if (!rider!.isActive || rider!.isDeleted) throw invalidToken('Rider account is disabled.');
    return rider!;
  });
}

/** Store app principal (restaurantLogin). */
export async function requireStore(ctx: GraphQLContext): Promise<RestaurantDoc> {
  const claims = requireClaims(ctx);
  if (claims.typ === 'restaurant' || (claims.typ === 'owner' && claims.ut === 'RESTAURANT')) {
    return memo(ctx, `store:${claims.sub}`, async () => {
      const r = await Restaurant.findById(claims.sub);
      checkVersion(claims, r);
      if (r!.isDeleted) throw invalidToken('Store is disabled.');
      return r!;
    });
  }
  throw forbidden('Store account required.');
}

export async function requireOwner(ctx: GraphQLContext): Promise<OwnerPrincipal> {
  const claims = requireClaims(ctx);
  if (claims.typ !== 'owner') throw forbidden('Dashboard account required.');
  return memo(ctx, `owner:${claims.sub}`, async () => {
    if (claims.ut === 'RESTAURANT') {
      const r = await Restaurant.findById(claims.sub).select('tokenVersion isDeleted name username');
      checkVersion(claims, r);
      if (r!.isDeleted) throw invalidToken('Store is disabled.');
      return { id: String(r!._id), userType: 'RESTAURANT', name: r!.name, permissions: [], restaurantIds: [String(r!._id)] };
    }
    const owner = await Owner.findById(claims.sub);
    checkVersion(claims, owner);
    if (!owner!.isActive || owner!.isDeleted) throw invalidToken('Account is disabled.');
    const restaurantIds =
      owner!.userType === 'VENDOR'
        ? (await Restaurant.find({ owner: owner!._id, isDeleted: { $ne: true } }).select('_id').lean()).map((r) => String(r._id))
        : [];
    return {
      id: String(owner!._id),
      userType: owner!.userType as OwnerType,
      email: owner!.email,
      name: owner!.name ?? undefined,
      permissions: owner!.permissions ?? [],
      restaurantIds,
    };
  });
}

export function isAdmin(p: OwnerPrincipal): boolean {
  return p.userType === 'ADMIN';
}

export function hasPermission(p: OwnerPrincipal, permission: Permission): boolean {
  if (p.userType === 'ADMIN') return true;
  if (p.userType === 'STAFF') return p.permissions.includes(permission) || p.permissions.includes('Admin');
  return false;
}

/** Super-admin, or staff holding the permission. */
export async function requireAdmin(ctx: GraphQLContext, permission?: Permission): Promise<OwnerPrincipal> {
  const p = await requireOwner(ctx);
  if (p.userType === 'ADMIN') return p;
  if (p.userType === 'STAFF' && permission && hasPermission(p, permission)) return p;
  throw forbidden();
}

/**
 * Anyone allowed to manage the given restaurant: admins / staff with "Stores",
 * the owning vendor, the restaurant itself (dashboard or store app).
 */
export async function requireRestaurantAccess(ctx: GraphQLContext, restaurantId: string | null | undefined): Promise<void> {
  if (!restaurantId || !Types.ObjectId.isValid(String(restaurantId))) throw badInput('A valid restaurant id is required.');
  const id = String(restaurantId);
  const claims = requireClaims(ctx);
  if (claims.typ === 'restaurant') {
    const store = await requireStore(ctx);
    if (String(store._id) === id) return;
    throw forbidden();
  }
  const p = await requireOwner(ctx);
  if (hasPermission(p, 'Stores')) {
    if (!(await Restaurant.exists({ _id: id }))) throw notFound('Restaurant');
    return;
  }
  if (p.restaurantIds.includes(id)) return;
  throw forbidden();
}

/** Restaurant ids visible to a dashboard principal (undefined = all). */
export function scopedRestaurantIds(p: OwnerPrincipal): string[] | undefined {
  if (p.userType === 'ADMIN' || p.userType === 'STAFF') return undefined;
  return p.restaurantIds;
}
