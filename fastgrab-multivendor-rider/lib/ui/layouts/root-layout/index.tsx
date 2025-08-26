import { useApptheme } from "@/lib/context/global/theme.context";
import { Stack } from "expo-router";

export default function RootStackLayout() {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTintColor: appTheme.mainTextColor,
        headerTitleStyle: { color: appTheme.mainTextColor },
      }}
      initialRouteName="(tabs)"
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen
        name="order-detail"
        options={{
          // headerShown: false,
          headerTintColor: appTheme.fontMainColor,
        }}
      />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
    </Stack>
  );
}
