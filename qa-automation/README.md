# Enatega QA Automation

Deterministic end-to-end automation for Enatega Customer, Store, Rider, Web,
Admin, and GraphQL surfaces.

## Coverage ledger

[AUTOMATED-COVERAGE.md](AUTOMATED-COVERAGE.md) is the source of truth for
manual QA work converted into automation. Every change that adds, removes,
renames, skips, or materially changes a test must update that ledger in the
same pull request.

## Safety

No live test or data mutation may run until `validateQaEnvironment` accepts an
exact QA hostname, tenant, and database allowlist match. Public Enatega service
hosts currently used by the applications are explicitly forbidden.

Copy `.env.example` to `.env.local` only after DevOps provides a dedicated QA
target. Never add production credentials or customer data.

## Local verification

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run qa:validate-env
```

`qa:validate-env` reads the Git-ignored `.env.local` and validates target
identity only. It performs no network request and no data mutation.

See [AUTOMATION.md](AUTOMATION.md) for the Customer Web execution strategy,
commands, CI workflows, and known constraints.

See [MOBILE-IOS.md](MOBILE-IOS.md) for the Maestro iOS toolchain, dedicated QA
build, safe smoke command, and explicitly guarded production-order procedure.
