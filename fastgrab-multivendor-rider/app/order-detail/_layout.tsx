import { useApptheme } from "@/lib/context/global/theme.context";
import { Stack } from "expo-router";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrderDetailLayour() {
  // Hooks
  const { appTheme } = useApptheme();
  const {top} = useSafeAreaInsets()
  return (
    <View style={{paddingTop: top+10, flex: 1, backgroundColor: appTheme.themeBackground}}>
      <Stack
        screenOptions={{
          headerBackButtonDisplayMode: "generic",
          headerTitleStyle: { color: appTheme.mainTextColor },
          headerTintColor: appTheme.fontMainColor,
          headerStyle: Platform.select({
            ios: {
              position: "absolute",
              backgroundColor: appTheme.themeBackground,
            },

            default: {
              position: "absolute",
              backgroundColor: appTheme.themeBackground,

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
            title: "Order Detail",
            headerTintColor: appTheme.fontMainColor,
            headerTitleAlign: "center",
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </View>
  );
}
