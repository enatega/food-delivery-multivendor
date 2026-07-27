# Rider App Audit — Skipped Issues (deferred)

These findings were **intentionally left for a later pass** because they are
Critical/High severity, require a **package migration**, a **backend schema
change**, **CI / EAS-secrets coordination**, or are otherwise a "big change"
that is not safe to apply in isolation. See
[`AUDIT-REMEDIATION-FIXED.md`](./AUDIT-REMEDIATION-FIXED.md) for what was done.

---

## Critical / High Security — deferred

| ID | Severity | Finding | Why deferred |
|----|----------|---------|--------------|
| SEC-001 | Critical | Hardcoded test credentials pre-filled in login | Critical — requires removing the pre-filled creds/label and disabling the backend test account (product + backend decision). |
| SEC-002 | Critical | Firebase API key in git (`google-services.json`) | Requires key rotation in Google Cloud, `.gitignore` + history rewrite, and EAS build-time injection. |
| SEC-003 | Critical | Backend returns rider password; re-sent in mutation vars | Backend schema change; client cleanup must be coordinated with it. |
| SEC-004 | High | Two Sentry DSNs hardcoded | Move to `EXPO_PUBLIC_SENTRY_DSN` at EAS build time (secrets/CI). |
| SEC-005 | High | Production GraphQL URLs hardcoded | Move to `EXPO_PUBLIC_GRAPHQL_URL` / `_WS_` env vars (secrets/CI). |
| SEC-006 | High | Auth token falls back to plaintext AsyncStorage | Security-sensitive storage refactor; needs device testing. |
| SEC-008 | High | `useContext` at module level in `environment.ts` | Tied to the env-var/Sentry rework (SEC-004/005); larger refactor. |
| SEC-009 | High | Deprecated `subscriptions-transport-ws` | **Package migration** to `graphql-ws`; requires server protocol confirmation. |

## Medium / Low Security — deferred (coordination required)

| ID | Severity | Finding | Why deferred |
|----|----------|---------|--------------|
| SEC-007 | Medium | `rider-id` stored in plaintext AsyncStorage | Moving it to SecureStore breaks the `asyncStorageEmitter` reactive update path that `user.context` relies on (`emit` fires on `setItem`). Needs a coordinated reactivity refactor, not a drop-in change. |
| SEC-010 | Medium | Apple developer credentials in `eas.json` | Requires EAS Secrets (`$APPLE_ID`, `$ASC_APP_ID`, `$APPLE_TEAM_ID`) + a corporate distribution account — CI/account coordination. |
| SEC-014 | Medium | Unauthenticated `lastOrderCreds` query reveals username | Backend endpoint / product decision (keep vs. device-local storage). |
| SEC-015 | Low | `serviceAccountKeyPath` references a non-existent file | Requires a `GOOGLE_SERVICE_ACCOUNT_KEY` EAS Secret — CI coordination. |

## High Performance — deferred

| ID | Severity | Finding | Why deferred |
|----|----------|---------|--------------|
| PERF-001 | High | N per-card `SUBSCRIPTION_ORDERS` subscriptions | High severity; removal must be validated against real-time propagation through `UserContext` subscriptions on-device. |
| PERF-002 | High | 5 `refetchQueries` on every order-status change | High severity; changing refetch behaviour needs careful testing of earnings/withdraw flows. |
| PERF-003 | High | `UserContext.Provider` value not memoized | High severity, touches the busiest context; deferred with the other High context work. |
| PERF-004 | High | `LocationContext.Provider` value not memoized | High severity; interacts with GPS-driven re-render chain. |
| PERF-005 | High | `asyncStorageEmitter` listener never removed (memory leak) | High severity; also entangled with SEC-007's emitter reactivity — treat together. |
| PERF-006 | High | `loadDevMessages()` called every render | High severity per the audit; part of the `environment.ts` rework (SEC-008). |
| PERF-013 | Medium | 30 s poll on `RIDER_ORDERS` alongside 2 subscriptions | Kept deliberately as a reliability safeguard for dropped subscriptions; the recommended replacement (refetch on WS reconnect) is a larger change. |
| PERF-022 | Low | `SUBSCRIPTION_ORDERS` opened twice on the detail screen | Coupled to PERF-001 (High) — deferred with it. |

## High Reliability / Quality — deferred

| ID | Severity | Finding | Why deferred |
|----|----------|---------|--------------|
| QUAL-001 | High | Notification tap passes a raw object → `[object Object]` | High severity real-time flow; needs on-device notification testing. |
| QUAL-002 | High | Mutation `onError` flash message commented out | High severity UX; left with the other High order-flow items. |
| QUAL-003 | High | `getCurrentPositionAsync` called without permission | High severity; location-permission flow needs device testing on iOS + Android. |
| QUAL-004 | High | `EventEmitter.removeListener` gets a new anon fn (leak) | Same code path as PERF-005 (High) — deferred together. |
| QUAL-022 | Low | `lastOrderCreds` prefills last rider's username | Backend endpoint decision (with SEC-014). |
| QUAL-024 | Low | Zero accessibility labels/roles across the app | **Large** effort — full app-wide accessibility pass, out of scope for this batch. |

## Dependency / Package changes — deferred

| ID | Finding | Why deferred |
|----|---------|--------------|
| DEAD-010 | `react-native-keyboard-controller` "installed but unused" | **FALSE POSITIVE — do NOT remove.** It has zero *direct* imports in our source, but it is a required **peer dependency of `react-native-gifted-chat`** (powers the chat screen), which imports it unconditionally at module top-level (`import { KeyboardProvider, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'`). Removing it crashes the chat screen on a clean install (npm auto-installs the peer, but yarn / `--legacy-peer-deps` do not). Kept as an explicit dep so the version stays pinned. |
| DEAD-012 | `lint-staged` in `dependencies` not `devDependencies` | `package.json` change. |
| DEAD-013 | `git-commit-validator.ts` possibly wired to a git hook | Do **not** delete without verifying `.git/hooks` wiring (audit classification C). |
| DEP-001 | 48 npm vulnerabilities | Needs `npm audit fix` + manual review (package work). |
| DEP-002 | No tests | Requires building an initial test suite. |
| DEP-003 | `lint-staged` in prod deps | Same as DEAD-012. |
| DEP-004 | `react-native-keyboard-controller` unused | **False positive — see DEAD-010.** Required peer dep of `react-native-gifted-chat`; do not remove. |
| DEP-005 | `sentry-expo` + `@sentry/react-native` installed together | Package/config change; check for duplicate `Sentry.init`. |

## Partial notes

- **SEC-011** — The **sensitive-data** logs called out in the audit (S3 responses,
  license `formData`, base64, global error payloads, auth/user-context errors)
  were removed or `__DEV__`-guarded. A blanket sweep of *every* remaining
  `console.log` is best done with `babel-plugin-transform-remove-console` in
  production, which is a package/config change and is left for the dependency pass.
- **PERF-010** — Stable keys + a memoized `renderItem` were applied, but the
  `FlatList → FlashList` swap was **not** done: FlashList needs an explicitly
  sized parent and the current lists use percentage heights inside a `ScrollView`,
  so swapping risks a zero-height/virtualization regression that needs layout testing.
