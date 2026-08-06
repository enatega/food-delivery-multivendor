/* eslint-disable @typescript-eslint/no-require-imports */
// Polyfill global.crypto.getRandomValues early so secure random is available
// app-wide (e.g. device nonce generation). Must be imported before first use.
import "react-native-get-random-values";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import * as Sentry from "@sentry/react-native";

import FlashMessage from "react-native-flash-message";

// Service
import setupApollo from "@/lib/apollo";
import { initSentry } from "@/lib/utils/service";

// Providers
import { AuthProvider } from "@/lib/context/global/auth.context";
import { ConfigurationProvider } from "@/lib/context/global/configuration.context";
import { LocationProvider } from "@/lib/context/global/location.context";
import { SoundProvider } from "@/lib/context/global/sound.context";
import { UserProvider } from "@/lib/context/global/user.context";
import { ApolloProvider } from "@apollo/client";

// Locale
import "@/i18next";

// Style
import InternetProvider from "@/lib/context/global/internet-provider";
import AppThemeProvidor from "@/lib/context/global/theme.context";
import RootStackLayout from "@/lib/ui/layouts/root-layout";
import { LocationPermissionComp } from "@/lib/ui/useable-components";
import AnimatedSplashScreen from "@/lib/ui/useable-components/splash/AnimatedSplashScreen";
import UnavailableStatus from "@/lib/ui/useable-components/unavailable-status";
import { requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import { useEffect, useState } from "react";

import "../global.css";
import PublicAccessTokenService from "@/lib/services/public-access-token.service";
import {
  RiderModeProvider,
  useRiderMode,
} from "@/lib/context/global/rider-mode.context";
import getEnvVars from "@/environment";
import { useMemo } from "react";

initSentry();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen?.preventAutoHideAsync();

function ModeAwareApp({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { mode, modeReady, riderIdKey, tokenKey } = useRiderMode();
  const [isPublicTokenReady, setIsPublicTokenReady] = useState(false);
  const environment = useMemo(() => getEnvVars(mode), [mode]);
  const runtime = useMemo(
    () => setupApollo({ environment, riderIdKey, tokenKey }),
    [environment, riderIdKey, tokenKey],
  );
  const { client } = runtime;

  useEffect(() => {
    setIsPublicTokenReady(false);
    if (!modeReady) return;

    if (!environment.PUBLIC_ACCESS_REQUIRED) {
      PublicAccessTokenService.pause();
      setIsPublicTokenReady(true);
      return;
    }

    PublicAccessTokenService.initialize(client, `${mode}:${environment.GRAPHQL_URL}`)
      .then(() => setIsPublicTokenReady(true))
      .catch((error) => {
        if (__DEV__) {
          console.log("Public auth initialization failed:", error);
        }
        setIsPublicTokenReady(true);
      });

    return () => PublicAccessTokenService.pause();
  }, [client, environment.GRAPHQL_URL, environment.PUBLIC_ACCESS_REQUIRED, mode, modeReady]);

  useEffect(() => {
    return () => runtime.dispose();
  }, [runtime]);

  const appReady = fontsLoaded && modeReady && isPublicTokenReady;

  return (
    <AnimatedSplashScreen ready={appReady}>
      {appReady ? (
        <ApolloProvider client={client} key={mode}>
          <AuthProvider client={client}>
            <UserProvider>
              <InternetProvider>
                <ConfigurationProvider>
                  <LocationProvider>
                    <SoundProvider>
                      <LocationPermissionComp>
                        <RootStackLayout />
                        <UnavailableStatus />
                      </LocationPermissionComp>
                      <StatusBar style="inverted" />
                      <FlashMessage position="bottom" />
                    </SoundProvider>
                  </LocationProvider>
                </ConfigurationProvider>
              </InternetProvider>
            </UserProvider>
          </AuthProvider>
        </ApolloProvider>
      ) : null}
    </AnimatedSplashScreen>
  );
}

function RootLayout() {
  const [loaded] = useFonts({
    Inter: require("../lib/assets/fonts/Inter.ttf"),
  });

  useEffect(() => {
    void requestMediaLibraryPermissionsAsync();
  }, []);

  useEffect(() => {
    const previousHandler = ErrorUtils.getGlobalHandler?.();
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      if (__DEV__) {
        console.log("Global Error Caught:", { error, isFatal });
      }
      Sentry.captureException(error);
      previousHandler?.(error, isFatal);
    });

    return () => {
      if (previousHandler) ErrorUtils.setGlobalHandler(previousHandler);
    };
  }, []);

  return (
    <RiderModeProvider>
      <AppThemeProvidor>
        <ModeAwareApp fontsLoaded={loaded} />
      </AppThemeProvidor>
    </RiderModeProvider>
  );
}

export default Sentry.wrap(RootLayout);
