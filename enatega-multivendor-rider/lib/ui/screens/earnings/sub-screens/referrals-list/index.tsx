import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";
import ReferralsListMain from "@/lib/ui/screen-components/referrals-list/view";
import { IReferral } from "@/lib/utils/interfaces/referral.interface";

export default function ReferralsListScreen() {
  const params = useLocalSearchParams();
  
  const referralsData: IReferral[] = params.referralsData 
    ? JSON.parse(params.referralsData as string)
    : [];
  
  const totalEarnings = params.totalEarnings 
    ? parseFloat(params.totalEarnings as string)
    : 0;
  
  const totalReferrals = params.totalReferrals 
    ? parseInt(params.totalReferrals as string)
    : 0;

  return (
    <SafeAreaView className="bg-white flex-1">
      <ReferralsListMain
        referralsData={referralsData}
        totalEarnings={totalEarnings}
        totalReferrals={totalReferrals}
      />
    </SafeAreaView>
  );
}
