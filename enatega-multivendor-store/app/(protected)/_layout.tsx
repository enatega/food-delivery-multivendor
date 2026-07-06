// Providers
import RestaurantProvider from "@/lib/context/global/restaurant";
import { AuthContext } from "@/lib/context/global/auth.context";
import { SoundProvider } from "@/lib/context/global/sound.context";
import { useApptheme } from "@/lib/context/theme.context";

// Expo
import { Redirect, Stack } from "expo-router";
import { StatusBar, StatusBarStyle } from "expo-status-bar";
import { useContext } from "react";

// React Native Flash Message
import FlashMessage from "react-native-flash-message";

export default function ProtectedLayout() {
  const { appTheme, currentTheme } = useApptheme();
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Redirect href="/(un-protected)/login" />;
  }

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
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="order-detail"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="chat" options={{ headerShown: false }} />
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
