import { model, Schema, type InferSchemaType, type HydratedDocument } from 'mongoose';
import { baseOptions, BussinessDetailsSchema, ObjectId, PointSchema } from './common.js';

const RiderSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, select: false },
    email: { type: String, trim: true, lowercase: true },
    phone: String,
    image: String,
    available: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    vehicleType: { type: String, default: 'bike' },
    zone: { type: ObjectId, ref: 'Zone', index: true },
    location: PointSchema,
    lastLocation: { accuracy: Number, heading: Number, speed: Number, recordedAt: Date },
    accountNumber: String,
    bussinessDetails: BussinessDetailsSchema,
    licenseDetails: { number: String, expiryDate: String, image: String },
    vehicleDetails: { number: String, image: String },
    currentWalletAmount: { type: Number, default: 0 },
    totalWalletAmount: { type: Number, default: 0 },
    withdrawnWalletAmount: { type: Number, default: 0 },
    timeZone: { type: String, default: 'UTC' },
    workSchedule: [
      {
        _id: false,
        day: String,
        enabled: { type: Boolean, default: true },
        slots: [{ _id: false, startTime: String, endTime: String }],
      },
    ],
    notificationToken: String,
    tokenVersion: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  baseOptions,
);
RiderSchema.index({ location: '2dsphere' });

export type RiderAttrs = InferSchemaType<typeof RiderSchema>;
export type RiderDoc = HydratedDocument<RiderAttrs>;
export const Rider = model('Rider', RiderSchema);
