// GraphQL
import { RIDER_EARNINGS_GRAPH } from "@/lib/apollo/queries/earnings.query";

// Hooks
import { useUserContext } from "@/lib/context/global/user.context";
import { QueryResult, useQuery } from "@apollo/client";

// Components
import SpinnerComponent from "@/lib/ui/useable-components/spinner";

// Interfacs
import { IRiderEarningsResponse } from "@/lib/utils/interfaces/rider-earnings.interface";

// Core
import { useApptheme } from "@/lib/context/global/theme.context";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export default function EarningDetailsHeader() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  // States
  const [riderEarningsGrandTotal, setRiderEarningsGrandTotal] = useState({
    earnings: 0,
    tips: 0,
    totalDeliveries: 0,
  });

  // Contexts
  const { userId } = useUserContext();

  // Queries
  const { loading: isRiderEarningsLoading, data: riderEarningsData } = useQuery(
    RIDER_EARNINGS_GRAPH,
    {
      variables: {
        riderId: userId ?? "",
      },
    },
  ) as QueryResult<IRiderEarningsResponse | undefined, { riderId: string }>;

  useEffect(() => {
    if (riderEarningsData?.riderEarningsGraph?.earnings?.length) {
      const totalEarnings =
        riderEarningsData?.riderEarningsGraph?.earnings?.reduce(
          (acc, curr) => acc + curr.totalEarningsSum,
          0,
        );
      const totalTips = riderEarningsData?.riderEarningsGraph?.earnings?.reduce(
        (acc, curr) => acc + curr.totalTipsSum,
        0,
      );
      const totalDeliveries =
        riderEarningsData?.riderEarningsGraph.earnings.reduce(
          (acc, curr) => acc + curr.totalDeliveries,
          0,
        );
      setRiderEarningsGrandTotal({
        earnings: totalEarnings,
        tips: totalTips,
        totalDeliveries: totalDeliveries,
      });
    }
  }, []);

  if (isRiderEarningsLoading) return <SpinnerComponent />;
  return (
    <View
      className=" py-3 border"
      style={{
        borderColor: appTheme.borderLineColor,
        backgroundColor: appTheme.themeBackground,
      }}
    >
      <Text
        className="left-5 text-xl font-semibold"
        style={{ color: appTheme.fontMainColor }}
      >
        {t("Summary")}
      </Text>
      <View className="flex flex-row justify-between items-center p-5">
        <View className="flex gap-2 items-center">
          <Text className="text-lg" style={{ color: appTheme.fontMainColor }}>
            {t("Total Earnings")}
          </Text>
          <Text
            className="font-semibold text-lg text-start self-start"
            style={{ color: appTheme.mainTextColor }}
          >
            ${Number(riderEarningsGrandTotal.earnings).toFixed(2)}
          </Text>
        </View>
        <View
          className="flex gap-2 items-center border-l-2 pl-3"
          style={{ borderLeftColor: appTheme.borderLineColor }}
        >
          <Text className="text-lg" style={{ color: appTheme.fontMainColor }}>
            {t("Total Tips")}
          </Text>
          <Text
            className="font-semibold text-lg text-start self-start"
            style={{ color: appTheme.mainTextColor }}
          >
            ${Number(riderEarningsGrandTotal.tips).toFixed(2)}
          </Text>
        </View>
        <View
          className="flex gap-2 items-center border-l-2 pl-3"
          style={{ borderLeftColor: appTheme.borderLineColor }}
        >
          <Text className="text-lg" style={{ color: appTheme.fontMainColor }}>
            {t("Total Deliveries")}
          </Text>
          <Text
            className="font-semibold text-lg text-start self-start"
            style={{ color: appTheme.mainTextColor }}
          >
            {riderEarningsGrandTotal.totalDeliveries}
          </Text>
        </View>
      </View>
    </View>
  );
}
