# Enatega QA Automation — Approach, Work Delivered, and Impact

**Scope:** Customer Web (`enatega-multivendor-web`), with scaffolding in place for Store, Rider, Admin, and mobile.
**Automation home:** `qa-automation/`
**Branch:** `chore/qa-automation-foundation`
**Document date:** 2026-07-31

---

## 1. Executive summary

The Enatega QA process was manual: a tester walked the Customer Web P1 checklist —
open the app, browse discovery, configure a product, build a cart, log in, reach
checkout, verify totals — by hand, on every release candidate. That is slow,
non-repeatable, and it produces no artifact anyone can audit afterwards.

The work in `qa-automation/` converts that checklist into **85 executable
scenarios** across five layers, wired into CI so that the deterministic majority
runs automatically on every relevant push, and the live-data minority runs on a
nightly schedule.

The single most important design decision: **the suite is architecturally
incapable of mutating production data.** Every GraphQL request from a
production-facing test passes through a guard that allows queries and exactly one
non-business mutation, and blocks everything else. Order placement against a live
backend exists as a separate, opt-in, manual-only project that CI never invokes.

| Metric | Before | After |
|---|---|---|
| P1 Customer Web regression pass | Manual, ~half a day | 61 tests, automatic, minutes |
| Executes without a human | No | Yes — push + nightly |
| Evidence of a run | Tester's word | HTML report + trace + video + JUnit XML |
| Risk of test data reaching production | Present | Structurally blocked |
| Live-backend contract checked | Ad hoc | 22 scenarios, nightly |

---

## 2. The approach

### 2.1 Layer by cost, not by convenience

The governing principle is a **test pyramid weighted by determinism**. A test
that depends on live production data is valuable — it is the only thing that
proves the real backend contract still holds — but it is also the only thing that
can fail for reasons unrelated to the code under review. A restaurant closes, a
menu item sells out, a rating shifts, and a per-commit assertion on that data
turns red for no engineering reason. Once a check goes red for reasons nobody can
act on, the team stops reading it, and the whole gate loses its value.

So the suite splits along exactly that line:

| Layer | Location | Network | Cadence | What it proves |
|---|---|---|---|---|
| **Unit & safety** | [tests/unit/](tests/unit/) | none | every push | Config validation, the read-only guard, run identity, auth-state handling, pure business logic |
| **Mock browser** | [tests/web/customer/mock/](tests/web/customer/mock/) | mocked GraphQL | every push | Real UI against deterministic data: navigation, auth errors, discovery → cart → checkout → order |
| **Production read-only (API)** | [production-readonly/catalog-api.spec.ts](tests/web/customer/production-readonly/catalog-api.spec.ts) | real GraphQL, queries only | nightly + manual | The live schema, aggregates, and pagination contract |
| **Production read-only (UI)** | [production-readonly/](tests/web/customer/production-readonly/) | real GraphQL + browser | nightly + manual | The real frontend renders real data |
| **Authenticated production** | [production-auth/](tests/web/customer/production-auth/) | real GraphQL + saved session | nightly + manual | Profile, addresses, order history, checkout totals — no order placed |
| **Production write** | [production-order/](tests/web/customer/production-order/) | real GraphQL | **manual, opt-in only** | A real COD order end to end |

**The rule that follows from this:** only the hermetic layers gate a merge. Unit
and mock are deterministic, so a red check is always a real regression and always
actionable. Everything that touches live data is informational and runs on a
schedule.

### 2.2 Safety as an architectural property, not a convention

"Don't point the tests at production" is a convention, and conventions fail under
deadline pressure. The suite instead makes the unsafe thing hard to express.

Four independent mechanisms:

**a. The GraphQL read-only guard** — [src/safety/graphql-read-only-guard.ts](src/safety/graphql-read-only-guard.ts)

A pure function inspects each request body, extracts the operation type and name,
and returns an allow/deny decision:

```ts
const allowedMutations = new Set(['MetricsGeneral'])
// ...
const allowed =
  type === 'query' ||
  (type === 'mutation' && allowedMutations.has(operationName))
```

Queries pass. Anonymous queries (`{ ... }`) pass. `MetricsGeneral` — the token
bootstrap the app itself performs on load — passes. Every other mutation,
every subscription, every malformed or batched body is denied. The guard **fails
closed**: an unparseable body returns `allowed: false`, not a pass-through.

Being a pure function, it is unit-tested independently of any browser
(`tests/unit/graphql-read-only-guard.spec.ts`) — so the safety property itself is
regression-tested on every push, in milliseconds.

