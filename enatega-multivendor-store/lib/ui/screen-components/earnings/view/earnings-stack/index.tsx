// Interfaces
import { IEarningStackProps } from "@/lib/utils/interfaces/earning.interface";
// SVG
import { RightArrowIcon } from "@/lib/ui/useable-components/svg";

import { useTranslation } from "react-i18next";

// Core
import { useApptheme } from "@/lib/context/theme.context";
import { ConfigurationContext } from "@/lib/context/global/configuration.context";
import { formatAmount } from "@/lib/utils/methods";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const formatEarningDate = (value: string) => {
  const [day, month, year] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return Number.isFinite(date.getTime())
    ? date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : value;
};

export default function EarningStack({
  date,
  earning,
  setModalVisible,
  _id,
  earningsArray,
  totalDeliveries,
  totalOrderAmount,
}: IEarningStackProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const configuration = useContext(ConfigurationContext);

  // Handlers
  function handleForwardPress() {
    setModalVisible({
      bool: true,
      _id: _id,
      date: date,
      earningsArray: earningsArray,
      totalEarningsSum: earning,
      totalDeliveries: totalDeliveries,
      totalOrderAmount: totalOrderAmount,
    });
  }

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      className="flex-row justify-between items-center p-4 mb-3"
      onPress={handleForwardPress}
      style={{
        backgroundColor: appTheme.cartContainer,
        borderColor: appTheme.borderLineColor,
        borderRadius: 12,
        borderWidth: 1,
      }}
    >
      <View className="flex-row items-center flex-1">
        <View
          style={{
            alignItems: "center",
            backgroundColor: appTheme.lowOpacityPrimaryColor,
            borderRadius: 8,
            height: 38,
            justifyContent: "center",
            marginRight: 10,
            width: 38,
          }}
        >
          <Ionicons
            name="calendar-outline"
            color={appTheme.primary}
            size={21}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            {formatEarningDate(date)}
          </Text>
          <Text
            style={{
              color: appTheme.fontSecondColor,
              fontSize: 12,
              marginTop: 2,
            }}
          >
            {t("Total Earnings")}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <Text
          style={{
            color: appTheme.fontMainColor,
            fontSize: 14,
            fontWeight: "700",
          }}
        >
          {configuration?.currencySymbol || "$"}
          {formatAmount(earning)}
        </Text>
        <RightArrowIcon color={appTheme.fontSecondColor} />
      </View>
    </TouchableOpacity>
  );
}
