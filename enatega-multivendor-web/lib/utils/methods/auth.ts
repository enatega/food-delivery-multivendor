import { clearMetricsData } from "./security";

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
}): void {
  if (typeof window === 'undefined') return;
  if (payload.token) localStorage.setItem(AUTH_KEYS.TOKEN, payload.token);
  if (payload.userType) localStorage.setItem(AUTH_KEYS.USER_TYPE, payload.userType);
  if (payload.userId) localStorage.setItem(AUTH_KEYS.USER_ID, payload.userId);
  if (payload.tokenExpiration)
    localStorage.setItem(AUTH_KEYS.TOKEN_EXPIRATION, String(payload.tokenExpiration));
}

export function getAccessToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(AUTH_KEYS.TOKEN) ?? '';
}

export function getTokenExpiration(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(AUTH_KEYS.TOKEN_EXPIRATION) ?? "";
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

export function hasValidAuthToken(): boolean {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem(AUTH_KEYS.TOKEN);
  return Boolean(token);
}



export function clearAuthTokens(): void {
  if (typeof window === 'undefined') return;
  Object.values(AUTH_KEYS).forEach((key) => localStorage.removeItem(key));
}

export function clearClientSessionStorage(): void {
  if (typeof window === "undefined") return;

  clearAuthTokens();
  SESSION_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  clearMetricsData();
}

export function invalidateClientSession(): void {
  clearClientSessionStorage();
}
