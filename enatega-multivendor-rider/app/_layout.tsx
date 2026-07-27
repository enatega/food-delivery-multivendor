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

initSentry();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen?.preventAutoHideAsync();

function RootLayout() {
  // Hooks
  const [loaded] = useFonts({
    Inter: require("../lib/assets/fonts/Inter.ttf"),
  });
  const [isPublicTokenReady, setIsPublicTokenReady] = useState(false);
  const client = setupApollo();

  // Permissions
  async function grantCameraAndGalleryPermissions() {
    await requestMediaLibraryPermissionsAsync();
  }

  // Use Effect
  // Note: the native splash is handed off to <AnimatedSplashScreen>, which calls
  // SplashScreen.hideAsync() itself once the JS animated splash has painted — so
  // we no longer hide it here (that caused a flash at the native -> JS handoff).

  useEffect(() => {
    PublicAccessTokenService.initialize(client)
      .then(() => {
        setIsPublicTokenReady(true);
      })
      .catch((error) => {
        console.log("Public auth initialization failed:", error);
        setIsPublicTokenReady(true);
      });
  }, [client]);

  useEffect(() => {
    grantCameraAndGalleryPermissions();
  }, []);

  useEffect(() => {
    const previousHandler = ErrorUtils.getGlobalHandler?.();

    ErrorUtils.setGlobalHandler((error, isFatal) => {
      if (__DEV__) {
        console.log("Global Error Caught:", { error, isFatal });
      }
      Sentry.captureException(error);

      if (previousHandler) {
        previousHandler(error, isFatal);
      }
    });

    return () => {
      if (previousHandler) {
        ErrorUtils.setGlobalHandler(previousHandler);
      }
    };
  }, []);

  // Render the animated splash immediately and let it play the intro/idle loop
  // while fonts + the public access token load. Once everything is ready the
  // splash plays its outro; the provider tree is only mounted once ready so
  // Apollo requests never fire before the public access token exists.
  const appReady = loaded && isPublicTokenReady;

  return (
    <AnimatedSplashScreen ready={appReady}>
      {appReady ? (
        <AppThemeProvidor>
        <ApolloProvider client={client}>
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
      </AppThemeProvidor>
      ) : null}
    </AnimatedSplashScreen>
  );
}

export default Sentry.wrap(RootLayout);
