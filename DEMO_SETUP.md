# Enatega demo setup (open-source frontends + hosted API)

This guide gets a **local, presenter-ready demo** of the open-source Enatega frontends running against the **project’s hosted demo API**. The API/backend is **proprietary and is not in this repository** — do not try to start `enatega-multivendor-api` unless you have a separate licensed copy.

**Primary demo target:** Customer Web (`enatega-multivendor-web`)  
**Secondary:** Admin Dashboard (`enatega-multivendor-admin`)

---

## Repo map

| Module | Path | Framework | Open source? | Needs proprietary API? |
| --- | --- | --- | --- | --- |
| Customer web | `enatega-multivendor-web` | Next.js 16 + React 19 + Apollo | Yes | Yes (hosted demo OK) |
| Admin dashboard | `enatega-multivendor-admin` | Next.js 14 + React 18 + Apollo | Yes | Yes (hosted demo OK) |
| Customer mobile | `enatega-multivendor-app` | Expo / React Native (SDK 53) | Yes | Yes |
| Rider app | `enatega-multivendor-rider` | Expo Router / RN (SDK 53) | Yes | Yes |
| Store / restaurant app | `enatega-multivendor-store` | Expo Router / RN (SDK 54) | Yes | Yes |
| API / backend | *not in this repo* (`../enatega-multivendor-api`) | Node / Express / MongoDB | **Proprietary** | N/A |

**Package manager:** `npm` only (`package-lock.json` in each app; yarn is discouraged via `engines.yarn`).  
**Node version:** `v20.16.0` (see each app’s `.nvmrc`). npm `>=10`.

Public hosted UIs (reference): customer `http://multivendor.enatega.com/`, admin `http://multivendor-admin.enatega.com/`.

---

## Prerequisites

1. **Node.js `v20.16.0`** (recommended via `nvm use` inside the app folder).
2. **npm `>=10`**.
3. Outbound HTTPS/WSS access to the hosted API:
   - `https://aws-server-v2.enatega.com/`
   - `wss://aws-server-v2.enatega.com/`
