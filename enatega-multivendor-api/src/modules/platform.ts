import { z } from 'zod';
import { defineModule } from '../graphql/module.js';
import { looseEnum, optBool, optNum, optStr } from '../graphql/zod.js';
import { optionalCustomer, requireAdmin, requireClaims, requireCustomer, requireOwner, isAdmin } from '../auth/guards.js';
import { signPublicToken } from '../auth/jwt.js';
import { env } from '../config/env.js';
import { encryptSecret, randomToken, sha256 } from '../lib/crypto.js';
import { badInput, forbidden, must, publicTokenInvalid } from '../lib/errors.js';
import { pageArgs, pageResult, searchRegex } from '../lib/query.js';
import {
  Activity,
  Country,
  Notification,
  Restaurant,
  Rider,
  SupportTicket,
  TicketMessage,
  User,
  UserNotification,
  WebNotification,
  Zone,
} from '../models/index.js';
import { kv } from '../lib/kv.js';
import { audit } from '../services/audit.js';
import { getConfig, invalidateConfig } from '../services/config.js';
import { sendPush } from '../services/push.js';
import { uploadImage } from '../services/storage.js';

// ---------------------------------------------------------------------------
// Configuration inputs. Secret fields are encrypted at rest and never returned.
// ---------------------------------------------------------------------------
const cfg = <T extends z.ZodRawShape>(shape: T) => z.object(shape);
const url = optStr(2000);
const secret = optStr(500);

const inputs = {
  EmailConfigurationInput: cfg({ email: optStr(254), emailName: optStr(120), password: secret, enableEmail: optBool }),
  FormEmailConfigurationInput: cfg({ formEmail: optStr(254) }),
  SendGridConfigurationInput: cfg({
    sendGridApiKey: secret,
    sendGridEnabled: optBool,
    sendGridEmail: optStr(254),
    sendGridEmailName: optStr(120),
    sendGridPassword: secret,
  }),
  PaypalConfigurationInput: cfg({ clientId: optStr(300), clientSecret: secret, sandbox: optBool }),
  StripeConfigurationInput: cfg({ publishableKey: optStr(300), secretKey: secret }),
  TwilioConfigurationInput: cfg({
    twilioAccountSid: optStr(100),
    twilioAuthToken: secret,
    twilioPhoneNumber: optStr(30),
    twilioWhatsAppNumber: optStr(30),
    twilioEnabled: optBool,
    skipWhatsAppOTP: optBool,
  }),
  CurrencyConfigurationInput: cfg({ currency: optStr(10), currencySymbol: optStr(10) }),
  DeliveryCostConfigurationInput: cfg({ deliveryRate: optNum, costType: optStr(20) }),
  SentryConfigurationInput: cfg({
    dashboardSentryUrl: url,
    webSentryUrl: url,
    apiSentryUrl: url,
    customerAppSentryUrl: url,
    restaurantAppSentryUrl: url,
    riderAppSentryUrl: url,
  }),
  GoogleApiKeyConfigurationInput: cfg({ googleApiKey: optStr(300), googleMapsApiKey: optStr(300) }),
  GoogleClientIDConfigurationInput: cfg({ webClientID: optStr(300), androidClientID: optStr(300), iOSClientID: optStr(300), expoClientID: optStr(300) }),
  CloudinaryConfigurationInput: cfg({ cloudinaryUploadUrl: url, cloudinaryApiKey: optStr(300) }),
  AmplitudeApiKeyConfigurationInput: cfg({ webAmplitudeApiKey: optStr(300), appAmplitudeApiKey: optStr(300) }),
  FirebaseConfigurationInput: cfg({
    firebaseKey: optStr(300),
    authDomain: optStr(300),
    projectId: optStr(300),
    storageBucket: optStr(300),
    msgSenderId: optStr(300),
    appId: optStr(300),
    measurementId: optStr(300),
    vapidKey: optStr(300),
  }),
  WebConfigurationInput: cfg({ googleMapLibraries: optStr(300), googleColor: optStr(50) }),
  AppConfigurationsInput: cfg({
    termsAndConditions: url,
    privacyPolicy: url,
    testOtp: optStr(12),
    enableCustomerDemoMode: optBool,
    customerDemoZoneId: optStr(40),
  }),
  VerificationConfigurationInput: cfg({ skipEmailVerification: optBool, skipMobileVerification: optBool, skipWhatsAppOTP: optBool }),
  GeneralConfigurationInput: cfg({ isAppLaunched: optBool }),
  VendorTypeConfigurationInput: cfg({ isMultiVendor: optBool }),
  AppTypeInput: cfg({ android: optStr(30), ios: optStr(30) }),
  NotificationRecipientType: looseEnum(['CUSTOMER', 'STORE', 'RIDER', 'ALL'] as const),
  SupportTicketInput: cfg({
    title: z.string().trim().min(1).max(200),
    description: optStr(5000),
    category: optStr(100),
    orderId: optStr(60),
    otherDetails: optStr(2000),
  }),
  MessageInput: cfg({
    ticket: optStr(40),
    ticketId: optStr(40),
    content: z.string().trim().min(1).max(5000),
    senderType: optStr(20),
  }).transform((m) => ({ ...m, ticket: m.ticket ?? m.ticketId ?? '' })),
  UpdateSupportTicketInput: cfg({ ticketId: z.string().trim().min(1), status: looseEnum(['open', 'inProgress', 'closed'] as const) }),
  SingleUserSupportTicketsInput: cfg({
    userId: optStr(40),
    filters: z
      .object({
        page: z.coerce.number().int().min(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).optional(),
        status: optStr(20),
      })
      .optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    status: optStr(20),
  }).transform((i) => ({ userId: i.userId, page: i.filters?.page ?? i.page, limit: i.filters?.limit ?? i.limit, status: i.filters?.status ?? i.status })),
  TicketMessagesInput: cfg({
    ticket: optStr(40),
    ticketId: optStr(40),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(200).optional(),
  }).transform((i) => ({ ...i, ticketId: i.ticket ?? i.ticketId ?? '' })),
  FiltersInput: cfg({
    search: optStr(100),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    userType: optStr(20),
    status: optStr(20),
  }),
};

