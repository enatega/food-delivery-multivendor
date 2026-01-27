// Core
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";

// Interfaces
import {
  IRiderEarnings,
  IRiderEarningsResponse,
} from "@/lib/utils/interfaces/rider-earnings.interface";

// Charts
import { barDataItem } from "react-native-gifted-charts";

// GraphQL
import { RIDER_EARNINGS_GRAPH } from "@/lib/apollo/queries/earnings.query";

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

// Helpers
import formatNumber from "@/lib/utils/methods/num-formatter";

// Mock Data
import { mockReferralEarnings } from "@/lib/utils/dummy/referrals";
import { IReferralEarnings } from "@/lib/utils/interfaces/referral.interface";

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

  // Referral bar data (mock data)
  const referralBarData: barDataItem[] = mockReferralEarnings
    .slice(0, 5)
    .map((earning: IReferralEarnings) => ({
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
    }));

  // If loading
  if (isRiderEarningsLoading) return <EarningScreenMainLoading />;

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
          {mockReferralEarnings.slice(0, 3).map((item, index) => (
            <ReferralStack
              key={index}
              date={item.date}
              earning={item.totalEarningsSum}
              totalReferrals={item.totalReferrals}
              _id={item._id}
              referralsArray={item.referralsArray}
              setModalVisible={setReferralModalVisible}
            />
          ))}
          
          {/* Referral Rewards Component */}
          <ReferralRewards />
          
          <ReferralModal
            totalEarnings={referralModalVisible.totalEarningsSum}
            totalReferrals={referralModalVisible.totalReferrals}
            modalVisible={referralModalVisible}
            setModalVisible={setReferralModalVisible}
          />
        </ScrollView>
      )}
    </View>
  );
}