4. A **Google Maps browser API key** for maps / address UX (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`).
5. Optional: Google OAuth client ID, EmailJS keys, admin login prefills (see env tables below).

> **Note:** Module READMEs say `cp .env.example .env.local`, but `.env.example` may be missing on older checkouts. Prefer copying `.env.dev` (already points at the hosted API), or use the `.env.example` files added alongside this guide.

---

## Quick start — Customer Web (recommended demo)

```bash
# 1) Node
cd enatega-multivendor-web
nvm use          # -> v20.16.0

# 2) Env (hosted demo API)
cp .env.dev .env.local
# OR: cp .env.example .env.local

# 3) Add a Maps key (required for maps/address flows)
# Edit .env.local and set:
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_BROWSER_KEY

# 4) Install + run
npm install
npm run dev
```

Open **http://localhost:3000**.

### Expected smoke path (presenter script)

1. Home renders (“*. DELIVERED” hero, search, Login).
2. Click **Login** → enter `demo-customer@enatega.com` → **Continue with Email**.
3. Enter password `123123` → complete login.
4. Set / confirm a delivery location (needs Maps key).
5. Browse restaurants / open a store → add an item to cart (needs live API data).

---

## Quick start — Admin Dashboard (secondary)

Run on a **different port** if Customer Web already uses `3000`:

```bash
cd enatega-multivendor-admin
nvm use
cp .env.dev .env.local
# Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
# Optionally set NEXT_PUBLIC_ADMIN_EMAIL / NEXT_PUBLIC_ADMIN_PASSWORD prefills
npm install
PORT=3001 npm run dev
```

Open **http://localhost:3001**.

Admin credentials are **not hardcoded** in the repo. Prefill via env, or enter credentials provided by your Enatega contact / demo operator.

---

## Environment variables

### Customer Web (`enatega-multivendor-web/.env.local`)

| Variable | Required? | Demo default / notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SERVER_URL` | **Required** | `https://aws-server-v2.enatega.com/` (from `.env.dev`) |
| `NEXT_PUBLIC_WS_SERVER_URL` | **Required** | `wss://aws-server-v2.enatega.com/` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | **Required for maps/address UX** | No project default — use your own browser key. App still boots without it; Maps provider is skipped. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Optional | Google login; runtime OAuth ID may also come from API `configuration`. |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | Optional | Helper email flows only. |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Optional | Helper email flows only. |

Firebase, Stripe, PayPal, Amplitude, Sentry, OTP flags, currency, etc. are loaded from the API **`configuration`** GraphQL query — not from local env.

### Admin (`enatega-multivendor-admin/.env.local`)

| Variable | Required? | Demo default / notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SERVER_URL` | **Required** | `https://aws-server-v2.enatega.com/` |
| `NEXT_PUBLIC_WS_SERVER_URL` | **Required** | `wss://aws-server-v2.enatega.com/` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | **Required for maps** | What the code reads (admin README historically mentioned `GOOGLE_MAPS_API_KEY` — use the `NEXT_PUBLIC_` name). |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Optional | Login form prefill only. |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Optional | Login form prefill only. |
| `NEXT_PUBLIC_ENCRYPTION_KEY` | Optional | Client-side decryption helper. |

---

## Demo credentials (from mobile login autofill in this monorepo)

| Role | Email / username | Password | Source |
| --- | --- | --- | --- |
| Customer | `demo-customer@enatega.com` | `123123` | `enatega-multivendor-app` login autofill |
| Store | `FalafelTmeer@yopmail.com` | `Yalla0014yalla0014@` | Store app placeholders (mobile; not needed for web demo) |
| Rider | `ryanabotreef` | `Rider@123` | Rider app placeholders (mobile) |
| Admin | *not in repo* | *not in repo* | Ask Enatega / set `NEXT_PUBLIC_ADMIN_*` |

Hosted GraphQL endpoint used by the apps: `https://aws-server-v2.enatega.com/graphql` (HTTP) and `wss://aws-server-v2.enatega.com/graphql` (subscriptions).

---

## Useful commands

| App | Lint | Dev | Production-style |
| --- | --- | --- | --- |
| Web | `cd enatega-multivendor-web && npm run lint` | `npm run dev` → `:3000` | `npm run build && npm run start` |
| Admin | `cd enatega-multivendor-admin && npm run lint` | `PORT=3001 npm run dev` | `npm run build && npm run start` |

Cypress (optional): `npm run cy:open` / `npm run cy:run` in either app.

---

## Known issues / workarounds

1. **Missing `.env.example` in older trees**  
   Workaround: `cp .env.dev .env.local` (already has hosted API URLs).

2. **`husky` during `npm install` prints `.git can't be found`** when installing from an app subdirectory in some environments. Harmless for demo; install still succeeds.

3. **Both apps default to port `3000`**  
   Use `PORT=3001` (or another free port) for the second process.

4. **Google Maps key missing**  
   Home/login still render. Location picker, map views, and some address modals degrade or skip Maps. Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

5. **Restaurants / menus empty or login stuck**  
   Almost always: cannot reach `aws-server-v2.enatega.com` (VPN/firewall/egress allowlist) or API outage. Verify with:
   ```bash
   curl -sS -X POST https://aws-server-v2.enatega.com/graphql \
     -H 'Content-Type: application/json' \
     -d '{"query":"{ __typename }"}'
   ```

6. **Admin README vs code for Maps env name**  
   Use `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (see `useConfiguration.tsx`).

7. **Proprietary backend**  
   Local `localhost:8001` setup only works if you separately license/run the API. For demos, keep `.env.local` on the hosted URLs above.

8. **Root README Node note is outdated** (“18–20”); per-app `.nvmrc` / `engines` (`v20.16.0`) are authoritative.

9. **Cloud agent / restricted egress environments**  
   If HTTPS to `*.enatega.com` is blocked, the UI boots but GraphQL/login/restaurants fail with `ERR_CONNECTION_RESET`. Allowlist at least:
   - `aws-server-v2.enatega.com`
   - `*.enatega.com`
   - `assets.enatega.com`
   - (optional) `cdn.jsdelivr.net` for EmailJS preload

---

## Reset to a clean state

```bash
# Customer web
cd enatega-multivendor-web
rm -rf node_modules .next .env.local
cp .env.dev .env.local
# re-add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
npm install

# Admin
cd ../enatega-multivendor-admin
rm -rf node_modules .next .env.local
cp .env.dev .env.local
# re-add maps key (+ optional admin prefills)
npm install
```

Browser: clear site data for `localhost:3000` / `localhost:3001` (tokens in `localStorage`).

---

## Blockers checklist (honest)

| Blocker | Needed for | Workaround |
| --- | --- | --- |
| Hosted API reachability | Restaurants, menus, login, orders | Use network that can reach `aws-server-v2.enatega.com`; or licensed local API |
| Google Maps browser key | Address/map UX | Provide your own key; UI boots without it |
| Admin demo password | Admin dashboard login | Not in repo — obtain from Enatega / demo operator |
| Proprietary API source | Fully offline / custom backend | License package; frontends alone cannot serve data |
| Mobile apps (Expo) | Native customer/rider/store demo | Out of scope for this web-focused demo guide |

---

## Presenter one-pager

```bash
nvm install 20.16.0 && nvm use 20.16.0
cd enatega-multivendor-web
cp .env.dev .env.local
# set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local
npm install && npm run dev
# → http://localhost:3000
# Login: demo-customer@enatega.com / 123123
```