/** Maps input field -> configuration document field, encrypting secrets. */
const SECRET_FIELDS: Record<string, string> = {
  password: 'password',
  clientSecret: 'clientSecret',
  secretKey: 'secretKey',
  twilioAuthToken: 'twilioAuthToken',
  sendGridApiKey: 'sendGridApiKey',
  sendGridPassword: 'sendGridPassword',
};

function saver(audience: string) {
  return async (_p: unknown, { configurationInput }: { configurationInput: Record<string, unknown> }, ctx: Parameters<typeof requireAdmin>[0]) => {
    await requireAdmin(ctx, 'Configuration');
    const doc = await getConfig();
    const changes: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(configurationInput ?? {})) {
      if (v === undefined) continue;
      if (SECRET_FIELDS[k]) {
        doc.set(SECRET_FIELDS[k]!, encryptSecret(String(v)));
        changes[k] = '[updated]';
      } else {
        doc.set(k, v);
        changes[k] = v;
      }
    }
    await doc.save();
    invalidateConfig();
    await audit(ctx, `SAVE_${audience}_CONFIGURATION`, 'Configuration', doc._id, changes);
    return doc;
  };
}

function configView(doc: any) {
  const o = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  const { password, clientSecret, secretKey, twilioAuthToken, sendGridApiKey, sendGridPassword, ...rest } = o;
  return {
    ...rest,
    hasEmailPasswordConfigured: Boolean(password),
    hasPaypalSecretConfigured: Boolean(clientSecret),
    hasStripeSecretConfigured: Boolean(secretKey),
    hasTwilioSecretConfigured: Boolean(twilioAuthToken),
    hasSendGridSecretConfigured: Boolean(sendGridApiKey || sendGridPassword),
  };
}

/** Fields of `configuration` that are safe for unauthenticated clients. */
const PUBLIC_CONFIG_FIELDS = [
  '_id', 'currency', 'currencySymbol', 'deliveryRate', 'costType', 'twilioEnabled', 'skipWhatsAppOTP', 'skipEmailVerification',
  'skipMobileVerification', 'publishableKey', 'clientId', 'sandbox', 'googleApiKey', 'googleMapsApiKey', 'googleMapLibraries',
  'googleColor', 'webClientID', 'androidClientID', 'iOSClientID', 'expoClientID', 'cloudinaryUploadUrl', 'cloudinaryApiKey',
  'webAmplitudeApiKey', 'appAmplitudeApiKey', 'firebaseKey', 'authDomain', 'projectId', 'storageBucket', 'msgSenderId', 'appId',
  'measurementId', 'vapidKey', 'termsAndConditions', 'privacyPolicy', 'customerAppSentryUrl', 'restaurantAppSentryUrl',
  'riderAppSentryUrl', 'webSentryUrl', 'dashboardSentryUrl', 'enableCustomerDemoMode', 'customerDemoZoneId', 'isPaidVersion',
  'isMultiVendor', 'isAppLaunched', 'restaurantCount', 'enableEmail', 'formEmail',
];

