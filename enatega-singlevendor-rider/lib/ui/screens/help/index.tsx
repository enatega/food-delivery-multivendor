// Core
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import { useApptheme } from "@/lib/context/global/theme.context";
import HelpMain from "../../screen-components/home/help/view/main";

const HelpScreen = () => {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <SafeAreaView
      edges={["bottom", "right", "left"]}
      className="w-full h-full"
      style={{ backgroundColor: appTheme.screenBackground }}
    >
      <HelpMain />
    </SafeAreaView>
  );
};

export default HelpScreen;
