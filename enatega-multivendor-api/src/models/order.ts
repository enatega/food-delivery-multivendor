import { model, Schema, type InferSchemaType, type HydratedDocument } from 'mongoose';
import { baseOptions, ObjectId, PointSchema } from './common.js';

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  ASSIGNED: 'ASSIGNED',
  PICKED: 'PICKED',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  CANCELLEDBYREST: 'CANCELLEDBYREST',
} as const;
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export const FINAL_STATUSES: OrderStatus[] = ['DELIVERED', 'COMPLETED', 'CANCELLED', 'CANCELLEDBYREST'];
export const ACTIVE_STATUSES: OrderStatus[] = ['PENDING', 'ACCEPTED', 'ASSIGNED', 'PICKED'];

const ItemOptionSchema = new Schema({ title: String, description: String, price: { type: Number, default: 0 } });
const ItemAddonSchema = new Schema({
  title: String,
  description: String,
  quantityMinimum: Number,
  quantityMaximum: Number,
  options: [ItemOptionSchema],
});
const ItemVariationSchema = new Schema({ title: String, price: Number, discounted: Number, image: String }, { timestamps: true });

const ItemSchema = new Schema(
  {
    food: { type: ObjectId, ref: 'Food' },
    category: { type: ObjectId, ref: 'Category' },
    title: String,
    description: String,
    image: String,
    quantity: { type: Number, required: true, min: 1 },
    specialInstructions: String,
    variation: ItemVariationSchema,
    addons: [ItemAddonSchema],
    /** Unit price (variation + options) at order time. */
    unitPrice: Number,
    dealDiscount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const LatLngSchema = new Schema({ latitude: Number, longitude: Number }, { _id: false });
const EtaSchema = new Schema(
  {
    phase: String,
    source: String,
    readyAt: Date,
    estimatedArrivalAt: Date,
    baseArrivalAt: Date,
    windowStartAt: Date,
    windowEndAt: Date,
    calculatedAt: Date,
    lastLocationAt: Date,
    durationSeconds: Number,
    distanceMeters: Number,
    encodedPolyline: String,
    version: { type: Number, default: 0 },
    origin: LatLngSchema,
    destination: LatLngSchema,
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    restaurant: { type: ObjectId, ref: 'Restaurant', required: true, index: true },
    user: { type: ObjectId, ref: 'User', required: true, index: true },
    rider: { type: ObjectId, ref: 'Rider', index: true },
    zone: { type: ObjectId, ref: 'Zone', index: true },
    review: { type: ObjectId, ref: 'Review' },
    items: { type: [ItemSchema], default: [] },
    deliveryAddress: {
      label: String,
      deliveryAddress: String,
      details: String,
      location: PointSchema,
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: 'PENDING', index: true },
    paymentIntentId: String,
    orderStatus: { type: String, default: ORDER_STATUS.PENDING, index: true },
    orderState: String,
    reason: String,
    isActive: { type: Boolean, default: true },
    isPickedUp: { type: Boolean, default: false },
    isPriority: { type: Boolean, default: false },
    /** Subtotal of items after item-level deals. */
    itemsSubTotal: { type: Number, default: 0 },
    orderAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    deliveryCharges: { type: Number, default: 0 },
    originalDeliveryCharges: { type: Number, default: 0 },
    tipping: { type: Number, default: 0 },
    taxationAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    couponCode: String,
    couponDiscount: { type: Number, default: 0 },
    creditsApplied: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    minimumOrderFee: { type: Number, default: 0 },
    priorityDeliveryFees: { type: Number, default: 0 },
    freeDeliveryApplied: { type: Boolean, default: false },
    commissionRate: { type: Number, default: 0 },
    instructions: String,
    orderDate: { type: Date, default: Date.now },
    isScheduled: { type: Boolean, default: false },
    expectedTime: Date,
    preparationTime: Date,
    selectedPrepTime: Number,
    completionTime: Date,
    acceptedAt: Date,
    assignedAt: Date,
    pickedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    isRinged: { type: Boolean, default: true },
    isRiderRinged: { type: Boolean, default: true },
    eta: EtaSchema,
    idempotencyKey: String,
    settled: { type: Boolean, default: false },
  },
  baseOptions,
);

OrderSchema.index({ restaurant: 1, createdAt: -1 });
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ rider: 1, orderStatus: 1 });
OrderSchema.index({ zone: 1, orderStatus: 1 });
OrderSchema.index({ orderStatus: 1, createdAt: -1 });
OrderSchema.index({ user: 1, idempotencyKey: 1 }, { unique: true, partialFilterExpression: { idempotencyKey: { $type: 'string' } } });

export type OrderAttrs = InferSchemaType<typeof OrderSchema>;
export type OrderDoc = HydratedDocument<OrderAttrs>;
export const Order = model('Order', OrderSchema);

export const ChatMessage = model(
  'ChatMessage',
  new Schema(
    {
      order: { type: ObjectId, ref: 'Order', required: true, index: true },
      message: { type: String, maxlength: 2000 },
      image: String,
      senderType: { type: String, enum: ['customer', 'rider'], required: true },
      user: { id: String, name: String },
    },
    baseOptions,
  ),
);

export const LiveActivitySession = model(
  'LiveActivitySession',
  new Schema(
    {
      order: { type: ObjectId, ref: 'Order', required: true, index: true },
      user: { type: ObjectId, ref: 'User' },
      activityId: { type: String, required: true },
      platform: String,
      pushToken: String,
      schemaVersion: Number,
      language: String,
    },
    baseOptions,
  ).index({ order: 1, activityId: 1 }, { unique: true }),
);
