// Core
import { SafeAreaView } from "react-native";

// Componnets
import { useApptheme } from "@/lib/context/theme.context";
import LanguageMain from "../../screen-components/home/language/view/main";

const index = () => {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <SafeAreaView
      style={{ backgroundColor: appTheme.themeBackground }}
      className="h-full w-full"
    >
      <LanguageMain />
    </SafeAreaView>
  );
};

export default index;
