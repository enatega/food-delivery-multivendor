// Providers
import RestaurantProvider from "@/lib/context/global/restaurant";
import { SoundProvider } from "@/lib/context/global/sound.context";
import { useApptheme } from "@/lib/context/theme.context";

// Expo
import { Stack } from "expo-router";
import { StatusBar, StatusBarStyle } from "expo-status-bar";

// React Native Flash Message
import FlashMessage from "react-native-flash-message";

export default function ProtectedLayout() {
  const { appTheme, currentTheme } = useApptheme();
  return (
    <RestaurantProvider.Provider>
      <SoundProvider>
        <>
          <Stack
            screenOptions={{
              headerShown: false,
              headerStyle: {
                backgroundColor: appTheme.screenBackground,
              },
              headerTitleAlign: "center",
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="order-detail"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="chat"
              options={{ headerShown: false }}
            />
          </Stack>
          {/* <Stack.Screen
            name="bank-management"
            options={{ headerShown: true }}
          /> */}
          <StatusBar style={currentTheme as StatusBarStyle} />
          <FlashMessage position="bottom" />
        </>
      </SoundProvider>
    </RestaurantProvider.Provider>
  );
}
