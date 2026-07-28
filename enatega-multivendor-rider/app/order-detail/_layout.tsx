import { useApptheme } from "@/lib/context/global/theme.context";
import { Stack } from "expo-router";
import { Platform, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrderDetailLayour() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: top + 10,
        flex: 1,
        backgroundColor: appTheme.themeBackground,
      }}
    >
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
            title: t("Order Details"),
            headerTintColor: appTheme.fontMainColor,
            headerTitleAlign: "center",
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </View>
  );
}
