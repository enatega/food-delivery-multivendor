// Expo
import { Stack } from "expo-router";

// Hooks
import { useTranslation } from "react-i18next";

export default function ProfileLayout() {
  // Hooks
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{ headerTitle: "", headerBackButtonMenuEnabled: true }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: t("Profile"),
          headerBackButtonMenuEnabled: true,
        }}
      />
    </Stack>
  );
}
