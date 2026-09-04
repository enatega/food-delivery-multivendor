import { STORE_EARNINGS_GRAPH } from "@/lib/apollo/queries/earnings.query";
import { ConfigurationContext } from "@/lib/context/global/configuration.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { useApptheme } from "@/lib/context/theme.context";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";
import { IStoreEarningsResponse } from "@/lib/utils/interfaces/rider-earnings.interface";
import { formatAmount } from "@/lib/utils/methods";
import { QueryResult, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export default function EarningDetailsHeader() {
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { userId } = useUserContext();
  const configuration = useContext(ConfigurationContext);

  const { loading: isStoreEarningsLoading, data: storeEarningsData } = useQuery(
    STORE_EARNINGS_GRAPH,
    {
      variables: { storeId: userId ?? "" },
    },
  ) as QueryResult<IStoreEarningsResponse | undefined, { storeId: string }>;

  const totals = useMemo(
    () =>
      (storeEarningsData?.storeEarningsGraph?.earnings ?? []).reduce(
        (summary, earning) => ({
          earnings: summary.earnings + earning.totalEarningsSum,
          totalDeliveries:
            summary.totalDeliveries + earning.earningsArray.length,
        }),
        { earnings: 0, totalDeliveries: 0 },
      ),
    [storeEarningsData?.storeEarningsGraph?.earnings],
  );

  if (isStoreEarningsLoading) return <SpinnerComponent />;

  const summaryItems = [
    {
      icon: "wallet-outline" as const,
      label: t("Total Earnings"),
      value: `${configuration?.currencySymbol || "$"}${formatAmount(
        totals.earnings,
      )}`,
    },
    {
      icon: "bag-check-outline" as const,
      label: t("Total Deliveries"),
      value: String(totals.totalDeliveries),
    },
  ];

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
      <Text
        style={{
          color: appTheme.fontMainColor,
          fontSize: 18,
          fontWeight: "700",
          marginBottom: 10,
        }}
      >
        {t("Summary")}
      </Text>
      <View
        style={{
          backgroundColor: appTheme.cartContainer,
          borderColor: appTheme.borderLineColor,
          borderRadius: 12,
          borderWidth: 1,
          flexDirection: "row",
          padding: 16,
        }}
      >
        {summaryItems.map((item, index) => (
          <View
            key={item.label}
            style={{
              borderStartColor: appTheme.borderLineColor,
              borderStartWidth: index === 0 ? 0 : 1,
              flex: 1,
              paddingStart: index === 0 ? 0 : 16,
            }}
          >
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <Ionicons color={appTheme.primary} name={item.icon} size={18} />
              <Text
                numberOfLines={1}
                style={{
                  color: appTheme.fontSecondColor,
                  flex: 1,
                  fontSize: 12,
                  marginStart: 6,
                }}
              >
                {item.label}
              </Text>
            </View>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={{
                color: appTheme.fontMainColor,
                fontSize: 20,
                fontWeight: "700",
                marginTop: 8,
              }}
            >
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
