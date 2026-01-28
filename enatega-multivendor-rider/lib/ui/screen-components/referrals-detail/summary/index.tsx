// Contexts
import { useApptheme } from "@/lib/context/global/theme.context";

// Core
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

interface IReferralSummaryProps {
  totalReferrals: number;
  totalEarnings: number;
  dateRange: string;
}

export default function ReferralSummary({
  totalReferrals,
  totalEarnings,
  dateRange,
}: IReferralSummaryProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  return (
    <View
      className="p-6 m-4 rounded-lg"
      style={{
        backgroundColor: appTheme.themeBackground,
        borderWidth: 1,
        borderColor: appTheme.borderLineColor,
      }}
    >
      <Text
        className="text-lg font-bold mb-4"
        style={{ color: appTheme.fontMainColor }}
      >
        {t("Summary")}
      </Text>
      <View className="flex flex-row justify-between items-center mb-3">
        <Text
          className="text-base"
          style={{ color: appTheme.fontSecondColor }}
        >
          {t("Total Referrals")}
        </Text>
        <Text
          className="text-base font-bold"
          style={{ color: appTheme.fontMainColor }}
        >
          {totalReferrals}
        </Text>
      </View>
      <View className="flex flex-row justify-between items-center mb-3">
        <Text
          className="text-base"
          style={{ color: appTheme.fontSecondColor }}
        >
          {t("Total Earnings")}
        </Text>
        <Text
          className="text-base font-bold text-[#3B82F6]"
        >
          ${totalEarnings.toFixed(2)}
        </Text>
      </View>
      {dateRange && (
        <View className="flex flex-row justify-between items-center">
          <Text
            className="text-sm"
            style={{ color: appTheme.fontSecondColor }}
          >
            {t("Date Range")}
          </Text>
          <Text
            className="text-sm"
            style={{ color: appTheme.fontSecondColor }}
          >
            {dateRange}
          </Text>
        </View>
      )}
    </View>
  );
}