**b. Enforcement at the network boundary** — [production-read-only.ts](tests/web/customer/support/production-read-only.ts)

`installProductionReadOnlyGuard(page)` routes all `**/graphql` traffic through
the guard and returns a live monitor:

```ts
export type ProductionReadOnlyMonitor = {
  allowedOperations: string[]
  blockedOperations: string[]
}
```

A blocked mutation is fulfilled with a synthetic GraphQL error — it never reaches
the network. Specs then assert `blockedOperations` is empty, which means a test
that *accidentally starts* mutating production doesn't silently succeed; it fails
loudly with the offending operation named.

**c. Target allowlisting before anything runs** — [qa-environment.ts](src/config/qa-environment.ts), [customer-web-environment.ts](src/config/customer-web-environment.ts)

Any mutating (`qa`-mode) run must clear a hard gate before a single request is
sent: `QA_ENV` must be exactly `"true"`, the hostname/tenant/database must each
match an explicit allowlist, the URL must be HTTPS (localhost excepted), must
carry no embedded credentials, and must target `/graphql`. Independently, the two
public Enatega backends are on a **hard-coded denylist** that no allowlist entry
can override:

```ts
const forbiddenHostnames = new Set([
  'aws-server.enatega.com',
  'aws-server-v2.enatega.com'
])
```

So even a misconfigured `.env` that allowlists production cannot produce a
mutating run against it.

**d. Physical separation of the write path**

Real order placement lives in its own Playwright project,
`customer-production-order`, referenced by no CI workflow, and gated behind an
explicit `QA_PLACE_REAL_ORDER=true` opt-in. The config comments the intent
directly at the definition site so it isn't casually wired into a pipeline later.

### 2.3 Determinism through a mock GraphQL layer

The mock browser layer runs the **real Next.js Customer Web frontend** — not a
stub — against an intercepted GraphQL endpoint
([mock-graphql.ts](tests/web/customer/support/mock-graphql.ts)). Playwright's
`webServer` boots the app with `NEXT_PUBLIC_SERVER_URL` pointed at a
`/__qa-api/` path, which the route handler intercepts:

```ts
await page.route('**/__qa-api/graphql', async (route) => { ... })
```

Handlers are keyed by operation name, with per-spec overrides layered over shared
defaults. The mock also records `operations` and `unhandledOperations`, so a spec
can assert *which* calls the UI made — for example, that submitting an invalid
email produces **no** authentication request at all, which is a stronger
assertion than merely checking that an error message appeared.

This is what makes `CW-P1-070` — full login → discovery → product configuration →
cart → checkout → COD order → tracking redirect — run in CI, repeatably, with
zero backend dependency.

### 2.4 Page Object Model with a fixture seam

UI knowledge lives in [src/pages/customer/](src/pages/customer/) — `BasePage`,
`DiscoveryPage`, `RestaurantPage`, `CartPage`, `CheckoutPage`, `LoginPage`,
`OrderTrackingPage` — composed into a single
[CustomerApp](src/pages/customer/customer-app.ts) facade and injected via the
`customerApp` fixture in [tests/fixtures/customer-test.ts](tests/fixtures/customer-test.ts).

The division of labour is explicit: **page objects own locators, navigation, and
user actions; specs own scenario assertions, test data, and orchestration.** The
happy-path spec reads as prose:

```ts
await customerApp.login.login(email, password)
await customerApp.discovery.openRestaurant('mock-restaurant')
await customerApp.restaurant.selectProduct('mock-burger')
await customerApp.restaurant.chooseOption(/garlic sauce/i)
await customerApp.cart.proceedToCheckout()
await customerApp.checkout.selectPickup()
await customerApp.checkout.placeOrder()
```

The page objects are deliberately thin — 193 lines total across seven classes.
That is the point: they concentrate the churn. When the checkout markup changes,
one file changes, not fourteen specs.

### 2.5 Stable selectors contributed back to the app

Automation built on CSS classes or visible text is automation that breaks on the
next redesign or the next translation. Rather than accept that, the work added
**26 `data-testid` attributes** to Customer Web at exactly the points automation
needs to anchor:

`customer-auth-dialog`, `auth-stepper`, `auth-close`, `customer-login-trigger`,
`theme-toggle`, `language-menu-trigger`, `customer-cart-trigger`, `customer-cart`,
`cart-item-{id}`, `cart-item-quantity`, `go-to-checkout`, `add-to-cart`,
`restaurant-card-{id}`, `product-card-{id}`, `checkout-page`,
`checkout-item-{id}`, `checkout-item-quantity`, `checkout-subtotal`,
`checkout-tax`, `checkout-total`, `place-order`.

