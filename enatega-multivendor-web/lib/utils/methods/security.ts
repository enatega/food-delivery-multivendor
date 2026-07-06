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

function getStorage(): Storage | null {
  return typeof window === 'undefined' ? null : window.localStorage;
}

export function initializeNonce(): void {
  const storage = getStorage();
  if (!storage) return;

  const existingNonce = storage.getItem(STORAGE_KEYS.NONCE);
  if (!existingNonce) {
    const nonce = generateRandomKey();
    storage.setItem(STORAGE_KEYS.NONCE, nonce);
  }
}

export function getNonce(): string | null {
  const storage = getStorage();
  if (!storage) return null;

  const nonce = storage.getItem(STORAGE_KEYS.NONCE);
  if (!nonce) {
    initializeNonce();
    return getNonce();
  }
  return nonce;
}

export function storeMetricsToken(token: string, expiry: string): void {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(STORAGE_KEYS.METRICS_TOKEN, token);
  storage.setItem(STORAGE_KEYS.EXPIRY, expiry);
  storage.setItem(STORAGE_KEYS.LAST_REFRESH, Date.now().toString());
}

export function getMetricsToken(): string | null {
  return getStorage()?.getItem(STORAGE_KEYS.METRICS_TOKEN) ?? null;
}

export function shouldRefreshToken(): boolean {
  const storage = getStorage();
  if (!storage) return false;

  const token = storage.getItem(STORAGE_KEYS.METRICS_TOKEN);
  const expiryStr = storage.getItem(STORAGE_KEYS.EXPIRY);
  const lastRefreshStr = storage.getItem(STORAGE_KEYS.LAST_REFRESH);

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
  const storage = getStorage();
  if (!storage) return;

  storage.removeItem(STORAGE_KEYS.NONCE);
  storage.removeItem(STORAGE_KEYS.METRICS_TOKEN);
  storage.removeItem(STORAGE_KEYS.EXPIRY);
  storage.removeItem(STORAGE_KEYS.LAST_REFRESH);
}
