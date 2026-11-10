# Enatega Multi-Vendor API

Production-ready GraphQL + REST backend for the Enatega platform. One deployment serves
**all six client apps** in this repository, in both multi-vendor and single-vendor mode:

| Client | Directory | Transport |
| --- | --- | --- |
| Customer app (Expo) | `enatega-multivendor-app` | GraphQL HTTP + WS, REST (maps, payments) |
| Customer web (Next.js) | `enatega-multivendor-web` | GraphQL HTTP + WS |
| Rider app (Expo) | `enatega-multivendor-rider` | GraphQL HTTP + WS |
| Store app (Expo) | `enatega-multivendor-store` | GraphQL HTTP + WS |
| Admin dashboard (Next.js) | `enatega-multivendor-admin` | GraphQL HTTP + WS, REST (maps, Stripe Connect) |
| Single-vendor admin (Next.js) | `enatega-singlevendor-admin` | GraphQL HTTP + WS |

The GraphQL schema was derived from the **828 GraphQL operations** used by those apps, and
`npm run check:contract` (also run in CI and in the test suite) validates every one of them
against the schema, so client/server drift is caught before it ships.

## Stack

Node.js 22 · TypeScript · Express 5 · Apollo Server 5 · GraphQL 16 · MongoDB 7 (Mongoose 9) ·
Redis (pub/sub, rate limits, OTP, locks) · zod · pino · Prometheus metrics · Vitest.

## Quick start (local)

```bash
cd enatega-multivendor-api
cp .env.example .env            # fill JWT_SECRET, JWT_REFRESH_SECRET, ENCRYPTION_KEY
npm ci
docker compose up -d mongo redis
npm run seed                    # demo data (refuses to run in production)
npm run dev                     # http://localhost:8001/graphql
```

Seeded accounts (password `Password123!`): `admin@example.com` (dashboard), `vendor@example.com`
(dashboard), `demo-store` (store app), `demo-rider` (rider app), `customer@example.com` (customer).

