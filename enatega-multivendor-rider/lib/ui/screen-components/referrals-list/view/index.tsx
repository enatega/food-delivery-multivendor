// Contexts
import { useApptheme } from "@/lib/context/global/theme.context";

// Core
import { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

// Components
import LevelTabs from "../../referrals-detail/level-tabs";
import ReferralItem from "../../referrals-detail/referral-item";

// Interfaces
import { IReferral } from "@/lib/utils/interfaces/referral.interface";

// React Native Gesture
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface IReferralsListMainProps {
  referralsData: IReferral[];
  totalEarnings: number;
  totalReferrals: number;
}

export default function ReferralsListMain({
  referralsData,
  totalEarnings,
  totalReferrals,
}: IReferralsListMainProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  // States - default to Level 1
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(1);

  // Filter referrals by level
  const filteredReferrals = useMemo(() => {
    return referralsData.filter((ref) => ref.level === activeLevel);
  }, [activeLevel, referralsData]);

  return (
    <GestureHandlerRootView
      style={{ backgroundColor: appTheme.screenBackground, height: "100%" }}
    >
      {/* Level Tabs */}
      <LevelTabs activeLevel={activeLevel} onLevelChange={setActiveLevel} />

      {/* Referrals List */}
      <FlatList
        data={filteredReferrals}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text
              className="text-base font-semibold"
              style={{ color: appTheme.fontSecondColor }}
            >
              {t("No referrals found")}
            </Text>
          </View>
        }
        renderItem={({ item }) => <ReferralItem referral={item} />}
      />
    </GestureHandlerRootView>
  );
}
