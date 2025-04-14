import { useApptheme } from "@/lib/context/global/theme.context";
import { SafeAreaView } from "react-native-safe-area-context";
import LanguageMain from "../../screen-components/home/language/view/main";

const index = () => {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <SafeAreaView
      style={{ backgroundColor: appTheme.screenBackground, height: "100%" }}
    >
      <LanguageMain />
    </SafeAreaView>
  );
};

export default index;
