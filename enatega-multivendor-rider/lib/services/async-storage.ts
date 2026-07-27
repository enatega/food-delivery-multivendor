import AsyncStorage from "@react-native-async-storage/async-storage";

type Listener = (...args: any[]) => void;

// Minimal EventEmitter so we don't depend on the Node "events" core module,
// which Metro cannot resolve in a React Native bundle.
class SimpleEventEmitter {
  private listeners: Record<string, Listener[]> = {};

  addListener(event: string, listener: Listener) {
    (this.listeners[event] ||= []).push(listener);
    return this;
  }

  removeListener(event: string, listener: Listener) {
    this.listeners[event] = (this.listeners[event] || []).filter(
      (l) => l !== listener
    );
    return this;
  }

  emit(event: string, ...args: any[]) {
    (this.listeners[event] || []).forEach((listener) => listener(...args));
    return true;
  }
}

export const asyncStorageEmitter = new SimpleEventEmitter();

// Custom function to set item and emit event
export const setItem = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value);
  asyncStorageEmitter.emit(key, { key, value });
};

// Custom function to remove item and emit event
export const removeItem = async (key: string) => {
  await AsyncStorage.removeItem(key);
  asyncStorageEmitter.emit(key, { key, value: null });
};
