import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getSecureItem } from "@/lib/services/secure-storage";
import {
  DEFAULT_RIDER_SERVER_MODE,
  DEFAULT_SINGLE_VENDOR,
  getRiderIdKey,
  getRiderTokenKey,
  isRiderServerMode,
  migrateLegacyRiderStorage,
  RIDER_SERVER_MODE_STORAGE_KEY,
  RIDER_SERVER_MODES,
  RiderServerMode,
} from "@/lib/mode/rider-mode";

interface RiderModeContextValue {
  mode: RiderServerMode;
  modeReady: boolean;
  riderIdKey: string;
  tokenKey: string;
  isModeSelectionLocked: boolean;
  selectMode: (mode: RiderServerMode) => Promise<boolean>;
}

const RiderModeContext = createContext<RiderModeContextValue | undefined>(
  undefined,
);

export function RiderModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<RiderServerMode>(DEFAULT_RIDER_SERVER_MODE);
  const [modeReady, setModeReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        await migrateLegacyRiderStorage();
        if (DEFAULT_SINGLE_VENDOR) {
          await AsyncStorage.setItem(
            RIDER_SERVER_MODE_STORAGE_KEY,
            RIDER_SERVER_MODES.SINGLE,
          );
          if (mounted) setMode(RIDER_SERVER_MODES.SINGLE);
          return;
        }
        const persistedMode = await AsyncStorage.getItem(
          RIDER_SERVER_MODE_STORAGE_KEY,
        );
        if (mounted && isRiderServerMode(persistedMode)) {
          setMode(persistedMode);
        }
      } finally {
        if (mounted) setModeReady(true);
      }
    };

    void hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  const selectMode = useCallback(
    async (nextMode: RiderServerMode) => {
      if (DEFAULT_SINGLE_VENDOR && nextMode !== RIDER_SERVER_MODES.SINGLE) {
        return false;
      }
      if (nextMode === mode) return true;

      // A rider session is deliberately pinned to one backend. The login screen
      // can switch freely; authenticated riders must log out first.
      const activeToken = await getSecureItem(getRiderTokenKey(mode));
      if (activeToken) return false;

      await AsyncStorage.setItem(RIDER_SERVER_MODE_STORAGE_KEY, nextMode);
      setMode(nextMode);
      return true;
    },
    [mode],
  );

  const value = useMemo(
    () => ({
      mode,
      modeReady,
      riderIdKey: getRiderIdKey(mode),
      tokenKey: getRiderTokenKey(mode),
      isModeSelectionLocked: DEFAULT_SINGLE_VENDOR,
      selectMode,
    }),
    [mode, modeReady, selectMode],
  );

  return (
    <RiderModeContext.Provider value={value}>
      {children}
    </RiderModeContext.Provider>
  );
}

export function useRiderMode() {
  const context = useContext(RiderModeContext);
  if (!context) {
    throw new Error("useRiderMode must be used within RiderModeProvider");
  }
  return context;
}
