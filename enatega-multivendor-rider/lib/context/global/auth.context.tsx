import * as Location from "expo-location";
import React, { useCallback, useEffect, useMemo, useState } from "react";

// Interfaces§
import { getSecureItem, removeSecureItem, setSecureItem } from "@/lib/services/secure-storage";
import { IAuthContext, IAuthProviderProps } from "@/lib/utils/interfaces";
import { useRouter } from "expo-router";
import { useRiderMode } from "@/lib/context/global/rider-mode.context";
import {
  hasCompleteRiderSession,
  subscribeToSessionInvalidation,
} from "@/lib/utils/session";

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext,
);

export const AuthProvider: React.FC<IAuthProviderProps> = ({
  client,
  children,
}) => {
  // Hooks
  const router = useRouter();
  const { riderIdKey, tokenKey } = useRiderMode();

  // State
  const [token, setToken] = useState<string>("");
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrateAuth = async () => {
      try {
        setIsAuthReady(false);
        setToken("");
        const [storedToken, storedRiderId] = await Promise.all([
          getSecureItem(tokenKey),
          getSecureItem(riderIdKey),
        ]);

        if (
          isMounted &&
          hasCompleteRiderSession(storedToken, storedRiderId)
        ) {
          setToken(storedToken);
        } else if (storedToken || storedRiderId) {
          // The token and rider id form one session. A partial pair can happen
          // if the app is terminated during login or legacy migration, and it
          // must never unlock a profile-less authenticated UI.
          await Promise.all([
            removeSecureItem(tokenKey),
            removeSecureItem(riderIdKey),
          ]);
          if (isMounted) router.replace("/login");
        }
      } finally {
        if (isMounted) {
          setIsAuthReady(true);
        }
      }
    };

    hydrateAuth();

    return () => {
      isMounted = false;
    };
  }, [riderIdKey, router, tokenKey]);

  const setTokenAsync = useCallback(
    async (token: string) => {
      await setSecureItem(tokenKey, token);
      await client.clearStore();
      setToken(token);
    },
    [client, tokenKey],
  );

  const logout = useCallback(async () => {
    setToken("");

    try {
      await Promise.all([removeSecureItem(tokenKey), removeSecureItem(riderIdKey)]);

      try {
        await client.clearStore();
      } catch (cacheError) {
        if (__DEV__) {
          console.log("Error clearing Apollo cache during logout:", cacheError);
        }
      }

      try {
        const hasLocationUpdates =
          await Location.hasStartedLocationUpdatesAsync("RIDER_LOCATION");
        if (hasLocationUpdates) {
          await Location.stopLocationUpdatesAsync("RIDER_LOCATION");
        }
      } catch (locationError) {
        if (__DEV__) {
          console.log("Error stopping location updates:", locationError);
        }
      }
    } catch (e) {
      if (__DEV__) {
        console.log("Logout Error: ", e);
      }
    } finally {
      router.replace("/login");
    }
  }, [client, riderIdKey, router, tokenKey]);

  useEffect(
    () =>
      subscribeToSessionInvalidation((event) => {
        if (event.tokenKey === tokenKey && event.riderIdKey === riderIdKey) {
          void logout();
          return true;
        }
        return false;
      }),
    [logout, riderIdKey, tokenKey],
  );

  const values: IAuthContext = useMemo(
    () => ({
      token: token ?? "",
      isAuthReady,
      logout,
      setTokenAsync,
    }),
    [token, isAuthReady, logout, setTokenAsync],
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
