import { useApptheme } from "@/lib/context/global/theme.context";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

interface EarningsTabsProps {
  activeTab: "deliveries" | "referrals";
  onTabChange: (tab: "deliveries" | "referrals") => void;
}

export default function EarningsTabs({ activeTab, onTabChange }: EarningsTabsProps) {
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  return (
    <View className="flex-row px-5 pt-4 pb-2">
      {/* Deliveries Tab */}
      <TouchableOpacity
        onPress={() => onTabChange("deliveries")}
        className="flex-1"
      >
        <Text
          className="text-base font-semibold text-center pb-3"
          style={{
            color: activeTab === "deliveries" ? appTheme.primary : appTheme.fontSecondColor,
          }}
        >
          {t("Deliveries")}
        </Text>
        {activeTab === "deliveries" && (
          <View
            style={{
              height: 3,
              backgroundColor: appTheme.primary,
              borderRadius: 2,
            }}
          />
        )}
      </TouchableOpacity>

      {/* Referrals Tab */}
      <TouchableOpacity
        onPress={() => onTabChange("referrals")}
        className="flex-1"
      >
        <Text
          className="text-base font-semibold text-center pb-3"
          style={{
            color: activeTab === "referrals" ? appTheme.primary : appTheme.fontSecondColor,
          }}
        >
          {t("Referrals")}
        </Text>
        {activeTab === "referrals" && (
          <View
            style={{
              height: 3,
              backgroundColor: appTheme.primary,
              borderRadius: 2,
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}
