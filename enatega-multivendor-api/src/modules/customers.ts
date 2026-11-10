import { Types } from 'mongoose';
import { z } from 'zod';
import { defineModule } from '../graphql/module.js';
import { optBool, optStr } from '../graphql/zod.js';
import { requireClaims, requireCustomer } from '../auth/guards.js';
import { signAccessToken, signPurposeToken, verifyPurposeToken } from '../auth/jwt.js';
import { assertStrongPassword, hashPassword, verifyPassword } from '../auth/password.js';
import { badInput, conflict, forbidden, notFound, unauthenticated } from '../lib/errors.js';
import { randomToken, shortCode } from '../lib/crypto.js';
import { User, type UserDoc } from '../models/index.js';
import { point } from '../models/common.js';
import { consumeVerification, sendOtp, verifyOtp, wasRecentlyVerified } from '../services/otp.js';
import { issueAppleNonce, verifyAppleIdToken, verifyGoogleIdToken } from '../services/social-auth.js';
import { getConfig } from '../services/config.js';

const email = z.string().trim().toLowerCase().email().max(254);
const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s()-]/g, ''))
  .refine((v) => /^\+?\d{6,16}$/.test(v), 'invalid phone number');

const CreateUserInput = z.object({
  name: optStr(120),
  email: z.preprocess((v) => (v === '' || v === null ? undefined : v), email.optional()),
  phone: z.preprocess((v) => (v === '' || v === null ? undefined : v), phone.optional()),
  password: optStr(128),
  notificationToken: optStr(400),
  appleId: optStr(200),
  emailIsVerified: optBool,
  isPhoneExists: optBool,
  referralCode: optStr(40),
});

const UpdateUserInput = z.object({
  name: optStr(120),
  phone: z.preprocess((v) => (v === '' || v === null ? undefined : v), phone.optional()),
  phoneIsVerified: optBool,
  emailIsVerified: optBool,
});

/** Shared by createAddress/editAddress and placeOrder; required fields are checked per mutation. */
const AddressInput = z.object({
  _id: optStr(40),
  label: optStr(60),
  deliveryAddress: optStr(500),
  details: optStr(500),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  isDemoDefaultLocation: optBool,
  demoZoneId: optStr(40),
});

function savedAddress(a: z.infer<typeof AddressInput>) {
  if (!a.deliveryAddress) throw badInput('deliveryAddress is required.');
  if (a.latitude === undefined || a.longitude === undefined || (a.latitude === 0 && a.longitude === 0)) throw badInput('Address coordinates are required.');
  return { label: a.label ?? 'Other', deliveryAddress: a.deliveryAddress, details: a.details, location: point(a.longitude, a.latitude) };
}

export function authData(user: UserDoc, isNewUser = false) {
  const { token, expiresAt } = signAccessToken({ sub: String(user._id), typ: 'customer', tv: user.tokenVersion ?? 0 });
  return {
    userId: user._id,
    token,
    tokenExpiration: expiresAt.toISOString(),
    isActive: user.isActive,
    name: user.name,
    email: user.email,
    phone: user.phone,
    picture: user.picture,
    isNewUser,
    phoneIsVerified: user.phoneIsVerified,
    emailIsVerified: user.emailIsVerified,
    addresses: user.addresses,
    userTypeId: String(user._id),
  };
}

async function uniqueReferralCode(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const code = shortCode(8);
    if (!(await User.exists({ referralCode: code }))) return code;
  }
  return shortCode(12);
}

async function applyReferral(user: UserDoc, code?: string) {
  if (!code) return;
  const referrer = await User.findOne({ referralCode: code.toUpperCase() }).select('_id');
  if (!referrer || String(referrer._id) === String(user._id)) return;
  user.referredBy = referrer._id;
  const cfg = await getConfig();
  if (cfg.referralCredit && cfg.referralCredit > 0) {
    user.credits = (user.credits ?? 0) + cfg.referralCredit;
    await User.updateOne({ _id: referrer._id }, { $inc: { credits: cfg.referralCredit } });
  }
}

function assertCanLogin(user: UserDoc) {
  if (user.status === 'blocked') throw forbidden('Your account has been blocked. Please contact support.');
  if (user.deletedAt) throw unauthenticated('Account not found.');
}

