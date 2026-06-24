const AUTH_KEYS = {
  TOKEN: 'token',
  USER_TYPE: 'userType',
  USER_ID: 'userId',
  TOKEN_EXPIRATION: 'tokenExpiration',
} as const;

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
