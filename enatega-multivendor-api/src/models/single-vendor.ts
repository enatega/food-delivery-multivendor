import { model, Schema } from 'mongoose';
import { baseOptions, ObjectId } from './common.js';

const CartItemSchema = new Schema({
  food: { type: ObjectId, ref: 'Food', required: true },
  category: { type: ObjectId, ref: 'Category' },
  variation: { type: ObjectId, required: true },
  quantity: { type: Number, required: true, min: 1, max: 999 },
  addons: [{ _id: false, addon: String, options: [String] }],
  specialInstructions: String,
});

export const Cart = model(
  'Cart',
  new Schema(
    {
      user: { type: ObjectId, ref: 'User', required: true, unique: true },
      restaurant: { type: ObjectId, ref: 'Restaurant' },
      items: { type: [CartItemSchema], default: [] },
      revision: { type: Number, default: 0 },
    },
    baseOptions,
  ),
);

export const FoodDeal = model(
  'FoodDeal',
  new Schema(
    {
      restaurant: { type: ObjectId, ref: 'Restaurant', required: true, index: true },
      food: { type: ObjectId, ref: 'Food', required: true, index: true },
      variation: { type: ObjectId },
      title: { type: String, required: true },
      /** PERCENTAGE | FIXED */
      discountType: { type: String, enum: ['PERCENTAGE', 'FIXED'], default: 'PERCENTAGE' },
      discountValue: { type: Number, required: true, min: 0 },
      /** limitedTime | weekly | newOffers */
      section: { type: String, default: 'limitedTime', index: true },
      startDate: Date,
      endDate: Date,
      isActive: { type: Boolean, default: true },
    },
    baseOptions,
  ),
);

export const SubscriptionPlan = model(
  'SubscriptionPlan',
  new Schema(
    {
      productId: String,
      productName: { type: String, required: true },
      stripePriceId: String,
      amount: { type: Number, required: true },
      interval: { type: String, enum: ['day', 'week', 'month', 'year'], default: 'month' },
      intervalCount: { type: Number, default: 1 },
      discountPercent: { type: Number, default: 0 },
      freeDeliveries: { type: Number, default: 0 },
      isActive: { type: Boolean, default: true },
    },
    baseOptions,
  ),
);

export const Feedback = model(
  'Feedback',
  new Schema(
    {
      user: { type: ObjectId, ref: 'User' },
      order: { type: ObjectId, ref: 'Order' },
      rating: Number,
      message: String,
      category: String,
    },
    baseOptions,
  ),
);
