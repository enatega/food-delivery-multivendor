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

  // Format date - handles Unix timestamps in milliseconds
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    
    try {
      // Check if it's a Unix timestamp (numeric string)
      const timestamp = parseInt(dateString);
      const date = isNaN(timestamp) ? new Date(dateString) : new Date(timestamp);
      
      if (isNaN(date.getTime())) return "N/A";
      
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.log("Error parsing date:", dateString, error);
      return "N/A";
    }
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
          className="px-3 py-1 rounded-full mb-2"
          style={{
            backgroundColor:
              referral.status === "Eligible"
                ? "rgba(249, 115, 22, 0.2)"
                : "rgba(34, 197, 94, 0.2)",
          }}
        >
          <Text
            className="text-xs font-semibold"
            style={{
              color: referral.status === "Eligible" ? "#f97316" : "#22C55E",
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
