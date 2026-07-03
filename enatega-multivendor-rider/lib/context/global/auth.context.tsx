// Core
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";

// Interfaces§
import { RIDER_ID, RIDER_TOKEN } from "@/lib/utils/constants";
import { getSecureItem } from "@/lib/services/secure-storage";
import {
  removeSecureItem,
  setSecureItem,
} from "@/lib/services/secure-storage";
import { IAuthContext, IAuthProviderProps } from "@/lib/utils/interfaces";
import { useRouter } from "expo-router";

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext
);

export const AuthProvider: React.FC<IAuthProviderProps> = ({
  client,
  children,
}) => {
  // Hooks
  const router = useRouter();

  // State
  const [token, setToken] = useState<string>("");
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrateAuth = async () => {
      try {
        const storedToken = await getSecureItem(RIDER_TOKEN);

        if (isMounted && storedToken) {
          setToken(storedToken);
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
  }, []);

  const setTokenAsync = async (token: string) => {
    await setSecureItem(RIDER_TOKEN, token);
    await client.clearStore();
    setToken(token);
  };

  const logout = async () => {
    try {
      // Clear storage first to ensure logout happens immediately
      await Promise.all([
        removeSecureItem(RIDER_TOKEN),
        AsyncStorage.removeItem(RIDER_ID),
      ]);
      await client.clearStore();

      // Navigate to login immediately after clearing storage

      // Stop location updates if they were started
      try {
        const hasLocationUpdates =
          await Location.hasStartedLocationUpdatesAsync("RIDER_LOCATION");
        if (hasLocationUpdates) {
          await Location.stopLocationUpdatesAsync("RIDER_LOCATION");
        }
      } catch (locationError) {
        console.log("Error stopping location updates:", locationError);
      }

      // Reset token state
      setToken("");
      router.replace("/login");
    } catch (e) {
      console.log("Logout Error: ", e);
    }
  };

  const values: IAuthContext = {
    token: token ?? "",
    isAuthReady,
    logout,
    setTokenAsync,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
