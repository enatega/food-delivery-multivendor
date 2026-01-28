// Contexts
import { useApptheme } from "@/lib/context/global/theme.context";

// Core
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

// Icons
import { Ionicons } from "@expo/vector-icons";

interface IReferralEarningsCardProps {
  totalEarnings: number;
}

export default function ReferralEarningsCard({
  totalEarnings,
}: IReferralEarningsCardProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  return (
    <View 
      className="mx-3 my-3 rounded-lg overflow-hidden" 
      style={{
        borderWidth: 1,
        borderColor: appTheme.borderLineColor,
      }}
    >
      {/* Decorative Header with Stars */}
      <View
        className="h-16 relative"
        style={{
          backgroundColor: "#1a4d2e",
        }}
      >
        {/* Star decorations */}
        <View className="absolute top-2 left-4">
          <Ionicons name="star" size={16} color="#4ade80" />
        </View>
        <View className="absolute top-3 left-16">
          <Ionicons name="star" size={12} color="#4ade80" />
        </View>
        <View className="absolute top-2 right-8">
          <Ionicons name="star" size={14} color="#4ade80" />
        </View>
        <View className="absolute top-1 right-20">
          <Ionicons name="star" size={10} color="#4ade80" />
        </View>
        <View className="absolute top-4 left-32">
          <Ionicons name="star" size={8} color="#4ade80" />
        </View>
        <View className="absolute top-2 right-32">
          <Ionicons name="star" size={14} color="#4ade80" />
        </View>
        <View className="absolute bottom-2 left-8">
          <Ionicons name="star" size={10} color="#4ade80" />
        </View>
        <View className="absolute bottom-1 right-12">
          <Ionicons name="star" size={12} color="#4ade80" />
        </View>
        <View className="absolute bottom-3 right-28">
          <Ionicons name="star" size={8} color="#4ade80" />
        </View>
        <View className="absolute top-6 left-24">
          <Ionicons name="star" size={6} color="#4ade80" />
        </View>
      </View>

      {/* Content */}
      <View
        className="p-4"
        style={{
          backgroundColor: appTheme.themeBackground,
        }}
      >
        <Text
          className="text-2xl font-bold mb-1"
          style={{ color: appTheme.fontMainColor }}
        >
          QAR {totalEarnings.toFixed(0)}
        </Text>
        <Text
          className="text-sm"
          style={{ color: appTheme.fontSecondColor }}
        >
          {t("Earned from referrals")}
        </Text>
      </View>
    </View>
  );
}
