import { Schema, Types } from 'mongoose';

export const ObjectId = Schema.Types.ObjectId;
export type Id = Types.ObjectId;

export const PointSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: undefined },
  },
  { _id: false },
);

export const PolygonSchema = new Schema(
  {
    type: { type: String, enum: ['Polygon'], default: 'Polygon' },
    coordinates: { type: [[[Number]]], default: undefined },
  },
  { _id: false },
);

export const AddressSchema = new Schema(
  {
    label: String,
    deliveryAddress: String,
    details: String,
    location: PointSchema,
    selected: { type: Boolean, default: false },
  },
  { timestamps: false },
);

export const BussinessDetailsSchema = new Schema(
  {
    bankName: String,
    accountName: String,
    accountCode: String,
    accountNumber: String,
    bussinessRegNo: String,
    companyRegNo: String,
    taxRate: Number,
  },
  { _id: false },
);

export const TimingsSchema = new Schema({
  startTime: [String],
  endTime: [String],
  maxOrder: Number,
});

export const OpeningTimesSchema = new Schema(
  {
    day: String,
    times: [TimingsSchema],
  },
  { _id: false },
);

export const ScheduleTimingSchema = new Schema({
  day: String,
  isOpen: { type: Boolean, default: true },
  times: [TimingsSchema],
});

/** Common schema options: timestamps + `id` virtual for GraphQL types that expose `id`. */
export const baseOptions = {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
} as const;

export const point = (lng: number, lat: number) => ({ type: 'Point' as const, coordinates: [lng, lat] });

export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;

export function defaultOpeningTimes() {
  return DAYS.map((day) => ({ day, times: [{ startTime: ['00', '00'], endTime: ['23', '59'] }] }));
}
