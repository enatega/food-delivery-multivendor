import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

let secureStoreAvailability: Promise<boolean> | null = null;

const isSecureStoreAvailable = async () => {
  if (!secureStoreAvailability) {
    secureStoreAvailability = SecureStore.isAvailableAsync().catch(() => false);
  }

  return secureStoreAvailability;
};

export const getSecureItem = async (
  key: string,
  legacyKey = key,
): Promise<string | null> => {
  const secureStoreAvailable = await isSecureStoreAvailable();

  if (secureStoreAvailable) {
    const secureValue = await SecureStore.getItemAsync(key);
    if (secureValue !== null) {
      return secureValue;
    }
  }

  const legacyValue = await AsyncStorage.getItem(legacyKey);
  if (legacyValue !== null && secureStoreAvailable) {
    await SecureStore.setItemAsync(key, legacyValue);
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

  if (secureStoreAvailable) {
    await SecureStore.setItemAsync(key, value);
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

  if (secureStoreAvailable) {
    await SecureStore.deleteItemAsync(key);
  }

  await AsyncStorage.removeItem(legacyKey);
};
