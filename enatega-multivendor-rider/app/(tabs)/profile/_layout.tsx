// Expo
import { useApptheme } from "@/lib/context/global/theme.context";
import { Stack } from "expo-router";

// Hooks
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileLayout() {
  // Hooks
  const { t } = useTranslation();
  const { appTheme } = useApptheme();
  const {top} = useSafeAreaInsets()

  return (
    <View style={{paddingTop: top+10, flex: 1, backgroundColor: appTheme.themeBackground}}>
      <Stack screenOptions={{ headerShown: false, headerShadowVisible: false }}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            headerTitle: t("Profile"),
            headerTitleStyle: { color: appTheme.mainTextColor },
            headerStyle: { backgroundColor: appTheme.themeBackground },
          }}
        />
      </Stack>
    </View>
  );
}