async function ticketAccess(ctx: Parameters<typeof requireClaims>[0], ticketId: string) {
  const ticket = must(await SupportTicket.findById(ticketId), 'Ticket');
  const claims = requireClaims(ctx);
  if (claims.typ === 'customer') {
    const user = await requireCustomer(ctx);
    if (String(ticket.user) !== String(user._id)) throw forbidden();
    return { ticket, senderType: 'user' as const, senderId: user._id };
  }
  const p = await requireOwner(ctx);
  if (!isAdmin(p) && !p.permissions.includes('Users') && !p.permissions.includes('Admin')) throw forbidden();
  return { ticket, senderType: 'admin' as const, senderId: p.id };
}

export const platformModule = defineModule({
  name: 'platform',
  inputs,
  resolvers: {
    Query: {
      configuration: async (_p, _a, ctx) => {
        const doc = configView(await getConfig());
        const claims = ctx.auth.error ? undefined : ctx.auth.claims;
        if (claims?.typ === 'owner') {
          const p = await requireOwner(ctx);
          if (isAdmin(p) || p.permissions.includes('Configuration')) return doc;
        }
        // Everyone else (apps, anonymous) receives only the public subset.
        return Object.fromEntries(PUBLIC_CONFIG_FIELDS.map((k) => [k, doc[k]]));
      },
      adminConfiguration: async (_p, _a, ctx) => {
        await requireAdmin(ctx, 'Configuration');
        const doc = configView(await getConfig());
        doc.restaurantCount = await Restaurant.countDocuments({ isDeleted: { $ne: true } });
        return doc;
      },
      publicConfiguration: async () => configView(await getConfig()),
      getVersions: async () => {
        const c = await getConfig();
        return { customerAppVersion: c.customerAppVersion, riderAppVersion: c.riderAppVersion, restaurantAppVersion: c.restaurantAppVersion };
      },
      notifications: async (_p, _a, ctx) => {
        await requireAdmin(ctx, 'Notification');
        return Notification.find().sort({ createdAt: -1 }).limit(500).lean();
      },
      notificationsPaginated: async (_p, args: { page?: number; limit?: number; search?: string }, ctx) => {
        await requireAdmin(ctx, 'Notification');
        const { page, limit, skip } = pageArgs(args.page, args.limit);
        const re = searchRegex(args.search);
        const filter = re ? { $or: [{ title: re }, { body: re }] } : {};
        const [data, total] = await Promise.all([Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), Notification.countDocuments(filter)]);
        return pageResult(data, total, page, limit);
      },
      webNotifications: async (_p, _a, ctx) => {
        const p = await requireOwner(ctx);
        const filter: Record<string, unknown> = isAdmin(p) || p.userType === 'STAFF' ? { $or: [{ audience: 'ADMIN' }, { owner: p.id }] } : { owner: p.id };
        return WebNotification.find(filter).sort({ createdAt: -1 }).limit(100).lean();
      },
      pastNotificationsByToken: async (_p, args: { skip?: number; limit?: number }, ctx) => {
        const user = await requireCustomer(ctx);
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        return tokenNotifications({ user: user._id, createdAt: { $lt: startOfDay } }, args);
      },
      todayNotificationsByToken: async (_p, args: { skip?: number; limit?: number }, ctx) => {
        const user = await requireCustomer(ctx);
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        return tokenNotifications({ user: user._id, createdAt: { $gte: startOfDay } }, args);
      },

      getSingleSupportTicket: async (_p, { ticketId }: { ticketId: string }, ctx) => (await ticketAccess(ctx, ticketId)).ticket,
      getSingleUserSupportTickets: async (_p, { input }: { input?: z.infer<typeof inputs.SingleUserSupportTicketsInput> }, ctx) => {
        const claims = requireClaims(ctx);
        let userId = input?.userId;
        if (claims.typ === 'customer') userId = String((await requireCustomer(ctx))._id);
        else await requireAdmin(ctx, 'Users');
        if (!userId) throw badInput('userId is required.');
        const { page, limit, skip } = pageArgs(input?.page, input?.limit);
        const filter: Record<string, unknown> = { user: userId };
        if (input?.status) filter.status = input.status;
        const [tickets, docsCount] = await Promise.all([
          SupportTicket.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
          SupportTicket.countDocuments(filter),
        ]);
        return { tickets, docsCount, totalPages: Math.max(Math.ceil(docsCount / limit), 1), currentPage: page };
      },
      getTicketMessages: async (_p, { input }: { input: z.infer<typeof inputs.TicketMessagesInput> }, ctx) => {
        if (!input.ticketId) throw badInput('ticket is required.');
        const { ticket, senderType } = await ticketAccess(ctx, input.ticketId);
        const { page, limit, skip } = pageArgs(input.page, input.limit, 50);
        const [messages, docsCount] = await Promise.all([
          TicketMessage.find({ ticket: ticket._id }).sort({ createdAt: 1 }).skip(skip).limit(limit).lean(),
          TicketMessage.countDocuments({ ticket: ticket._id }),
        ]);
        // Mark messages from the other side as read.
        await TicketMessage.updateMany({ ticket: ticket._id, senderType: { $ne: senderType }, isRead: false }, { isRead: true });
        return { messages, ticket, page, totalPages: Math.max(Math.ceil(docsCount / limit), 1), docsCount };
      },
      getTicketUsers: async (_p, { input }: { input?: z.infer<typeof inputs.FiltersInput> }, ctx) => ticketUsers(ctx, input, false),
      getTicketUsersWithLatest: async (_p, { input }: { input?: z.infer<typeof inputs.FiltersInput> }, ctx) => ticketUsers(ctx, input, true),

      getCountries: async () => Country.find().select('name flag iso').sort({ name: 1 }).lean(),
      getCountryByIso: async (_p, { iso }: { iso: string }) => Country.findOne({ iso: String(iso).toUpperCase() }).lean(),
      getCitiesByCountry: async (_p, { id }: { id?: string }) => (id ? Country.findById(id).lean() : null),
    },
    Mutation: {
      metricsGeneral: async (_p, _a, ctx) => {
        const nonce = ctx.nonce?.trim();
        if (!nonce || nonce.length < 16 || nonce.length > 200) throw publicTokenInvalid('a nonce header (16-200 chars) is required');
        const { token, expiresAt } = signPublicToken(sha256(nonce), env.PUBLIC_TOKEN_TTL_SECONDS);
        const decoy = () => randomToken(18);
        return {
          experience: token,
          hehe: expiresAt.toISOString(),
          excellence: decoy(),
          topgun: decoy(),
          skydiver: decoy(),
          rider: decoy(),
          haha: decoy(),
          huhu: decoy(),
          yoyo: decoy(),
          turu: decoy(),
        };
      },

      saveEmailConfiguration: saver('EMAIL'),
      saveFormEmailConfiguration: saver('FORM_EMAIL'),
      saveSendGridConfiguration: saver('SENDGRID'),
      savePaypalConfiguration: saver('PAYPAL'),
      saveStripeConfiguration: saver('STRIPE'),
      saveTwilioConfiguration: saver('TWILIO'),
      saveCurrencyConfiguration: saver('CURRENCY'),
      saveDeliveryRateConfiguration: saver('DELIVERY_RATE'),
      saveSentryConfiguration: saver('SENTRY'),
      saveGoogleApiKeyConfiguration: saver('GOOGLE_API_KEY'),
      saveGoogleClientIDConfiguration: saver('GOOGLE_CLIENT_ID'),
      saveCloudinaryConfiguration: saver('CLOUDINARY'),
      saveAmplitudeApiKeyConfiguration: saver('AMPLITUDE'),
      saveFirebaseConfiguration: saver('FIREBASE'),
      saveWebConfiguration: saver('WEB'),
      saveAppConfigurations: saver('APP'),
      saveVerificationsToggle: saver('VERIFICATION'),
      saveGeneralConfiguration: saver('GENERAL'),
      saveVendorTypeToggle: saver('VENDOR_TYPE'),
      setVersions: async (_p, args: Record<string, { android?: string; ios?: string } | undefined>, ctx) => {
        await requireAdmin(ctx, 'Configuration');
        const doc = await getConfig();
        for (const k of ['customerAppVersion', 'riderAppVersion', 'restaurantAppVersion']) if (args[k]) doc.set(k, args[k]);
        await doc.save();
        invalidateConfig();
        await audit(ctx, 'SET_APP_VERSIONS', 'Configuration', doc._id, args);
        return 'App versions updated';
      },

      sendNotificationUser: async (_p, args: { notificationTitle?: string; notificationBody: string; recipientType?: string }, ctx) => {
        const p = await requireAdmin(ctx, 'Notification');
        const body = String(args.notificationBody ?? '').trim();
        if (!body) throw badInput('Notification body is required.');
        const title = args.notificationTitle?.trim() || 'Notification';
        const recipientType = args.recipientType ?? 'CUSTOMER';
        let recipients = 0;
        if (recipientType === 'CUSTOMER' || recipientType === 'ALL') {
          const cursor = User.find({ isActive: true, isOfferNotification: { $ne: false }, $or: [{ notificationToken: { $type: 'string' } }, { webNotificationToken: { $type: 'string' } }] })
            .select('_id notificationToken webNotificationToken')
            .lean()
            .cursor();
          let batch: { _id: unknown; notificationToken?: string | null; webNotificationToken?: string | null }[] = [];
          const flush = async () => {
            if (!batch.length) return;
            await sendPush(batch.flatMap((u) => [u.notificationToken, u.webNotificationToken]), { title, body });
            await UserNotification.insertMany(batch.map((u) => ({ user: u._id, title, body, creator: 'admin' })), { ordered: false });
            recipients += batch.length;
            batch = [];
          };
          for await (const u of cursor) {
            batch.push(u as never);
            if (batch.length >= 500) await flush();
          }
          await flush();
        }
        if (recipientType === 'RIDER' || recipientType === 'ALL') {
          const riders = await Rider.find({ isActive: true, notificationToken: { $type: 'string' } }).select('notificationToken').lean();
          await sendPush(riders.map((r) => r.notificationToken), { title, body });
          recipients += riders.length;
        }
        if (recipientType === 'STORE' || recipientType === 'ALL') {
          const stores = await Restaurant.find({ isDeleted: { $ne: true }, notificationToken: { $type: 'string' } }).select('notificationToken').lean();
          await sendPush(stores.map((r) => r.notificationToken), { title, body });
          recipients += stores.length;
        }
        await Notification.create({ title, body, recipientType, sentBy: p.userType === 'RESTAURANT' ? undefined : p.id, recipients });
        await audit(ctx, 'SEND_NOTIFICATION', 'Notification', null, { title, recipientType, recipients });
        return `Notification sent to ${recipients} recipient(s)`;
      },
      markWebNotificationsAsRead: async (_p, _a, ctx) => {
        const p = await requireOwner(ctx);
        const filter: Record<string, unknown> = isAdmin(p) || p.userType === 'STAFF' ? { $or: [{ audience: 'ADMIN' }, { owner: p.id }] } : { owner: p.id };
        await WebNotification.updateMany({ ...filter, read: false }, { read: true });
        return WebNotification.find(filter).sort({ createdAt: -1 }).limit(100).lean();
      },

      createSupportTicket: async (_p, { ticketInput }: { ticketInput: z.infer<typeof inputs.SupportTicketInput> }, ctx) => {
        const user = await requireCustomer(ctx);
        // One active conversation per customer (the apps surface this message and open the existing chat).
        if (await SupportTicket.exists({ user: user._id, status: { $in: ['open', 'inProgress'] } })) {
          throw badInput('You already have an open ticket. Please continue the existing support chat.');
        }
        const ticket = await SupportTicket.create({ ...ticketInput, user: user._id, userType: 'customer' });
        await WebNotification.create({ audience: 'ADMIN', body: `New support ticket: ${ticket.title}`, navigateTo: '/general/customer-support' });
        return ticket;
      },
      createMessage: async (_p, { messageInput }: { messageInput: z.infer<typeof inputs.MessageInput> }, ctx) => {
        if (!messageInput.ticket) throw badInput('ticket is required.');
        const { ticket, senderType, senderId } = await ticketAccess(ctx, messageInput.ticket);
        if (ticket.status === 'closed') throw badInput('This ticket is closed.');
        const msg = await TicketMessage.create({ ticket: ticket._id, content: messageInput.content, senderType, sender: senderId });
        ticket.set({ updatedAt: new Date(), ...(senderType === 'admin' && ticket.status === 'open' ? { status: 'inProgress' } : {}) });
        await ticket.save();
        if (senderType === 'admin') {
          const user = await User.findById(ticket.user).select('notificationToken').lean();
          await sendPush([user?.notificationToken], { title: 'Support replied', body: messageInput.content.slice(0, 120), data: { type: 'support', ticketId: String(ticket._id) } });
        } else {
          await WebNotification.create({ audience: 'ADMIN', body: `New message on ticket: ${ticket.title}`, navigateTo: '/general/customer-support' });
        }
        return msg;
      },
      updateSupportTicketStatus: async (_p, { input }: { input: z.infer<typeof inputs.UpdateSupportTicketInput> }, ctx) => {
        await requireAdmin(ctx, 'Users');
        const ticket = must(await SupportTicket.findByIdAndUpdate(input.ticketId, { status: input.status }, { returnDocument: 'after' }), 'Ticket');
        await audit(ctx, 'UPDATE_TICKET_STATUS', 'SupportTicket', ticket._id, { status: input.status });
        return ticket;
      },

      uploadImageToS3: async (_p, { image }: { image: string; publicMedia?: boolean }, ctx) => {
        const claims = requireClaims(ctx);
        return { imageUrl: await uploadImage(image, `${claims.typ}s`) };
      },
      createActivity: async (_p, args: { groupId: string; module: string; screenPath: string; type: string; details: string }, ctx) => {
        // Analytics events are cheap to send: cap them per client to protect the database.
        if ((await kv.incr(`rl:activity:${ctx.ip}`, 60)) > 120) return false;
        const user = await optionalCustomer(ctx);
        await Activity.create({
          user: user?._id,
          groupId: String(args.groupId).slice(0, 100),
          module: String(args.module).slice(0, 100),
          screenPath: String(args.screenPath).slice(0, 300),
          type: String(args.type).slice(0, 60),
          details: String(args.details).slice(0, 2000),
        });
        return true;
      },
    },
    Configuration: {
      restaurantCount: (c: { restaurantCount?: number }) => c.restaurantCount ?? null,
    },
    SupportTicket: {
      user: (t: { user?: unknown }, _a, ctx) => (t.user ? ctx.loaders.user.load(String(t.user)) : null),
    },
    Country: {
      id: (c: { _id: unknown }) => c._id,
    },
    City: {
      id: (c: { _id: unknown }) => c._id,
    },
  },
});

