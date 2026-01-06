const STORAGE_KEYS = {
  NONCE: '_px3k9',
  METRICS_TOKEN: '_zt7m2',
  EXPIRY: '_qw4v8',
  LAST_REFRESH: '_rf8n1',
} as const;

const MIN_REFRESH_INTERVAL = 5000; // 5 seconds between refresh attempts
const EXPIRY_BUFFER = 10000; // Start refreshing 10 seconds before expiry

function generateRandomKey(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function initializeNonce(): void {
  const existingNonce = localStorage.getItem(STORAGE_KEYS.NONCE);
  if (!existingNonce) {
    const nonce = generateRandomKey();
    localStorage.setItem(STORAGE_KEYS.NONCE, nonce);
  }
}

export function getNonce(): string | null {
  const nonce = localStorage.getItem(STORAGE_KEYS.NONCE);
  if (!nonce) {
    initializeNonce();
    return getNonce();
  }
  return nonce;
}

export function storeMetricsToken(token: string, expiry: string): void {
  localStorage.setItem(STORAGE_KEYS.METRICS_TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.EXPIRY, expiry);
  localStorage.setItem(STORAGE_KEYS.LAST_REFRESH, Date.now().toString());
}

export function getMetricsToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.METRICS_TOKEN);
}

export function shouldRefreshToken(): boolean {
  const token = localStorage.getItem(STORAGE_KEYS.METRICS_TOKEN);
  const expiryStr = localStorage.getItem(STORAGE_KEYS.EXPIRY);
  const lastRefreshStr = localStorage.getItem(STORAGE_KEYS.LAST_REFRESH);

  // No token or expiry - must refresh
  if (!token || !expiryStr) return true;

  const expiryTime = new Date(expiryStr).getTime();
  const now = Date.now();

  // Token is fully expired - always refresh
  if (now >= expiryTime) return true;

  // Token is approaching expiry (within buffer) - respect MIN_REFRESH_INTERVAL
  if (now >= expiryTime - EXPIRY_BUFFER) {
    if (!lastRefreshStr) return true;
    const lastRefresh = parseInt(lastRefreshStr, 10);
    return now - lastRefresh >= MIN_REFRESH_INTERVAL;
  }

  return false;
}

export function clearMetricsData(): void {
  localStorage.removeItem(STORAGE_KEYS.NONCE);
  localStorage.removeItem(STORAGE_KEYS.METRICS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.EXPIRY);
  localStorage.removeItem(STORAGE_KEYS.LAST_REFRESH);
}