async function socialLogin(
  kind: 'google' | 'apple',
  profile: { subject: string; email?: string; emailVerified: boolean; name?: string; picture?: string },
  args: { name?: string | null; notificationToken?: string | null },
) {
  const idField = kind === 'google' ? 'googleId' : 'appleId';
  let user = await User.findOne({ [idField]: profile.subject });
  if (!user && profile.email && profile.emailVerified) user = await User.findOne({ email: profile.email });
  let isNewUser = false;
  if (!user) {
    isNewUser = true;
    user = new User({
      name: args.name?.trim() || profile.name || (profile.email ? profile.email.split('@')[0] : 'Customer'),
      email: profile.email,
      emailIsVerified: profile.emailVerified,
      [idField]: profile.subject,
      picture: profile.picture,
      userType: kind,
      referralCode: await uniqueReferralCode(),
    });
  } else {
    assertCanLogin(user);
    user.set(idField, profile.subject);
    if (profile.emailVerified && !user.emailIsVerified && user.email === profile.email) user.emailIsVerified = true;
    if (!user.name && (args.name || profile.name)) user.name = args.name?.trim() || profile.name;
  }
  user.isActive = true;
  if (args.notificationToken) user.notificationToken = args.notificationToken;
  user.lastLogin = new Date();
  await user.save();
  return authData(user, isNewUser);
}

function findAddress(user: UserDoc, id: string) {
  const a = user.addresses.id(id);
  if (!a) throw notFound('Address');
  return a;
}

