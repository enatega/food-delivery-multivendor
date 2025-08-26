// Expo
import { useApptheme } from "@/lib/context/global/theme.context";
import { Stack } from "expo-router";

// Hooks
import { useTranslation } from "react-i18next";

// Core
import { Platform } from "react-native";

export default function LoginLayour() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerStyle: Platform.select({
          ios: {
            position: "absolute",
          },

          default: {
            position: "absolute",
            backgroundColor: appTheme.white,
            elevation: 0, // Shadow for Android
            shadowColor: "white", // Shadow for iOS
            shadowOpacity: 0,
            shadowRadius: 0,
          },
        }),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: t("Chat"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
