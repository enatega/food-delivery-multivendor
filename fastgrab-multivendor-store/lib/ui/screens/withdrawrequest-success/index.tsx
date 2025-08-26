// Components
import { useApptheme } from "@/lib/context/theme.context";
import { SafeAreaView } from "react-native-safe-area-context";
import WithdrawRquestSuccessMain from "../../screen-components/withdrawrequest-success/view/main";

export default function WithDrawRequestSuccessScreen() {
  const { appTheme } = useApptheme();
  return (
    <SafeAreaView
      style={{ backgroundColor: appTheme.themeBackground }}
      className="h-full w-full"
    >
      <WithdrawRquestSuccessMain />
    </SafeAreaView>
  );
}
