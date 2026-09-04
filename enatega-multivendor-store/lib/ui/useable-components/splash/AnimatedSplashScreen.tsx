import * as SplashScreen from "expo-splash-screen";
import { ReactNode, useEffect, useState } from "react";
import { View } from "react-native";
import AnimatedSplash from "./AnimatedSplash";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function AnimatedSplashScreen({
  ready = false,
  children,
}: {
  ready?: boolean;
  children: ReactNode;
}) {
  const [splashDone, setSplashDone] = useState(false);

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
