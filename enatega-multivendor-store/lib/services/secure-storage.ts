import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { STORE_ID } from "@/lib/utils/constants";

interface StorageEvent {
  key: string;
  value: string | null;
}

type StorageListener = (data: StorageEvent) => void;

class SimpleEventEmitter {
  private listeners: Record<string, StorageListener[]> = {};

  emit(event: string, data: StorageEvent) {
    this.listeners[event]?.forEach((listener) => listener(data));
  }

  addListener(event: string, listener: StorageListener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);

    return {
      removeListener: () => {
        const index = this.listeners[event].indexOf(listener);
        if (index > -1) {
          this.listeners[event].splice(index, 1);
        }
      },
    };
  }
}

export const storageEmitter = new SimpleEventEmitter();

export const setItem = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
  storageEmitter.emit(key, { key, value });
};

export const removeItem = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
  storageEmitter.emit(key, { key, value: null });
};

export const getStoreId = async () => {
  const secureStoreId = await SecureStore.getItemAsync(STORE_ID);
  if (secureStoreId) return secureStoreId;

  const legacyStoreId = await AsyncStorage.getItem(STORE_ID);
  if (!legacyStoreId) return null;

  await setItem(STORE_ID, legacyStoreId);
  await AsyncStorage.removeItem(STORE_ID);
  return legacyStoreId;
};
