import { useState } from "react";
import { SafeAreaView } from "react-native";
import ReferralsDetailMain from "@/lib/ui/screen-components/referrals-detail/view";
import ReferralModal from "@/lib/ui/screen-components/earnings/view/referrals-modal";
import { IReferralEarnings } from "@/lib/utils/interfaces/referral.interface";

export default function ReferralsDetailScreen() {
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  const [referralModalVisible, setReferralModalVisible] = useState<
    IReferralEarnings & { bool: boolean }
  >({
    bool: false,
    _id: "",
    date: "",
    referralsArray: [],
    totalEarningsSum: 0,
    totalReferrals: 0,
  });

  return (
    <SafeAreaView className="bg-white">
      <ReferralsDetailMain
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        setReferralModalVisible={setReferralModalVisible}
      />
      <ReferralModal
        totalEarnings={referralModalVisible.totalEarningsSum}
        totalReferrals={referralModalVisible.totalReferrals}
        modalVisible={referralModalVisible}
        setModalVisible={setReferralModalVisible}
      />
    </SafeAreaView>
  );
}
