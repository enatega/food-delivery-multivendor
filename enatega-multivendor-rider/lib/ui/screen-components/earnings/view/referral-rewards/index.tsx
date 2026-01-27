// Contexts
import { useApptheme } from "@/lib/context/global/theme.context";

// Core
import { useState } from "react";
import { Text, TouchableOpacity, View, FlatList } from "react-native";
import { useTranslation } from "react-i18next";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Mock Data
import { mockReferrals } from "@/lib/utils/dummy/referrals";

// Interfaces
import { IReferral } from "@/lib/utils/interfaces/referral.interface";

export default function ReferralRewards() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  // States
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(1);

  // Calculate total earnings
  const totalEarnings = mockReferrals.reduce((sum, ref) => sum + ref.amount, 0);

  // Filter by level
  const filteredReferrals = mockReferrals.filter(
    (ref) => ref.level === activeLevel
  );

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View
      className="mx-3 my-3 rounded-lg overflow-hidden"
      style={{
        backgroundColor: appTheme.themeBackground,
        borderWidth: 1,
        borderColor: appTheme.borderLineColor,
      }}
    >
      {/* Header */}
      <TouchableOpacity
        className="flex flex-row justify-between items-center p-4"
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View className="flex flex-row items-center gap-3">
          <Ionicons name="trophy-outline" size={24} color={appTheme.primary} />
          <View>
            <View className="flex flex-row items-center" style={{ gap: 6 }}>
              <Text
                className="text-base font-bold"
                style={{ color: appTheme.fontMainColor }}
              >
                {t("Referral Rewards")}
              </Text>
              <Ionicons 
                name="information-circle-outline" 
                size={18} 
                color={appTheme.fontSecondColor} 
              />
            </View>
            <Text
              className="text-sm"
              style={{ color: appTheme.fontSecondColor }}
            >
              QAR {totalEarnings.toFixed(0)} {t("earned so far")}
            </Text>
            {!isExpanded && (
              <Text
                className="text-xs mt-1"
                style={{ color: appTheme.fontSecondColor, opacity: 0.7 }}
              >
                {t("Tap to view detailed breakdown")}
              </Text>
            )}
          </View>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={28}
          color="#666666"
        />
      </TouchableOpacity>

      {/* Collapsible Content */}
      {isExpanded && (
        <View>
          {/* Level Tabs */}
          <View className="flex flex-row justify-around px-4 pb-3">
            {[1, 2, 3].map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => setActiveLevel(level as 1 | 2 | 3)}
                className="px-4 py-2"
                style={{
                  borderBottomWidth: activeLevel === level ? 2 : 0,
                  borderBottomColor: activeLevel === level ? appTheme.primary : "transparent",
                }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{
                    color:
                      activeLevel === level
                        ? appTheme.primary
                        : appTheme.fontSecondColor,
                  }}
                >
                  {t("Level")} {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Referrals List */}
          <View className="px-4 pb-4">
            {filteredReferrals.length > 0 ? (
              filteredReferrals.map((referral, index) => (
                <View
                  key={referral._id}
                  className="flex flex-row justify-between items-center py-3"
                  style={{ 
                    borderBottomWidth: index === filteredReferrals.length - 1 ? 0 : 1,
                    borderBottomColor: appTheme.borderLineColor 
                  }}
                >
                  <View>
                    <Text
                      className="text-base font-semibold mb-1"
                      style={{ color: appTheme.fontMainColor }}
                    >
                      {referral.name}
                    </Text>
                    <Text
                      className="text-xs"
                      style={{ color: appTheme.fontSecondColor }}
                    >
                      {t("Joined on")} {formatDate(referral.joinedDate)}
                    </Text>
                  </View>
                  <Text
                    className="text-base font-bold"
                    style={{ color: appTheme.fontMainColor }}
                  >
                    QAR {referral.amount.toFixed(1)}
                  </Text>
                </View>
              ))
            ) : (
              <Text
                className="text-center py-4"
                style={{ color: appTheme.fontSecondColor }}
              >
                {t("No referrals found")}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
