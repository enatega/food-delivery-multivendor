import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function Layout() {
  // Hooks
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          title: t("Help"),
        }}
      />
    </Stack>
  );
}
