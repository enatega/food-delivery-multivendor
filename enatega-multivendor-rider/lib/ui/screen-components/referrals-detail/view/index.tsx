// Contexts
import { useApptheme } from "@/lib/context/global/theme.context";
import { useUserContext } from "@/lib/context/global/user.context";

// Core
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

// GraphQL
import { FETCH_RIDER_RECENT_ACTIVITY } from "@/lib/apollo/queries/referral.query";
import { QueryResult, useQuery } from "@apollo/client";

// Components
import ReferralStack from "../../earnings/view/referrals-stack";
import ReferralsDateFilter from "../date-filter";
import ReferralModal from "../../earnings/view/referrals-modal";

// Interfaces
import { IReferralEarnings, IRecentActivityResponse } from "@/lib/utils/interfaces/referral.interface";

// React Native Gesture
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface IDateFilter {
  startDate: string;
  endDate: string;
}

interface IReferralsDetailMainProps {
  dateFilter: IDateFilter;
  setDateFilter: Dispatch<SetStateAction<IDateFilter>>;
  setReferralModalVisible: Dispatch<
    SetStateAction<IReferralEarnings & { bool: boolean }>
  >;
}

export default function ReferralsDetailMain({
  dateFilter,
  setDateFilter,
  setReferralModalVisible,
}: IReferralsDetailMainProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { userId } = useUserContext();

  // States
  const [isDateFilterVisible, setIsDateFilterVisible] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Query
  const { data: referralData, loading, refetch } = useQuery(
    FETCH_RIDER_RECENT_ACTIVITY,
    {
      variables: {
        startDate: dateFilter.startDate || undefined,
        endDate: dateFilter.endDate || undefined,
        limit: 50,
        offset: 0,
      },
    },
  ) as QueryResult<IRecentActivityResponse | undefined>;

  // Group referral activities by date
  const groupedReferralActivities = useMemo(() => {
    if (!referralData?.fetchRiderRecentActivity?.activities) return [];

    // Group activities by date
    const grouped: { [key: string]: { activities: typeof referralData.fetchRiderRecentActivity.activities; totalEarnings: number; date: Date } } = {};

    referralData.fetchRiderRecentActivity.activities.forEach((activity) => {
      if (!activity.createdAt) return;

      try {
        // Handle Unix timestamp or date string
        const timestamp = parseInt(activity.createdAt);
        const dateObj = isNaN(timestamp) ? new Date(activity.createdAt) : new Date(timestamp);

        if (isNaN(dateObj.getTime())) return;

        // Get date string for grouping (YYYY-MM-DD)
        const dateKey = dateObj.toISOString().split('T')[0];

        if (!grouped[dateKey]) {
          grouped[dateKey] = {
            activities: [],
            totalEarnings: 0,
            date: dateObj,
          };
        }

        grouped[dateKey].activities.push(activity);
        grouped[dateKey].totalEarnings += activity.value;
      } catch (error) {
        console.log("Error parsing date:", activity.createdAt);
      }
    });

    // Convert to array and sort by date (newest first)
    return Object.entries(grouped)
      .map(([dateKey, data]) => ({
        dateKey,
        date: data.date,
        activities: data.activities,
        totalEarnings: data.totalEarnings,
        totalReferrals: data.activities.length,
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [referralData]);

  // Format date for display
  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate totals from API
  const totals = useMemo(() => {
    return {
      totalReferrals: referralData?.fetchRiderRecentActivity?.summary?.totalReferrals || 0,
      totalEarnings: referralData?.fetchRiderRecentActivity?.summary?.totalEarnings || 0,
    };
  }, [referralData]);

  // Handlers
  async function handleDateFilterSubmit() {
    try {
      setIsFiltering(true);
      await refetch({
        startDate: dateFilter.startDate || undefined,
        endDate: dateFilter.endDate || undefined,
        limit: 50,
        offset: 0,
      });
      setIsDateFilterVisible(false);
    } catch (error) {
      console.log("Error filtering referrals:", error);
    } finally {
      setIsFiltering(false);
    }
  }

  async function refetchDefault() {
    try {
      setIsFiltering(true);
      setDateFilter({ startDate: "", endDate: "" });
      await refetch({
        startDate: undefined,
        endDate: undefined,
        limit: 50,
        offset: 0,
      });
    } catch (error) {
      console.log("Error refetching referrals:", error);
    } finally {
      setIsFiltering(false);
    }
  }

  return (
    <GestureHandlerRootView
      style={{ backgroundColor: appTheme.screenBackground, height: "100%" }}
    >
      <ReferralsDateFilter
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        handleFilterSubmit={handleDateFilterSubmit}
        isFiltering={isFiltering}
        isDateFilterVisible={isDateFilterVisible}
        setIsDateFilterVisible={setIsDateFilterVisible}
        refetchDefault={refetchDefault}
      />

      {/* Summary Section */}
      <View
        className="py-3 border-b-2"
        style={{
          borderColor: appTheme.borderLineColor,
          backgroundColor: appTheme.themeBackground,
        }}
      >
        <Text
          className="px-5 text-lg font-semibold mb-3"
          style={{ color: appTheme.fontMainColor }}
        >
          {t("Summary")}
        </Text>
        <View className="flex flex-row justify-between items-center px-5">
          <View className="flex gap-2">
            <Text className="text-base" style={{ color: appTheme.fontMainColor }}>
              {t("Referrals")}
            </Text>
            <Text
              className="font-semibold text-lg"
              style={{ color: appTheme.mainTextColor }}
            >
              {totals.totalReferrals}
            </Text>
          </View>
          <View
            className="flex gap-2 items-end border-l-2 pl-8"
            style={{ borderLeftColor: appTheme.borderLineColor }}
          >
            <Text className="text-base" style={{ color: appTheme.fontMainColor }}>
              {t("Total Earnings")}
            </Text>
            <Text
              className="font-semibold text-lg"
              style={{ color: appTheme.mainTextColor }}
            >
              ${totals.totalEarnings.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Referral Activity List */}
      <FlatList
        data={groupedReferralActivities}
        keyExtractor={(item) => item.dateKey}
        contentContainerClassName="scroll-smooth pb-12"
        style={{ height: "55%" }}
        ListEmptyComponent={
          <Text
            className="block mx-auto font-bold text-center w-full my-12"
            style={{ color: appTheme.fontSecondColor }}
          >
            {loading ? t("Loading...") : t("No record found")}
          </Text>
        }
        renderItem={(info) => {
          return (
            <ReferralStack
              date={formatDisplayDate(info.item.date)}
              earning={info.item.totalEarnings}
              totalReferrals={info.item.totalReferrals}
              _id={info.item.dateKey}
              referralsArray={info.item.activities}
              key={info.index}
              setModalVisible={setReferralModalVisible}
              activityId={info.item.activities[0]?._id}
              dateKey={info.item.dateKey}
            />
          );
        }}
      />
    </GestureHandlerRootView>
  );
}
