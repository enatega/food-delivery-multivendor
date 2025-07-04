// Apollo
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";

// Core
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";

// Constants
import { STORE_TOKEN } from "@/lib/utils/constants";

// Interfaces
import { IAuthContext, IAuthProviderProps } from "@/lib/utils/interfaces";

// Expo
import * as Localization from "expo-localization";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

// I18n
import { changeLanguage } from "i18next";

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext,
);

export const AuthProvider: React.FC<IAuthProviderProps> = ({
  client,
  children,
}) => {
  // States
  const [isSelected, setIsSelected] = useState("");
  const [token, setToken] = useState<string>("");
  
  const setTokenAsync = async (token: string) => {
    await SecureStore.setItemAsync(STORE_TOKEN, token);
    client.clearStore();
    setToken(token);
  };

  // Handlers
  const handleSetCurrentLanguage = async () => {
    try {
      const lng = await AsyncStorage.getItem("lang");
      console.log("🚀 ~ handleSetCurrentLanguage ~ lng:", lng);
      
      // Safe handling of Localization.locale
      let systemLanguage = "en"; // default fallback
      
      if (Localization.locale && typeof Localization.locale === 'string') {
        systemLanguage = Localization.locale.split("-")[0];
      } else if (Localization.locales && Array.isArray(Localization.locales) && Localization.locales.length > 0) {
        const firstLocale = Localization.locales[0];
        if (firstLocale && typeof firstLocale === 'string') {
          systemLanguage = firstLocale.split("-")[0];
        }
      }
      
      console.log("🚀 ~ handleSetCurrentLanguage ~ systemLanguage:", systemLanguage);

      // Use stored language preference or fall back to system language
      const selectedLanguage = lng || systemLanguage;
      
      await changeLanguage(selectedLanguage);
      setIsSelected(selectedLanguage);
      
    } catch (error) {
      console.error("Language setting error:", error);
      // Ultimate fallback
      try {
        await changeLanguage("en");
        setIsSelected("en");
      } catch (fallbackError) {
        console.error("Fallback language setting failed:", fallbackError);
      }
    }
  };

  const logout = async () => {
    try {
      client.stop();
      await Promise.all([
        client.clearStore(),
        SecureStore.deleteItemAsync(STORE_TOKEN),
        AsyncStorage.removeItem("store-id"),
      ]);

      setToken("");
      router.replace("/(un-protected)/login");
    } catch (e) {
      console.error("Logout Error: ", { e });
    }
  };

  async function checkAuth() {
    try {
      const token = await SecureStore.getItemAsync(STORE_TOKEN);
      const storeId = await AsyncStorage.getItem("store-id");

      if (!storeId || !token) {
        return await logout();
      }
      setToken(token);
    } catch (error) {
      console.error("error getting store id & token", error);
      await logout();
    }
  }

  // UseEffects
  useEffect(() => {
    handleSetCurrentLanguage();
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (__DEV__) {
      loadDevMessages();
      loadErrorMessages();
    }
  }, []);

  const values: IAuthContext = {
    token: token ?? "",
    logout,
    setTokenAsync,
    isSelected,
    setIsSelected,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};