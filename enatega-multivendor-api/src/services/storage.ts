import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { env } from '../config/env.js';
import { badInput } from '../lib/errors.js';

const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/heic': 'heic',
  'image/svg+xml': 'svg',
};

/** Magic-number check so that a renamed non-image payload is rejected. */
function sniff(buf: Buffer): string | null {
  if (buf.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return 'image/jpeg';
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') return 'image/webp';
  if (buf.subarray(0, 6).toString('ascii').startsWith('GIF8')) return 'image/gif';
  if (buf.subarray(4, 12).toString('ascii').includes('ftyp')) return 'image/heic';
  return null;
}

export const UPLOADS_ROOT = resolve(env.UPLOADS_DIR);

let s3: S3Client | null = null;
function getS3(): S3Client {
  if (!s3) {
    s3 = new S3Client({
      region: env.S3_REGION ?? 'us-east-1',
      endpoint: env.S3_ENDPOINT,
      forcePathStyle: Boolean(env.S3_ENDPOINT),
      credentials:
        env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY
          ? { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY }
          : undefined,
    });
  }
  return s3;
}

/**
 * Stores a base64 data-URI (or raw base64) image and returns its public URL.
 * SVG uploads are rejected (they can carry scripts).
 */
export async function uploadImage(input: string, folder = 'images'): Promise<string> {
  if (typeof input !== 'string' || input.length < 16) throw badInput('Image payload is empty.');
  if (/^https?:\/\//i.test(input)) return input; // already hosted
  const m = /^data:([\w/+.-]+);base64,(.+)$/s.exec(input);
  const b64 = m ? m[2]! : input;
  const buf = Buffer.from(b64, 'base64');
  if (buf.length === 0) throw badInput('Image payload is not valid base64.');
  if (buf.length > env.MAX_UPLOAD_BYTES) throw badInput(`Image exceeds ${Math.round(env.MAX_UPLOAD_BYTES / 1024 / 1024)} MB.`);
  const mime = sniff(buf);
  if (!mime) throw badInput('Unsupported image type. Use JPEG, PNG, WEBP, GIF or HEIC.');
  const ext = MIME_EXT[mime]!;
  const key = `${folder}/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${ext}`;

  switch (env.STORAGE_DRIVER) {
    case 's3': {
      await getS3().send(
        new PutObjectCommand({
          Bucket: env.S3_BUCKET!,
          Key: key,
          Body: buf,
          ContentType: mime,
          CacheControl: 'public, max-age=31536000, immutable',
        }),
      );
      const base = env.S3_PUBLIC_URL ?? `https://${env.S3_BUCKET}.s3.${env.S3_REGION ?? 'us-east-1'}.amazonaws.com`;
      return `${base.replace(/\/$/, '')}/${key}`;
    }
    case 'cloudinary': {
      if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
        throw new Error('Cloudinary is not configured');
      }
      const timestamp = Math.floor(Date.now() / 1000);
      const publicId = key.replace(/\.[^.]+$/, '');
      const signature = createHash('sha1')
        .update(`public_id=${publicId}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`)
        .digest('hex');
      const form = new FormData();
      form.set('file', `data:${mime};base64,${buf.toString('base64')}`);
      form.set('api_key', env.CLOUDINARY_API_KEY);
      form.set('timestamp', String(timestamp));
      form.set('public_id', publicId);
      form.set('signature', signature);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: form,
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) throw new Error(`Cloudinary upload failed (${res.status})`);
      const json = (await res.json()) as { secure_url: string };
      return json.secure_url;
    }
    default: {
      const path = join(UPLOADS_ROOT, key);
      await mkdir(join(path, '..'), { recursive: true });
      await writeFile(path, buf);
      return `${env.PUBLIC_API_URL.replace(/\/$/, '')}/uploads/${key}`;
    }
  }
}
