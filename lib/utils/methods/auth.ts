const AUTH_STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER_TYPE: 'userType',
  TOKEN_EXPIRATION: 'tokenExpiration',
  REFRESH_TOKEN_EXPIRATION: 'refreshTokenExpiration',
  USER_ID: 'userId',
} as const;

export function getAuthStorageValue(key: keyof typeof AUTH_STORAGE_KEYS): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(AUTH_STORAGE_KEYS[key]) ?? '';
}

export function setAuthTokens(payload: {
  token?: string;
  refreshToken?: string;
  userType?: string;
  tokenExpiration?: string | number;
  refreshTokenExpiration?: string | number;
  userId?: string;
}): void {
  if (typeof window === 'undefined') return;
  if (payload.token) localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, payload.token);
  if (payload.refreshToken)
    localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, payload.refreshToken);
  if (payload.userType) localStorage.setItem(AUTH_STORAGE_KEYS.USER_TYPE, payload.userType);
  if (payload.userId) localStorage.setItem(AUTH_STORAGE_KEYS.USER_ID, payload.userId);
  if (payload.tokenExpiration)
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRATION, String(payload.tokenExpiration));
  if (payload.refreshTokenExpiration)
    localStorage.setItem(
      AUTH_STORAGE_KEYS.REFRESH_TOKEN_EXPIRATION,
      String(payload.refreshTokenExpiration)
    );
}

export function getAccessToken(): string {
  return getAuthStorageValue('TOKEN');
}

export function getRefreshToken(): string {
  return getAuthStorageValue('REFRESH_TOKEN');
}

export function getUserType(): string {
  return getAuthStorageValue('USER_TYPE');
}

export function clearAuthTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER_TYPE);
  localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRATION);
  localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN_EXPIRATION);
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER_ID);
}
