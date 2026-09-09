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
import { LinearGradient } from "expo-linear-gradient";
import { useEarningsTheme } from "../../theme";

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

const parseEarningDate = (value: string) => {
  const [day, month, year] = value.split("-").map(Number);
  return new Date(year, month - 1, day).getTime();
};

export default function EarningsMain() {
  // Hooks
  const { appTheme } = useApptheme();
  const earningsTheme = useEarningsTheme();
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
            numberOfLines={1}
            style={{
              color: earningsTheme.primaryText,
              fontSize: 10,
              fontWeight: "700",
              fontVariant: ["tabular-nums"],
              marginBottom: 4,
              textAlign: "center",
              width: 72,
            }}
          >
            {currencySymbol}
            {formatAmount(Math.abs(Number(earning.totalEarningsSum)))}
          </Text>
        ),
      })),
    [currencySymbol, earnings, earningsTheme.primaryText],
  );
  const recentTransaction = useMemo(
    () =>
      [...earnings]
        .sort((a, b) => parseEarningDate(b._id) - parseEarningDate(a._id))
        .slice(0, 4),
    [earnings],
  );

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
      isFirst={index === 0}
      isLast={index === recentTransaction.length - 1}
    />
  );

  // If loading
  if (isStoreEarningsLoading) return <EarningScreenMainLoading />;
  return (
    <GestureHandlerRootView
      style={{ backgroundColor: earningsTheme.canvas, flex: 1 }}
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
            <LinearGradient
              colors={[earningsTheme.surfaceRaised, earningsTheme.surfaceEnd]}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={{
                alignItems: "center",
                borderRadius: 14,
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 18,
                marginTop: 10,
                minHeight: 130,
                paddingHorizontal: 20,
                paddingVertical: 22,
              }}
            >
              <View style={{ flex: 1, paddingEnd: 16 }}>
                <Text style={{ color: earningsTheme.mutedText, fontSize: 15 }}>
                  {t("Total Earnings")}
                </Text>
                <Text
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  style={{
                    color: earningsTheme.primaryText,
                    fontSize: 32,
                    fontWeight: "800",
                    fontVariant: ["tabular-nums"],
                    marginTop: 8,
                  }}
                >
                  {currencySymbol}
                  {formatAmount(totalEarnings)}
                </Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: earningsTheme.accentSoft,
                  borderRadius: 12,
                  height: 54,
                  justifyContent: "center",
                  width: 54,
                }}
              >
                <Ionicons
                  name="wallet-outline"
                  color={appTheme.primary}
                  size={26}
                />
              </View>
            </LinearGradient>

            <LinearGradient
              colors={[earningsTheme.surface, earningsTheme.surfaceEnd]}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={{
                borderRadius: 14,
                marginBottom: 24,
                paddingBottom: 18,
                paddingHorizontal: 16,
                paddingTop: 16,
              }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <Text
                  numberOfLines={1}
                  style={{
                    color: earningsTheme.primaryText,
                    flex: 1,
                    fontSize: 18,
                    fontWeight: "700",
                    marginEnd: 12,
                  }}
                >
                  {t("Earnings Overview")}
                </Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => setIsRangeMenuVisible(true)}
                  style={{
                    alignItems: "center",
                    backgroundColor: earningsTheme.surfaceRaised,
                    borderRadius: 10,
                    flexDirection: "row",
                    paddingHorizontal: 11,
                    paddingVertical: 8,
                  }}
                >
                  <Text
                    style={{
                      color: earningsTheme.primaryText,
                      fontSize: 13,
                      fontWeight: "600",
                    }}
                  >
                    {t("Last {{count}} days", { count: rangeDays })}
                  </Text>
                  <Ionicons
                    color={earningsTheme.mutedText}
                    name="chevron-down"
                    size={15}
                    style={{ marginStart: 5 }}
                  />
                </TouchableOpacity>
              </View>
              <EarningsBarChart
                data={barData}
                width={Math.max(windowWidth - 104, 220)}
                height={180}
                frontColor={appTheme.primary}
                barStyle={{ marginTop: 15 }}
                rulesColor={earningsTheme.rule}
                disableScroll={barData.length <= 4}
                barWidth={barData.length > 4 ? 28 : 36}
                spacing={barData.length > 4 ? 20 : 24}
                xAxisLabelTextStyle={{
                  fontSize: 9,
                  color: earningsTheme.mutedText,
                }}
                yAxisTextStyle={{
                  fontSize: 9,
                  color: earningsTheme.mutedText,
                }}
              />
            </LinearGradient>

            <View className="flex-row justify-between items-center mb-3">
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: earningsTheme.primaryText,
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
            backgroundColor: earningsTheme.overlay,
            flex: 1,
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: earningsTheme.surfaceRaised,
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
                      ? earningsTheme.accentSoft
                      : "transparent",
                  borderRadius: 8,
                  paddingHorizontal: 14,
                  paddingVertical: 14,
                }}
              >
                <Text
                  style={{
                    color: earningsTheme.primaryText,
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
