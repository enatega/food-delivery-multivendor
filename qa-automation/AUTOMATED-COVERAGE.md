# Enatega Automated QA Coverage

This is the source of truth for manual QA work that has been converted into
automation. It records what is automated, the expected outcome, where it runs,
and whether the scenario can change production data.

Last updated: 2026-08-28

## Maintenance rule

Every pull request that adds, removes, renames, skips, or materially changes an
automated scenario must update this file in the same pull request.

When updating coverage:

1. Add or update the scenario ID and expected outcome.
2. Record the correct layer: unit, mock browser, production read-only,
   authenticated production read-only, or manual production write.
3. Update the test counts and commands if they changed.
4. Never mark a scenario automated until an executable test exists.
5. Do not interpret `Implemented` as a recent pass; GitHub Actions and the
   Playwright report are the source of truth for the latest result.

## Coverage summary

| Layer                              |   Implemented scenarios | Data source             | Automatic execution                    |
| ---------------------------------- | ----------------------: | ----------------------- | -------------------------------------- |
| Unit and safety                    |                      44 | Local only              | Every relevant push and pull request   |
| Customer Web mock browser          |                      17 | Mocked GraphQL          | Every relevant push and pull request   |
| Production read-only               |                      14 | Real production GraphQL | Nightly and manual                     |
| Authenticated production read-only | 8 including login setup | Real production GraphQL | Nightly when secrets exist, and manual |
| Production order                   |                       2 | Real production GraphQL | Manual only; order placement is opt-in |
| Customer Mobile iOS                |                      22 | Real production GraphQL | Manual; write scenario separately opted in |

The per-push quality gate currently contains 61 tests: 44 unit tests and 17
mock browser tests.

## Unit and safety coverage

| Area                     | Automated manual check                           | Expected outcome                                                   | Status      |
| ------------------------ | ------------------------------------------------ | ------------------------------------------------------------------ | ----------- |
| Customer Web environment | Load deterministic local defaults                | Safe mock defaults are selected                                    | Implemented |
| Customer Web environment | Select production read-only mode                 | Local frontend and read-only production mode remain distinct       | Implemented |
| Customer Web environment | Use an allowlisted HTTPS QA target               | Valid QA target is accepted                                        | Implemented |
| Customer Web environment | Use a non-allowlisted target                     | Configuration is rejected                                          | Implemented |
| Customer Web environment | Use insecure non-local HTTP                      | Configuration is rejected                                          | Implemented |
| Customer Web environment | Use invalid coordinates or mode                  | Configuration is rejected                                          | Implemented |
| Authentication state     | Save Customer Web authentication state           | Customer Web local storage is kept and browser cookies are removed | Implemented |
| GraphQL safety           | Send named and anonymous queries                 | Read-only queries are allowed                                      | Implemented |
| GraphQL safety           | Send `MetricsGeneral` bootstrap mutation         | Only the approved non-business mutation is allowed                 | Implemented |
| GraphQL safety           | Send customer or order mutations                 | Business mutations are blocked                                     | Implemented |
| GraphQL safety           | Send subscriptions, malformed bodies, or batches | Guard fails closed                                                 | Implemented |
| Environment loading      | Load a valid local environment file              | Values load and validate                                           | Implemented |
| Environment loading      | Load a missing environment file                  | Validation fails safely                                            | Implemented |
| QA target safety         | Use exact QA hostname, tenant, and database      | Dedicated QA target is accepted                                    | Implemented |
| QA target safety         | Omit explicit QA mode                            | Run is rejected                                                    | Implemented |
| QA target safety         | Use a public Enatega endpoint for mutations      | Run is rejected even when allowlisted                              | Implemented |
| QA target safety         | Use an incorrect hostname                        | Run is rejected                                                    | Implemented |
| QA target safety         | Use an incorrect tenant or database              | Run is rejected                                                    | Implemented |
| Run identity             | Generate an Asia/Karachi daily run ID            | Correct deterministic identifier is produced                       | Implemented |
| Run identity             | Generate a run ID in a supplied timezone         | Requested timezone is used                                         | Implemented |
| Run identity             | Use an invalid commit identifier                 | Identifier is rejected                                             | Implemented |
| Run identity             | Use an invalid timestamp                         | Timestamp is rejected                                              | Implemented |
| Delivery calculation     | Calculate identical, known, and reversed distances | Great-circle distances are accurate and symmetric                | Implemented |
| Delivery calculation     | Calculate fixed and per-kilometre charges          | Fixed rates remain fixed and distance is rounded up correctly     | Implemented |
| Restaurant availability | Evaluate active, inactive, unavailable, and malformed schedules | Only currently serviceable restaurants are reported open | Implemented |
| Customer presentation    | Generate slugs and customer initials               | Navigation slugs and profile initials are deterministic           | Implemented |
| Language direction       | Classify Arabic, Urdu, Persian, Hebrew, English, and Croatian | RTL layout is enabled only for right-to-left languages | Implemented |
| Authentication expiry    | Evaluate seconds, milliseconds, ISO, missing, and malformed expirations | Expired tokens are identified without rejecting unspecified expirations | Implemented |

