import { model, Schema } from 'mongoose';
import { baseOptions, ObjectId } from './common.js';

export const Cuisine = model(
  'Cuisine',
  new Schema(
    {
      name: { type: String, required: true, trim: true, unique: true },
      description: String,
      image: String,
      shopType: { type: String, default: 'restaurant' },
      isActive: { type: Boolean, default: true },
    },
    baseOptions,
  ),
);

export const ShopType = model(
  'ShopType',
  new Schema(
    {
      name: { type: String, required: true, trim: true },
      slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
      image: String,
      isActive: { type: Boolean, default: true },
      isDeleted: { type: Boolean, default: false },
    },
    baseOptions,
  ),
);

export const Banner = model(
  'Banner',
  new Schema(
    {
      title: String,
      description: String,
      action: String,
      screen: String,
      file: String,
      parameters: String,
      buttonText: String,
      slug: String,
      shopType: String,
      isActive: { type: Boolean, default: true },
      order: { type: Number, default: 0 },
    },
    baseOptions,
  ),
);

/** Single-vendor promotional banners linked to a food item. */
export const BannerRestaurant = model(
  'BannerRestaurant',
  new Schema(
    {
      restaurant: { type: ObjectId, ref: 'Restaurant', index: true },
      title: String,
      description: String,
      file: String,
      foodId: String,
      displayImage: String,
      isActive: { type: Boolean, default: true },
    },
    baseOptions,
  ),
);

const CouponSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, uppercase: true },
    discount: { type: Number, required: true, min: 0, max: 100 },
    enabled: { type: Boolean, default: true },
    /** percentage | flat */
    couponType: { type: String, default: 'percentage' },
    lifeTimeActive: { type: Boolean, default: false },
    startDate: Date,
    endDate: Date,
    /** null = platform coupon, otherwise restaurant specific. */
    restaurant: { type: ObjectId, ref: 'Restaurant', default: null, index: true },
    maxUsesPerUser: { type: Number, default: 0 },
  },
  baseOptions,
);
CouponSchema.index({ title: 1, restaurant: 1 }, { unique: true });
export const Coupon = model('Coupon', CouponSchema);

export const Taxation = model(
  'Taxation',
  new Schema({ taxationCharges: { type: Number, default: 0 }, enabled: { type: Boolean, default: true } }, baseOptions),
);

export const Tipping = model(
  'Tipping',
  new Schema({ tipVariations: { type: [Number], default: [5, 10, 15] }, enabled: { type: Boolean, default: true } }, baseOptions),
);

export const Review = model(
  'Review',
  new Schema(
    {
      order: { type: ObjectId, ref: 'Order', required: true, unique: true },
      restaurant: { type: ObjectId, ref: 'Restaurant', required: true, index: true },
      user: { type: ObjectId, ref: 'User', index: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      description: String,
      comments: String,
      isActive: { type: Boolean, default: true },
    },
    baseOptions,
  ),
);

export const Zone = model(
  'Zone',
  new Schema(
    {
      title: { type: String, required: true, trim: true },
      description: String,
      location: {
        type: { type: String, enum: ['Polygon'], default: 'Polygon' },
        coordinates: { type: [[[Number]]], required: true },
      },
      tax: { type: Number, default: 0 },
      isActive: { type: Boolean, default: true },
    },
    baseOptions,
  ).index({ location: '2dsphere' }),
);

export const Country = model(
  'Country',
  new Schema(
    {
      name: { type: String, required: true },
      iso: { type: String, uppercase: true, index: true },
      flag: String,
      cities: [{ name: String, latitude: Number, longitude: Number }],
    },
    baseOptions,
  ),
);
