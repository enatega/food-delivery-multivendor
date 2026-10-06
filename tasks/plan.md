# Implementation Plan: Customer Web Discovery-to-Cart Automation

## Overview

Add the next production-safe P1 automation slice: mocked discovery results, opening a restaurant, validating required product choices, adding a configured product, and updating/removing it from the cart.

## Architecture Decisions

- Keep all business-flow tests in `customer-mock-chromium`; no production mutation is permitted.
- Reuse Customer Web’s real components and GraphQL client while intercepting GraphQL at the browser boundary.
- Add stable test IDs only to ambiguous dynamic cards and controls; continue using roles and accessible names elsewhere.

## Task List

### Phase 1: Discovery contract

- [x] Task 1: Add reusable restaurant/menu GraphQL fixtures.
- [x] Task 2: Verify discovery lists a restaurant and opens its menu.

### Checkpoint: Discovery

- [x] Focused discovery tests pass.
- [x] No request reaches a forbidden production host.

### Phase 2: Product and cart flow

- [x] Task 3: Verify required add-on validation and product total calculation.
- [x] Task 4: Verify adding, incrementing, decrementing, and removing a cart item.

### Checkpoint: Complete

- [x] Mock browser tests pass.
- [x] Unit tests, typecheck, lint, and `git diff --check` pass.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| GraphQL mock drifts from Customer Web schema | High | Build fixture shapes directly from current query selections |
| Dynamic cards have ambiguous locators | Medium | Add scoped `data-testid` values using record IDs |
| Cart state leaks between tests | Medium | Start every test in a fresh Playwright browser context |
| Production host is contacted accidentally | High | Keep the forbidden-host monitor active in each flow |

## Open Questions

- Live mutation coverage remains blocked until a dedicated QA backend/database is available.
