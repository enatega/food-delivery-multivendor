import { useApptheme } from "@/lib/context/global/theme.context";
import { View } from "react-native";
import WalletMain from "../../screen-components/wallet/view/main";

export default function WalletScreen() {
  // Hooks
  const { appTheme } = useApptheme();

  return (
    <View
      className="w-full items-center"
      style={{ backgroundColor: appTheme.screenBackground }}
    >
      <WalletMain />
    </View>
  );
}
