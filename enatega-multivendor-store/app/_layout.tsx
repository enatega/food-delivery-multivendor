/* eslint-disable @typescript-eslint/no-require-imports */
import { ApolloProvider } from "@apollo/client";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import FlashMessage from "react-native-flash-message";
import "react-native-reanimated";

import "@/i18next";
import setupApollo, { disposeApollo } from "@/lib/apollo";
import { AuthProvider } from "@/lib/context/global/auth.context";
import { ConfigurationProvider } from "@/lib/context/global/configuration.context";
import InternetProvider from "@/lib/context/global/internet-provider";
import {
  StoreModeProvider,
  useStoreMode,
} from "@/lib/context/global/store-mode.context";
import { UserProvider } from "@/lib/context/global/user.context";
import AppThemeProvidor, { useApptheme } from "@/lib/context/theme.context";
import PublicAccessTokenService from "@/lib/services/public-access-token.service";
import AnimatedSplashScreen from "@/lib/ui/useable-components/splash/AnimatedSplashScreen";
import UnavailableStatus from "@/lib/ui/useable-components/unavailable-status";
import { useFonts } from "expo-font";

import "../global.css";

SplashScreen.preventAutoHideAsync();

function ModeAwareRootLayout() {
  const { currentTheme, appTheme } = useApptheme();
  const { environment, isModeReady, mode, storeIdKey, tokenKey } =
    useStoreMode();
  const [loaded] = useFonts({
    SpaceMono: require("../lib/assets/fonts/SpaceMono-Regular.ttf"),
    Inter: require("../lib/assets/fonts/Inter.ttf"),
  });
  const [isTokenReady, setIsTokenReady] = useState(false);

  const client = useMemo(
    () =>
      setupApollo({
        environment,
        tokenKey,
        storeIdKey,
      }),
    [environment, storeIdKey, tokenKey],
  );

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    let mounted = true;
    setIsTokenReady(false);

    const initializePublicAccess = async () => {
      if (environment.PUBLIC_ACCESS_REQUIRED) {
        try {
          await PublicAccessTokenService.initialize(
            client,
            `${mode}:${environment.GRAPHQL_URL}`,
          );
        } catch {
          // Operations that require public access surface their own errors.
        }
      }
      if (mounted) setIsTokenReady(true);
    };

    void initializePublicAccess();
    return () => {
      mounted = false;
      if (environment.PUBLIC_ACCESS_REQUIRED) {
        PublicAccessTokenService.pause();
      }
      disposeApollo(client);
    };
  }, [client, environment.GRAPHQL_URL, environment.PUBLIC_ACCESS_REQUIRED, mode]);

  if (!isModeReady || !isTokenReady) {
    return null;
  }

  return (
    <ApolloProvider client={client} key={mode}>
      <AnimatedSplashScreen>
        <InternetProvider>
          <AuthProvider client={client}>
            <ConfigurationProvider>
              <StatusBar
                style={currentTheme ?? "dark"}
                backgroundColor={appTheme.themeBackground ?? ""}
              />
              <UserProvider>
                <UnavailableStatus />
                <Slot />
              </UserProvider>
            </ConfigurationProvider>
          </AuthProvider>
        </InternetProvider>
      </AnimatedSplashScreen>
      <FlashMessage position="center" />
    </ApolloProvider>
  );
}

function RootLayout() {
  return (
    <AppThemeProvidor>
      <StoreModeProvider>
        <ModeAwareRootLayout />
      </StoreModeProvider>
    </AppThemeProvidor>
  );
}

export default RootLayout;