export const customersModule = defineModule({
  name: 'customers',
  inputs: { CreateUserInput, UpdateUserInput, AddressInput },
  resolvers: {
    Query: {
      profile: async (_p, _a, ctx) => requireCustomer(ctx),
      appleAuthNonce: async () => {
        const nonce = randomToken(24);
        await issueAppleNonce(nonce);
        return nonce;
      },
    },
    Mutation: {
      login: async (_p, args: { email?: string; password?: string; type: string; appleId?: string; appleNonce?: string; idToken?: string; name?: string; notificationToken?: string }) => {
        const type = (args.type || 'default').toLowerCase();
        if (type === 'google') {
          if (!args.idToken) throw badInput('Google idToken is required.');
          return socialLogin('google', await verifyGoogleIdToken(args.idToken), args);
        }
        if (type === 'apple') {
          if (!args.idToken) throw badInput('Apple identity token is required.');
          const profile = await verifyAppleIdToken(args.idToken, args.appleNonce);
          if (args.appleId && args.appleId !== profile.subject) throw badInput('Apple account mismatch.');
          return socialLogin('apple', profile, args);
        }
        if (type === 'facebook') throw badInput('Facebook sign-in is not supported.');

        const parsedEmail = email.safeParse(args.email ?? '');
        if (!parsedEmail.success || !args.password) throw badInput('Email and password are required.');
        const user = await User.findOne({ email: parsedEmail.data }).select('+password');
        if (!user || !(await verifyPassword(args.password, user.password))) {
          throw badInput('Invalid email or password.', { code: 'BAD_USER_INPUT' });
        }
        assertCanLogin(user);
        user.isActive = true;
        if (args.notificationToken) user.notificationToken = args.notificationToken;
        user.lastLogin = new Date();
        await user.save();
        return authData(user);
      },

      createUser: async (_p, { userInput }: { userInput: z.infer<typeof CreateUserInput> }) => {
        const input = userInput ?? {};
        if (!input.email && !input.phone) throw badInput('Email or phone is required.');
        if (input.email && (await User.exists({ email: input.email }))) throw conflict('An account with this email already exists.');
        if (input.phone && (await User.exists({ phone: input.phone }))) throw conflict('An account with this phone number already exists.');
        const cfg = await getConfig();
        let password: string | undefined;
        if (input.password) {
          assertStrongPassword(input.password);
          password = await hashPassword(input.password);
        } else if (!input.appleId) {
          throw badInput('Password is required.');
        }
        // Verification flags are only trusted when the server verified the code (or verification is disabled).
        const emailVerified =
          Boolean(input.email) && (cfg.skipEmailVerification || (await wasRecentlyVerified('email', input.email!)));
        const phoneVerified =
          Boolean(input.phone) && (cfg.skipMobileVerification || (await wasRecentlyVerified('phone', input.phone!)));
        const user = new User({
          name: input.name ?? (input.email ? input.email.split('@')[0] : 'Customer'),
          email: input.email,
          phone: input.phone,
          password,
          appleId: input.appleId,
          notificationToken: input.notificationToken,
          emailIsVerified: emailVerified,
          phoneIsVerified: phoneVerified,
          userType: input.appleId ? 'apple' : 'default',
          referralCode: await uniqueReferralCode(),
          lastLogin: new Date(),
        });
        await applyReferral(user, input.referralCode);
        await user.save();
        return authData(user, true);
      },

      updateUser: async (_p, { updateUserInput }: { updateUserInput: z.infer<typeof UpdateUserInput> }, ctx) => {
        const user = await requireCustomer(ctx);
        const input = updateUserInput ?? {};
        if (input.name !== undefined) user.name = input.name;
        if (input.phone !== undefined && input.phone !== user.phone) {
          if (await User.exists({ phone: input.phone, _id: { $ne: user._id } })) throw conflict('This phone number is already in use.');
          user.phone = input.phone;
          const cfg = await getConfig();
          user.phoneIsVerified = Boolean(cfg.skipMobileVerification || (await wasRecentlyVerified('phone', input.phone)));
        }
        if (input.phoneIsVerified && user.phone) {
          const cfg = await getConfig();
          if (cfg.skipMobileVerification || (await wasRecentlyVerified('phone', user.phone))) user.phoneIsVerified = true;
        }
        if (input.emailIsVerified && user.email) {
          const cfg = await getConfig();
          if (cfg.skipEmailVerification || (await wasRecentlyVerified('email', user.email))) user.emailIsVerified = true;
        }
        await user.save();
        return user;
      },

      emailExist: async (_p, { email: e }: { email: string }) => {
        const parsed = email.safeParse(e);
        if (!parsed.success) return null;
        return User.findOne({ email: parsed.data, deletedAt: { $exists: false } }).select('_id').lean();
      },
      phoneExist: async (_p, { phone: ph }: { phone: string }) => {
        const parsed = phone.safeParse(ph);
        if (!parsed.success) return null;
        return User.findOne({ phone: parsed.data, deletedAt: { $exists: false } }).select('_id').lean();
      },

      sendOtpToEmail: async (_p, { email: e }: { email: string }) => {
        const parsed = email.safeParse(e);
        if (!parsed.success) throw badInput('Invalid email address.');
        return { result: await sendOtp('email', parsed.data, 'verify') };
      },
      sendOtpToPhoneNumber: async (_p, { phone: ph }: { phone: string }) => {
        const parsed = phone.safeParse(ph);
        if (!parsed.success) throw badInput('Invalid phone number.');
        return { result: await sendOtp('phone', parsed.data, 'verify') };
      },
      verifyOtp: async (_p, args: { otp: string; email?: string; phone?: string }, ctx) => {
        let channel: 'email' | 'phone';
        let target: string;
        if (args.email) {
          channel = 'email';
          target = email.parse(args.email);
        } else if (args.phone) {
          channel = 'phone';
          target = phone.parse(args.phone);
        } else throw badInput('Email or phone is required.');
        const ok = (await verifyOtp(channel, target, args.otp, 'verify')) || (await verifyOtp(channel, target, args.otp, 'reset'));
        if (ok && ctx.auth.claims?.typ === 'customer') {
          const user = await requireCustomer(ctx).catch(() => null);
          if (user) {
            if (channel === 'email' && user.email === target) user.emailIsVerified = true;
            if (channel === 'phone' && user.phone === target) user.phoneIsVerified = true;
            await user.save();
          }
        }
        return { result: ok };
      },

      forgotPassword: async (_p, { email: e }: { email: string }) => {
        const parsed = email.safeParse(e);
        if (parsed.success && (await User.exists({ email: parsed.data }))) {
          await sendOtp('email', parsed.data, 'reset').catch(() => undefined);
        }
        // Always succeed so that the endpoint cannot be used to enumerate accounts.
        return { result: true };
      },

      resetPassword: async (_p, args: { password: string; email: string; otp?: string; token?: string }) => {
        const target = email.parse(args.email);
        let allowed = false;
        if (args.token) {
          allowed = verifyPurposeToken(args.token, 'reset-password') === target;
        } else if (args.otp) {
          allowed = (await verifyOtp('email', target, args.otp, 'reset')) || (await verifyOtp('email', target, args.otp, 'verify'));
        } else {
          // Clients that verify the code in a previous step (verifyOtp) and then call resetPassword.
          allowed = (await wasRecentlyVerified('email', target, 'reset')) || (await wasRecentlyVerified('email', target, 'verify'));
        }
        if (!allowed) throw badInput('Invalid or expired verification code.');
        assertStrongPassword(args.password);
        const user = await User.findOne({ email: target });
        if (!user) throw badInput('Invalid or expired verification code.');
        user.password = await hashPassword(args.password);
        user.tokenVersion = (user.tokenVersion ?? 0) + 1; // revoke existing sessions
        await user.save();
        await consumeVerification('email', target, 'reset');
        await consumeVerification('email', target, 'verify');
        return { result: true };
      },

      changePassword: async (_p, args: { oldPassword: string; newPassword: string }, ctx) => {
        const claims = requireClaims(ctx);
        if (claims.typ !== 'customer') throw forbidden();
        const user = await User.findById(claims.sub).select('+password');
        if (!user || !(await verifyPassword(args.oldPassword, user.password))) throw badInput('Current password is incorrect.');
        assertStrongPassword(args.newPassword);
        user.password = await hashPassword(args.newPassword);
        await user.save();
        return true;
      },

      Deactivate: async (_p, args: { isActive: boolean; email: string }, ctx) => {
        const user = await requireCustomer(ctx);
        if (user.email && args.email && user.email !== args.email.toLowerCase()) throw forbidden();
        user.isActive = Boolean(args.isActive);
        if (!args.isActive) {
          user.notificationToken = undefined;
          user.tokenVersion = (user.tokenVersion ?? 0) + 1;
        }
        await user.save();
        return user;
      },

      pushToken: async (_p, { token }: { token?: string }, ctx) => {
        const user = await requireCustomer(ctx);
        user.notificationToken = token || undefined;
        await user.save();
        return user;
      },
      saveNotificationTokenWeb: async (_p, { token }: { token: string }, ctx) => {
        const user = await requireCustomer(ctx);
        user.webNotificationToken = token;
        await user.save();
        return { success: true, message: 'Notification token saved' };
      },
      updateNotificationStatus: async (_p, args: { offerNotification: boolean; orderNotification: boolean }, ctx) => {
        const user = await requireCustomer(ctx);
        user.isOfferNotification = args.offerNotification;
        user.isOrderNotification = args.orderNotification;
        await user.save();
        return user;
      },

      createAddress: async (_p, { addressInput }: { addressInput: z.infer<typeof AddressInput> }, ctx) => {
        const user = await requireCustomer(ctx);
        if (user.addresses.length >= 50) throw badInput('You can save up to 50 addresses.');
        user.addresses.forEach((a) => (a.selected = false));
        user.addresses.push({ ...savedAddress(addressInput), selected: true });
        await user.save();
        return user;
      },
      editAddress: async (_p, { addressInput }: { addressInput: z.infer<typeof AddressInput> }, ctx) => {
        const user = await requireCustomer(ctx);
        if (!addressInput._id) throw badInput('Address id is required.');
        const a = findAddress(user, addressInput._id);
        a.set({ ...savedAddress(addressInput), label: addressInput.label ?? a.label });
        await user.save();
        return user;
      },
      deleteAddress: async (_p, { id }: { id: string }, ctx) => {
        const user = await requireCustomer(ctx);
        findAddress(user, id).deleteOne();
        if (user.addresses.length && !user.addresses.some((a) => a.selected)) user.addresses[0]!.selected = true;
        await user.save();
        return user;
      },
      deleteBulkAddresses: async (_p, { ids }: { ids: string[] }, ctx) => {
        const user = await requireCustomer(ctx);
        const set = new Set(ids.map(String));
        user.set(
          'addresses',
          user.addresses.filter((a) => !set.has(String(a._id))),
        );
        if (user.addresses.length && !user.addresses.some((a) => a.selected)) user.addresses[0]!.selected = true;
        await user.save();
        return user;
      },
      selectAddress: async (_p, { id }: { id: string }, ctx) => {
        const user = await requireCustomer(ctx);
        findAddress(user, id);
        user.addresses.forEach((a) => (a.selected = String(a._id) === id));
        await user.save();
        return user;
      },
      addFavourite: async (_p, { id }: { id: string }, ctx) => {
        const user = await requireCustomer(ctx);
        if (!Types.ObjectId.isValid(id)) throw badInput('Invalid restaurant id.');
        const fav = new Set(user.favourite ?? []);
        if (fav.has(id)) fav.delete(id);
        else fav.add(id);
        user.favourite = [...fav];
        await user.save();
        return user;
      },
    },
    Address: {
      id: (a: { _id: unknown }) => a._id,
    },
    User: {
      // Never leak secrets even if a document was loaded with them.
      notificationToken: (u: { notificationToken?: string }, _a: unknown, ctx) =>
        ctx.auth.claims?.typ === 'customer' || ctx.auth.claims?.typ === 'owner' ? u.notificationToken : null,
    },
  },
});

/** Issues a short-lived token proving that `email` passed an OTP check (used by password reset UIs). */
export const issueResetToken = (emailAddress: string) => signPurposeToken(emailAddress, 'reset-password');
