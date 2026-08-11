// Components
import EarningsOrderDetailsMain from "@/lib/ui/screen-components/earning-order-details/view";

// Core
import { SafeAreaView } from "react-native";

// Hooks
import { useApptheme } from "@/lib/context/theme.context";

export default function EarningsOrderDetailsScreen() {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <SafeAreaView
      style={{ backgroundColor: appTheme.themeBackground }}
      className="h-full w-full"
    >
      <EarningsOrderDetailsMain />
    </SafeAreaView>
  );
}