## Customer Web mock browser coverage

These scenarios run against the real Customer Web frontend with deterministic
mocked GraphQL responses. They never contact production.

| ID                    | Automated manual QA task                       | Expected outcome                                               | Status      |
| --------------------- | ---------------------------------------------- | -------------------------------------------------------------- | ----------- |
| CW-P1-001             | Open Customer Web                              | Page loads without a fatal error                               | Implemented |
| CW-P1-002 / CW-P1-005 | Navigate to static pages                       | Correct routes and content render                              | Implemented |
| CW-P1-004             | Change theme and refresh                       | Selected theme persists                                        | Implemented |
| CW-P1-006             | Open an invalid route                          | Customer-friendly not-found page renders                       | Implemented |
| CW-P1-007             | Allow use of the configured current location   | Location is supplied without a browser permission prompt       | Implemented |
| CW-P1-021             | Submit a valid email with an invalid password  | Authentication error appears and no session is created         | Implemented |
| CW-P1-022             | Submit an invalid email                        | Field validation appears and no authentication request is sent | Implemented |
| CW-P1-025             | Close authentication without logging in        | No customer session is created                                 | Implemented |
| CW-P1-030             | View a serviceable restaurant listing          | Deterministic restaurant card appears                          | Implemented |
| CW-P1-035             | Open restaurant details                        | Restaurant menu loads                                          | Implemented |
| CW-P1-041             | Add a product without required options         | Validation prevents adding it                                  | Implemented |
| CW-P1-044 / CW-P1-045 | Change product quantity and add it             | Price recalculates and configured product enters the cart      | Implemented |
| CW-P1-051 / CW-P1-053 | Change cart quantity and remove the final item | Quantity updates and empty-cart state appears                  | Implemented |
| CW-P1-060             | Search for a restaurant                        | Matching deterministic result appears                          | Implemented |
| CW-P1-062             | Open the language menu                         | Language selector opens without leaving discovery              | Implemented |
| CW-P1-064             | Open cart before adding items                  | Empty-cart state appears                                       | Implemented |
| CW-P1-070             | Complete login-to-order happy path             | Mocked order is submitted once and success state appears       | Implemented |

## Production read-only coverage

These scenarios use real production GraphQL data. The read-only guard blocks
business mutations.

