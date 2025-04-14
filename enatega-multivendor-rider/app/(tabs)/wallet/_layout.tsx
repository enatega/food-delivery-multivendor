// Expo
import { useApptheme } from "@/lib/context/global/theme.context";
import { Stack } from "expo-router";

// Hooks
import { useTranslation } from "react-i18next";

export default function StackLayout() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: t("Wallet"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: appTheme.themeBackground },
          headerTitleStyle: { color: appTheme.mainTextColor },
          contentStyle: {
            backgroundColor: appTheme.fontMainColor,
          },
          headerBackTitle: "Wallet",
        }}
      />
      <Stack.Screen
        name="(routes)/success"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
