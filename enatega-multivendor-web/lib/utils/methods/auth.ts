import { clearMetricsData } from "./security";
import { getStoredMode, modeStorage } from "@/lib/mode/storage";
import type { AppMode } from "@/lib/mode/constants";

const AUTH_KEYS = {
  TOKEN: 'token',
  USER_TYPE: 'userType',
  USER_ID: 'userId',
  TOKEN_EXPIRATION: 'tokenExpiration',
} as const;

const SESSION_STORAGE_KEYS = [
  "userToken",
  "userAddress",
  "searchedKeywords",
  "restaurant",
  "cartItems",
  "newOrderInstructions",
  "orderInstructions",
  "applied_coupon",
  "coupon_text",
  "is_coupon_applied",
  "coupon_restaurant_id",
  "pending_stripe_order_id",
  "pending_stripe_started_at",
] as const;

export function setAuthTokens(payload: {
  token?: string;
  userType?: string;
  userId?: string;
  tokenExpiration?: string | number;
}, mode: AppMode = getStoredMode()): void {
  if (typeof window === 'undefined') return;
  if (payload.token) modeStorage.set(AUTH_KEYS.TOKEN, payload.token, mode);
  if (payload.userType) modeStorage.set(AUTH_KEYS.USER_TYPE, payload.userType, mode);
  if (payload.userId) modeStorage.set(AUTH_KEYS.USER_ID, payload.userId, mode);
  if (payload.tokenExpiration)
    modeStorage.set(AUTH_KEYS.TOKEN_EXPIRATION, String(payload.tokenExpiration), mode);
}

export function getAccessToken(mode: AppMode = getStoredMode()): string {
  if (typeof window === 'undefined') return '';
  return modeStorage.get(AUTH_KEYS.TOKEN, mode) ?? '';
}

export function getTokenExpiration(mode: AppMode = getStoredMode()): string {
  if (typeof window === "undefined") return "";
  return modeStorage.get(AUTH_KEYS.TOKEN_EXPIRATION, mode) ?? "";
}

export function isTokenExpired(tokenExpiration?: string | number | null): boolean {
  if (!tokenExpiration) return false;

  const numericExpiration = Number(tokenExpiration);
  if (!Number.isNaN(numericExpiration) && numericExpiration > 0) {
    const normalizedExpiration =
      numericExpiration < 1_000_000_000_000
        ? numericExpiration * 1000
        : numericExpiration;

    return Date.now() >= normalizedExpiration;
  }

  const parsedExpiration = new Date(String(tokenExpiration)).getTime();
  if (Number.isNaN(parsedExpiration)) return false;

  return Date.now() >= parsedExpiration;
}

export function hasValidAuthToken(mode: AppMode = getStoredMode()): boolean {
  if (typeof window === "undefined") return false;

  const token = modeStorage.get(AUTH_KEYS.TOKEN, mode);
  return Boolean(token);
}



export function clearAuthTokens(mode: AppMode = getStoredMode()): void {
  if (typeof window === 'undefined') return;
  Object.values(AUTH_KEYS).forEach((key) => modeStorage.remove(key, mode));
}

export function clearClientSessionStorage(mode: AppMode = getStoredMode()): void {
  if (typeof window === "undefined") return;

  clearAuthTokens(mode);
  SESSION_STORAGE_KEYS.forEach((key) => modeStorage.remove(key, mode));
  clearMetricsData(mode);
}

export function invalidateClientSession(mode: AppMode = getStoredMode()): void {
  clearClientSessionStorage(mode);
}
