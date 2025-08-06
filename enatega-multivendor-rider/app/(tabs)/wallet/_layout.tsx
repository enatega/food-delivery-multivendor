// Expo
import { useApptheme } from "@/lib/context/global/theme.context";
import { Stack } from "expo-router";

// Hooks
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StackLayout() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
const {top} = useSafeAreaInsets()
  return (
    <View style={{paddingTop: top+10, flex: 1, backgroundColor: appTheme.themeBackground}}>
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
    </View>
  );
}
