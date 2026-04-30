/* eslint-disable @typescript-eslint/no-require-imports */
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";



// Service
import setupApollo from "@/lib/apollo";
import PublicAccessTokenService from "@/lib/services/public-access-token.service";

// Providers
import { AuthProvider } from "@/lib/context/global/auth.context";
import { ConfigurationProvider } from "@/lib/context/global/configuration.context";
import { ApolloProvider } from "@apollo/client";

import { useEffect, useState } from "react";


// Locale
import "@/i18next";

// Style
import "../global.css";

// Hooks
import { UserProvider } from "@/lib/context/global/user.context";
import { useFonts } from "expo-font";
import { useKeepAwake } from "expo-keep-awake";
import { StatusBar } from "expo-status-bar";
import FlashMessage from "react-native-flash-message";

// Providers
import InternetProvider from "@/lib/context/global/internet-provider";
// UI
import AppThemeProvidor, { useApptheme } from "@/lib/context/theme.context";
import AnimatedSplashScreen from "@/lib/ui/useable-components/splash/AnimatedSplashScreen";
import UnavailableStatus from "@/lib/ui/useable-components/unavailable-status";


import { Slot } from "expo-router";



// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


// Clarity.initialize('nq7dea7dt4', {
//   logLevel: Clarity.LogLevel.None, // Note: Use "LogLevel.Verbose" value while testing to debug initialization issues.
// });


function RootLayout() {
  // Hooks
  useKeepAwake();
  const { currentTheme, appTheme } = useApptheme();
  const [loaded] = useFonts({
    SpaceMono: require("../lib/assets/fonts/SpaceMono-Regular.ttf"),
    Inter: require("../lib/assets/fonts/Inter.ttf"),
  });

  const [isTokenReady, setIsTokenReady] = useState(false);
  
  const client = setupApollo();

  // Use Effect
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    console.log("🔄 Initializing public access token...");
    PublicAccessTokenService.initialize(client)
      .then(() => {
        console.log("✅ Public access token initialized");
        setIsTokenReady(true);
      })
      .catch((error) => {
        console.error("❌ Failed to initialize token:", error);
        setIsTokenReady(true);
      });
  }, [client]);

  if (!isTokenReady) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <AppThemeProvidor>
        <AnimatedSplashScreen>
          <InternetProvider>
            <ConfigurationProvider>
              <AuthProvider client={client}>
                <StatusBar
                  style={currentTheme ?? "dark"}
                  backgroundColor={appTheme.themeBackground ?? ""}
                />
                <UserProvider>
                  <UnavailableStatus />
                  <Slot />
                </UserProvider>
              </AuthProvider>
            </ConfigurationProvider>
          </InternetProvider>
        </AnimatedSplashScreen>
        <FlashMessage position="center" />
      </AppThemeProvidor>
    </ApolloProvider>
  );
}

export default RootLayout;