ID-parameterised test IDs (`restaurant-card-${item._id}`) mean a spec targets a
specific known entity rather than "the third card" — which is what makes
assertions survive reordering and pagination.

These are additive, render-only attributes; they carry no behaviour and no
production cost.

### 2.6 Deterministic run identity

[src/run/run-id.ts](src/run/run-id.ts) produces `daily-YYYYMMDD-HHMM-{sha7}` in
**Asia/Karachi** — the team's timezone, so a "nightly" bucket matches the working
day people actually reason about, rather than drifting across a UTC boundary
mid-shift. Commit SHA and timestamp are both validated, so a run can always be
tied back to the exact code that produced it.

---

## 3. What has been built

### 3.1 Coverage delivered — 85 scenarios

| Layer | Scenarios | Data source | Execution |
|---|---:|---|---|
| Unit and safety | **44** | Local only | Every relevant push / PR |
| Customer Web mock browser | **17** | Mocked GraphQL | Every relevant push / PR |
| Production read-only | **14** | Real production GraphQL | Nightly + manual |
| Authenticated production read-only | **8** (incl. login setup) | Real production GraphQL | Nightly when secrets exist |
| Production order (write) | **2** | Real production GraphQL | Manual, opt-in only |
| **Per-push quality gate** | **61** | Hermetic | **Automatic** |

Full scenario-by-scenario detail, with IDs and expected outcomes, is maintained in
[AUTOMATED-COVERAGE.md](AUTOMATED-COVERAGE.md).

**Unit and safety (44)** — Customer Web environment validation (defaults,
read-only mode, allowlisted target, rejection of non-allowlisted hosts, rejection
of insecure non-local HTTP, invalid coordinates); auth-state handling (Customer
Web local storage retained, browser cookies stripped); the GraphQL guard (named
and anonymous queries allowed, `MetricsGeneral` allowed, business mutations
blocked, subscriptions/malformed/batched bodies fail closed); environment-file
loading; QA target safety (exact hostname/tenant/database, rejection of implicit
mode, rejection of public endpoints even when allowlisted); run identity; and
extracted business logic — great-circle delivery distance, fixed vs
per-kilometre charges, restaurant availability from opening schedules, slug and
initials generation, RTL classification across Arabic/Urdu/Persian/Hebrew vs
English/Croatian, and token-expiry evaluation across seconds/milliseconds/ISO/
missing/malformed forms.

**Mock browser (17)** — app boot, static routes, theme persistence across
refresh, customer-friendly not-found, geolocation without a permission prompt,
authentication error paths (valid email + wrong password, invalid email format,
dialog dismissal), restaurant listing and detail, required-option validation,
quantity and price recalculation, cart quantity change and empty-cart state,
search, language menu, and the full `CW-P1-070` login-to-order happy path.

**Production read-only (14)** — live discovery, application configuration,
restaurants and menu items, restaurant page render, live search, nearby cuisines,
top-rated vendors, review-aggregate self-consistency, pagination without repeated
IDs, restaurant-by-ID-and-slug full menu, page-size limits, and opening-time
schema.

**Authenticated production read-only (8)** — a login setup project that
first confirms the QA account exists via `EmailExist` before submitting
credentials (so a typo can never accidentally walk into registration), then saves
a customer-scoped session; followed by session restore, profile, order history,
saved addresses, settings, favourites, and `CW-P1-PROD-083` — browse, configure a
product, update the cart, reach checkout, and verify item, quantity, COD,
subtotal, tax, total, and an enabled order button **without placing an order.**

### 3.2 Infrastructure

**Playwright configuration** — [playwright.config.ts](playwright.config.ts)
defines 13 projects: the customer mock/QA/mobile/Firefox/WebKit matrix, the
production smoke, auth-setup, authenticated and order projects, plus admin, unit,
and preflight. Cross-browser and mobile runs are `grep`-gated on `@cross-browser`
and `@mobile` tags, so breadth is opt-in rather than a tax on every run.

Notable decisions encoded there:

- `trace: 'retain-on-failure'`, `screenshot: 'only-on-failure'`,
  `video: 'retain-on-failure'` — full forensics on failure, no storage cost on
  success.
- Traces/screenshots/video are **off** for the auth-setup and authenticated
  projects, so real credentials and session tokens are never captured into an
  artifact that gets uploaded to CI.
- `retries: 1` in CI only; zero locally, so local flake is visible rather than
  hidden.