async function tokenNotifications(filter: Record<string, unknown>, args: { skip?: number; limit?: number }) {
  const skip = Math.max(Number(args.skip) || 0, 0);
  const limit = Math.min(Math.max(Number(args.limit) || 20, 1), 100);
  const [notifications, total] = await Promise.all([
    UserNotification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    UserNotification.countDocuments(filter),
  ]);
  return { notifications, total, skip, limit, hasMore: skip + notifications.length < total };
}

async function ticketUsers(ctx: Parameters<typeof requireAdmin>[0], input: { search?: string; page?: number; limit?: number; status?: string } | undefined, withLatest: boolean) {
  await requireAdmin(ctx, 'Users');
  const { page, limit, skip } = pageArgs(input?.page, input?.limit, 20);
  const ticketFilter: Record<string, unknown> = {};
  if (input?.status) ticketFilter.status = input.status;
  const userIds = await SupportTicket.distinct('user', ticketFilter);
  const re = searchRegex(input?.search);
  const userFilter: Record<string, unknown> = { _id: { $in: userIds } };
  if (re) userFilter.$or = [{ name: re }, { email: re }, { phone: re }];
  const [users, docsCount] = await Promise.all([
    User.find(userFilter).select('name email phone isActive userType').sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(userFilter),
  ]);
  let enriched: unknown[] = users;
  if (withLatest) {
    const latest = await SupportTicket.aggregate([
      { $match: { user: { $in: users.map((u) => u._id) }, ...ticketFilter } },
      { $sort: { updatedAt: -1 } },
      { $group: { _id: '$user', ticket: { $first: '$$ROOT' } } },
    ]);
    const map = new Map(latest.map((l) => [String(l._id), l.ticket]));
    enriched = users
      .map((u) => ({ ...u, latestTicket: map.get(String(u._id)) ?? null }))
      .sort((a, b) => new Date(b.latestTicket?.updatedAt ?? 0).getTime() - new Date(a.latestTicket?.updatedAt ?? 0).getTime());
  }
  void Zone;
  return { users: enriched, docsCount, totalPages: Math.max(Math.ceil(docsCount / limit), 1), currentPage: page };
}
