import { Router, type Response } from 'express';
import { z } from 'zod';
import { createHash } from 'node:crypto';
import { kv } from '../../lib/kv.js';
import { logger } from '../../lib/logger.js';
import { getSecrets } from '../../services/config.js';

/**
 * Google Maps proxy so that the API key never ships inside the apps.
 * Response envelope: { success, data, error }.
 */
export const mapsRouter = Router();

const lang = z.string().regex(/^[a-zA-Z-]{2,10}$/).default('en');

function fail(res: Response, status: number, code: string, message: string) {
  res.status(status).json({ success: false, data: null, error: { code, message } });
}

async function google(path: string, params: Record<string, string>, ttlSeconds: number) {
  const { googleMapsKey } = await getSecrets();
  if (!googleMapsKey) return { configured: false as const };
  const qs = new URLSearchParams({ ...params, key: googleMapsKey });
  const cacheKey = `maps:${path}:${createHash('sha1').update(JSON.stringify(params)).digest('hex')}`;
  const cached = await kv.get(cacheKey);
  if (cached) return { configured: true as const, json: JSON.parse(cached) as Record<string, any> };
  const res = await fetch(`https://maps.googleapis.com/maps/api/${path}?${qs}`, { signal: AbortSignal.timeout(8000) });
  const json = (await res.json()) as Record<string, any>;
  if (json.status === 'OK' || json.status === 'ZERO_RESULTS') await kv.set(cacheKey, JSON.stringify(json), ttlSeconds);
  return { configured: true as const, json };
}

mapsRouter.get('/maps/autocomplete', async (req, res) => {
  const q = z.object({ input: z.string().trim().min(1).max(200), language: lang, types: z.string().max(40).optional() }).safeParse(req.query);
  if (!q.success) return fail(res, 400, 'BAD_REQUEST', 'input is required');
  try {
    const r = await google('place/autocomplete/json', { input: q.data.input, language: q.data.language, ...(q.data.types ? { types: q.data.types } : {}) }, 3600);
    if (!r.configured) return fail(res, 503, 'NOT_CONFIGURED', 'Maps are not configured');
    return res.json({
      success: true,
      error: null,
      data: {
        status: r.json.status,
        errorMessage: r.json.error_message ?? null,
        predictions: (r.json.predictions ?? []).map((p: any) => ({
          placeId: p.place_id,
          place_id: p.place_id,
          description: p.description,
          mainText: p.structured_formatting?.main_text,
          secondaryText: p.structured_formatting?.secondary_text,
          structured_formatting: p.structured_formatting,
          types: p.types,
        })),
      },
    });
  } catch (err) {
    logger.error({ err }, 'Maps autocomplete failed');
    return fail(res, 502, 'UPSTREAM_ERROR', 'Search failed');
  }
});

mapsRouter.get('/maps/place-details', async (req, res) => {
  const q = z.object({ placeId: z.string().trim().min(1).max(300), language: lang }).safeParse(req.query);
  if (!q.success) return fail(res, 400, 'BAD_REQUEST', 'placeId is required');
  try {
    const r = await google('place/details/json', { place_id: q.data.placeId, language: q.data.language, fields: 'geometry,formatted_address,name,address_components' }, 86400);
    if (!r.configured) return fail(res, 503, 'NOT_CONFIGURED', 'Maps are not configured');
    return res.json({ success: true, error: null, data: { status: r.json.status, errorMessage: r.json.error_message ?? null, result: r.json.result ?? null } });
  } catch (err) {
    logger.error({ err }, 'Maps place details failed');
    return fail(res, 502, 'UPSTREAM_ERROR', 'Unable to load location details');
  }
});

mapsRouter.get('/maps/reverse-geocode', async (req, res) => {
  const q = z.object({ latitude: z.coerce.number().min(-90).max(90), longitude: z.coerce.number().min(-180).max(180), language: lang }).safeParse(req.query);
  if (!q.success) return fail(res, 400, 'BAD_REQUEST', 'latitude and longitude are required');
  try {
    const latlng = `${q.data.latitude.toFixed(6)},${q.data.longitude.toFixed(6)}`;
    const r = await google('geocode/json', { latlng, language: q.data.language }, 86400);
    if (!r.configured) return fail(res, 503, 'NOT_CONFIGURED', 'Maps are not configured');
    const first = r.json.results?.[0];
    const city = first?.address_components?.find((c: any) => c.types?.includes('locality') || c.types?.includes('administrative_area_level_2'))?.long_name ?? null;
    return res.json({
      success: true,
      error: null,
      data: { status: r.json.status, errorMessage: r.json.error_message ?? null, formattedAddress: first?.formatted_address ?? null, city, results: r.json.results ?? [] },
    });
  } catch (err) {
    logger.error({ err }, 'Reverse geocoding failed');
    return fail(res, 502, 'UPSTREAM_ERROR', 'Unable to fetch address');
  }
});
