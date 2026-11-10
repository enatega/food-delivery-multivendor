import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { defineModule } from '../graphql/module.js';
import { optBool, optStr } from '../graphql/zod.js';
import { hasPermission, requireAdmin, requireClaims, requireOwner, type OwnerPrincipal } from '../auth/guards.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken, type OwnerType } from '../auth/jwt.js';
import { assertStrongPassword, hashPassword, verifyPassword } from '../auth/password.js';
import { badInput, conflict, forbidden, invalidToken, must } from '../lib/errors.js';
import { pageArgs, pageResult, searchRegex } from '../lib/query.js';
import { shortCode } from '../lib/crypto.js';
import { AuditLog, Owner, Restaurant, Rider, User } from '../models/index.js';
import { audit } from '../services/audit.js';

const StaffInput = z.object({
  _id: optStr(40),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email(),
  password: optStr(128),
  phone: optStr(30),
  isActive: optBool,
  permissions: z.array(z.string().max(60)).max(50).default([]),
});

const VendorInput = z.object({
  _id: optStr(40),
  email: z.string().trim().toLowerCase().email(),
  password: optStr(128),
  name: optStr(120),
  firstName: optStr(60),
  lastName: optStr(60),
  phoneNumber: optStr(30),
  image: optStr(2000),
});

async function ownerAuthPayload(kind: OwnerType, account: { _id: unknown; tokenVersion?: number | null }, extra: Record<string, unknown>) {
  const claims = { sub: String(account._id), typ: 'owner' as const, ut: kind, tv: account.tokenVersion ?? 0 };
  const access = signAccessToken(claims);
  const refresh = signRefreshToken(claims);
  const restaurants =
    kind === 'RESTAURANT'
      ? await Restaurant.find({ _id: account._id }).lean()
      : kind === 'VENDOR'
        ? await Restaurant.find({ owner: account._id as never, isDeleted: { $ne: true } }).lean()
        : [];
  return {
    userId: account._id,
    token: access.token,
    tokenExpiration: access.expiresAt.toISOString(),
    refreshToken: refresh.token,
    refreshTokenExpiration: refresh.expiresAt.toISOString(),
    userType: kind,
    userTypeId: String(account._id),
    restaurants,
    ...extra,
  };
}

async function loadOwnerAccount(kind: OwnerType, id: string) {
  if (kind === 'RESTAURANT') {
    const r = await Restaurant.findById(id);
    if (!r || r.isDeleted) return null;
    return { doc: r, extra: { email: r.username, name: r.name, image: r.image, permissions: [], isActive: r.isActive } };
  }
  const o = await Owner.findById(id);
  if (!o || !o.isActive || o.isDeleted) return null;
  return { doc: o, extra: { email: o.email, name: o.name, image: o.image, permissions: o.permissions, isActive: o.isActive } };
}

const jwtDecodeExp = (token?: string): number | undefined => (token ? (jwt.decode(token) as { exp?: number } | null)?.exp : undefined);

const ownerData = (o: any) => ({ ...o, phoneNumber: o.phoneNumber ?? o.phone });

