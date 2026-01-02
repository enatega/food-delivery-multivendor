import { useApptheme } from "@/lib/context/theme.context";
import { SafeAreaView, Text } from "react-native";
import PrintOrderMain from "../../screen-components/print-order/view/main";

const index = () => {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <SafeAreaView
      style={{ backgroundColor: appTheme.themeBackground }}
      className="h-full w-full"
    >
      
      <PrintOrderMain/>
    </SafeAreaView>
  );
};

export default index;
