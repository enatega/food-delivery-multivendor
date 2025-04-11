import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventEmitter } from "events";

export const asyncStorageEmitter = new EventEmitter();

// Custom function to set item and emit event
export const setItem = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value);
  asyncStorageEmitter?.emit(key, { key, value });
};

// Custom function to remove item and emit event
export const removeItem = async (key: string) => {
  await AsyncStorage.removeItem(key);
  asyncStorageEmitter.emit(key, { key, value: null });
};
