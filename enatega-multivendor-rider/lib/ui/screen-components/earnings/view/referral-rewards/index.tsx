// Contexts
import { useApptheme } from "@/lib/context/global/theme.context";

// Core
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

// Icons
import { Ionicons } from "@expo/vector-icons";

// GraphQL
import { FETCH_RIDER_REFERRAL_REWARDS } from "@/lib/apollo/queries/referral.query";
import { QueryResult, useQuery } from "@apollo/client";

// Interfaces
import { IReferralRewardsResponse } from "@/lib/utils/interfaces/referral.interface";

export default function ReferralRewards() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  // States
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(1);

  // Query
  const { data: rewardsData, loading } = useQuery(
    FETCH_RIDER_REFERRAL_REWARDS,
    {
      variables: {
        level: isExpanded ? activeLevel : undefined,
      },
    },
  ) as QueryResult<IReferralRewardsResponse | undefined>;

  // Calculate total earnings
  const totalEarnings = rewardsData?.fetchRiderReferralRewards?.totalEarnings || 0;

  // Filter by level
  const filteredReferrals = rewardsData?.fetchRiderReferralRewards?.referralDetails?.filter(
    (ref) => ref.level === activeLevel
  ) || [];

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
      });
    } catch (error) {
      console.log("Error parsing date:", dateString);
      return "N/A";
    }
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
            {loading ? (
              <Text
                className="text-center py-4"
                style={{ color: appTheme.fontSecondColor }}
              >
                {t("Loading...")}
              </Text>
            ) : filteredReferrals.length > 0 ? (
              filteredReferrals
                .sort((a, b) => {
                  // Sort by joinedAt date descending (latest first)
                  const dateA = new Date(isNaN(Number(a.joinedAt)) ? a.joinedAt : Number(a.joinedAt)).getTime();
                  const dateB = new Date(isNaN(Number(b.joinedAt)) ? b.joinedAt : Number(b.joinedAt)).getTime();
                  return dateB - dateA;
                })
                .map((referral, index) => {
                  // Map API status to UI status
                  const isWithdrawn = referral.status === "WITHDRAWN" || referral.status === "COMPLETED";
                  const statusText = isWithdrawn ? "Withdrawn" : "Eligible";
                  const statusColor = isWithdrawn ? "#22C55E" : "#f97316";
                  const statusBgColor = isWithdrawn 
                    ? "rgba(34, 197, 94, 0.2)" 
                    : "rgba(249, 115, 22, 0.2)";
                  
                  return (
                    <View
                      key={referral.riderId}
                      className="flex flex-row justify-between items-center py-3"
                      style={{ 
                        borderBottomWidth: index === filteredReferrals.length - 1 ? 0 : 1,
                        borderBottomColor: appTheme.borderLineColor 
                      }}
                    >
                      <View className="flex-1">
                        <Text
                          className="text-base font-semibold mb-1"
                          style={{ color: appTheme.fontMainColor }}
                        >
                          {referral.riderName}
                        </Text>
                        <Text
                          className="text-xs"
                          style={{ color: appTheme.fontSecondColor }}
                        >
                          {t("Joined on")} {formatDate(referral.joinedAt)}
                        </Text>
                      </View>
                      <View className="items-end">
                        <View
                          className="px-2 py-1 rounded-full mb-1"
                          style={{ backgroundColor: statusBgColor }}
                        >
                          <Text
                            className="text-xs font-semibold"
                            style={{ color: statusColor }}
                          >
                            {t(statusText)}
                          </Text>
                        </View>
                        <Text
                          className="text-base font-bold"
                          style={{ color: appTheme.fontMainColor }}
                        >
                          QAR {referral.earnedAmount.toFixed(1)}
                        </Text>
                      </View>
                    </View>
                  );
                })
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
