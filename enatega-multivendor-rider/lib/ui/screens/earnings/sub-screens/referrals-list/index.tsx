import { SafeAreaView } from "react-native";
import ReferralsListMain from "@/lib/ui/screen-components/referrals-list/view";

export default function ReferralsListScreen() {
  return (
    <SafeAreaView className="bg-white flex-1">
      <ReferralsListMain />
    </SafeAreaView>
  );
}
