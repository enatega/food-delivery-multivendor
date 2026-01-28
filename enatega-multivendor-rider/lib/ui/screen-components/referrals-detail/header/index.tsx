// Contexts
import { useApptheme } from "@/lib/context/global/theme.context";

// Expo
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

// Core
import { Text, TouchableOpacity, View } from "react-native";

// Icons
import { Ionicons } from "@expo/vector-icons";

export default function ReferralsDetailHeader() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  return (
    <View
      className="flex flex-row justify-between items-center p-4 border-b-2"
      style={{
        backgroundColor: appTheme.themeBackground,
        borderBottomColor: appTheme.borderLineColor,
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={appTheme.iconColor} />
      </TouchableOpacity>
      <Text
        className="text-xl font-bold"
        style={{ color: appTheme.fontMainColor }}
      >
        {t("Referral Earnings")}
      </Text>
      <View style={{ width: 24 }} />
    </View>
  );
}
