import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import getEnvVars, { StoreEnvironment } from "@/environment";
import {
  DEFAULT_STORE_SERVER_MODE,
  getForcedStoreServerMode,
  getStoreIdKey,
  getStoreTokenKey,
  isStoreServerMode,
  migrateLegacyStoreSession,
  STORE_SERVER_MODE_KEY,
  STORE_SERVER_MODES,
  StoreServerMode,
} from "@/lib/mode/store-mode";

interface StoreModeContextValue {
  mode: StoreServerMode;
  isModeReady: boolean;
  isSwitchingMode: boolean;
  isSingleVendor: boolean;
  isModeToggleEnabled: boolean;
  environment: StoreEnvironment;
  tokenKey: string;
  storeIdKey: string;
  selectMode: (mode: StoreServerMode) => Promise<boolean>;
}

const StoreModeContext = createContext<StoreModeContextValue>(
  {} as StoreModeContextValue,
);

export const StoreModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const forcedMode = getForcedStoreServerMode();
  const [mode, setMode] = useState<StoreServerMode>(DEFAULT_STORE_SERVER_MODE);
  const [isModeReady, setIsModeReady] = useState(false);
  const [isSwitchingMode, setIsSwitchingMode] = useState(false);

  useEffect(() => {
    let mounted = true;

    const restoreMode = async () => {
      try {
        await migrateLegacyStoreSession();
        const storedMode = await AsyncStorage.getItem(STORE_SERVER_MODE_KEY);
        if (forcedMode) {
          await AsyncStorage.setItem(STORE_SERVER_MODE_KEY, forcedMode);
          if (mounted) setMode(forcedMode);
        } else if (mounted && isStoreServerMode(storedMode)) {
          setMode(storedMode);
        }
      } finally {
        if (mounted) setIsModeReady(true);
      }
    };

    void restoreMode();
    return () => {
      mounted = false;
    };
  }, [forcedMode]);

  const selectMode = useCallback(
    async (nextMode: StoreServerMode) => {
      if (
        !isStoreServerMode(nextMode) ||
        (forcedMode !== null && nextMode !== forcedMode) ||
        nextMode === mode ||
        isSwitchingMode
      ) {
        return false;
      }

      const activeToken = await SecureStore.getItemAsync(
        getStoreTokenKey(mode),
      );
      if (activeToken) return false;

      setIsSwitchingMode(true);
      try {
        await AsyncStorage.setItem(STORE_SERVER_MODE_KEY, nextMode);
        setMode(nextMode);
        return true;
      } finally {
        setIsSwitchingMode(false);
      }
    },
    [forcedMode, isSwitchingMode, mode],
  );

  const value = useMemo<StoreModeContextValue>(
    () => ({
      mode,
      isModeReady,
      isSwitchingMode,
      isSingleVendor: mode === STORE_SERVER_MODES.SINGLE,
      isModeToggleEnabled: forcedMode === null,
      environment: getEnvVars(mode),
      tokenKey: getStoreTokenKey(mode),
      storeIdKey: getStoreIdKey(mode),
      selectMode,
    }),
    [forcedMode, isModeReady, isSwitchingMode, mode, selectMode],
  );

  return (
    <StoreModeContext.Provider value={value}>
      {children}
    </StoreModeContext.Provider>
  );
};

export const useStoreMode = () => useContext(StoreModeContext);
