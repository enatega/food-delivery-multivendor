import * as Device from "expo-device";
import {
  PUBLIC_ACCESS_EXPIRY,
  PUBLIC_ACCESS_NONCE,
  PUBLIC_ACCESS_TOKEN,
} from "./constants";
import {
  getSecureItem,
  removeSecureItem,
  setSecureItem,
} from "../services/secure-storage";

const STORAGE_KEYS = {
  TOKEN: PUBLIC_ACCESS_TOKEN,
  NONCE: PUBLIC_ACCESS_NONCE,
  EXPIRY: PUBLIC_ACCESS_EXPIRY,
};

/**
 * Generate a unique device nonce
 */
const generateNonce = async (): Promise<string> => {
  const deviceId = Device.modelId || Device.osInternalBuildId || "unknown";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${deviceId}-${timestamp}-${random}`;
};

/**
 * Get or create nonce (cached in secure storage)
 */
export const getOrCreateNonce = async (): Promise<string> => {
  let nonce = await getSecureItem(STORAGE_KEYS.NONCE);
  if (!nonce) {
    nonce = await generateNonce();
    await setSecureItem(STORAGE_KEYS.NONCE, nonce);
  }
  return nonce;
};

/**
 * Save public token and expiry
 */
export const savePublicToken = async (
  token: string,
  expiry: string,
): Promise<void> => {
  await Promise.all([
    setSecureItem(STORAGE_KEYS.TOKEN, token),
    setSecureItem(STORAGE_KEYS.EXPIRY, expiry),
  ]);
};

/**
 * Get public token from storage
 */
export const getPublicToken = async (): Promise<string | null> => {
  return await getSecureItem(STORAGE_KEYS.TOKEN);
};

/**
 * Get token expiry from storage
 */
export const getTokenExpiry = async (): Promise<string | null> => {
  return await getSecureItem(STORAGE_KEYS.EXPIRY);
};

/**
 * Check if token is expired
 */
export const isTokenExpired = async (): Promise<boolean> => {
  const expiry = await getTokenExpiry();
  if (!expiry) {
    return true;
  }

  const expiryTime = new Date(expiry).getTime();
  const now = Date.now();
  const BUFFER_MS = 30 * 1000;
  const isExpired = now + BUFFER_MS >= expiryTime;

  return isExpired;
};

/**
 * Clear public token data
 */
export const clearPublicToken = async (): Promise<void> => {
  await Promise.all([
    removeSecureItem(STORAGE_KEYS.TOKEN),
    removeSecureItem(STORAGE_KEYS.EXPIRY),
    removeSecureItem(STORAGE_KEYS.NONCE),
  ]);
};
