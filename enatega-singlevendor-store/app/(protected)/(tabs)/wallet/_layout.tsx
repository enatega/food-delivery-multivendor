import { useApptheme } from "@/lib/context/theme.context";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function StackLayout() {
  // Hooks
  const { t } = useTranslation();
  const { appTheme } = useApptheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: appTheme.screenBackground,
        },
        headerTitleStyle: {
          color: appTheme.fontMainColor,
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: true, headerTitle: t("Wallet") }}
      />
      <Stack.Screen
        name="(routes)/success"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
