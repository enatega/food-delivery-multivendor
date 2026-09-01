# Customer Web QA Automation — Work Report

**Repo:** `enatega/food-delivery-multivendor`
**Branch:** `chore/qa-automation-foundation`
**Suite location:** `qa-automation/`
**Date:** 2026-07-24

---

## 1. Summary

The Customer Web surface now has a layered, production-safe Playwright suite of
**63 tests** across four tiers, a fixed flaky-parallelism bug, and two GitHub
Actions workflows that turn every push into a signal and run real-GraphQL checks
nightly.

| Tier | Tests | Network | When it runs |
|------|:-----:|---------|--------------|
| Unit | 22 | none | every push |
| Mock browser | 15 | mocked GraphQL | every push |
| Read-only (real GraphQL) | 14 | live queries only | nightly / on demand |
| Authenticated (real GraphQL) | 7 (+1 login setup) | live + saved session | nightly / on demand |
| Preflight | 1 | none | local / on demand |

Status: **typecheck ✅ · lint ✅ · all suites green** on Node 20.

---

## 2. Changes made in this effort

### New test coverage (15 test cases)

| File | Tests | What it covers |
|------|:-----:|----------------|
| `production-readonly/catalog-api.spec.ts` | 7 | Real GraphQL read-only API: cuisines, top-rated vendors, review aggregates, pagination, page-size limits, opening-time shape, full menu by id/slug |
| `production-readonly/discovery-ui.spec.ts` | 2 | Real data rendered in the browser: top-rated vendor visible, live search filter + restore |
| `production-auth/profile-data.spec.ts` | 3 | Authenticated read-only: saved addresses, settings session + real email, favourites |
| `mock/discovery-search.spec.ts` | 3 | Deterministic UI: search by query, language menu, empty cart |

### New shared helper

- `support/production-graphql.ts` — `createReadOnlyGraphqlClient(request)`: mirrors
  the app's `MetricsGeneral` token bootstrap, issues **queries only**, and asserts
  GraphQL/HTTP errors. Removes duplicated token logic from specs.

### Bug fixed

- **Flaky parallelism** in `playwright.config.ts`. `fullyParallel` with many
  workers hammered a single shared Customer Web dev server — 7 of 12 mock tests
  failed intermittently. Workers are now capped to 1 whenever the dev server is
  booted (override via `QA_WEB_WORKERS`). Mock suite went from **5/12 flaky → 15/15
  stable** on the default command.

### CI/CD

- `.github/workflows/qa-checks.yml` — per push/PR (path-filtered): static gate
  (typecheck + lint + unit) then deterministic mock browser suite. Failures
  annotate inline on the PR; HTML/JUnit reports upload as artifacts.
- `.github/workflows/qa-nightly.yml` — scheduled 02:00 UTC + manual: real-GraphQL
  read-only smoke, then authenticated suite when customer secrets are present.

### Documentation

- `qa-automation/AUTOMATION.md` — strategy, safety model, run commands, CI wiring,
  required secrets, and the operating model for growing the suite.

---

## 3. Safety model

No test can mutate production:

- `src/safety/graphql-read-only-guard.ts` permits queries + exactly one mutation
  (`MetricsGeneral`, the app's own token bootstrap); every other mutation is blocked.
- Browser tests route all `**/graphql` through `installProductionReadOnlyGuard` and
  assert `blockedOperations` is empty.
- The read-only API client issues queries only.
- `validateCustomerWebEnvironment` refuses non-allowlisted hosts for any mutating run.

Real endpoint under test: `https://aws-server-v2.enatega.com/graphql`.

---

## 4. How to run

> Browser suites require **Node 20+** (Node 18 fails to boot the Next.js dev server).

```sh
cd qa-automation && npm ci
npm run typecheck && npm run lint && npm run test:unit   # static gate
npm run test:web:mock                                    # deterministic browser
npm run test:web:production-smoke                         # real GraphQL, read-only
npm run auth:web:production && npm run test:web:production-authenticated
```

---

## 5. Verification (this run)

- Unit: **22 passed**
- Mock browser (default command): **15 passed** (previously flaky)
- Production read-only (API + UI): **14 passed** against live GraphQL
- Authenticated: **4 passed** (incl. login setup)
- typecheck + lint: clean

---

## 6. To activate CI

1. Add repository secrets: `QA_CUSTOMER_EMAIL`, `QA_CUSTOMER_PASSWORD`
   (optional `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`).
2. Make **static** and **mock-web** required status checks on `main`.
3. Nightly runs automatically; trigger on demand via *Actions → QA Nightly → Run*.

---

## 7. Recommended next steps

- Add a `next build && next start` CI step so browser tests can run at higher
  worker counts (faster) instead of the dev server.
- Extend the same pyramid to Admin (project already stubbed in the config).
- Add Store / Rider / mobile (Maestro) P0 smoke.
- Track flake toward the <1% target; fix any test that needs >1 retry.
