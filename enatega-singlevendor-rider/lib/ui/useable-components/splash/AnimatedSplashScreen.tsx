import * as SplashScreen from "expo-splash-screen";
import { ReactNode, useEffect, useState } from "react";
import { View } from "react-native";
import AnimatedSplash from "./AnimatedSplash";

// Keep the native OS splash up until our theme-aware JS splash has painted, so
// there is no black/white flash at the native -> JS handoff.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function AnimatedSplashScreen({
  ready = false,
  children,
}: {
  ready?: boolean;
  children: ReactNode;
}) {
  const [splashDone, setSplashDone] = useState(false);

  // Hand off from the native static splash to AnimatedSplash. Safe to hide on
  // mount because both layers share the same themed background color.
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {children}
      {!splashDone && (
        <AnimatedSplash ready={ready} onFinish={() => setSplashDone(true)} />
      )}
    </View>
  );
}
