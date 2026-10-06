# Enatega QA Automation — Strategy & Operations

How the Customer Web suite is layered, how to run it, how it stays safe against
production, and how CI turns every push into a signal.

The maintained scenario inventory is
[AUTOMATED-COVERAGE.md](AUTOMATED-COVERAGE.md). Every automation change must
update that ledger in the same pull request.

## 1. The test pyramid

Coverage is deliberately layered so the fast, deterministic tests carry the load
and the slow, live-data tests stay rare and out of the per-push path.

| Layer | Location | Network | Runs | Purpose |
|-------|----------|---------|------|---------|
| **Unit** | `tests/unit` | none | every push (seconds) | Config validation, safety guard, run-id, auth-state logic |
| **Mock browser** | `tests/web/customer/mock` | mocked GraphQL (`__qa-api`) | every push | Deterministic UI: navigation, discovery→cart, auth errors, search |
| **Read-only API** | `tests/web/customer/production-readonly/*catalog-api* ` | real GraphQL (queries only) | nightly / on demand | Real catalog, cuisines, top-rated, reviews, menu, pagination |
| **Read-only UI** | `tests/web/customer/production-readonly` | real GraphQL + browser | nightly / on demand | Discovery renders real data; search over live restaurants |
| **Authenticated** | `tests/web/customer/production-auth` | real GraphQL + saved session | nightly / on demand | Profile, addresses, order history, checkout page (no order placed) |

**Rule of thumb:** anything that must *gate a merge* lives in unit or mock —
they are hermetic and never flake on live data. Anything that reads production
lives in the nightly job.

## 2. Safety model (why this never mutates production)

- **`src/safety/graphql-read-only-guard.ts`** allows queries and exactly one
  mutation (`MetricsGeneral`, the token bootstrap the app itself runs). Every
  other mutation is blocked and returns a synthetic error.
- **`installProductionReadOnlyGuard(page)`** routes all `**/graphql` traffic
  through that guard for browser tests; specs assert `blockedOperations` is empty.
- **Read-only API client** (`support/production-graphql.ts`) only issues queries.
- **`validateCustomerWebEnvironment`** refuses non-allowlisted hosts and forbids
  the public demo hosts for any mutating (`qa`) run.

If a new test needs to *write* data, it must run against a dedicated QA backend
(`QA_RUN_MODE=qa`), never production.

## 3. Running locally

> **Node 20+ is required** for the browser suites — the Customer Web dev server
> (Next.js) will not boot on Node 18. Use `nvm use 20`.

```sh
cd qa-automation
npm ci

# Static gates
npm run typecheck && npm run lint && npm run test:unit

# Deterministic browser tests (boots Customer Web with mocked GraphQL)
npm run test:web:mock

# Real GraphQL, read-only (needs enatega-multivendor-web/.env with the server URL)
npm run test:web:production-smoke

# Authenticated real GraphQL (needs QA_CUSTOMER_EMAIL / QA_CUSTOMER_PASSWORD in .env)
# Create a fresh session. Production limits each email to five existence checks
# per 15 minutes, so do not repeat this before every local test.
npm run auth:web:production

# Run with a fresh login dependency.
npm run test:web:production-authenticated

# Reuse reports/auth/customer.json while developing or watching a headed run.
npm run test:web:production-authenticated -- --no-deps --headed --workers=1
```

Reports land in `reports/playwright` (HTML) and `reports/junit`.

## 4. CI/CD

Two workflows under `.github/workflows/`:

### `qa-checks.yml` — every push / PR
Path-filtered to `qa-automation/**` and `enatega-multivendor-web/**`.
1. **static** — typecheck, lint, unit. Fails fast, no external deps.
2. **mock-web** — installs Chromium + Customer Web, runs the mock suite.

Both are hermetic, so a red check means a real regression, not live-data noise.
The Playwright `github` reporter annotates failures inline on the PR, and the
HTML/JUnit reports upload as artifacts.

### `qa-nightly.yml` — scheduled 02:00 UTC + manual
Runs the read-only smoke against production, then (if the customer secrets are
present) the authenticated suite. Never gates a merge.

**Required repository secrets** (Settings → Secrets → Actions):

| Secret | Used by | Notes |
|--------|---------|-------|
| `QA_CUSTOMER_EMAIL` | authenticated suite | A dedicated automation account, not a real customer |
| `QA_CUSTOMER_PASSWORD` | authenticated suite | — |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Customer Web boot | Optional; maps degrade gracefully without it |

If the customer secrets are absent, the nightly job still runs the read-only
smoke and simply skips the authenticated steps.

## 5. Effective automation — the operating model

1. **Gate merges on the hermetic layers only.** Make `static` and `mock-web`
   required status checks on `main`. They are deterministic, so failures are
   always actionable.
2. **Keep production tests on a schedule.** Live data changes (a restaurant
   closes, a menu item sells out); asserting on it per-commit produces false
   reds. Nightly + `workflow_dispatch` is the right cadence.
3. **Own a dedicated automation account and location.** All fixtures use one
   set of coordinates (`33.6844, 73.0479`) and one QA login. Data drift there is
   the team's to control.
4. **Triage with the artifacts.** Every run uploads the HTML report with traces,
   screenshots, and video (`retain-on-failure`). Start triage there, not from
   the log.
5. **Grow coverage in the cheap layers first.** New behaviour → add a mock test.
   Only reach for a production test when the value is confirming the *real*
   backend contract (schema, aggregates, session).
6. **Watch flake.** The target is <1% flake. `retries: 1` in CI absorbs
   transient blips; a test that needs more than one retry to pass is a bug to fix,
   not to paper over.

## 6. Extending the suite

- **Customer Page Object Model:** import `test` and `expect` from
  `tests/fixtures/customer-test.ts`, then use the `customerApp` fixture. Page
  objects under `src/pages/customer` own reusable UI locators, navigation, and
  user actions. Specs keep scenario assertions, test data, and orchestration.
  GraphQL mocks, API clients, authentication state, host monitoring, and
  production safety guards remain in `support` or `src` infrastructure modules.
- **New mock test:** add a spec under `tests/web/customer/mock`, drive it with
  `mockGraphql(page, handlers)` and fixtures in `support/customer-fixtures.ts`.
- **New read-only API test:** use `createReadOnlyGraphqlClient(request)` from
  `support/production-graphql.ts` — it handles the token bootstrap and error
  assertions for you.
- **New authenticated test:** install the read-only guard in `beforeEach`,
  observe the real GraphQL response (see `production-auth/account.spec.ts`), and
  assert on the payload rather than fragile DOM where possible.
- **Other surfaces** (Store, Rider, Admin, mobile Maestro) follow the same
  pyramid; scaffold projects already exist in `playwright.config.ts`.

## 7. Known constraints

- Browser suites need **Node 20+**; the default environment here ships Node 18.
- The mock/production browser projects share a single Customer Web dev server,
  so they run at **`workers: 1`** (set automatically when the server is booted;
  override with `QA_WEB_WORKERS`). For faster CI, build once (`next build &&
  next start`) and raise the worker count.
- The web app expects `enatega-multivendor-web/.env`; CI generates a placeholder
  for mock runs and a production-pointing one for nightly.
