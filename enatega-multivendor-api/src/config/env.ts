import { z } from 'zod';

const bool = z
  .enum(['true', 'false', '1', '0', 'yes', 'no'])
  .transform((v) => v === 'true' || v === '1' || v === 'yes');

const list = z
  .string()
  .transform((v) =>
    v
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );

const EnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(8001),
    HOST: z.string().default('0.0.0.0'),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
    /** Public base URL of this API, used to build REST callback URLs (Stripe/PayPal redirects). */
    PUBLIC_API_URL: z.string().url().default('http://localhost:8001'),
    /** Comma-separated list of allowed browser origins. `*` allows any origin (not allowed in production). */
    CORS_ORIGINS: list.default(['*']),
    TRUST_PROXY: z.string().default('1'),

    MONGODB_URI: z.string().min(1).default('mongodb://localhost:27017/enatega'),
    MONGODB_MAX_POOL_SIZE: z.coerce.number().int().positive().default(50),
    /** Optional. When set, Redis is used for pub/sub (multi-instance subscriptions), rate limiting, OTP and caches. */
    REDIS_URL: z.string().optional(),

    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
    JWT_ACCESS_TTL: z.string().default('7d'),
    JWT_DASHBOARD_ACCESS_TTL: z.string().default('1h'),
    JWT_REFRESH_TTL: z.string().default('30d'),
    /** 32-byte key (hex or base64) used to encrypt third-party secrets stored in the configuration collection. */
    ENCRYPTION_KEY: z.string().min(32),

    /** Require the public access token (metricsGeneral handshake) on unauthenticated requests. */
    PUBLIC_ACCESS_REQUIRED: bool.default(false),
    PUBLIC_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(3600),

    GRAPHQL_INTROSPECTION: bool.optional(),
    GRAPHQL_MAX_DEPTH: z.coerce.number().int().positive().default(14),
    GRAPHQL_MAX_ALIASES: z.coerce.number().int().positive().default(30),
    GRAPHQL_MAX_TOKENS: z.coerce.number().int().positive().default(8000),
    REQUEST_BODY_LIMIT: z.string().default('12mb'),

    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(600),
    AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),

    /** Seeded super-admin (only used by `npm run create-admin` / first boot when no admin exists). */
    ADMIN_EMAIL: z.string().email().optional(),
    ADMIN_PASSWORD: z.string().min(10).optional(),

    // --- object storage for uploads ---
    STORAGE_DRIVER: z.enum(['local', 's3', 'cloudinary']).default('local'),
    UPLOADS_DIR: z.string().default('uploads'),
    S3_BUCKET: z.string().optional(),
    S3_REGION: z.string().optional(),
    S3_ENDPOINT: z.string().optional(),
    S3_PUBLIC_URL: z.string().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
    MAX_UPLOAD_BYTES: z.coerce.number().int().positive().default(8 * 1024 * 1024),

    // --- integrations (all optional; values saved through the admin configuration take precedence) ---
    GOOGLE_MAPS_API_KEY: z.string().optional(),
    GOOGLE_CLIENT_IDS: list.optional(),
    APPLE_BUNDLE_IDS: list.optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    PAYPAL_CLIENT_ID: z.string().optional(),
    PAYPAL_SECRET: z.string().optional(),
    PAYPAL_SANDBOX: bool.default(true),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().int().positive().default(587),
    SMTP_SECURE: bool.default(false),
    SMTP_USER: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),
    MAIL_FROM: z.string().optional(),
    SENDGRID_API_KEY: z.string().optional(),
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional(),
    TWILIO_PHONE_NUMBER: z.string().optional(),
    EXPO_ACCESS_TOKEN: z.string().optional(),
    FIREBASE_SERVICE_ACCOUNT_JSON: z.string().optional(),

    /** Fixed OTP accepted for these emails/phones (store review / demo accounts). Never use real users here. */
    DEMO_OTP: z.string().optional(),
    DEMO_ACCOUNTS: list.default([]),

    JOBS_ENABLED: bool.default(true),
    /** Minutes after which an unaccepted order is auto-cancelled (0 disables). */
    ORDER_ACCEPT_TIMEOUT_MINUTES: z.coerce.number().int().min(0).default(0),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === 'production') {
      if (env.CORS_ORIGINS.includes('*')) {
        ctx.addIssue({ code: 'custom', path: ['CORS_ORIGINS'], message: 'Set explicit origins in production' });
      }
      if (env.JWT_SECRET === env.JWT_REFRESH_SECRET) {
        ctx.addIssue({ code: 'custom', path: ['JWT_REFRESH_SECRET'], message: 'Must differ from JWT_SECRET' });
      }
      if (!env.REDIS_URL) {
        ctx.addIssue({
          code: 'custom',
          path: ['REDIS_URL'],
          message: 'Redis is required in production (subscriptions across instances, rate limiting, OTP storage)',
        });
      }
      if (env.STORAGE_DRIVER === 's3' && !env.S3_BUCKET) {
        ctx.addIssue({ code: 'custom', path: ['S3_BUCKET'], message: 'Required when STORAGE_DRIVER=s3' });
      }
    }
  });

export type Env = z.infer<typeof EnvSchema>;

function load(): Env {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues.map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n');
     
    console.error(`Invalid environment configuration:\n${details}`);
    process.exit(1);
  }
  return parsed.data;
}

export const env: Env = load();
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
export const introspectionEnabled = env.GRAPHQL_INTROSPECTION ?? !isProduction;
