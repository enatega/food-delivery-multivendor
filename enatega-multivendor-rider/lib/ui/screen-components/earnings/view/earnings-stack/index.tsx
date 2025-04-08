// Interfaces
import { IEarningStackProps } from "@/lib/utils/interfaces/earning.interface";
// SVG
import { RightChevron } from "@/lib/ui/useable-components/svg";

import { useTranslation } from "react-i18next";

// Core
import { useApptheme } from "@/lib/context/global/theme.context";
import { Text, TouchableOpacity, View } from "react-native";

export default function EarningStack({
  date,
  earning,
  setModalVisible,
  _id,
  earningsArray,
  tip,
  totalDeliveries,
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
      totalTipsSum: tip,
      totalEarningsSum: earning,
      totalDeliveries: totalDeliveries,
    });
  }
  return (
    <View
      className="flex flex-row justify-between items-center p-4 w-[95%] mx-auto my-3  border-b-2"
      style={{
        borderBottomColor: appTheme.borderLineColor,
        backgroundColor: appTheme.themeBackground,
      }}
    >
      <View className="flex flex-row gap-2 items-center flex-2">
        <Text style={{ color: appTheme.fontSecondColor }}>{date}</Text>
        <Text className="font-bold" style={{ color: appTheme.fontMainColor }}>
          {t("Total Earnings")}
        </Text>
      </View>
      <TouchableOpacity
        className="flex flex-row gap-2 items-center flex-2"
        onPress={handleForwardPress}
      >
        <Text className="font-bold text-[#3B82F6]">${earning}</Text>
        <RightChevron color="#3B82F6" />
      </TouchableOpacity>
    </View>
  );
}
