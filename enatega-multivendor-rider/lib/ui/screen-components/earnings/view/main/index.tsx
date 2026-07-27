// Core
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useCallback, useMemo } from "react";

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

// Helpers
import formatNumber from "@/lib/utils/methods/num-formatter";

export default function EarningsMain() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

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

  const barData: barDataItem[] = useMemo(
    () =>
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
        })) ?? ([] as barDataItem[]),
    [riderEarningsData, appTheme.fontMainColor],
  );

  const renderEarning = useCallback(
    ({ item }: { item: IRiderEarnings }) => (
      <EarningStack
        date={item?.date}
        earning={item?.totalEarningsSum}
        totalDeliveries={item?.earningsArray.length}
        _id={item?._id}
        tip={item?.totalTipsSum}
        earningsArray={item?.earningsArray}
        setModalVisible={setModalVisible}
      />
    ),
    [setModalVisible],
  );

  // If loading
  if (isRiderEarningsLoading) return <EarningScreenMainLoading />;

  return (
    <View style={{ backgroundColor: appTheme.screenBackground }}>
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
          keyExtractor={(item: IRiderEarnings, index) =>
            item?._id ?? String(item?.date ?? index)
          }
          style={{ height: "55%" }}
          ListEmptyComponent={
            <Text
              className="block mx-auto font-bold text-center w-full my-12 "
              style={{ color: appTheme.fontSecondColor }}
            >
              {t("No record found")}
            </Text>
          }
          renderItem={renderEarning}
        />
      </View>
    </View>
  );
}
