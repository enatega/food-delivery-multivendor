import {
  APP_MODES,
  APP_MODE_STORAGE_KEY,
  DEFAULT_APP_MODE,
  isAppMode,
  type AppMode,
} from "./constants";

const SHARED_KEYS = new Set([
  APP_MODE_STORAGE_KEY,
  "theme",
  "locale",
  "NEXT_LOCALE",
  "messaging-token",
  "pendingOrderNavigation",
  "knownOrderOrigins",
]);

const LEGACY_MODE_KEYS = [
  "token", "userType", "userId", "tokenExpiration", "userToken",
  "userAddress", "location", "restaurant", "restaurant-slug",
  "restaurantData", "cartItems", "cart-product-store-id",
  "cart-product-store-slug", "currentShopType", "newOrderInstructions",
  "orderInstructions", "applied_coupon", "coupon_text",
  "is_coupon_applied", "coupon_restaurant_id", "pending_stripe_order_id",
  "pending_stripe_started_at", "searchedKeywords",
] as const;

export const getStoredMode = (): AppMode => {
  if (typeof window === "undefined") return DEFAULT_APP_MODE;
  const stored = window.localStorage.getItem(APP_MODE_STORAGE_KEY);
  return isAppMode(stored) ? stored : DEFAULT_APP_MODE;
};

export const getModeStorageKey = (key: string, mode = getStoredMode()) =>
  SHARED_KEYS.has(key) ? key : `@enatega/${mode.toLowerCase()}/${key}`;

export const modeStorage = {
  get(key: string, mode?: AppMode) {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(getModeStorageKey(key, mode));
  },
  set(key: string, value: string, mode?: AppMode) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(getModeStorageKey(key, mode), value);
  },
  remove(key: string, mode?: AppMode) {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(getModeStorageKey(key, mode));
  },
};

export const migrateLegacyMultivendorStorage = () => {
  if (typeof window === "undefined") return;
  const migrationKey = "@enatega/multi/storage-migrated-v1";
  if (window.localStorage.getItem(migrationKey) === "true") return;

  for (const key of LEGACY_MODE_KEYS) {
    const legacy = window.localStorage.getItem(key);
    const scoped = getModeStorageKey(key, APP_MODES.MULTI);
    if (legacy !== null && window.localStorage.getItem(scoped) === null) {
      window.localStorage.setItem(scoped, legacy);
    }
  }
  window.localStorage.setItem(migrationKey, "true");
};
