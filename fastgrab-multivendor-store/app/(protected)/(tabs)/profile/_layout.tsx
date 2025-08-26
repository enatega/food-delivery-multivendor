// Hooks
import { useApptheme } from "@/lib/context/theme.context";

// Expo
import { Stack } from "expo-router";

export default function ProfileLayout() {
  // Hooks
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
        headerShown: false,
        headerBackButtonMenuEnabled: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerBackButtonMenuEnabled: true,
        }}
      />
    </Stack>
  );
}