export const accountsModule = defineModule({
  name: 'accounts',
  inputs: { StaffInput, VendorInput },
  resolvers: {
    Query: {
      ownerSession: async (_p, _a, ctx) => {
        const claims = requireClaims(ctx);
        if (claims.typ !== 'owner') throw forbidden();
        const acc = await loadOwnerAccount(claims.ut!, claims.sub);
        if (!acc || (acc.doc.tokenVersion ?? 0) !== claims.tv) throw invalidToken();
        const payload = await ownerAuthPayload(claims.ut!, acc.doc, acc.extra);
        const exp = (jwtDecodeExp(ctx.auth.token) ?? Date.now() / 1000) * 1000;
        // Session lookups must not rotate credentials: echo the caller's access token, omit the refresh token.
        return { ...payload, token: ctx.auth.token, tokenExpiration: new Date(exp).toISOString(), refreshToken: null, refreshTokenExpiration: null };
      },
      hasOwnerPermission: async (_p, { permission }: { permission: string }, ctx) => {
        const p = await requireOwner(ctx);
        return hasPermission(p, permission as never) || (p.userType === 'VENDOR' && ['Stores', 'Orders'].includes(permission));
      },
      staffs: async (_p, _a, ctx) => {
        await requireAdmin(ctx, 'Staff');
        return Owner.find({ userType: 'STAFF', isDeleted: { $ne: true } }).sort({ createdAt: -1 }).lean();
      },
      staffsPaginated: async (_p, args: { page?: number; limit?: number; search?: string; isActive?: boolean }, ctx) => {
        await requireAdmin(ctx, 'Staff');
        const { page, limit, skip } = pageArgs(args.page, args.limit);
        const filter: Record<string, unknown> = { userType: 'STAFF', isDeleted: { $ne: true } };
        const re = searchRegex(args.search);
        if (re) filter.$or = [{ name: re }, { email: re }, { phone: re }];
        if (typeof args.isActive === 'boolean') filter.isActive = args.isActive;
        const [data, total] = await Promise.all([Owner.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), Owner.countDocuments(filter)]);
        return pageResult(data, total, page, limit);
      },
      vendors: async (_p, _a, ctx) => {
        await requireAdmin(ctx, 'Vendors');
        return (await Owner.find({ userType: 'VENDOR', isDeleted: { $ne: true } }).sort({ createdAt: -1 }).lean()).map(ownerData);
      },
      getVendor: async (_p, { id }: { id: string }, ctx) => {
        const p = await requireOwner(ctx);
        if (!hasPermission(p, 'Vendors') && p.id !== id) throw forbidden();
        return ownerData(must(await Owner.findOne({ _id: id, userType: 'VENDOR' }).lean(), 'Vendor'));
      },
      restaurantByOwner: async (_p, { id }: { id?: string }, ctx) => {
        const p = await requireOwner(ctx);
        const ownerId = id || p.id;
        if (p.userType === 'RESTAURANT') {
          const r = must(await Restaurant.findById(p.id).lean(), 'Restaurant');
          return { _id: r._id, email: r.username, userType: 'RESTAURANT', restaurants: [r] };
        }
        if (!hasPermission(p, 'Vendors') && !hasPermission(p, 'Stores') && p.id !== ownerId) throw forbidden();
        return ownerData(must(await Owner.findById(ownerId).lean(), 'Owner'));
      },
      users: async (_p, _a, ctx) => {
        await requireAdmin(ctx, 'Users');
        return User.find({ deletedAt: { $exists: false } }).sort({ createdAt: -1 }).limit(1000).lean();
      },
      usersPaginated: async (_p, args: { page?: number; limit?: number; search?: string; registrationMethod?: string; status?: string }, ctx) => {
        await requireAdmin(ctx, 'Users');
        const { page, limit, skip } = pageArgs(args.page, args.limit);
        const filter: Record<string, unknown> = { deletedAt: { $exists: false } };
        const re = searchRegex(args.search);
        if (re) filter.$or = [{ name: re }, { email: re }, { phone: re }];
        if (args.registrationMethod && args.registrationMethod !== 'all') filter.userType = args.registrationMethod.toLowerCase();
        if (args.status && args.status !== 'all') filter.status = args.status.toLowerCase();
        const [data, total] = await Promise.all([User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), User.countDocuments(filter)]);
        return pageResult(data, total, page, limit);
      },
      user: async (_p, { id }: { id: string }, ctx) => {
        await requireAdmin(ctx, 'Users');
        return must(await User.findById(id).lean(), 'User');
      },
      getAllUsersDropDownSearch: async (_p, { searchTerm }: { searchTerm?: string }, ctx) => {
        await requireAdmin(ctx, 'Users');
        const re = searchRegex(searchTerm);
        return User.find({ deletedAt: { $exists: false }, ...(re ? { $or: [{ name: re }, { email: re }, { phone: re }] } : {}) })
          .select('_id name email')
          .limit(20)
          .lean();
      },
      auditLogs: async (_p, args: { page?: number; limit?: number }, ctx) => {
        await requireAdmin(ctx);
        const { page, limit, skip } = pageArgs(args.page, args.limit, 20);
        const [logs, total] = await Promise.all([
          AuditLog.find().sort({ timestamp: -1 }).skip(skip).limit(limit).populate('admin', 'email').lean(),
          AuditLog.countDocuments(),
        ]);
        const r = pageResult(logs, total, page, limit);
        return { auditLogs: r.data, totalCount: r.totalCount, currentPage: r.currentPage, totalPages: r.totalPages };
      },
    },
    Mutation: {
      ownerLogin: async (_p, args: { email: string; password: string }) => {
        const login = String(args.email ?? '').trim().toLowerCase();
        if (!login || !args.password) throw badInput('Email and password are required.');
        const owner = await Owner.findOne({ email: login, isDeleted: { $ne: true } }).select('+password');
        if (owner && (await verifyPassword(args.password, owner.password))) {
          if (!owner.isActive) throw forbidden('Your account is disabled.');
          owner.lastLogin = new Date();
          await owner.save();
          return ownerAuthPayload(owner.userType as OwnerType, owner, {
            email: owner.email,
            name: owner.name,
            image: owner.image,
            permissions: owner.permissions,
            isActive: owner.isActive,
          });
        }
        // Store accounts can sign in to the dashboard with their username.
        const store = owner ? null : await Restaurant.findOne({ username: login, isDeleted: { $ne: true } }).select('+password');
        if (store && (await verifyPassword(args.password, store.password))) {
          return ownerAuthPayload('RESTAURANT', store, { email: store.username, name: store.name, image: store.image, permissions: [], isActive: store.isActive });
        }
        if (!owner && !store) await verifyPassword(args.password, null);
        throw badInput('Invalid email or password.');
      },
      ownerLogout: async (_p, _a, ctx) => {
        const claims = requireClaims(ctx);
        if (claims.typ !== 'owner') throw forbidden();
        // Revokes every token of this dashboard account (access + refresh).
        if (claims.ut === 'RESTAURANT') await Restaurant.updateOne({ _id: claims.sub }, { $inc: { tokenVersion: 1 } });
        else await Owner.updateOne({ _id: claims.sub }, { $inc: { tokenVersion: 1 } });
        return true;
      },
      refreshToken: async (_p, args: { refreshToken: string; userType: string }) => {
        const claims = verifyRefreshToken(args.refreshToken);
        if (claims.typ !== 'owner' || !claims.ut) throw invalidToken();
        const acc = await loadOwnerAccount(claims.ut, claims.sub);
        if (!acc || (acc.doc.tokenVersion ?? 0) !== claims.tv) throw invalidToken();
        return ownerAuthPayload(claims.ut, acc.doc, acc.extra);
      },
      restaurantLogin: async (_p, args: { username: string; password: string; notificationToken?: string }) => {
        const username = String(args.username ?? '').trim().toLowerCase();
        const store = await Restaurant.findOne({ username, isDeleted: { $ne: true } }).select('+password');
        if (!store || !(await verifyPassword(args.password ?? '', store.password))) throw badInput('Invalid username or password.');
        if (args.notificationToken) {
          store.notificationToken = args.notificationToken;
          await store.save();
        }
        const { token } = signAccessToken({ sub: String(store._id), typ: 'restaurant', tv: store.tokenVersion ?? 0 });
        return { token, restaurantId: store._id };
      },
      riderLogin: async (_p, args: { username?: string; password?: string; notificationToken?: string; timeZone: string }) => {
        const username = String(args.username ?? '').trim().toLowerCase();
        const rider = await Rider.findOne({ username, isDeleted: { $ne: true } }).select('+password');
        if (!rider || !(await verifyPassword(args.password ?? '', rider.password))) throw badInput('Invalid username or password.');
        if (!rider.isActive) throw forbidden('Your rider account is disabled. Please contact support.');
        if (args.notificationToken) rider.notificationToken = args.notificationToken;
        if (args.timeZone) rider.timeZone = args.timeZone;
        await rider.save();
        const { token } = signAccessToken({ sub: String(rider._id), typ: 'rider', tv: rider.tokenVersion ?? 0 });
        return { userId: rider._id, token };
      },

      createStaff: async (_p, { staffInput }: { staffInput: z.infer<typeof StaffInput> }, ctx) => {
        await requireAdmin(ctx, 'Staff');
        if (!staffInput.password) throw badInput('Password is required.');
        assertStrongPassword(staffInput.password, 8);
        if (await Owner.exists({ email: staffInput.email })) throw conflict('An account with this email already exists.');
        const staff = await Owner.create({
          ...staffInput,
          _id: undefined,
          password: await hashPassword(staffInput.password),
          userType: 'STAFF',
          isActive: staffInput.isActive ?? true,
        });
        await audit(ctx, 'CREATE_STAFF', 'Staff', staff._id, { email: staff.email, permissions: staff.permissions });
        return staff;
      },
      editStaff: async (_p, { staffInput }: { staffInput: z.infer<typeof StaffInput> }, ctx) => {
        await requireAdmin(ctx, 'Staff');
        const staff = must(await Owner.findOne({ _id: staffInput._id, userType: 'STAFF' }), 'Staff');
        if (staffInput.email !== staff.email && (await Owner.exists({ email: staffInput.email }))) throw conflict('Email already in use.');
        const permsChanged = JSON.stringify(staff.permissions) !== JSON.stringify(staffInput.permissions);
        staff.set({ name: staffInput.name, email: staffInput.email, phone: staffInput.phone, permissions: staffInput.permissions });
        if (typeof staffInput.isActive === 'boolean') staff.isActive = staffInput.isActive;
        if (staffInput.password) {
          assertStrongPassword(staffInput.password, 8);
          staff.password = await hashPassword(staffInput.password);
        }
        if (staffInput.password || permsChanged || staff.isActive === false) staff.tokenVersion = (staff.tokenVersion ?? 0) + 1;
        await staff.save();
        await audit(ctx, 'EDIT_STAFF', 'Staff', staff._id, { permissions: staff.permissions, isActive: staff.isActive });
        return staff;
      },
      deleteStaff: async (_p, { id }: { id: string }, ctx) => {
        await requireAdmin(ctx, 'Staff');
        const staff = must(await Owner.findOneAndUpdate({ _id: id, userType: 'STAFF' }, { isDeleted: true, isActive: false, $inc: { tokenVersion: 1 } }, { new: true }), 'Staff');
        await audit(ctx, 'DELETE_STAFF', 'Staff', id);
        return staff;
      },

      createVendor: async (_p, { vendorInput }: { vendorInput: z.infer<typeof VendorInput> }, ctx) => {
        await requireAdmin(ctx, 'Vendors');
        if (!vendorInput.password) throw badInput('Password is required.');
        assertStrongPassword(vendorInput.password, 8);
        if (await Owner.exists({ email: vendorInput.email })) throw conflict('An account with this email already exists.');
        const vendor = await Owner.create({
          email: vendorInput.email,
          password: await hashPassword(vendorInput.password),
          name: vendorInput.name ?? [vendorInput.firstName, vendorInput.lastName].filter(Boolean).join(' '),
          firstName: vendorInput.firstName,
          lastName: vendorInput.lastName,
          phone: vendorInput.phoneNumber,
          image: vendorInput.image,
          userType: 'VENDOR',
          unique_id: shortCode(10),
        });
        await audit(ctx, 'CREATE_VENDOR', 'Vendor', vendor._id, { email: vendor.email });
        return ownerData(vendor.toObject());
      },
      editVendor: async (_p, { vendorInput }: { vendorInput: z.infer<typeof VendorInput> }, ctx) => {
        const p: OwnerPrincipal = await requireOwner(ctx);
        if (!hasPermission(p, 'Vendors') && p.id !== vendorInput._id) throw forbidden();
        const vendor = must(await Owner.findOne({ _id: vendorInput._id, userType: 'VENDOR' }), 'Vendor');
        if (vendorInput.email !== vendor.email && (await Owner.exists({ email: vendorInput.email }))) throw conflict('Email already in use.');
        vendor.set({
          email: vendorInput.email,
          firstName: vendorInput.firstName,
          lastName: vendorInput.lastName,
          name: vendorInput.name ?? ([vendorInput.firstName, vendorInput.lastName].filter(Boolean).join(' ') || vendor.name),
          phone: vendorInput.phoneNumber,
          image: vendorInput.image,
        });
        if (vendorInput.password) {
          assertStrongPassword(vendorInput.password, 8);
          vendor.password = await hashPassword(vendorInput.password);
          vendor.tokenVersion = (vendor.tokenVersion ?? 0) + 1;
        }
        await vendor.save();
        await audit(ctx, 'EDIT_VENDOR', 'Vendor', vendor._id);
        return ownerData(vendor.toObject());
      },
      deleteVendor: async (_p, { id }: { id: string }, ctx) => {
        await requireAdmin(ctx, 'Vendors');
        must(await Owner.findOneAndUpdate({ _id: id, userType: 'VENDOR' }, { isDeleted: true, isActive: false, $inc: { tokenVersion: 1 } }), 'Vendor');
        await Restaurant.updateMany({ owner: id }, { isActive: false, isAvailable: false });
        await audit(ctx, 'DELETE_VENDOR', 'Vendor', id);
        return true;
      },

      deleteUser: async (_p, { id }: { id: string }, ctx) => {
        await requireAdmin(ctx, 'Users');
        const user = must(await User.findById(id), 'User');
        user.set({ isActive: false, status: 'deleted', deletedAt: new Date(), notificationToken: undefined, tokenVersion: (user.tokenVersion ?? 0) + 1 });
        await user.save();
        await audit(ctx, 'DELETE_USER', 'User', id);
        return user;
      },
      updateUserNotes: async (_p, { id, notes }: { id: string; notes: string }, ctx) => {
        await requireAdmin(ctx, 'Users');
        const user = must(await User.findByIdAndUpdate(id, { notes: String(notes).slice(0, 5000) }, { new: true }), 'User');
        await audit(ctx, 'UPDATE_USER_NOTES', 'User', id);
        return user;
      },
      updateUserStatus: async (_p, { id, status, reason }: { id: string; status: string; reason?: string }, ctx) => {
        await requireAdmin(ctx, 'Users');
        const s = String(status).toLowerCase();
        if (!['active', 'blocked'].includes(s)) throw badInput('Status must be "active" or "blocked".');
        const update: Record<string, unknown> = { status: s, statusReason: reason };
        if (s === 'blocked') update.$inc = { tokenVersion: 1 };
        const user = must(await User.findByIdAndUpdate(id, update, { new: true }), 'User');
        await audit(ctx, 'UPDATE_USER_STATUS', 'User', id, { status: s, reason });
        return user;
      },
      resetUserSession: async (_p, { userId }: { userId: string }, ctx) => {
        await requireAdmin(ctx, 'Users');
        const user = must(await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } }, { new: true }), 'User');
        await audit(ctx, 'RESET_USER_SESSION', 'User', userId);
        return user;
      },
    },
    OwnerData: {
      restaurants: async (o: { _id: unknown; restaurants?: unknown[] }) =>
        o.restaurants ?? Restaurant.find({ owner: String(o._id), isDeleted: { $ne: true } }).sort({ createdAt: -1 }).lean(),
    },
  },
});
