// Contexts
import { useApptheme } from "@/lib/context/global/theme.context";

// Expo
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

// Core
import { Text, TouchableOpacity, View } from "react-native";

// Icons
import { Ionicons } from "@expo/vector-icons";

export default function ReferralsListHeader() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  return (
    <View
      className="flex flex-row items-center p-4 border-b-2"
      style={{
        backgroundColor: appTheme.themeBackground,
        borderBottomColor: appTheme.borderLineColor,
      }}
    >
      <TouchableOpacity onPress={() => router.back()} className="mr-4">
        <Ionicons name="arrow-back" size={24} color={appTheme.iconColor} />
      </TouchableOpacity>
      <Text
        className="text-xl font-bold"
        style={{ color: appTheme.fontMainColor }}
      >
        {t("Referrals")}
      </Text>
    </View>
  );
}
