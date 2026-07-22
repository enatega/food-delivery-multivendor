# Enatega QA Automation

Deterministic end-to-end automation for Enatega Customer, Store, Rider, Web,
Admin, and GraphQL surfaces.

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
```

Browser and mobile flows will be added after the QA environment, accounts,
fixtures, and exact Store preparation/ready state mapping are approved.
