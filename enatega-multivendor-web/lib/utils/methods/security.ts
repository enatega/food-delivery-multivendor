const STORAGE_KEYS = {
  NONCE: '_px3k9',
  METRICS_TOKEN: '_zt7m2',
  EXPIRY: '_qw4v8',
  LAST_REFRESH: '_rf8n1',
} as const;

const MIN_REFRESH_INTERVAL = 5000; // 5 seconds between refresh attempts
const EXPIRY_BUFFER = 10000; // Start refreshing 10 seconds before expiry

// SSR guard — localStorage does not exist on the server
const isBrowser = typeof window !== 'undefined';
const storage = {
  get: (key: string): string | null => (isBrowser ? localStorage.getItem(key) : null),
  set: (key: string, value: string): void => { if (isBrowser) localStorage.setItem(key, value); },
  remove: (key: string): void => { if (isBrowser) localStorage.removeItem(key); },
};

function generateRandomKey(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function initializeNonce(): void {
  if (!isBrowser) return;
  const existingNonce = storage.get(STORAGE_KEYS.NONCE);
  if (!existingNonce) {
    storage.set(STORAGE_KEYS.NONCE, generateRandomKey());
  }
}

export function getNonce(): string | null {
  if (!isBrowser) return null;
  const nonce = storage.get(STORAGE_KEYS.NONCE);
  if (!nonce) {
    initializeNonce();
    return storage.get(STORAGE_KEYS.NONCE);
  }
  return nonce;
}

export function storeMetricsToken(token: string, expiry: string): void {
  storage.set(STORAGE_KEYS.METRICS_TOKEN, token);
  storage.set(STORAGE_KEYS.EXPIRY, expiry);
  storage.set(STORAGE_KEYS.LAST_REFRESH, Date.now().toString());
}

export function getMetricsToken(): string | null {
  return storage.get(STORAGE_KEYS.METRICS_TOKEN);
}

export function shouldRefreshToken(): boolean {
  const token = storage.get(STORAGE_KEYS.METRICS_TOKEN);
  const expiryStr = storage.get(STORAGE_KEYS.EXPIRY);
  const lastRefreshStr = storage.get(STORAGE_KEYS.LAST_REFRESH);

  if (!token || !expiryStr) return true;

  const expiryTime = new Date(expiryStr).getTime();
  const now = Date.now();

  if (now >= expiryTime) return true;

  if (now >= expiryTime - EXPIRY_BUFFER) {
    if (!lastRefreshStr) return true;
    const lastRefresh = parseInt(lastRefreshStr, 10);
    return now - lastRefresh >= MIN_REFRESH_INTERVAL;
  }

  return false;
}

export function clearMetricsData(): void {
  storage.remove(STORAGE_KEYS.NONCE);
  storage.remove(STORAGE_KEYS.METRICS_TOKEN);
  storage.remove(STORAGE_KEYS.EXPIRY);
  storage.remove(STORAGE_KEYS.LAST_REFRESH);
}
