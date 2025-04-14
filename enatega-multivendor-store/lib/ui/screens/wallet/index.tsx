// Core
import { SafeAreaView } from "react-native";

// Components
import { useApptheme } from "@/lib/context/theme.context";
import WalletMain from "../../screen-components/wallet/view/main";

export default function WalletScreen() {
  // Hooks
  const { appTheme } = useApptheme();

  return (
    <SafeAreaView
      className="w-full h-full"
      style={{
        backgroundColor: appTheme.themeBackground,
      }}
    >
      <WalletMain />
    </SafeAreaView>
  );
}
