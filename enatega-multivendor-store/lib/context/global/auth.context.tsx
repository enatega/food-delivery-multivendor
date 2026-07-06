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
import { setAppLanguage } from "@/i18next";

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

      // Safe handling of Localization
      let systemLanguage = "en"; // default fallback

      const locales = Localization.getLocales();
      if (locales && locales.length > 0 && locales[0].languageCode) {
        systemLanguage = locales[0].languageCode;
      }

      // Use stored language preference or fall back to system language
      const selectedLanguage = lng || systemLanguage;

      const appliedLanguage = await setAppLanguage(selectedLanguage);
      setIsSelected(appliedLanguage);
    } catch {
      // Ultimate fallback
      try {
        const appliedLanguage = await setAppLanguage("en");
        setIsSelected(appliedLanguage);
      } catch {
        setIsSelected("en");
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
    } catch {
      return;
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
    } catch {
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