| ID             | Automated manual QA task              | Expected outcome                                            | Status                   |
| -------------- | ------------------------------------- | ----------------------------------------------------------- | ------------------------ |
| CW-P1-PROD-001 | Load live discovery                   | Production discovery data loads without a business mutation | Implemented              |
| CW-P1-PROD-002 | Read live application configuration   | Required production configuration is returned               | Implemented              |
| CW-P1-PROD-003 | Read live restaurants and menu items  | Real restaurant and product data is well formed             | Implemented              |
| CW-P1-PROD-004 | Open a live restaurant                | Restaurant page and menu render                             | Implemented              |
| CW-P1-PROD-005 | Search live restaurant data           | Matching production result appears                          | Implemented              |
| CW-P1-PROD-006 | Read nearby cuisines                  | Real cuisine records are returned                           | Implemented              |
| CW-P1-PROD-007 | Read top-rated vendors                | Review averages are valid                                   | Implemented              |
| CW-P1-PROD-008 | Compare a restaurant review aggregate | Aggregate and review data are self-consistent               | Implemented              |
| CW-P1-PROD-009 | Paginate nearby restaurants           | Pages do not repeat restaurant IDs                          | Implemented              |
| CW-P1-PROD-010 | Load a restaurant by ID and slug      | Full live menu is returned                                  | Implemented              |
| CW-P1-PROD-011 | Render a top-rated vendor             | Vendor returned by GraphQL appears in the UI                | Conditional on live data |
| CW-P1-PROD-012 | Filter and clear restaurant search    | List filters and then restores                              | Conditional on live data |
| CW-P1-PROD-013 | Request a restaurant page size        | Backend respects the requested limit                        | Implemented              |
| CW-P1-PROD-014 | Read restaurant opening times         | Returned schedule is well formed                            | Implemented              |

## Authenticated production read-only coverage

These scenarios use the dedicated automation customer. They require
`QA_CUSTOMER_EMAIL` and `QA_CUSTOMER_PASSWORD`.

| ID             | Automated manual QA task                                   | Expected outcome                                                                                               | Status                      |
| -------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------- |
| Setup          | Confirm the QA account exists, then log in with email and password | Registration is never entered accidentally and a reusable Customer Web session is saved securely               | Implemented                 |
| CW-P1-PROD-020 | Refresh authenticated session                              | Customer session is restored                                                                                   | Implemented                 |
| CW-P1-PROD-090 | Open profile                                               | Real customer details appear                                                                                   | Implemented                 |
| CW-P1-PROD-092 | Open order history                                         | Real active and past orders load                                                                               | Implemented                 |
| CW-P1-PROD-094 | Open saved addresses                                       | Real saved addresses load                                                                                      | Implemented                 |
| CW-P1-PROD-096 | Open settings                                              | Session remains active and real email appears                                                                  | Implemented                 |
| CW-P1-PROD-098 | Open favourites                                            | Real favourites are read when the page requests them                                                           | Conditional on page request |
| CW-P1-PROD-083 | Browse, configure product, update cart, and reach checkout | Real item, quantity, COD, subtotal, tax, total, and enabled order button are verified without placing an order | Implemented                 |

## Manual production-write coverage

These scenarios are intentionally excluded from push, pull-request, and nightly
automation.

| ID             | Automated manual QA task                | Expected outcome                                                    | Status                                 |
| -------------- | --------------------------------------- | ------------------------------------------------------------------- | -------------------------------------- |
| CW-P1-PROD-200 | Build a cart using live production data | An available product meeting the restaurant minimum enters the cart | Manual command only                    |
| CW-P1-PROD-201 | Place a real COD pickup order           | One order is created and its tracking route opens                   | Opt-in with `QA_PLACE_REAL_ORDER=true` |

## Customer Mobile iOS coverage

