import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getSecureItem,
  removeSecureItem,
  setSecureItem,
} from "@/lib/services/secure-storage";
import { RIDER_ID, RIDER_TOKEN } from "@/lib/utils/constants";

export const RIDER_SERVER_MODES = {
  MULTI: "MULTI",
  SINGLE: "SINGLE",
} as const;

export type RiderServerMode =
  (typeof RIDER_SERVER_MODES)[keyof typeof RIDER_SERVER_MODES];

export const DEFAULT_RIDER_SERVER_MODE: RiderServerMode =
  RIDER_SERVER_MODES.MULTI;

export const getForcedRiderServerMode = (): RiderServerMode | null => {
  const policy = process.env.EXPO_PUBLIC_VENDOR_MODE?.toUpperCase();
  if (policy === RIDER_SERVER_MODES.SINGLE) return RIDER_SERVER_MODES.SINGLE;
  if (policy === RIDER_SERVER_MODES.MULTI) return RIDER_SERVER_MODES.MULTI;
  return null;
};

export const RIDER_SERVER_MODE_STORAGE_KEY =
  "@enatega/rider/selected-server-mode";
const RIDER_STORAGE_MIGRATION_KEY = "@enatega/rider/server-storage-migrated-v1";

export const getRiderTokenKey = (mode: RiderServerMode) =>
  `enatega-rider-${mode.toLowerCase()}-token`;

export const getRiderIdKey = (mode: RiderServerMode) =>
  `enatega-rider-${mode.toLowerCase()}-id`;

export const getHandledNotificationKey = (mode: RiderServerMode) =>
  `@enatega/rider/${mode.toLowerCase()}/last-notification-id`;

export const getChatUnreadKey = (mode: RiderServerMode) =>
  `@enatega/rider/${mode.toLowerCase()}/chat-unread`;

export const isRiderServerMode = (
  value: string | null,
): value is RiderServerMode =>
  value === RIDER_SERVER_MODES.MULTI || value === RIDER_SERVER_MODES.SINGLE;

export async function migrateLegacyRiderStorage(): Promise<void> {
  const alreadyMigrated = await AsyncStorage.getItem(
    RIDER_STORAGE_MIGRATION_KEY,
  );
  if (alreadyMigrated) return;

  const multiTokenKey = getRiderTokenKey(RIDER_SERVER_MODES.MULTI);
  const multiRiderIdKey = getRiderIdKey(RIDER_SERVER_MODES.MULTI);
  const [legacyToken, existingMultiToken, legacyRiderId, existingMultiRiderId] =
    await Promise.all([
      getSecureItem(RIDER_TOKEN),
      getSecureItem(multiTokenKey),
      getSecureItem(RIDER_ID),
      getSecureItem(multiRiderIdKey),
    ]);

  if (legacyToken && !existingMultiToken) {
    await setSecureItem(multiTokenKey, legacyToken);
  }
  if (legacyRiderId && !existingMultiRiderId) {
    await setSecureItem(multiRiderIdKey, legacyRiderId);
  }

  await Promise.all([
    removeSecureItem(RIDER_TOKEN),
    removeSecureItem(RIDER_ID),
    AsyncStorage.setItem(RIDER_STORAGE_MIGRATION_KEY, "1"),
  ]);
}
