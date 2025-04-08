// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";

// Core
import { SafeAreaView } from "react-native";

// Components
import EarningsMain from "../../screen-components/earnings/view/main";

export default function EarningsScreen() {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <SafeAreaView style={{ backgroundColor: appTheme.screenBackground }}>
      <EarningsMain />
    </SafeAreaView>
  );
}
