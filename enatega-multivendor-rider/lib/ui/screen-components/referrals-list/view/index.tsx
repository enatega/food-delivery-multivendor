// Contexts
import { useApptheme } from "@/lib/context/global/theme.context";

// Core
import { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";

// GraphQL
import { FETCH_RIDER_ACTIVITIES_BY_DATE } from "@/lib/apollo/queries/referral.query";
import { QueryResult, useQuery } from "@apollo/client";

// Components
import LevelTabs from "../../referrals-detail/level-tabs";
import ReferralItem from "../../referrals-detail/referral-item";

// Interfaces
import { IReferral, IRecentActivityResponse } from "@/lib/utils/interfaces/referral.interface";

// React Native Gesture
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function ReferralsListMain() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const params = useLocalSearchParams();

  // States - default to Level 1
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(1);

  // Get dateKey from params (YYYY-MM-DD format)
  const dateKey = params.dateKey as string;

  // For a single day, send the same date for both startDate and endDate
  const { startDate, endDate } = useMemo(() => {
    if (!dateKey) return { startDate: "", endDate: "" };
    
    // Send the same date (YYYY-MM-DD) for both start and end
    // Backend should handle filtering for that specific day
    return {
      startDate: dateKey,
      endDate: dateKey,
    };
  }, [dateKey]);

  // Query - fetch activities for this specific date
  const { data: activitiesData, loading } = useQuery(
    FETCH_RIDER_ACTIVITIES_BY_DATE,
    {
      variables: {
        startDate,
        endDate,
      },
      skip: !dateKey || !startDate || !endDate,
    },
  ) as QueryResult<IRecentActivityResponse | undefined>;

  // Group activities by level and convert to IReferral format
  const filteredReferrals = useMemo(() => {
    if (!activitiesData?.fetchRiderRecentActivity?.activities) return [];

    // Filter activities by level and convert to IReferral format
    return activitiesData.fetchRiderRecentActivity.activities
      .filter((activity) => activity.level === activeLevel)
      .map((activity) => {
        // Use createdAt as the joined date (when the referral activity happened)
        const joinedDate = activity.createdAt || "";
        
        return {
          _id: activity._id,
          name: activity.triggeredBy || activity.user_name || "Unknown",
          joinedDate: joinedDate,
          amount: activity.value,
          status: "Eligible" as const,
          level: activeLevel,
        } as IReferral;
      })
      .sort((a, b) => {
        // Sort by date descending (latest first)
        // Try parsing as both timestamp and ISO date
        const dateA = new Date(isNaN(Number(a.joinedDate)) ? a.joinedDate : Number(a.joinedDate)).getTime();
        const dateB = new Date(isNaN(Number(b.joinedDate)) ? b.joinedDate : Number(b.joinedDate)).getTime();
        return dateB - dateA;
      });
  }, [activeLevel, activitiesData]);

  return (
    <GestureHandlerRootView
      style={{ backgroundColor: appTheme.screenBackground, height: "100%" }}
    >
      {/* Level Tabs */}
      <LevelTabs activeLevel={activeLevel} onLevelChange={setActiveLevel} />

      {/* Referrals List */}
      <FlatList
        data={filteredReferrals}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text
              className="text-base font-semibold"
              style={{ color: appTheme.fontSecondColor }}
            >
              {loading ? t("Loading...") : t("No referrals found")}
            </Text>
          </View>
        }
        renderItem={({ item }) => <ReferralItem referral={item} />}
      />
    </GestureHandlerRootView>
  );
}