- `forbidOnly` under CI — a stray `test.only` fails the build instead of silently
  skipping the suite.
- Worker count auto-caps to 1 whenever the suite boots the shared Next.js dev
  server, with a `QA_WEB_WORKERS` override for a faster production build.
- Fixed geolocation (`33.6844, 73.0479`) for every run, so location-dependent
  results are reproducible.

**Auth state handling** — [src/auth/customer-auth-state.ts](src/auth/customer-auth-state.ts)
derives a customer-scoped storage state: Customer Web local storage is retained,
browser cookies are stripped, and the file is written with mode `0o600`.

**Reporting** — HTML (`reports/playwright`), JUnit XML (`reports/junit`), and the
GitHub reporter for inline PR annotations, all emitted from a single run.

### 3.3 CI/CD

**[qa-checks.yml](../.github/workflows/qa-checks.yml) — every push and PR**

Path-filtered to `qa-automation/**` and `enatega-multivendor-web/**`, with
`cancel-in-progress` concurrency so superseded commits don't burn runners.

1. `static` — typecheck, lint, unit. No external dependencies, fails in under a
   minute.
2. `mock-web` — needs `static`; installs Chromium (cached by lockfile hash) and
   Customer Web, generates a placeholder `.env`, runs the mock suite.

Both jobs are hermetic, so a red check is a real regression. Reports upload as
artifacts on `always()`, 7-day retention.

**[qa-nightly.yml](../.github/workflows/qa-nightly.yml) — 02:00 UTC + manual**

Points Customer Web at production, runs the read-only smoke, then — only if
`QA_CUSTOMER_EMAIL` and `QA_CUSTOMER_PASSWORD` are configured — establishes a
session and runs the authenticated suite. Absent secrets degrade gracefully: the
read-only smoke still runs and the authenticated steps skip. Never gates a merge.
14-day artifact retention.

### 3.4 Documentation and process

- [AUTOMATED-COVERAGE.md](AUTOMATED-COVERAGE.md) — the coverage ledger, mapping
  each manual QA task to its scenario ID, expected outcome, layer, and status.
- [AUTOMATION.md](AUTOMATION.md) — strategy, run commands, CI, and constraints.
- [README.md](README.md) — entry point and safety statement.

A **maintenance rule** is written into the ledger and enforced by review: every PR
that adds, removes, renames, skips, or materially changes a scenario must update
the ledger in the same PR. Two supporting rules matter as much: *never mark a
scenario automated until an executable test exists*, and *`Implemented` is not
evidence of a recent pass — CI and the Playwright report are.* Those keep the
ledger from decaying into the aspirational spreadsheet that coverage documents
usually become.

---

## 4. How this makes QA faster and more efficient

### 4.1 Wall-clock: half a day becomes minutes

The 61-test per-push gate replaces the manual P1 walkthrough. It runs
unattended, in parallel with review, and reports back before a human would have
finished setting up. The gain is not just the elapsed time — it is that the cost
is now **zero marginal human attention.** Running it a fifth time today costs
nothing, so nobody rations it.

### 4.2 Defects are caught at the cheapest point

A bug found in review costs a comment. The same bug found in staging costs a
context switch; found in production, an incident. Because the gate is path-
filtered to the two directories that matter and finishes in minutes, feedback
lands while the author still has the change in their head — the point where a fix
is cheapest.

The layering compounds this. Pure logic — RTL classification, delivery-charge
maths, opening-schedule evaluation, token expiry — is verified in milliseconds by
unit tests, not by booting a browser and clicking to the screen that happens to
display the result. Only genuinely UI-level behaviour pays browser cost.

### 4.3 Triage time collapses

Manual QA produces "checkout looked wrong." Automation produces a named scenario,
a stack trace, a screenshot at the point of failure, a video of the run, and a
Playwright trace with the full DOM and network timeline — and for production
tests, the exact list of GraphQL operations that were allowed and blocked. The
reproduction step disappears entirely, because the failure is already recorded.

### 4.4 QA time shifts from regression to exploration

This is the largest efficiency gain and the least visible one. Regression testing
is repetitive, and repetition is what humans do worst and machines do best.
Exploratory testing, usability judgement, edge-case invention, and risk analysis
are what humans do best and machines cannot do at all. Automating the 61-test
regression pass doesn't reduce headcount — it **moves the same people onto work
that finds different bugs.**

### 4.5 Trust in the signal is protected