| ID | Web coverage mapped | Maestro scenario | Execution |
| --- | --- | --- | --- |
| CM-P0-001 | CW-P1-001, CW-P1-007 | Clean launch, in-use location, discovery load | Production read-only smoke |
| CM-P0-002 | CW-P1-021, CW-P1-022 | Invalid email validation, then dedicated-account login | Production read-only smoke |
| CM-P0-003 | CW-P1-030, CW-P1-035, CW-P1-060 | Search allowlisted restaurant and open menu | Production read-only smoke |
| CM-P0-004 | CW-P1-041, CW-P1-044/045 | Required option, quantity change, add allowlisted product | Production read-only smoke |
| CM-P0-005 | CW-P1-051/053, CW-P1-110/111 | Cart quantity and persistence after app restart | Production read-only smoke |
| CM-P0-006 | CW-P1-100–105, CW-P1-120–123 | Pickup, COD, subtotal, tax, total and maximum ceiling | Production read-only smoke |
| CM-P0-007 | CW-P1-070, CW-P1-PROD-200/201 | One Run-ID COD pickup order, details, cancellation | Explicit manual production write only |
| CM-P1-007 | CW-P1-020, CW-P1-052 | Guest may browse and build a cart but is denied the checkout control; signing in restores it | Production read-only regression |
| CM-P1-008 | CW-P1-031, CW-P1-032 | Unmatchable query renders the empty state; clear control retracts it and search recovers | Production read-only regression |
| CM-P1-009 | CW-P1-051, CW-P1-054 | Cart stepper raises and lowers quantity; the last decrement removes the line and hides checkout | Production read-only regression |
| CM-P1-010 | CW-P1-101, CW-P1-104 | Delivery total never undercuts pickup and returning to pickup restores the exact total | Production read-only regression |
| CM-P1-011 | CW-P1-023, CW-P1-110 | Session survives a restart that keeps storage, and a cleared install restores the auth wall | Production read-only regression |
| CM-P1-012 | CW-P1-PROD-090, CW-P1-PROD-096 | Profile hub renders and the Account screen reports the email and name of the customer that signed in | Production read-only regression |
| CM-P1-013 | CW-P1-PROD-092 | Current and Past order tabs each resolve to real orders or to their own empty state; a past order opens a detail carrying an order number | Production read-only regression |
| CM-P1-014 | CW-P1-PROD-094 | Saved addresses resolve to rows or the empty state, and the add-address control opens the map picker | Production read-only regression |
| CM-P1-015 | CW-P1-PROD-098 | Favourites open from the hub and contain restaurant cards; with no favourites the section is absent rather than broken | Production read-only regression |
| CM-P1-016 | Mobile-only | Cancelling the logout prompt is safe; confirming clears the persisted session so a restart still lands on the auth wall | Production read-only regression |
| CM-P1-017 | Mobile-only | A tip raises the delivery total by exactly the tip, and switching to pickup zeroes it and restores the original pickup total | Production read-only regression |
| CM-P1-018 | Mobile-only | An invalid voucher is rejected, the apply-voucher entry point stays offered, and the total is unchanged to the cent | Production read-only regression |
| CM-P1-019 | CW-P1-041, CW-P1-044 | Add-to-cart is inert until a required addon is chosen, the quantity stepper will not fall below 1, and the configured quantity carries into the cart | Production read-only regression |
| CM-P1-020 | CW-P1-100 | Cash and card are both offered, switching between them never reprices the order, and card selection does not leave checkout | Production read-only regression |
| CM-P2-001 | Mobile-only | Adding a product from a second restaurant prompts before replacing the cart: declining preserves it, accepting empties it | Production read-only, extra fixtures |

## Commands

Run from `qa-automation`:

```sh
npm run typecheck
npm run lint
npm run test:unit
npm run test:web:mock
npm run test:web:production-smoke
npm run test:web:production-authenticated
npm run test:web:production-order
npm run report:web
npm run mobile:preflight:ios
npm run test:mobile:ios:smoke
npm run test:mobile:ios:regression
npm run test:mobile:ios:multi-vendor
npm run test:mobile:ios:production-order
npm run report:mobile
```

Build Customer Web from `enatega-multivendor-web`:

```sh
npm ci --legacy-peer-deps
npm run build
```

## CI reporting

- Relevant pushes and pull requests run unit and mock browser coverage.
- Nightly runs execute production read-only coverage.
- GitHub commit and pull-request checks show pass or failure.
- Playwright HTML and JUnit reports are uploaded as workflow artifacts.
- A skipped conditional live-data scenario is not equivalent to a pass and
  should be reviewed in the report.
