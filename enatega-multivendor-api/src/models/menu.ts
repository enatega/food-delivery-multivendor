import { model, Schema, type InferSchemaType, type HydratedDocument } from 'mongoose';
import { baseOptions, ObjectId } from './common.js';

const CategorySchema = new Schema(
  {
    restaurant: { type: ObjectId, ref: 'Restaurant', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: String,
    image: String,
    icon: String,
    viewType: { type: String, default: 'grid' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  baseOptions,
);
CategorySchema.index({ restaurant: 1, order: 1 });

const SubCategorySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    parentCategoryId: { type: String, required: true, index: true },
  },
  baseOptions,
);

const VariationSchema = new Schema({
  title: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  discounted: { type: Number, min: 0 },
  addons: { type: [String], default: [] },
  isOutOfStock: { type: Boolean, default: false },
});

const FoodSchema = new Schema(
  {
    restaurant: { type: ObjectId, ref: 'Restaurant', required: true, index: true },
    category: { type: ObjectId, ref: 'Category', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: String,
    image: String,
    subCategory: { type: String, index: true },
    isActive: { type: Boolean, default: true },
    isOutOfStock: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    variations: { type: [VariationSchema], default: [] },
    order: { type: Number, default: 0 },
    // single-vendor catalogue attributes
    UOM: String,
    inventory: Number,
    ingredients: String,
    usage: String,
    nutritionDetail: String,
    nutritions: [{ _id: false, name: String, quantity: String }],
    orderQuantity: { min: Number, max: Number },
    orderCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  baseOptions,
);
FoodSchema.index({ restaurant: 1, category: 1, order: 1 });
FoodSchema.index({ title: 'text', description: 'text' });

const AddonSchema = new Schema(
  {
    restaurant: { type: ObjectId, ref: 'Restaurant', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: String,
    options: { type: [String], default: [] },
    quantityMinimum: { type: Number, default: 0 },
    quantityMaximum: { type: Number, default: 1 },
  },
  baseOptions,
);

const OptionSchema = new Schema(
  {
    restaurant: { type: ObjectId, ref: 'Restaurant', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: String,
    price: { type: Number, default: 0, min: 0 },
    isOutOfStock: { type: Boolean, default: false },
  },
  baseOptions,
);

export type CategoryDoc = HydratedDocument<InferSchemaType<typeof CategorySchema>>;
export type FoodAttrs = InferSchemaType<typeof FoodSchema>;
export type FoodDoc = HydratedDocument<FoodAttrs>;
export type AddonDoc = HydratedDocument<InferSchemaType<typeof AddonSchema>>;
export type OptionDoc = HydratedDocument<InferSchemaType<typeof OptionSchema>>;

export const Category = model('Category', CategorySchema);
export const SubCategory = model('SubCategory', SubCategorySchema);
export const Food = model('Food', FoodSchema);
export const Addon = model('Addon', AddonSchema);
export const Option = model('Option', OptionSchema);
