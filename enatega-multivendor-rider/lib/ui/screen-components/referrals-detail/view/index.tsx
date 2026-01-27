// Contexts
import { useApptheme } from "@/lib/context/global/theme.context";

// Core
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

// Components
import ReferralStack from "../../earnings/view/referrals-stack";
import ReferralsDateFilter from "../date-filter";
import ReferralModal from "../../earnings/view/referrals-modal";

// Mock Data
import { mockReferralEarnings } from "@/lib/utils/dummy/referrals";
import { IReferralEarnings } from "@/lib/utils/interfaces/referral.interface";

// React Native Gesture
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface IDateFilter {
  startDate: string;
  endDate: string;
}

interface IReferralsDetailMainProps {
  dateFilter: IDateFilter;
  setDateFilter: Dispatch<SetStateAction<IDateFilter>>;
  setReferralModalVisible: Dispatch<
    SetStateAction<IReferralEarnings & { bool: boolean }>
  >;
}

export default function ReferralsDetailMain({
  dateFilter,
  setDateFilter,
  setReferralModalVisible,
}: IReferralsDetailMainProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  // States
  const [isDateFilterVisible, setIsDateFilterVisible] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Calculate totals
  const totals = useMemo(() => {
    const totalReferrals = mockReferralEarnings.reduce(
      (sum, item) => sum + item.totalReferrals,
      0
    );
    const totalEarnings = mockReferralEarnings.reduce(
      (sum, item) => sum + item.totalEarningsSum,
      0
    );
    return { totalReferrals, totalEarnings };
  }, []);

  // Handlers
  async function handleDateFilterSubmit() {
    try {
      setIsFiltering(true);
      // TODO: Add actual filtering logic when API is ready
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsDateFilterVisible(false);
    } catch (error) {
      console.log("Error filtering referrals:", error);
    } finally {
      setIsFiltering(false);
    }
  }

  async function refetchDefault() {
    try {
      setIsFiltering(true);
      // TODO: Add actual refetch logic when API is ready
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.log("Error refetching referrals:", error);
    } finally {
      setIsFiltering(false);
    }
  }

  return (
    <GestureHandlerRootView
      style={{ backgroundColor: appTheme.screenBackground, height: "100%" }}
    >
      <ReferralsDateFilter
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        handleFilterSubmit={handleDateFilterSubmit}
        isFiltering={isFiltering}
        isDateFilterVisible={isDateFilterVisible}
        setIsDateFilterVisible={setIsDateFilterVisible}
        refetchDefault={refetchDefault}
      />

      {/* Summary Section */}
      <View
        className="py-3 border-b-2"
        style={{
          borderColor: appTheme.borderLineColor,
          backgroundColor: appTheme.themeBackground,
        }}
      >
        <Text
          className="px-5 text-lg font-semibold mb-3"
          style={{ color: appTheme.fontMainColor }}
        >
          {t("Summary")}
        </Text>
        <View className="flex flex-row justify-between items-center px-5">
          <View className="flex gap-2">
            <Text className="text-base" style={{ color: appTheme.fontMainColor }}>
              {t("Referrals")}
            </Text>
            <Text
              className="font-semibold text-lg"
              style={{ color: appTheme.mainTextColor }}
            >
              {totals.totalReferrals}
            </Text>
          </View>
          <View
            className="flex gap-2 items-end border-l-2 pl-8"
            style={{ borderLeftColor: appTheme.borderLineColor }}
          >
            <Text className="text-base" style={{ color: appTheme.fontMainColor }}>
              {t("Total Earnings")}
            </Text>
            <Text
              className="font-semibold text-lg"
              style={{ color: appTheme.mainTextColor }}
            >
              ${totals.totalEarnings.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Referral Activity List */}
      <FlatList
        data={mockReferralEarnings}
        keyExtractor={(item) => item._id}
        contentContainerClassName="scroll-smooth pb-12"
        style={{ height: "55%" }}
        ListEmptyComponent={
          <Text
            className="block mx-auto font-bold text-center w-full my-12"
            style={{ color: appTheme.fontSecondColor }}
          >
            {t("No record found")}
          </Text>
        }
        renderItem={(info) => {
          return (
            <ReferralStack
              date={info?.item?.date}
              earning={info?.item?.totalEarningsSum}
              totalReferrals={info?.item?.totalReferrals}
              _id={info?.item?._id}
              referralsArray={info?.item?.referralsArray}
              key={info.index}
              setModalVisible={setReferralModalVisible}
            />
          );
        }}
      />
    </GestureHandlerRootView>
  );
}
