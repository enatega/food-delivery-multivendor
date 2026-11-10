import { model, Schema, type InferSchemaType, type HydratedDocument } from 'mongoose';
import {
  baseOptions,
  BussinessDetailsSchema,
  defaultOpeningTimes,
  ObjectId,
  OpeningTimesSchema,
  PointSchema,
  PolygonSchema,
  ScheduleTimingSchema,
} from './common.js';

const RestaurantSchema = new Schema(
  {
    unique_restaurant_id: { type: String, index: true },
    owner: { type: ObjectId, ref: 'Owner', index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true },
    image: String,
    logo: String,
    phone: String,
    address: String,
    city: String,
    postCode: String,
    /** Store-app and dashboard login. */
    username: { type: String, trim: true, lowercase: true },
    password: { type: String, select: false },
    orderPrefix: { type: String, trim: true },
    /** Sequence used to generate human readable order ids (`<prefix>-<n>`). */
    orderId: { type: Number, default: 0 },
    location: PointSchema,
    deliveryBounds: PolygonSchema,
    boundType: { type: String, enum: ['polygon', 'radius', 'point', 'circle'], default: 'polygon' },
    circleBounds: { radius: Number },
    deliveryInfo: {
      minDeliveryFee: Number,
      deliveryDistance: Number,
      deliveryFee: Number,
    },
    deliveryOptions: {
      delivery: { type: Boolean, default: true },
      pickup: { type: Boolean, default: true },
    },
    deliveryTime: { type: Number, default: 30 },
    minimumOrder: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    shopType: { type: String, default: 'restaurant' },
    cuisines: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    keywords: { type: [String], default: [] },
    openingTimes: { type: [OpeningTimesSchema], default: defaultOpeningTimes },
    scheduleTimings: [ScheduleTimingSchema],
    zone: { type: ObjectId, ref: 'Zone', index: true },
    reviewCount: { type: Number, default: 0 },
    reviewAverage: { type: Number, default: 0 },
    bussinessDetails: BussinessDetailsSchema,
    stripeAccountId: String,
    stripeDetailsSubmitted: { type: Boolean, default: false },
    currentWalletAmount: { type: Number, default: 0 },
    totalWalletAmount: { type: Number, default: 0 },
    withdrawnWalletAmount: { type: Number, default: 0 },
    notificationToken: String,
    enableNotification: { type: Boolean, default: true },
    pushToken: String,
    freeDelivery: { type: Boolean, default: false },
    acceptVouchers: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, index: true },
    clonedFrom: { type: ObjectId, ref: 'Restaurant' },
    /** Orders placed (denormalised counter for "most ordered" discovery). */
    orderCount: { type: Number, default: 0 },
  },
  baseOptions,
);

RestaurantSchema.index({ location: '2dsphere' });
RestaurantSchema.index({ slug: 1 }, { unique: true, partialFilterExpression: { slug: { $type: 'string' } } });
RestaurantSchema.index({ username: 1 }, { unique: true, partialFilterExpression: { username: { $type: 'string' } } });
RestaurantSchema.index({ isActive: 1, isDeleted: 1, shopType: 1 });
RestaurantSchema.index({ name: 'text', address: 'text', keywords: 'text' });

export type RestaurantAttrs = InferSchemaType<typeof RestaurantSchema>;
export type RestaurantDoc = HydratedDocument<RestaurantAttrs>;
export const Restaurant = model('Restaurant', RestaurantSchema);
