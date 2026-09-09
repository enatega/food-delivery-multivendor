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
import { LinearGradient } from "expo-linear-gradient";
import { useEarningsTheme } from "../../earnings/theme";

export default function EarningDetailsHeader() {
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { userId } = useUserContext();
  const configuration = useContext(ConfigurationContext);
  const earningsTheme = useEarningsTheme();

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
    <View style={{ paddingHorizontal: 16, paddingBottom: 22 }}>
      <Text
        style={{
          color: earningsTheme.primaryText,
          fontSize: 20,
          fontWeight: "800",
          marginBottom: 12,
        }}
      >
        {t("Summary")}
      </Text>
      <LinearGradient
        colors={[earningsTheme.surfaceRaised, earningsTheme.surfaceEnd]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={{
          borderRadius: 12,
          flexDirection: "row",
          padding: 18,
        }}
      >
        {summaryItems.map((item, index) => (
          <View
            key={item.label}
            style={{
              flex: 1,
              paddingEnd: index === 0 ? 10 : 0,
              paddingStart: index === 0 ? 0 : 10,
            }}
          >
            <View
              style={{
                alignItems: "center",
                backgroundColor: earningsTheme.accentSoft,
                borderRadius: 9,
                height: 34,
                justifyContent: "center",
                marginBottom: 12,
                width: 34,
              }}
            >
              <Ionicons color={appTheme.primary} name={item.icon} size={18} />
            </View>
            <Text
              numberOfLines={1}
              style={{
                color: earningsTheme.mutedText,
                fontSize: 13,
              }}
            >
              {item.label}
            </Text>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={{
                color: earningsTheme.primaryText,
                fontSize: 22,
                fontWeight: "800",
                fontVariant: ["tabular-nums"],
                marginTop: 6,
              }}
            >
              {item.value}
            </Text>
          </View>
        ))}
      </LinearGradient>
    </View>
  );
}
