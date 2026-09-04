// Core
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

// Contexts
import { useUserContext } from "@/lib/context/global/user.context";
import { ConfigurationContext } from "@/lib/context/global/configuration.context";

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
import { formatAmount } from "@/lib/utils/methods";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useMemo, useState } from "react";
import { showMessage } from "react-native-flash-message";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import EarningsBarChart from "../../bar-chart";
import EarningStack from "../earnings-stack";

const RANGE_OPTIONS = [7, 30, 90] as const;

const getQueryDates = (days: number) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
};

const formatChartDate = (value: string) => {
  const [day, month] = value.split("-");
  return day && month ? `${day}/${month}` : value;
};

export default function EarningsMain() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { userId, setModalVisible } = useUserContext();
  const configuration = useContext(ConfigurationContext);
  const tabBarHeight = useBottomTabBarHeight();
  const { width: windowWidth } = useWindowDimensions();
  const [rangeDays, setRangeDays] = useState<(typeof RANGE_OPTIONS)[number]>(7);
  const [isRangeMenuVisible, setIsRangeMenuVisible] = useState(false);
  const currencySymbol = configuration?.currencySymbol || "$";

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
      const { startDate, endDate } = getQueryDates(rangeDays);

      fetchEarningsGraph({
        variables: {
          storeId: userId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(), // End of today
          page: 1,
          limit: rangeDays,
        },
      });
    }
  }, [fetchEarningsGraph, rangeDays, userId]);

  const earnings = storeEarningsData?.storeEarningsGraph?.earnings ?? [];
  const totalEarnings = useMemo(
    () =>
      earnings.reduce(
        (total, earning) => total + Number(earning.totalEarningsSum || 0),
        0,
      ),
    [earnings],
  );
  const barData = useMemo<barDataItem[]>(
    () =>
      earnings.map((earning) => ({
        value: earning.totalEarningsSum.toString().startsWith("-")
          ? Number(-earning.totalEarningsSum)
          : earning.totalEarningsSum,
        label: formatChartDate(earning._id),
        topLabelComponent: () => (
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 10,
              fontWeight: "600",
              marginBottom: 4,
            }}
          >
            {currencySymbol}
            {formatAmount(Math.abs(Number(earning.totalEarningsSum)))}
          </Text>
        ),
      })),
    [appTheme.fontMainColor, currencySymbol, earnings],
  );
  const recentTransaction = earnings;

  const renderEmptyState = (
    <Text
      className="block mx-auto font-bold text-center w-full my-12 "
      style={{ color: appTheme.fontSecondColor }}
    >
      {t("No record found")}
    </Text>
  );

  const renderEarningItem = ({
    item,
    index,
  }: {
    item: IStoreEarnings;
    index: number;
  }) => (
    <EarningStack
      date={item._id}
      earning={item.totalEarningsSum}
      totalDeliveries={item.earningsArray.length}
      _id={item._id}
      totalOrderAmount={item.totalOrderAmount}
      earningsArray={item.earningsArray}
      key={index}
      setModalVisible={setModalVisible}
    />
  );

  // If loading
  if (isStoreEarningsLoading) return <EarningScreenMainLoading />;
  return (
    <GestureHandlerRootView
      style={{ backgroundColor: appTheme.themeBackground, flex: 1 }}
    >
      <FlatList
        data={recentTransaction}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + 24,
          paddingHorizontal: 16,
        }}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={
          <>
            <View
              style={{
                alignItems: "center",
                backgroundColor: appTheme.cartContainer,
                borderColor: appTheme.borderLineColor,
                borderRadius: 14,
                borderWidth: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 16,
                marginTop: 8,
                padding: 18,
              }}
            >
              <View>
                <Text style={{ color: appTheme.fontSecondColor, fontSize: 14 }}>
                  {t("Total Earnings")}
                </Text>
                <Text
                  style={{
                    color: appTheme.fontMainColor,
                    fontSize: 28,
                    fontWeight: "700",
                    marginTop: 4,
                  }}
                >
                  {currencySymbol}
                  {formatAmount(totalEarnings)}
                </Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: appTheme.lowOpacityPrimaryColor,
                  borderRadius: 12,
                  height: 48,
                  justifyContent: "center",
                  width: 48,
                }}
              >
                <Ionicons
                  name="wallet-outline"
                  color={appTheme.primary}
                  size={26}
                />
              </View>
            </View>

            <View
              style={{
                backgroundColor: appTheme.cartContainer,
                borderColor: appTheme.borderLineColor,
                borderRadius: 14,
                borderWidth: 1,
                marginBottom: 18,
                padding: 14,
              }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text
                  style={{
                    color: appTheme.fontMainColor,
                    fontSize: 18,
                    fontWeight: "700",
                  }}
                >
                  {t("Earnings Overview")}
                </Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => setIsRangeMenuVisible(true)}
                  style={{
                    borderColor: appTheme.borderLineColor,
                    borderRadius: 8,
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                  }}
                >
                  <Text style={{ color: appTheme.fontMainColor, fontSize: 13 }}>
                    {t("Last {{count}} days", { count: rangeDays })} ▾
                  </Text>
                </TouchableOpacity>
              </View>
              <EarningsBarChart
                data={barData}
                width={Math.max(windowWidth - 104, 220)}
                height={180}
                frontColor={appTheme.primary}
                barStyle={{ marginTop: 15 }}
                rulesColor={appTheme.borderLineColor}
                disableScroll={barData.length <= 7}
                barWidth={barData.length > 7 ? 24 : 36}
                spacing={barData.length > 7 ? 16 : 24}
                xAxisLabelTextStyle={{
                  fontSize: 9,
                  color: appTheme.fontSecondColor,
                }}
                yAxisTextStyle={{
                  fontSize: 9,
                  color: appTheme.fontSecondColor,
                }}
              />
            </View>

            <View className="flex-row justify-between items-center mb-3">
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
                    color: appTheme.primary,
                  }}
                >
                  {t("See More")}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={renderEarningItem}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="fade"
        transparent
        visible={isRangeMenuVisible}
        onRequestClose={() => setIsRangeMenuVisible(false)}
      >
        <Pressable
          onPress={() => setIsRangeMenuVisible(false)}
          style={{
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            flex: 1,
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: appTheme.cartContainer,
              borderRadius: 14,
              padding: 8,
              width: "100%",
            }}
          >
            {RANGE_OPTIONS.map((days) => (
              <TouchableOpacity
                key={days}
                onPress={() => {
                  setRangeDays(days);
                  setIsRangeMenuVisible(false);
                }}
                style={{
                  backgroundColor:
                    days === rangeDays
                      ? appTheme.lowOpacityPrimaryColor
                      : "transparent",
                  borderRadius: 8,
                  paddingHorizontal: 14,
                  paddingVertical: 14,
                }}
              >
                <Text
                  style={{
                    color: appTheme.fontMainColor,
                    fontSize: 16,
                    fontWeight: days === rangeDays ? "600" : "400",
                    textAlign: "center",
                  }}
                >
                  {t("Last {{count}} days", { count: days })}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </GestureHandlerRootView>
  );
}
