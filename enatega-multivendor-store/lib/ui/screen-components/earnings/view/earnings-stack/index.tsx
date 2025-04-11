// Interfaces
import { IEarningStackProps } from "@/lib/utils/interfaces/earning.interface";
// SVG
import { RightArrowIcon } from "@/lib/ui/useable-components/svg";

import { useTranslation } from "react-i18next";

// Core
import { useApptheme } from "@/lib/context/theme.context";
import { Text, TouchableOpacity, View } from "react-native";

export default function EarningStack({
  date,
  earning,
  setModalVisible,
  _id,
  earningsArray,
  totalDeliveries,
  totalOrderAmount,
  isLast,
}: IEarningStackProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

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
    <View
      className="flex flex-row justify-between items-center p-4 w-[95%] mx-auto my-3  border-b-2"
      style={{
        borderBottomColor: appTheme.borderLineColor,
        backgroundColor: appTheme.themeBackground,
        marginBottom: isLast ? 300 : 0,
      }}
    >
      <View className="flex flex-row gap-2 items-center flex-2">
        <Text style={{ color: appTheme.fontMainColor }}>{date}</Text>
        <Text className="font-bold" style={{ color: appTheme.fontMainColor }}>
          {t("Total Earnings")}
        </Text>
      </View>
      <TouchableOpacity
        className="flex flex-row gap-2 items-center flex-2"
        onPress={handleForwardPress}
      >
        <Text className="font-bold " style={{ color: appTheme.linkColor }}>
          ${Number(earning)}
        </Text>
        <RightArrowIcon color={appTheme.linkColor} />
      </TouchableOpacity>
    </View>
  );
}
