import { getModeStorageKey } from "@/lib/mode/storage";
import { getStoredMode } from "@/lib/mode/storage";
import type { AppMode } from "@/lib/mode/constants";

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

const keyFor = (key: string, mode: AppMode) => getModeStorageKey(key, mode);

export function initializeNonce(mode: AppMode = getStoredMode()): void {
  const storage = getStorage();
  if (!storage) return;

  const existingNonce = storage.getItem(keyFor(STORAGE_KEYS.NONCE, mode));
  if (!existingNonce) {
    const nonce = generateRandomKey();
    storage.setItem(keyFor(STORAGE_KEYS.NONCE, mode), nonce);
  }
}

export function getNonce(mode: AppMode = getStoredMode()): string | null {
  const storage = getStorage();
  if (!storage) return null;

  const nonce = storage.getItem(keyFor(STORAGE_KEYS.NONCE, mode));
  if (!nonce) {
    initializeNonce(mode);
    return getNonce(mode);
  }
  return nonce;
}

export function storeMetricsToken(token: string, expiry: string, mode: AppMode = getStoredMode()): void {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(keyFor(STORAGE_KEYS.METRICS_TOKEN, mode), token);
  storage.setItem(keyFor(STORAGE_KEYS.EXPIRY, mode), expiry);
  storage.setItem(keyFor(STORAGE_KEYS.LAST_REFRESH, mode), Date.now().toString());
}

export function getMetricsToken(mode: AppMode = getStoredMode()): string | null {
  return getStorage()?.getItem(keyFor(STORAGE_KEYS.METRICS_TOKEN, mode)) ?? null;
}

export function shouldRefreshToken(mode: AppMode = getStoredMode()): boolean {
  const storage = getStorage();
  if (!storage) return false;

  const token = storage.getItem(keyFor(STORAGE_KEYS.METRICS_TOKEN, mode));
  const expiryStr = storage.getItem(keyFor(STORAGE_KEYS.EXPIRY, mode));
  const lastRefreshStr = storage.getItem(keyFor(STORAGE_KEYS.LAST_REFRESH, mode));

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

export function clearMetricsData(mode: AppMode = getStoredMode()): void {
  const storage = getStorage();
  if (!storage) return;

  storage.removeItem(keyFor(STORAGE_KEYS.NONCE, mode));
  storage.removeItem(keyFor(STORAGE_KEYS.METRICS_TOKEN, mode));
  storage.removeItem(keyFor(STORAGE_KEYS.EXPIRY, mode));
  storage.removeItem(keyFor(STORAGE_KEYS.LAST_REFRESH, mode));
}
