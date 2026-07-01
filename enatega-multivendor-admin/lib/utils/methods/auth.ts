import {
  APP_NAME,
  SELECTED_RESTAURANT,
  SELECTED_SHOPTYPE,
  SELECTED_VENDOR,
  SELECTED_VENDOR_EMAIL,
} from '@/lib/utils/constants';
import { ILoginResponse } from '@/lib/utils/interfaces';

const AUTH_KEYS = {
  TOKEN: 'token',
  USER_TYPE: 'userType',
  USER_ID: 'userId',
  TOKEN_EXPIRATION: 'tokenExpiration',
} as const;

export const SESSION_USER_KEY = `user-${APP_NAME}`;

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

export function getUserType(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(AUTH_KEYS.USER_TYPE) ?? '';
}

export function clearAuthTokens(): void {
  if (typeof window === 'undefined') return;
  Object.values(AUTH_KEYS).forEach((key) => localStorage.removeItem(key));
}

export function getStoredUser(): ILoginResponse | null {
  if (typeof window === 'undefined') return null;

  const storedUser = localStorage.getItem(SESSION_USER_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as ILoginResponse;
  } catch {
    localStorage.removeItem(SESSION_USER_KEY);
    return null;
  }
}

export function setStoredUser(user: ILoginResponse): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
}

export function persistUserSession(user: ILoginResponse): void {
  if (typeof window === 'undefined') return;

  setStoredUser(user);
  setAuthTokens({
    userId: user.userId,
    token: user.token,
    tokenExpiration: user.tokenExpiration,
    userType: user.userType,
  });

  if (user.userType === 'VENDOR') {
    localStorage.setItem(SELECTED_VENDOR, user.userId);
    localStorage.setItem(SELECTED_VENDOR_EMAIL, user.email);
  }

  if (user.userType === 'RESTAURANT' && user.userTypeId) {
    localStorage.setItem(SELECTED_RESTAURANT, user.userTypeId);
    localStorage.setItem(SELECTED_SHOPTYPE, user.shopType ?? '');
  }
}

export function clearStoredSessionState(): void {
  if (typeof window === 'undefined') return;

  clearAuthTokens();
  localStorage.removeItem(SESSION_USER_KEY);
  localStorage.removeItem(SELECTED_VENDOR);
  localStorage.removeItem(SELECTED_VENDOR_EMAIL);
  localStorage.removeItem(SELECTED_RESTAURANT);
  localStorage.removeItem(SELECTED_SHOPTYPE);
  localStorage.removeItem('messaging-token');
}
