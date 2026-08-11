# Rider App Audit — Fixed Issues

Scope of this pass: **Low + Medium severity findings and Dead Code cleanup only.**
Critical/High findings and anything requiring a package migration, backend
schema change, or CI/secrets coordination were intentionally left out and are
listed in [`AUDIT-REMEDIATION-SKIPPED.md`](./AUDIT-REMEDIATION-SKIPPED.md).

All changes below type-check cleanly (`tsc --noEmit` → no errors).

---

## Security (Low / Medium)

| ID | Finding | What was done |
|----|---------|---------------|
| SEC-011 | Production `console.log` exposes S3 responses, license data, error payloads | Removed the S3 response / `formData` / base64 logs in the license form; wrapped the remaining sensitive logs (global error handler, auth-context logout errors, user-context subscription errors, configuration error, useDetail errors, vehicle-upload error) in `if (__DEV__)`. |
| SEC-012 | `Math.random()` used for auth nonce (no CSPRNG) | `PublicAccessTokenService.generateNonce` now uses `crypto.getRandomValues` (polyfilled by `react-native-get-random-values`) via a new `getSecureRandomHex` helper, falling back to `Math.random` only if the secure RNG is unavailable. |
| SEC-013 | Generic `myapp` deep-link scheme hijackable on Android | `app.config.js` `scheme` changed from `myapp` → `com.enatega.multirider` (matches the bundle id / package). |

## Performance (Medium / Low)

| ID | Finding | What was done |
|----|---------|---------------|
| PERF-007 | Derived order lists used `useState` + `useEffect` (3 screens) | `new-orders`, `processing-orders`, `delivered-orders` now derive `orders` with `useMemo` from `assignedOrders`. Removes the double-render and the stale-list bug (also closes **QUAL-016**). |
| PERF-008 | `barData` recomputed inline each render | Wrapped in `useMemo([riderEarningsData, appTheme.fontMainColor])`. |
| PERF-009 | SoundContext `isPlaying` in effect deps caused stop/start oscillation | Added an `isPlayingRef`; the `assignedOrders` effect reads the ref and no longer lists `isPlaying` as a dependency (also closes **QUAL-020**). |
| PERF-010 | Index-based keys in earnings lists | Both earnings `FlatList`s now use stable keys (`item._id ?? date ?? index`) and the main list uses a `useCallback` `renderItem`. (FlatList kept instead of FlashList — see skipped notes.) |
| PERF-011 | `JSON.stringify(order)` passed as a route param on every render | The order card now passes only `itemId` + `tab`; the order-detail screen already resolves the full order from `UserContext.assignedOrders`. Seeded `useOrderDetail`'s initial `order` synchronously from that cache. |
| PERF-014 | `customMapStyles` mirrored into state via an effect | Converted to `useMemo(() => CustomMapStyles(appTheme), [currentTheme])`. |
| PERF-015 | AuthContext handlers not memoized; value not memoized | `setTokenAsync` and `logout` wrapped in `useCallback`; provider value wrapped in `useMemo`. |
| PERF-016 | `Appearance.addChangeListener` never cleaned up; ThemeContext value not memoized | Store the subscription and `subscription.remove()` on cleanup; provider value memoized; `toggleTheme` wrapped in `useCallback` (also closes **QUAL-005**). |
| PERF-017 | `localOrder` shadow state caused a double render | Removed the `localOrder` state + syncing effect; the screen uses `order` directly. |
| PERF-018 | `handleRouteError("label")` IIFE created a new prop each render | Retry helpers + `handleRouteError` wrapped in `useCallback`; three stable per-leg handlers built with `useMemo`. |
| PERF-019 | Wallet transactions used a possibly-non-unique `createdAt` key | Key changed to `transaction._id ?? \`${createdAt}-${index}\``. |
| PERF-020 | Explicit `refetch` effect duplicated Apollo's variable-change re-run | Removed the `refetchProfile`/`refetchAssigned` effect in `user.context`; the queries already re-run when `skip` flips false. |
| PERF-021 | `preparationTime` / `currentSeconds` built 6 `new Date()`s per render | Both derived once in a `useMemo` keyed on the order. |

## Reliability & Code Quality (Medium / Low)

