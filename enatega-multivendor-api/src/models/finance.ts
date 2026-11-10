import { model, Schema, type InferSchemaType, type HydratedDocument } from 'mongoose';
import { baseOptions, BussinessDetailsSchema, ObjectId } from './common.js';

export const WithdrawRequest = model(
  'WithdrawRequest',
  new Schema(
    {
      requestId: { type: String, required: true, unique: true },
      requestAmount: { type: Number, required: true, min: 0 },
      requestTime: { type: Date, default: Date.now },
      /** REQUESTED | TRANSFERRED | CANCELLED */
      status: { type: String, default: 'REQUESTED', index: true },
      userType: { type: String, enum: ['RIDER', 'STORE'], required: true },
      rider: { type: ObjectId, ref: 'Rider', index: true },
      store: { type: ObjectId, ref: 'Restaurant', index: true },
    },
    baseOptions,
  ),
);

export const Transaction = model(
  'Transaction',
  new Schema(
    {
      transactionId: { type: String, required: true, unique: true },
      amountCurrency: String,
      amountTransferred: Number,
      status: String,
      userType: { type: String, enum: ['RIDER', 'STORE'] },
      userId: String,
      toBank: BussinessDetailsSchema,
      rider: { type: ObjectId, ref: 'Rider', index: true },
      store: { type: ObjectId, ref: 'Restaurant', index: true },
      withdrawRequest: { type: ObjectId, ref: 'WithdrawRequest' },
    },
    baseOptions,
  ),
);

const EarningSchema = new Schema(
  {
    order: { type: ObjectId, ref: 'Order', unique: true },
    orderId: { type: String, index: true },
    /** DELIVERY | PICKUP */
    orderType: String,
    paymentMethod: String,
    platformEarnings: {
      marketplaceCommission: { type: Number, default: 0 },
      deliveryCommission: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 },
      totalEarnings: { type: Number, default: 0 },
    },
    riderEarnings: {
      riderId: { type: ObjectId, ref: 'Rider', index: true },
      deliveryFee: { type: Number, default: 0 },
      tip: { type: Number, default: 0 },
      totalEarnings: { type: Number, default: 0 },
    },
    storeEarnings: {
      storeId: { type: ObjectId, ref: 'Restaurant', index: true },
      orderAmount: { type: Number, default: 0 },
      totalEarnings: { type: Number, default: 0 },
    },
    orderTotal: Number,
    deliveredAt: Date,
  },
  baseOptions,
);
EarningSchema.index({ createdAt: -1 });
export type EarningDoc = HydratedDocument<InferSchemaType<typeof EarningSchema>>;
export const Earning = model('Earning', EarningSchema);

export const CreditRecord = model(
  'CreditRecord',
  new Schema(
    {
      user: { type: ObjectId, ref: 'User', required: true, index: true },
      amount: { type: Number, required: true },
      orderId: String,
      /** credit | debit */
      recordType: { type: String, enum: ['credit', 'debit'], required: true },
      createdBy: { type: ObjectId, ref: 'Owner' },
    },
    baseOptions,
  ),
);