Everything in one command: `docker compose up -d --build` (API + MongoDB replica set + Redis).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Watch mode with `.env` |
| `npm run build` / `npm start` | Compile to `dist/` and run |
| `npm test` | Integration tests (real HTTP, WebSocket and MongoDB; set `TEST_MONGODB_URI`) |
| `npm run check:contract` | Validate every client GraphQL document against the schema |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run create-admin -- <email> <password>` | Create or reset a super admin |
| `npm run seed` | Demo data for development / staging |

## Endpoints

| Path | Description |
| --- | --- |
| `POST /graphql` | GraphQL (queries, mutations) |
| `WS /graphql` | Subscriptions — both `graphql-transport-ws` and the legacy `graphql-ws` protocol used by the apps |
| `GET /health/live`, `GET /health/ready` | Liveness / readiness (Mongo + Redis) |
| `GET /metrics` | Prometheus metrics (bearer `METRICS_TOKEN`, or private networks only) |
| `GET /maps/autocomplete`, `/maps/place-details`, `/maps/reverse-geocode` | Google Maps proxy (the key never ships in the apps) |
| `GET /stripe/create-checkout-session?id=`, `/stripe/success`, `/stripe/cancel` | Card payment flow opened by the apps' web views |
| `POST /stripe/webhook` | Stripe webhooks (signature verified with `STRIPE_WEBHOOK_SECRET`) |
| `POST /stripe/account` | Stripe Connect onboarding for a store (dashboard token required) |
| `GET /paypal?id=`, `/paypal/success`, `/paypal/cancel` | PayPal payment flow |
| `GET /uploads/*` | Uploaded images when `STORAGE_DRIVER=local` |

## Connecting the apps

All clients keep their previous defaults unless the variables below are set.

| App | Variables |
| --- | --- |
| Customer app | `EXPO_PUBLIC_API_URL=https://api.example.com` (derives GraphQL, WS and REST URLs for both modes) |
| Customer web | `NEXT_PUBLIC_SERVER_URL=https://api.example.com/`, `NEXT_PUBLIC_WS_SERVER_URL=wss://api.example.com/` (and the `NEXT_PUBLIC_SINGLE_VENDOR_*` equivalents) |
| Rider app | `EXPO_PUBLIC_GRAPHQL_URL=https://api.example.com/graphql`, `EXPO_PUBLIC_WS_GRAPHQL_URL=wss://api.example.com/graphql` |
| Store app | `EXPO_PUBLIC_GRAPHQL_URL`, `EXPO_PUBLIC_WS_GRAPHQL_URL` (same values) |
| Admin dashboards | `NEXT_PUBLIC_SERVER_URL=https://api.example.com/`, `NEXT_PUBLIC_WS_SERVER_URL=wss://api.example.com/` |
| Single-vendor mode (apps) | `EXPO_PUBLIC_SINGLE_VENDOR_GRAPHQL_URL` / `_WS_GRAPHQL_URL` / `_REST_URL` — the same API serves single-vendor mode |

Add every browser origin (customer web, both dashboards) to `CORS_ORIGINS`.

## Architecture

```
src/
  config/env.ts          zod-validated environment (fails fast on misconfiguration)
  graphql/schema/*.graphql  SDL, one file per domain
  graphql/               schema builder, scalars, request context, DataLoaders, validation rules, plugins
  auth/                  JWT (access/refresh/purpose/public tokens), password hashing, role guards
  modules/               resolvers per domain: customers, accounts, platform, restaurants, menu,
                         catalog, orders, single-vendor, riders, dashboards
  services/              pricing, order lifecycle, payments, push/email/SMS, storage, OTP, config
  models/                Mongoose models (~35 collections)
  http/                  Express app, REST routes, dual-protocol WebSocket server
  jobs/                  background jobs (Redis-locked, safe with many instances)
```

### Key design decisions

- **Server-authoritative pricing.** Item, add-on and option prices, coupons, deals, tax, delivery fee,
  credits and fees are recomputed from the database; amounts sent by clients are ignored. The formula
  matches `enatega-multivendor-app/src/utils/orderPricing.js` so displayed and charged totals agree.
- **Order lifecycle** `PENDING → ACCEPTED → ASSIGNED → PICKED → DELIVERED` (pickup: `ACCEPTED → DELIVERED`),
  cancellation as `CANCELLED` / `CANCELLEDBYREST`, enforced by a transition matrix. Rider self-assignment is
  atomic (no double assignment). Online orders stay hidden from stores/riders until paid; unpaid ones expire
  after 30 minutes. Delivery triggers an idempotent earnings settlement (store, rider, platform) and wallet credits.
- **Validated input scalars.** Client-facing argument types (`RestaurantInput`, `OrderInput`, …) are scalars backed
  by zod schemas (`modules/*.ts` → `inputs`): values are coerced and validated with field-level errors, unknown keys
  are stripped. This keeps every existing client document valid while enforcing strict validation.
- **Dates.** `DateTime` = ISO-8601; `Timestamp` = epoch milliseconds as a string, used where the apps parse
  `new Date(Number(x))` (users, reviews, coupons, support tickets, credits).
- **Real time.** Entity-scoped pub/sub topics (Redis in production, so every instance receives every event).
- **Public access token.** `metricsGeneral` issues a short-lived token bound to the client's `nonce` header
  (`experience` = token, `hehe` = expiry). Enforce it for anonymous traffic with `PUBLIC_ACCESS_REQUIRED=true`.

### Security

- JWT access tokens with per-account token versions (logout, password reset, block or admin "reset session"
  revoke every issued token). Dashboard sessions use short access tokens + rotating refresh tokens.
- Role/permission guards for customers, riders, stores, vendors, staff (permission codes from the admin app)
  and super admins; vendors are scoped to their own stores; dashboard-only fields are hidden from customers.
- Error codes understood by the apps: `UNAUTHENTICATED`, `TOKEN_EXPIRED`, `INVALID_TOKEN` (log out),
  `FORBIDDEN`, `BAD_USER_INPUT`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`. Internal errors are masked in production.
- Third-party secrets saved from the admin (Stripe, PayPal, Twilio, SendGrid, SMTP) are AES-256-GCM encrypted
  at rest, write-only, and never returned (`has*Configured` flags instead).
- OTP codes are server-generated, stored hashed, single use, attempt-limited and rate limited; password reset
  never enumerates accounts. Social sign-in verifies Google ID tokens and Apple identity tokens (+ nonce).
- Helmet, strict CORS allow-list, CSRF prevention, body size limits, per-IP rate limits (global and stricter for
  auth/OTP operations), GraphQL depth/alias/token limits, introspection disabled in production, image uploads
  checked by magic number (no SVG), audit log for administrative actions.

## Deployment checklist

1. MongoDB **replica set** (Atlas or self-hosted) and Redis 7 (required when `NODE_ENV=production`).
2. Set all `[required]` values in `.env.example`; generate secrets with the commands shown there.
3. Run behind TLS (load balancer / reverse proxy) with WebSocket upgrades enabled for `/graphql`; set `TRUST_PROXY`.
4. Create the first admin (`ADMIN_EMAIL`/`ADMIN_PASSWORD` on first boot, or `npm run create-admin`).
5. In the admin dashboard configure currency, delivery rate, Google keys, Stripe/PayPal, Twilio/SendGrid, Firebase.
6. Stripe: add a webhook to `https://<api>/stripe/webhook` for `checkout.session.completed`,
   `checkout.session.async_payment_succeeded`, `customer.subscription.updated/deleted`, `account.updated`.
7. Use `STORAGE_DRIVER=s3` or `cloudinary` when running more than one instance.
8. Scrape `/metrics`, alert on `/health/ready`, ship JSON logs (pino) to your log platform.
9. Scale horizontally: the API is stateless (sessions in JWT, events and locks in Redis).

## Notes and limitations

- Cash-on-delivery wallets are credited with earnings; reconciling the cash a rider collected is an operational
  process (use withdraw requests / transactions in the dashboard).
- Store opening hours are enforced by the apps (stores have no time zone field); the API enforces availability,
  delivery zones, delivery/pickup options and minimum order.
- iOS Live Activity sessions are stored (`registerLiveActivitySession`) but APNs delivery is not implemented.