| ID | Finding | What was done |
|----|---------|---------------|
| QUAL-005 | `Appearance.addChangeListener` never cleaned up | Fixed together with PERF-016. |
| QUAL-006 | `useMemo` dep `order._id` but computed from `order.items` | Dependency changed to `order?.items`. |
| QUAL-007 | `WelldoneComponent` `setTimeout` had no cleanup | Guarded on empty `orderId`, stored the timer id, and `clearTimeout` on cleanup. |
| QUAL-008 | Wallet `onRefresh` hid spinner after a hardcoded 2 s | Now `await refetch()` inside `try/finally`. |
| QUAL-009 | `setOrderId` called twice on "Mark as Delivered" | Removed the second unconditional call outside `onCompleted`. |
| QUAL-010 | `useRoute` from React Navigation used inside Expo Router | Replaced with `useLocalSearchParams` in `useChat` and `useOrderDetails`. |
| QUAL-011 | `cause` destructured from `onError` was always dead | Removed `cause` and its dead branch in `useDetail`. |
| QUAL-012 | ConfigurationContext used a lazy query with a 300 ms debounce | Replaced with a direct `useQuery(GET_CONFIGURATION)`. |
| QUAL-013 | Two parallel public-access-token systems | Deleted the dead second system: `lib/utils/publicAccessToken.ts`, `lib/utils/service/publicAccessService.ts`, `lib/hooks/usePublicAccessInit.ts` (also closes **DEAD-005**). |
| QUAL-014 | `borderColor: "green0"` is an invalid color | Changed to `"green"`. |
| QUAL-015 | `useLayoutEffect` in `useOrderDetails` missing `router`/`appTheme` deps | Added both to the dependency array. |
| QUAL-016 | Stale closure in the order-list effects | Resolved by the `useMemo` migration (PERF-007). |
| QUAL-017 | Vehicle-upload error feedback commented out | Uncommented `showMessage({ type: "danger" })`. |
| QUAL-018 | Location permission re-checked before the user acted | Added an `AppState` "active" listener that re-checks permission when the app returns to the foreground (e.g. from Settings). |
| QUAL-019 | Login `onInit` cleared the Apollo store on every creds change | `clearStore()` now runs once on mount; the creds prefill is a separate effect. |
| QUAL-020 | SoundContext cleanup captured a stale `isPlaying` | Resolved by the `isPlayingRef` change (PERF-009). |
| QUAL-021 | Stale `// TODO: Implement login logic` comment | Removed. |
| QUAL-023 | Duplicate loading state in LoginScreen + useLogin | Removed the local `loading` state; the screen uses `isLogging` from the hook. |

## Dead Code

| ID | Finding | What was done |
|----|---------|---------------|
| DEAD-001 | 5 Expo boilerplate components | Deleted `Collapsible`, `HelloWave`, `ExternalLink`, `ParallaxScrollView`, `TabBarBackground(.ios)`. `ThemedText`/`ThemedView` (and their `useThemeColor`/`useColorScheme` hooks) kept — still used by `app/+not-found.tsx`. |
| DEAD-002 | `SpaceMono` font loaded but never applied | Removed from `useFonts` and deleted `SpaceMono-Regular.ttf`. |
| DEAD-003 | Unused Inter-Italic variable font | Deleted `Inter-Italic-VariableFont_opsz,wght.ttf`. |
| DEAD-004 | `useQueryQL` (`useQueryGQL`) hook, zero imports | Deleted `lib/hooks/useQueryQL.tsx`. |
| DEAD-005 | `usePublicAccessInit` dead hook | Deleted (with QUAL-013). |
| DEAD-006 | 6 customer-app mutation files | Deleted `activity`, `address`, `notification`, `restaurant`, `user`, `push-token` mutation files (verified zero imports). |
| DEAD-007 | 14+ customer-app query files + duplicate barrel export | Deleted the unused query files (`banner`, `category`, `coupon`, `cuisine`, `food`, `sub-category`, `taxation`, `tipping`, `zone`, `cities`, `version`, `vendor`, `user`, `restaurant-1`, `restaurant-3`); rewrote `queries/index.ts` and `queries/resturant/index.ts` to export only the used files; removed the duplicate `export * from "./rider.query"`. |
| DEAD-008 | 2 unused subscriptions | Removed `subscriptionRiderLocation` and `orderStatusChanged` from `subscriptions.ts`. |
| DEAD-009 | Unused named query exports | Removed `RIDER_EARNINGS` (rider.query) and `RIDER_GRAND_TOTAL_EARNINGS` (earnings.query). |
| DEAD-011 | Dead image/asset files | Deleted `adaptive-icon.png`, `favicon.png`, `splash-icon.png`, `react-logo*.png`, `partial-react-logo.png`, `black_bg.jpg`, `transparent.png`, `success-request.jpg`, `loader.json`, root `splash.png`, and `svg/truck-long-svgrepo-com.svg` (each verified unreferenced). |

---

### Verification
- `npx tsc --noEmit` → **No errors found** after all changes.
- Manual on-device testing is still recommended for the behavioural changes
  (notification/deep-link flow, order-detail resolution from cache, location
  permission return-from-Settings, theme toggle, delivery flow).
