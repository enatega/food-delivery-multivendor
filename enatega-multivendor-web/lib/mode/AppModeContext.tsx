"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { APP_MODES, APP_MODE_STORAGE_KEY, DEFAULT_APP_MODE, isAppMode, type AppMode } from "./constants";
import { isSingleVendorEnabled } from "./environment";
import { migrateLegacyMultivendorStorage, modeStorage } from "./storage";
import { routeAfterModeSwitch } from "./routes";

interface AppModeValue {
  mode: AppMode;
  isModeReady: boolean;
  isSwitchingMode: boolean;
  isModeSwitchBlocked: boolean;
  singleVendorAvailable: boolean;
  isSingleVendor: boolean;
  switchMode: (next: AppMode) => Promise<boolean>;
  beginModeSensitiveOperation: () => () => void;
}

const AppModeContext = createContext<AppModeValue | null>(null);

export function AppModeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mode, setMode] = useState<AppMode>(DEFAULT_APP_MODE);
  const [isModeReady, setModeReady] = useState(false);
  const [isSwitchingMode, setSwitchingMode] = useState(false);
  const [blockingCount, setBlockingCount] = useState(0);
  const blockers = useRef(new Set<symbol>());
  const singleVendorAvailable = isSingleVendorEnabled();

  useEffect(() => {
    migrateLegacyMultivendorStorage();
    const stored = window.localStorage.getItem(APP_MODE_STORAGE_KEY);
    const next = isAppMode(stored) ? stored : DEFAULT_APP_MODE;
    if (next === APP_MODES.SINGLE && !singleVendorAvailable) {
      modeStorage.set(APP_MODE_STORAGE_KEY, APP_MODES.MULTI);
      setMode(APP_MODES.MULTI);
    } else setMode(next);
    setModeReady(true);
  }, [singleVendorAvailable]);

  const switchMode = useCallback(async (next: AppMode) => {
    if (!isAppMode(next) || next === mode || blockers.current.size > 0 ||
      (next === APP_MODES.SINGLE && !singleVendorAvailable)) return false;
    setSwitchingMode(true);
    try {
      modeStorage.set(APP_MODE_STORAGE_KEY, next);
      setMode(next);
      router.replace(routeAfterModeSwitch(pathname, next));
      return true;
    } finally {
      setSwitchingMode(false);
    }
  }, [mode, pathname, router, singleVendorAvailable]);

  const beginModeSensitiveOperation = useCallback(() => {
    const id = Symbol("mode-sensitive-operation");
    blockers.current.add(id);
    setBlockingCount(blockers.current.size);
    return () => {
      blockers.current.delete(id);
      setBlockingCount(blockers.current.size);
    };
  }, []);

  const value = useMemo<AppModeValue>(() => ({
    mode, isModeReady, isSwitchingMode,
    isModeSwitchBlocked: blockingCount > 0,
    singleVendorAvailable,
    isSingleVendor: mode === APP_MODES.SINGLE,
    switchMode, beginModeSensitiveOperation,
  }), [mode, isModeReady, isSwitchingMode, blockingCount, singleVendorAvailable, switchMode, beginModeSensitiveOperation]);

  return <AppModeContext.Provider value={value}>{children}</AppModeContext.Provider>;
}

export const useAppMode = () => {
  const context = useContext(AppModeContext);
  if (!context) throw new Error("useAppMode must be used inside AppModeProvider");
  return context;
};

export const useModeSensitiveOperation = (active: boolean) => {
  const { beginModeSensitiveOperation } = useAppMode();
  useEffect(() => active ? beginModeSensitiveOperation() : undefined, [active, beginModeSensitiveOperation]);
};

