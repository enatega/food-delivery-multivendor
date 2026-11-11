import * as SplashScreen from "expo-splash-screen";
import { ReactNode, useEffect, useState } from "react";
import { View } from "react-native";
import StaticSplash from "./StaticSplash";

// Keep the native OS splash up until the static JS splash has painted.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function AnimatedSplashScreen({
  ready = false,
  children,
}: {
  ready?: boolean;
  children: ReactNode;
}) {
  const [splashDone, setSplashDone] = useState(false);

  // Hand off from the native splash to the matching static JS splash.
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {children}
      {!splashDone && (
        <StaticSplash ready={ready} onFinish={() => setSplashDone(true)} />
      )}
    </View>
  );
}
