// Contexts
import { useApptheme } from "@/lib/context/global/theme.context";

// Core
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

// Interfaces
import { IReferral } from "@/lib/utils/interfaces/referral.interface";

interface IReferralItemProps {
  referral: IReferral;
}

export default function ReferralItem({ referral }: IReferralItemProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View
      className="flex flex-row justify-between items-center p-4 mx-4 my-2 rounded-lg"
      style={{
        backgroundColor: appTheme.themeBackground,
        borderWidth: 1,
        borderColor: appTheme.borderLineColor,
      }}
    >
      <View className="flex-1">
        <Text
          className="text-base font-bold mb-1"
          style={{ color: appTheme.fontMainColor }}
        >
          {referral.name}
        </Text>
        <Text
          className="text-sm"
          style={{ color: appTheme.fontSecondColor }}
        >
          {t("Joined")}: {formatDate(referral.joinedDate)}
        </Text>
      </View>
      <View className="items-end">
        <View
          className="px-2 py-1 rounded mb-2"
          style={{
            backgroundColor:
              referral.status === "Eligible"
                ? "rgba(34, 197, 94, 0.1)"
                : "rgba(59, 130, 246, 0.1)",
          }}
        >
          <Text
            className="text-xs font-semibold"
            style={{
              color: referral.status === "Eligible" ? "#22C55E" : "#3B82F6",
            }}
          >
            {t(referral.status)}
          </Text>
        </View>
        <Text
          className="text-lg font-bold text-[#3B82F6]"
        >
          QAR {referral.amount.toFixed(1)}
        </Text>
      </View>
    </View>
  );
}
