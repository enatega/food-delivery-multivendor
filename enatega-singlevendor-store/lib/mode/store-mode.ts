import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import { STORE_ID, STORE_TOKEN } from "@/lib/utils/constants";

export const STORE_SERVER_MODES = {
  MULTI: "MULTI",
  SINGLE: "SINGLE",
} as const;

export type StoreServerMode =
  (typeof STORE_SERVER_MODES)[keyof typeof STORE_SERVER_MODES];

export const DEFAULT_SINGLE_VENDOR =
  process.env.EXPO_PUBLIC_DEFAULT_SINGLE_VENDOR !== "false";
export const DEFAULT_STORE_SERVER_MODE = DEFAULT_SINGLE_VENDOR
  ? STORE_SERVER_MODES.SINGLE
  : STORE_SERVER_MODES.MULTI;
export const STORE_SERVER_MODE_KEY = "@enatega/store/server-mode";

const STORE_STORAGE_MIGRATION_KEY = "@enatega/store/server-storage-migrated-v1";

export const isStoreServerMode = (
  value: string | null,
): value is StoreServerMode =>
  value === STORE_SERVER_MODES.MULTI || value === STORE_SERVER_MODES.SINGLE;

const modeSuffix = (mode: StoreServerMode) => mode.toLowerCase();

export const getStoreTokenKey = (mode: StoreServerMode) =>
  `enatega-store-${modeSuffix(mode)}-token`;

export const getStoreIdKey = (mode: StoreServerMode) =>
  `enatega-store-${modeSuffix(mode)}-id`;

export const migrateLegacyStoreSession = async (): Promise<void> => {
  const hasMigrated = await AsyncStorage.getItem(STORE_STORAGE_MIGRATION_KEY);
  if (hasMigrated === "true") return;

  const multiTokenKey = getStoreTokenKey(STORE_SERVER_MODES.MULTI);
  const multiStoreIdKey = getStoreIdKey(STORE_SERVER_MODES.MULTI);

  const [legacyToken, scopedToken, legacySecureStoreId, scopedStoreId] =
    await Promise.all([
      SecureStore.getItemAsync(STORE_TOKEN),
      SecureStore.getItemAsync(multiTokenKey),
      SecureStore.getItemAsync(STORE_ID),
      SecureStore.getItemAsync(multiStoreIdKey),
    ]);

  const legacyAsyncStoreId = legacySecureStoreId
    ? null
    : await AsyncStorage.getItem(STORE_ID);
  const legacyStoreId = legacySecureStoreId ?? legacyAsyncStoreId;

  if (legacyToken && !scopedToken) {
    await SecureStore.setItemAsync(multiTokenKey, legacyToken);
  }
  if (legacyStoreId && !scopedStoreId) {
    await SecureStore.setItemAsync(multiStoreIdKey, legacyStoreId);
  }

  await Promise.all([
    SecureStore.deleteItemAsync(STORE_TOKEN),
    SecureStore.deleteItemAsync(STORE_ID),
    AsyncStorage.removeItem(STORE_ID),
    AsyncStorage.setItem(STORE_STORAGE_MIGRATION_KEY, "true"),
  ]);
};
