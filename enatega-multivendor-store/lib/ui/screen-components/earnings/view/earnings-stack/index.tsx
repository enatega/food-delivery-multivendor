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
import { useEarningsTheme } from "../../theme";

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
  isFirst = false,
  isLast = false,
}: IEarningStackProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const configuration = useContext(ConfigurationContext);
  const earningsTheme = useEarningsTheme();

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
      className="flex-row justify-between items-center"
      onPress={handleForwardPress}
      style={{
        backgroundColor: earningsTheme.surface,
        borderBottomColor: earningsTheme.divider,
        borderBottomWidth: isLast ? 0 : 1,
        borderTopLeftRadius: isFirst ? 14 : 0,
        borderTopRightRadius: isFirst ? 14 : 0,
        borderBottomLeftRadius: isLast ? 14 : 0,
        borderBottomRightRadius: isLast ? 14 : 0,
        minHeight: 76,
        paddingHorizontal: 16,
        paddingVertical: 13,
      }}
    >
      <View className="flex-row items-center flex-1">
        <View
          style={{
            alignItems: "center",
            backgroundColor: earningsTheme.accentSoft,
            borderRadius: 10,
            height: 42,
            justifyContent: "center",
            marginEnd: 10,
            width: 42,
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
              fontSize: 15,
              fontWeight: "700",
            }}
          >
            {formatEarningDate(date)}
          </Text>
          <Text
            style={{
              color: appTheme.fontSecondColor,
              fontSize: 13,
              marginTop: 2,
            }}
          >
            {t("Total Earnings")}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-3">
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={{
            color: appTheme.fontMainColor,
            fontSize: 15,
            fontWeight: "700",
            fontVariant: ["tabular-nums"],
            maxWidth: 120,
          }}
        >
          {configuration?.currencySymbol || "$"}
          {formatAmount(earning)}
        </Text>
        <RightArrowIcon color={earningsTheme.mutedText} />
      </View>
    </TouchableOpacity>
  );
}
