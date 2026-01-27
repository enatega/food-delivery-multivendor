// Interfaces
import { IReferralEarnings, IRecentActivityItem } from "@/lib/utils/interfaces/referral.interface";

// SVG
import { RightChevron } from "@/lib/ui/useable-components/svg";

import { useTranslation } from "react-i18next";

// Core
import { useApptheme } from "@/lib/context/global/theme.context";
import { Dispatch, SetStateAction } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface IReferralStackProps {
  date: string;
  earning: number;
  totalReferrals: number;
  setModalVisible: Dispatch<
    SetStateAction<IReferralEarnings & { bool: boolean }>
  >;
  _id: string;
  referralsArray: any[]; // Can be IReferral[] or IRecentActivityItem[]
  activityId?: string;
  dateKey?: string; // YYYY-MM-DD format for filtering
}

export default function ReferralStack({
  date,
  earning,
  setModalVisible,
  _id,
  referralsArray,
  totalReferrals,
  activityId,
  dateKey,
}: IReferralStackProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  // Handlers
  function handleForwardPress() {
    setModalVisible({
      bool: true,
      _id: dateKey || activityId || _id,
      date: date,
      referralsArray: referralsArray,
      totalEarningsSum: earning,
      totalReferrals: totalReferrals,
    });
  }

  return (
    <View
      className="flex flex-row justify-between items-center p-4 w-[95%] mx-auto my-3 border-b-2"
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
