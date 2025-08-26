// Core
import { Text, TouchableOpacity, View } from "react-native";

// Contexts
import { useUserContext } from "@/lib/context/global/user.context";

// Interfaces
import {
  IStoreEarnings,
  IStoreEarningsResponse,
} from "@/lib/utils/interfaces/rider-earnings.interface";

// Charts
import { barDataItem } from "react-native-gifted-charts";

// GraphQL
import { STORE_EARNINGS_GRAPH } from "@/lib/apollo/queries/earnings.query";

// Hooks
import { useLazyQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

// Expo
import { router } from "expo-router";

// Skeletons
import { EarningScreenMainLoading } from "@/lib/ui/skeletons";

// Components
import { useApptheme } from "@/lib/context/theme.context";
import formatNumber from "@/lib/utils/methods/num-formatter";
import { useEffect, useState } from "react";
import { showMessage } from "react-native-flash-message";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import EarningsBarChart from "../../bar-chart";
import EarningStack from "../earnings-stack";

export default function EarningsMain() {
  // Set dates for the query
  const getQueryDates = () => {
    const endDate = new Date(); // Today
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);

    // Set start date to beginning of day
    startDate.setHours(0, 0, 0, 0);

    // Set end date to end of day
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  };

  // Constants
  const queryPayload = {
    page: 1,
    limit: 5,
    ...getQueryDates(),
  };

  // States
  const [recentTransaction, setRecentTransaction] =
    useState<IStoreEarnings[]>();

  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { userId, setModalVisible } = useUserContext();

  // Queries
  const [
    fetchEarningsGraph,
    { loading: isStoreEarningsLoading, data: storeEarningsData },
  ] = useLazyQuery<
    IStoreEarningsResponse,
    {
      storeId: string;
      startDate: string;
      endDate: string;
      page: number;
      limit: number;
    }
  >(STORE_EARNINGS_GRAPH, {
    onError: (err) => {
      console.log(err);
      showMessage({
        message:
          err.graphQLErrors[0]?.message ||
          err.networkError?.message ||
          "Failed to fetch earnings",
        type: "danger",
        duration: 1000,
      });
    },
    fetchPolicy: "cache-and-network",
  });

  // Fetch data on component mount
  useEffect(() => {
    if (userId) {
      const { startDate, endDate } = getQueryDates();

      fetchEarningsGraph({
        variables: {
          storeId: userId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(), // End of today
          page: queryPayload.page,
          limit: queryPayload.limit,
        },
      });
    }
  }, [userId]);

  const barData: barDataItem[] =
    storeEarningsData?.storeEarningsGraph.earnings
      .slice(0, 7)
      .map((earning: IStoreEarnings) => ({
        value: earning.totalEarningsSum.toString().startsWith("-")
          ? Number(-earning.totalEarningsSum)
          : earning.totalEarningsSum,
        label: earning._id,
        topLabelComponent: () => {
          return (
            <Text
              style={{
                color: appTheme.fontMainColor,
                fontSize: 8,
                fontWeight: "600",
                marginBottom: 1,
                wordWrap: "wrap",
              }}
            >
              ${formatNumber(Number(earning.totalEarningsSum))}
            </Text>
          );
        },
      })) ?? ([] as barDataItem[]);

  // UseEffects
  useEffect(() => {
    if (storeEarningsData?.storeEarningsGraph?.earnings?.length) {
      const sortedTransactions = [
        ...storeEarningsData.storeEarningsGraph.earnings,
      ];
      setRecentTransaction(sortedTransactions);
    }
  }, [storeEarningsData?.storeEarningsGraph?.earnings?.length]);

  // If loading
  if (isStoreEarningsLoading) return <EarningScreenMainLoading />;
  return (
    <GestureHandlerRootView
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <EarningsBarChart
        data={barData}
        width={700}
        height={200}
        frontColor={appTheme.primary}
        barStyle={{ marginTop: 15 }}
        rulesColor={appTheme.fontSecondColor}
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
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: appTheme.fontMainColor,
          }}
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
              totalDeliveries: 0,
              totalOrderAmount: 0,
            });
            router.push(
              "/(protected)/(tabs)/earnings/(routes)/earnings-detail",
            );
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: appTheme.linkColor,
            }}
          >
            {t("See More")}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          data={recentTransaction}
          contentContainerStyle={{ paddingBottom: 30 }}
          contentContainerClassName="scroll-smooth"
          keyExtractor={(item) => item._id}
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
                date={info?.item?._id}
                earning={info?.item?.totalEarningsSum}
                totalDeliveries={info?.item?.earningsArray.length}
                _id={info?.item?._id}
                totalOrderAmount={info?.item?.totalOrderAmount}
                earningsArray={info?.item?.earningsArray}
                key={info.index}
                setModalVisible={setModalVisible}
              />
            );
          }}
        />
      </View>
    </GestureHandlerRootView>
  );
}
