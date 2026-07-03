/* eslint-disable @typescript-eslint/no-require-imports */
import AsyncStorage from "@react-native-async-storage/async-storage";

type SecureStoreModule = {
  isAvailableAsync: () => Promise<boolean>;
  getItemAsync: (key: string) => Promise<string | null>;
  setItemAsync: (key: string, value: string) => Promise<void>;
  deleteItemAsync: (key: string) => Promise<void>;
};

let secureStoreModule: SecureStoreModule | null | undefined;

const getSecureStore = (): SecureStoreModule | null => {
  if (secureStoreModule !== undefined) {
    return secureStoreModule;
  }

  try {
    secureStoreModule = require("expo-secure-store") as SecureStoreModule;
  } catch {
    console.log("expo-secure-store unavailable, falling back to AsyncStorage");
    secureStoreModule = null;
  }

  return secureStoreModule;
};

let secureStoreAvailability: Promise<boolean> | null = null;

const isSecureStoreAvailable = async () => {
  if (!secureStoreAvailability) {
    const secureStore = getSecureStore();
    secureStoreAvailability = secureStore
      ? secureStore.isAvailableAsync().catch(() => false)
      : Promise.resolve(false);
  }

  return secureStoreAvailability;
};

export const getSecureItem = async (
  key: string,
  legacyKey = key,
): Promise<string | null> => {
  const secureStoreAvailable = await isSecureStoreAvailable();
  const secureStore = secureStoreAvailable ? getSecureStore() : null;

  if (secureStoreAvailable && secureStore) {
    const secureValue = await secureStore.getItemAsync(key);
    if (secureValue !== null) {
      return secureValue;
    }
  }

  const legacyValue = await AsyncStorage.getItem(legacyKey);
  if (legacyValue !== null && secureStoreAvailable && secureStore) {
    await secureStore.setItemAsync(key, legacyValue);
    await AsyncStorage.removeItem(legacyKey);
  }

  return legacyValue;
};

export const setSecureItem = async (
  key: string,
  value: string,
  legacyKey = key,
): Promise<void> => {
  const secureStoreAvailable = await isSecureStoreAvailable();
  const secureStore = secureStoreAvailable ? getSecureStore() : null;

  if (secureStoreAvailable && secureStore) {
    await secureStore.setItemAsync(key, value);
    if (legacyKey) {
      await AsyncStorage.removeItem(legacyKey);
    }
    return;
  }

  await AsyncStorage.setItem(legacyKey, value);
};

export const removeSecureItem = async (
  key: string,
  legacyKey = key,
): Promise<void> => {
  const secureStoreAvailable = await isSecureStoreAvailable();
  const secureStore = secureStoreAvailable ? getSecureStore() : null;

  if (secureStoreAvailable && secureStore) {
    await secureStore.deleteItemAsync(key);
  }

  await AsyncStorage.removeItem(legacyKey);
};
