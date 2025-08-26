// React Native Async Storage
import { useApptheme } from "@/lib/context/theme.context";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Expo
import { Stack } from "expo-router";

// i18n
import { changeLanguage } from "i18next";

// Hooks
import { useEffect } from "react";
import { SafeAreaView } from "react-native";

export default function RootUserLayout() {
  // Hooks
  const { appTheme } = useApptheme();

  // Handlers
  async function handleSetCurrentLanguage() {
    try {
      const lng = await AsyncStorage.getItem("lang");
      if (lng) {
        changeLanguage(lng);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // UseEffects
  useEffect(() => {
    handleSetCurrentLanguage();
  }, []);
  return (
    <SafeAreaView>
      <Stack
        initialRouteName="(un-protected)"
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: appTheme.screenBackground,
          },
          headerTintColor: appTheme.mainTextColor,
          headerTitleStyle: { color: appTheme.mainTextColor },
        }}
      >
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="(protected)"
          options={{
            headerShown: false,
            presentation: "fullScreenModal",
          }}
        />
        <Stack.Screen name="(un-protected)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}
