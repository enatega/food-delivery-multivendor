// Core
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useMemo, useState } from "react";

// Interfaces
import {
  IRiderEarnings,
  IRiderEarningsResponse,
} from "@/lib/utils/interfaces/rider-earnings.interface";

// Charts
import { barDataItem } from "react-native-gifted-charts";

// GraphQL
import { RIDER_EARNINGS_GRAPH } from "@/lib/apollo/queries/earnings.query";
import { FETCH_RIDER_RECENT_ACTIVITY } from "@/lib/apollo/queries/referral.query";

// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { QueryResult, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

// Expo
import { router } from "expo-router";

// Skeletons
import { EarningScreenMainLoading } from "@/lib/ui/skeletons";

// Components
import EarningsBarChart from "../../bar-chart";
import EarningStack from "../earnings-stack";
import EarningsTabs from "../../tabs";
import ReferralStack from "../referrals-stack";
import ReferralModal from "../referrals-modal";
import ReferralRewards from "../referral-rewards";
import ReferralEarningsCard from "../referral-earnings-card";

// Helpers
import formatNumber from "@/lib/utils/methods/num-formatter";

// Interfaces
import { IReferralEarnings, IRecentActivityResponse } from "@/lib/utils/interfaces/referral.interface";

export default function EarningsMain() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  // State for active tab
  const [activeTab, setActiveTab] = useState<"deliveries" | "referrals">("deliveries");

  // State for referral modal
  const [referralModalVisible, setReferralModalVisible] = useState<
    IReferralEarnings & { bool: boolean }
  >({
    bool: false,
    _id: "",
    date: "",
    referralsArray: [],
    totalEarningsSum: 0,
    totalReferrals: 0,
  });

  // Contexts
  const { userId, setModalVisible } = useUserContext();

  // Queries
  const { loading: isRiderEarningsLoading, data: riderEarningsData } = useQuery(
    RIDER_EARNINGS_GRAPH,
    {
      variables: {
        riderId: userId ?? "",
      },
    },
  ) as QueryResult<IRiderEarningsResponse | undefined, { riderId: string }>;

  // Referral queries - fetch more activities to ensure we get last 5 days
  const { loading: isReferralLoading, data: referralData } = useQuery(
    FETCH_RIDER_RECENT_ACTIVITY,
    {
      variables: {
        limit: 100, // Fetch more to ensure we get activities from last 5 days
        offset: 0,
      },
      skip: activeTab !== "referrals",
    },
  ) as QueryResult<IRecentActivityResponse | undefined>;

  const barData: barDataItem[] =
    riderEarningsData?.riderEarningsGraph.earnings
      .slice(0, 5)
      .sort(
        (a, b) =>
          new Date(String(a.date)).setHours(0, 0, 0, 0) -
          new Date(String(b.date)).setHours(23, 59, 59, 999),
      )
      .map((earning: IRiderEarnings) => ({
        value: Math.abs(earning.totalEarningsSum),
        label: earning._id,
        topLabelComponent: () => {
          return (
            <Text
              style={{
                color: appTheme.fontMainColor,
                fontSize: 10,
                fontWeight: "600",
                marginBottom: 0,
              }}
            >
              ${formatNumber(earning.totalEarningsSum)}
            </Text>
          );
        },
      })) ?? ([] as barDataItem[]);

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
    const sortedGroups = Object.entries(grouped)
      .map(([dateKey, data]) => ({
        dateKey,
        date: data.date,
        activities: data.activities,
        totalEarnings: data.totalEarnings,
        totalReferrals: data.activities.length,
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    // Return last 5 days (or all if less than 5)
    return sortedGroups.slice(0, 5);
  }, [referralData]);

  // Format date for display
  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Referral bar data - use grouped data for last 5 days
  const referralBarData: barDataItem[] = useMemo(() => {
    return groupedReferralActivities.map((group) => ({
      value: Math.abs(group.totalEarnings),
      label: formatDisplayDate(group.date).split(',')[0], // Just "Jan 27" without year
      topLabelComponent: () => (
        <Text
          style={{
            color: appTheme.fontMainColor,
            fontSize: 10,
            fontWeight: "600",
            marginBottom: 0,
          }}
        >
          ${formatNumber(group.totalEarnings)}
        </Text>
      ),
    }));
  }, [groupedReferralActivities, appTheme.fontMainColor]);

  // Calculate total referral earnings
  const totalReferralEarnings = referralData?.fetchRiderRecentActivity?.summary?.totalEarnings || 0;

  // If loading
  if (isRiderEarningsLoading || (activeTab === "referrals" && isReferralLoading)) {
    return <EarningScreenMainLoading />;
  }

  return (
    <View style={{ backgroundColor: appTheme.screenBackground }}>
      {/* Tabs */}
      <EarningsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content based on active tab */}
      {activeTab === "deliveries" ? (
        <>
          <EarningsBarChart
            data={barData}
            width={700}
            height={200}
            frontColor={appTheme.primary}
            barStyle={{ marginTop: 15 }}
            rulesColor={appTheme.secondaryTextColor}
            topLabelTextStyle={{ color: appTheme.primary }}
            xAxisLabelTextStyle={{
              display: "flex",
              fontSize: 9,
              color: appTheme.fontMainColor,
            }}
            yAxisTextStyle={{ fontSize: 8, color: appTheme.fontSecondColor }}
          />
          <View className="flex flex-row justify-between w-full px-4 py-4">
            <Text
              className="text-xl font-bold"
              style={{ color: appTheme.fontMainColor }}
            >
              {t("Recent Activity")}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible({
                  bool: false,
                  _id: "",
                  date: "",
                  earningsArray: [],
                  totalEarningsSum: 0,
                  totalTipsSum: 0,
                  totalDeliveries: 0,
                });
                router.push("/(tabs)/earnings/(routes)/earnings-detail");
              }}
            >
              <Text className="text-sm text-[#3B82F6] font-bold">
                {t("See More")}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <FlatList
              data={riderEarningsData?.riderEarningsGraph?.earnings?.slice(0, 5)}
              contentContainerClassName="scroll-smooth"
              keyExtractor={(_, index) => index.toString()}
              style={{ height: "55%" }}
              ListEmptyComponent={
                <Text
                  className="block mx-auto font-bold text-center w-full my-12 "
                  style={{ color: appTheme.fontSecondColor }}
                >
                  {t("No record found")}
                </Text>
              }
              renderItem={(info) => {
                return (
                  <EarningStack
                    date={info?.item?.date}
                    earning={info?.item?.totalEarningsSum}
                    totalDeliveries={info?.item?.earningsArray.length}
                    _id={info?.item?._id}
                    tip={info?.item?.totalTipsSum}
                    earningsArray={info?.item?.earningsArray}
                    key={info.index}
                    setModalVisible={setModalVisible}
                  />
                );
              }}
            />
          </View>
        </>
      ) : (
        <ScrollView 
          style={{ height: "100%" }}
          contentContainerStyle={{ paddingBottom: 200 }}
          showsVerticalScrollIndicator={false}
        >
          <EarningsBarChart
            data={referralBarData}
            width={700}
            height={200}
            frontColor={appTheme.primary}
            barStyle={{ marginTop: 15 }}
            rulesColor={appTheme.secondaryTextColor}
            topLabelTextStyle={{ color: appTheme.primary }}
            xAxisLabelTextStyle={{
              display: "flex",
              fontSize: 9,
              color: appTheme.fontMainColor,
            }}
            yAxisTextStyle={{ fontSize: 8, color: appTheme.fontSecondColor }}
          />
          <View className="flex flex-row justify-between w-full px-4 py-4">
            <Text
              className="text-xl font-bold"
              style={{ color: appTheme.fontMainColor }}
            >
              {t("Recent Referral Activity")}
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/earnings/(routes)/referrals-detail");
              }}
            >
              <Text className="text-sm text-[#3B82F6] font-bold">
                {t("See More")}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Recent Referral Activity List */}
          {groupedReferralActivities.map((group) => (
            <ReferralStack
              key={group.dateKey}
              date={formatDisplayDate(group.date)}
              earning={group.totalEarnings}
              totalReferrals={group.totalReferrals}
              _id={group.dateKey}
              referralsArray={group.activities}
              setModalVisible={setReferralModalVisible}
              activityId={group.activities[0]?._id}
              dateKey={group.dateKey}
            />
          ))}
          
          {/* Referral Earnings Card */}
          <ReferralEarningsCard 
            totalEarnings={totalReferralEarnings} 
          />
          
          {/* Referral Rewards Component */}
          <ReferralRewards />
          
          <ReferralModal
            totalEarnings={referralModalVisible.totalEarningsSum}
            totalReferrals={referralModalVisible.totalReferrals}
            modalVisible={referralModalVisible}
            setModalVisible={setReferralModalVisible}
            activityId={referralModalVisible._id}
          />
        </ScrollView>
      )}
    </View>
  );
}
