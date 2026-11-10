import { model, Schema, type InferSchemaType, type HydratedDocument } from 'mongoose';
import { baseOptions, ObjectId } from './common.js';

const AppVersionSchema = new Schema({ android: String, ios: String }, { _id: false });

const ConfigurationSchema = new Schema(
  {
    singleton: { type: String, default: 'config', unique: true },
    email: String,
    emailName: String,
    password: String, // encrypted SMTP password
    enableEmail: { type: Boolean, default: false },
    formEmail: String,
    sendGridEnabled: { type: Boolean, default: false },
    sendGridApiKey: String, // encrypted
    sendGridEmail: String,
    sendGridEmailName: String,
    sendGridPassword: String, // encrypted (legacy)
    clientId: String,
    clientSecret: String, // encrypted
    sandbox: { type: Boolean, default: true },
    publishableKey: String,
    secretKey: String, // encrypted
    currency: { type: String, default: 'USD' },
    currencySymbol: { type: String, default: '$' },
    deliveryRate: { type: Number, default: 0 },
    costType: { type: String, default: 'perKM' },
    twilioAccountSid: String,
    twilioAuthToken: String, // encrypted
    twilioPhoneNumber: String,
    twilioWhatsAppNumber: String,
    twilioEnabled: { type: Boolean, default: false },
    skipWhatsAppOTP: { type: Boolean, default: true },
    skipEmailVerification: { type: Boolean, default: false },
    skipMobileVerification: { type: Boolean, default: false },
    testOtp: String,
    dashboardSentryUrl: String,
    webSentryUrl: String,
    apiSentryUrl: String,
    customerAppSentryUrl: String,
    restaurantAppSentryUrl: String,
    riderAppSentryUrl: String,
    googleApiKey: String,
    googleMapsApiKey: String,
    googleMapLibraries: String,
    googleColor: String,
    webClientID: String,
    androidClientID: String,
    iOSClientID: String,
    expoClientID: String,
    cloudinaryUploadUrl: String,
    cloudinaryApiKey: String,
    webAmplitudeApiKey: String,
    appAmplitudeApiKey: String,
    firebaseKey: String,
    authDomain: String,
    projectId: String,
    storageBucket: String,
    msgSenderId: String,
    appId: String,
    measurementId: String,
    vapidKey: String,
    termsAndConditions: String,
    privacyPolicy: String,
    enableCustomerDemoMode: { type: Boolean, default: false },
    customerDemoZoneId: String,
    isPaidVersion: { type: Boolean, default: true },
    isMultiVendor: { type: Boolean, default: true },
    isAppLaunched: { type: Boolean, default: true },
    customerAppVersion: AppVersionSchema,
    riderAppVersion: AppVersionSchema,
    restaurantAppVersion: AppVersionSchema,
    // single-vendor pricing rules
    serviceFee: { type: Number, default: 0 },
    minimumOrderFee: { type: Number, default: 0 },
    maximumOrderAmount: { type: Number, default: 0 },
    priorityDeliveryFee: { type: Number, default: 0 },
    referralCredit: { type: Number, default: 0 },
  },
  baseOptions,
);
export type ConfigurationAttrs = InferSchemaType<typeof ConfigurationSchema>;
export type ConfigurationDoc = HydratedDocument<ConfigurationAttrs>;
export const Configuration = model('Configuration', ConfigurationSchema);

export const Notification = model(
  'Notification',
  new Schema(
    {
      title: String,
      body: { type: String, required: true },
      /** CUSTOMER | RIDER | RESTAURANT | ALL */
      recipientType: { type: String, default: 'CUSTOMER' },
      sentBy: { type: ObjectId, ref: 'Owner' },
      recipients: Number,
    },
    baseOptions,
  ),
);

/** In-app notifications for dashboard users (bell icon). */
export const WebNotification = model(
  'WebNotification',
  new Schema(
    {
      owner: { type: ObjectId, ref: 'Owner', index: true },
      /** When set, visible to all admins. */
      audience: { type: String, enum: ['ADMIN', 'OWNER'], default: 'ADMIN' },
      body: String,
      navigateTo: String,
      read: { type: Boolean, default: false },
    },
    baseOptions,
  ),
);

/** Push notifications delivered to a customer (shown in the app's notification centre). */
export const UserNotification = model(
  'UserNotification',
  new Schema(
    {
      user: { type: ObjectId, ref: 'User', index: true },
      title: String,
      body: String,
      creator: String,
    },
    baseOptions,
  ).index({ user: 1, createdAt: -1 }),
);

export const SupportTicket = model(
  'SupportTicket',
  new Schema(
    {
      user: { type: ObjectId, ref: 'User', index: true },
      userType: { type: String, default: 'customer' },
      title: { type: String, required: true },
      description: String,
      /** open | inProgress | closed */
      status: { type: String, default: 'open', index: true },
      category: String,
      orderId: String,
      otherDetails: String,
    },
    baseOptions,
  ),
);

export const TicketMessage = model(
  'TicketMessage',
  new Schema(
    {
      ticket: { type: ObjectId, ref: 'SupportTicket', required: true, index: true },
      content: { type: String, required: true, maxlength: 5000 },
      /** user | admin */
      senderType: { type: String, required: true },
      sender: { type: ObjectId },
      isRead: { type: Boolean, default: false },
    },
    baseOptions,
  ),
);

export const AuditLog = model(
  'AuditLog',
  new Schema(
    {
      admin: { type: ObjectId, ref: 'Owner', index: true },
      action: String,
      targetType: String,
      targetId: String,
      changes: Schema.Types.Mixed,
      timestamp: { type: Date, default: Date.now, index: true },
    },
    { timestamps: false },
  ),
);

export const Activity = model(
  'Activity',
  new Schema(
    {
      user: { type: ObjectId, ref: 'User' },
      groupId: String,
      module: String,
      screenPath: String,
      type: String,
      details: String,
      createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 },
    },
    { timestamps: false },
  ),
);

export const Counter = model(
  'Counter',
  new Schema({ _id: { type: String, required: true }, seq: { type: Number, default: 0 } }, { versionKey: false }),
);

export async function nextSequence(name: string): Promise<number> {
  const c = await Counter.findOneAndUpdate({ _id: name }, { $inc: { seq: 1 } }, { new: true, upsert: true });
  return c!.seq;
}
