import { Types } from 'mongoose';
import { z } from 'zod';

/** Common zod building blocks for input validation. */
export const objectId = z
  .string()
  .trim()
  .refine((v) => Types.ObjectId.isValid(v), 'must be a valid id');

export const optionalObjectId = z.preprocess((v) => (v === '' || v === null ? undefined : v), objectId.optional());

/** Strings: trims, converts '' to undefined. */
export const optStr = (max = 1000) =>
  z.preprocess((v) => (v === null ? undefined : typeof v === 'string' ? (v.trim() === '' ? undefined : v.trim()) : v), z.string().max(max).optional());

export const str = (max = 1000) => z.string().trim().min(1).max(max);

export const optNum = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : typeof v === 'string' ? Number(v) : v),
  z.number().finite().optional(),
);

export const num = z.preprocess((v) => (typeof v === 'string' && v.trim() !== '' ? Number(v) : v), z.number().finite());

export const optBool = z.preprocess(
  (v) => (v === 'true' ? true : v === 'false' ? false : v === null ? undefined : v),
  z.boolean().optional(),
);

export const coordinates = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]);

/** Accepts [lng, lat] arrays of numbers or numeric strings. */
export const lngLat = z
  .array(z.union([z.number(), z.string()]))
  .length(2)
  .transform((a) => a.map(Number) as [number, number])
  .refine(([lng, lat]) => Math.abs(lng) <= 180 && Math.abs(lat) <= 90, 'invalid coordinates');

export const polygon = z
  .array(z.array(z.array(z.union([z.number(), z.string()])).min(2)).min(4))
  .transform((rings) => rings.map((ring) => ring.map((pt) => [Number(pt[0]), Number(pt[1])])));

/** Case-insensitive enum that normalises to the canonical value. */
export function looseEnum<const T extends readonly [string, ...string[]]>(values: T) {
  return z.preprocess((v) => {
    if (typeof v !== 'string') return v;
    const hit = values.find((x) => x.toLowerCase() === v.toLowerCase());
    return hit ?? v;
  }, z.enum(values));
}

/** Accepts either { pageNo, pageSize } or { offset, limit } / { page, limit }. */
export const pagination = z
  .object({
    pageNo: z.coerce.number().int().min(1).optional(),
    pageSize: z.coerce.number().int().min(1).max(200).optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(200).optional(),
    offset: z.coerce.number().int().min(0).optional(),
  })
  .transform((p) => {
    const limit = p.pageSize ?? p.limit ?? 10;
    const page = p.pageNo ?? p.page ?? (p.offset !== undefined ? Math.floor(p.offset / limit) + 1 : 1);
    const skip = p.offset ?? (page - 1) * limit;
    return { page, limit, skip };
  });
export type Pagination = z.infer<typeof pagination>;

export const dateFilter = z
  .object({ starting_date: optStr(40), ending_date: optStr(40) })
  .transform((d) => ({ start: d.starting_date ? new Date(d.starting_date) : undefined, end: d.ending_date ? new Date(d.ending_date) : undefined }));
