# AGENTS.md

## Cursor Cloud specific instructions

This monorepo ships **open-source frontends only**. The GraphQL API is proprietary (not in-repo). For demos and cloud agents, point web/admin at the hosted API — see root **`DEMO_SETUP.md`** for the full presenter guide, env tables, demo logins, and blockers.

### Apps in scope for cloud/demo work

| App | Path | Dev command | Default URL |
| --- | --- | --- | --- |
| Customer web (primary) | `enatega-multivendor-web` | `npm run dev` | http://localhost:3000 |
| Admin dashboard | `enatega-multivendor-admin` | `PORT=3001 npm run dev` | http://localhost:3001 |

Mobile apps (`enatega-multivendor-app`, `-rider`, `-store`) need Expo/native tooling and are optional for web demos.

### Non-obvious gotchas

- **Node:** use **`v20.16.0`** from each app’s `.nvmrc`. Prefer putting `$HOME/.nvm/versions/node/v20.16.0/bin` ahead of other Node binaries on `PATH` (some cloud images ship a newer Node that shadows `nvm`).
- **Package manager:** **npm** + `package-lock.json` only.
- **Env files:** READMEs mention `.env.example`; also safe to `cp .env.dev .env.local` (already has `https://aws-server-v2.enatega.com/` + `wss://…`). `.env*.local` is gitignored.
- **Maps:** set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Without it the UI still boots; Maps provider is skipped. Admin code uses the `NEXT_PUBLIC_` name (not bare `GOOGLE_MAPS_API_KEY`).
- **Egress:** Customer/admin GraphQL, images (`assets.enatega.com`), and login **require** outbound access to `*.enatega.com` / `aws-server-v2.enatega.com`. On restricted allowlists the Next apps start, but the browser shows `net::ERR_CONNECTION_RESET` and restaurants/login fail. Allow those hosts before expecting demo data.
- **Ports:** both Next apps default to `3000` — use `PORT=3001` for admin when web is already running.
- **`npm install` husky:** from an app subdirectory, `prepare` may print `.git can't be found`; install still completes.
- **Lint:** `npm run lint` in each app. Web may report existing warnings (0 errors); admin was clean at setup time.
- **Demo customer login (from mobile autofill):** `demo-customer@enatega.com` / `123123`. Admin password is **not** in the repo.
- Do **not** put `npm run dev`, builds, or migrations in the VM update script — only dependency refresh (`npm install` in the web/admin folders).