The strict separation between merge-gating and informational layers is what keeps
this durable. Teams abandon CI checks when they go red for reasons nobody can
act on. By keeping every live-data assertion off the per-push path, a red
`qa-checks` run means one thing: *this change broke something.* That is the
property worth defending, and the architecture defends it rather than relying on
discipline.

The complementary rules: `retries: 1` absorbs transient blips, but a test
needing more than one retry is treated as a bug to fix, not a nuisance to paper
over — target flake is **under 1%**. Locally, retries are off, so flake surfaces
where it is cheapest to diagnose.

### 4.6 Release confidence becomes evidence, not assertion

"QA passed" is now a link: a specific run, a specific commit SHA, a specific
timestamp in a specific timezone, an HTML report, and a JUnit XML that any
dashboard can ingest. Release decisions rest on artifacts rather than
recollection.

### 4.7 The suite is cheap to extend

Adding a scenario is now a small, well-defined task with an obvious home:

- **New UI behaviour** → a mock spec plus, if needed, a page-object method.
- **New backend contract** → a read-only API test via
  `createReadOnlyGraphqlClient(request)`, which handles token bootstrap and error
  assertions.
- **New authenticated flow** → install the guard in `beforeEach`, observe the
  real GraphQL response, assert on the payload rather than fragile DOM.
- **A different surface** (Store, Rider, Admin, mobile) → the same pyramid;
  Playwright projects are already scaffolded.

Low marginal cost is what determines whether coverage grows after the initial
push or stalls. This is designed for the growth case.

### 4.8 The catastrophic failure mode is engineered out

A test suite that can write to production is a liability that eventually gets
exercised. Between the read-only guard, its independent unit tests, the
network-boundary enforcement with assertion-backed monitoring, the allowlist plus
hard-coded denylist, and the physical separation of the write path, the suite can
be pointed at production by anyone on the team without anyone needing to hold the
safety rules in their head. **Safety that depends on remembering is safety that
fails; safety that depends on the type system and the network layer does not.**

---

## 5. Running it

Node 20+ is required for the browser suites — the Next.js Customer Web dev server
will not boot on Node 18.

```sh
cd qa-automation
npm ci

# Static gates (seconds)
npm run typecheck && npm run lint && npm run test:unit

# Deterministic browser tests — boots Customer Web with mocked GraphQL
npm run test:web:mock

# Real GraphQL, read-only
npm run test:web:production-smoke

# Authenticated. Production rate-limits each email to five existence checks
# per 15 minutes, so do not re-run this before every local test.
npm run auth:web:production
npm run test:web:production-authenticated

# Reuse the saved session while developing
npm run test:web:production-authenticated -- --no-deps --headed --workers=1

# Interactive
npm run test:web:ui
npm run report:web
```

**Required repository secrets** (Settings → Secrets → Actions):

| Secret | Used by | Notes |
|---|---|---|
| `QA_CUSTOMER_EMAIL` | Authenticated suite | A dedicated automation account, never a real customer |
| `QA_CUSTOMER_PASSWORD` | Authenticated suite | — |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Customer Web boot | Optional; maps degrade gracefully without it |

---

## 6. Known constraints

- **Node 20+** required for browser suites; the default environment here ships
  Node 18.
- The mock and production browser projects share a single Customer Web **dev
  server**, so they run at `workers: 1`. Building once (`next build && next
  start`) and raising `QA_WEB_WORKERS` is the available speedup and the clearest
  next optimisation.
- Customer Web expects `enatega-multivendor-web/.env`; CI generates a placeholder
  for mock runs and a production-pointing one for nightly.
- Production rate-limits email-existence checks to five per email per 15 minutes,
  which constrains how often the auth setup can be re-run.
- Two production scenarios (`CW-P1-PROD-011`, `CW-P1-PROD-012`) are conditional on
  live data. A skip there is **not** a pass and should be reviewed in the report.

---

## 7. Recommended next steps

1. **Make `static` and `mock-web` required status checks on `main`.** The suite is
   built to gate merges; the gate is only real once branch protection enforces it.
2. **Provision the dedicated QA customer account and configure the secrets**, so
   the nightly job exercises its authenticated half.
3. **Switch the CI web server to a production build** and raise `QA_WEB_WORKERS` —
   the single largest available reduction in browser-suite wall time.
4. **Enable the cross-browser and mobile projects on a schedule.** The projects and
   tags already exist; only the workflow wiring is missing.
5. **Extend the pyramid to Store, Rider, and Admin**, starting with the unit and
   mock layers where the cost-to-value ratio is best.
6. **Track flake explicitly** against the sub-1% target, using the JUnit XML the
   suite already emits.
