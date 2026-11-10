import { model, Schema, type InferSchemaType, type HydratedDocument } from 'mongoose';
import { AddressSchema, baseOptions, ObjectId } from './common.js';

const UserSchema = new Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    password: { type: String, select: false },
    phoneIsVerified: { type: Boolean, default: false },
    emailIsVerified: { type: Boolean, default: false },
    notificationToken: String,
    webNotificationToken: String,
    isActive: { type: Boolean, default: true },
    isOrderNotification: { type: Boolean, default: true },
    isOfferNotification: { type: Boolean, default: true },
    addresses: [AddressSchema],
    /** Favourite restaurants (ids). */
    favourite: [String],
    /** Favourite foods (single-vendor). */
    favouriteFoods: [{ type: ObjectId, ref: 'Food' }],
    /** Registration method: default | google | apple | facebook. */
    userType: { type: String, default: 'default' },
    /** Account status managed by admins: active | blocked | deactivated. */
    status: { type: String, default: 'active' },
    statusReason: String,
    appleId: { type: String, index: true, sparse: true },
    googleId: { type: String, index: true, sparse: true },
    picture: String,
    lastLogin: Date,
    notes: String,
    tokenVersion: { type: Number, default: 0 },
    // single-vendor features
    referralCode: { type: String, index: { unique: true, sparse: true } },
    referredBy: { type: ObjectId, ref: 'User' },
    credits: { type: Number, default: 0 },
    freeDeliveries: { type: Number, default: 0 },
    stripeCustomerId: String,
    stripe_plan_id: String,
    subscription: {
      planId: { type: ObjectId, ref: 'SubscriptionPlan' },
      stripeSubscriptionId: String,
      status: String,
      currentPeriodEnd: Date,
      discountPercent: Number,
    },
    deletedAt: Date,
  },
  baseOptions,
);

UserSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { email: { $type: 'string' } } });
UserSchema.index({ phone: 1 }, { unique: true, partialFilterExpression: { phone: { $type: 'string' } } });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ name: 'text', email: 'text', phone: 'text' });

export type UserAttrs = InferSchemaType<typeof UserSchema>;
export type UserDoc = HydratedDocument<UserAttrs>;
export const User = model('User', UserSchema);
