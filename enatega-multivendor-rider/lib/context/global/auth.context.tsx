import * as Location from "expo-location";
import React, { useEffect, useState } from "react";

// Interfaces§
import { RIDER_ID, RIDER_TOKEN } from "@/lib/utils/constants";
import { getSecureItem } from "@/lib/services/secure-storage";
import {
  removeSecureItem,
  setSecureItem,
} from "@/lib/services/secure-storage";
import { removeItem } from "@/lib/services/async-storage";
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
    setToken("");

    try {
      await Promise.all([
        removeSecureItem(RIDER_TOKEN),
        removeItem(RIDER_ID),
      ]);

      try {
        await client.clearStore();
      } catch (cacheError) {
        console.log("Error clearing Apollo cache during logout:", cacheError);
      }

      try {
        const hasLocationUpdates =
          await Location.hasStartedLocationUpdatesAsync("RIDER_LOCATION");
        if (hasLocationUpdates) {
          await Location.stopLocationUpdatesAsync("RIDER_LOCATION");
        }
      } catch (locationError) {
        console.log("Error stopping location updates:", locationError);
      }
    } catch (e) {
      console.log("Logout Error: ", e);
    } finally {
      router.replace("/login");
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
