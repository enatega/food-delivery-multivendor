import { model, Schema, type InferSchemaType, type HydratedDocument } from 'mongoose';
import { baseOptions } from './common.js';

/** Dashboard accounts: super admins, staff and vendors (restaurant owners). */
const OwnerSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, select: false },
    name: { type: String, trim: true },
    firstName: String,
    lastName: String,
    phone: String,
    image: String,
    userType: { type: String, enum: ['ADMIN', 'STAFF', 'VENDOR'], required: true, index: true },
    permissions: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    unique_id: { type: String, index: true },
    tokenVersion: { type: Number, default: 0 },
    lastLogin: Date,
    isDeleted: { type: Boolean, default: false, index: true },
  },
  baseOptions,
);

export type OwnerAttrs = InferSchemaType<typeof OwnerSchema>;
export type OwnerDoc = HydratedDocument<OwnerAttrs>;
export const Owner = model('Owner', OwnerSchema);
