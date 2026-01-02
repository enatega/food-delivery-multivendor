import { useApptheme } from "@/lib/context/theme.context";
import { SafeAreaView, Text } from "react-native";
import ReceiptPreviewMain from "../../screen-components/receipt-preview/view/main";

const index = () => {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <SafeAreaView
      style={{ backgroundColor: appTheme.themeBackground }}
      className="h-full w-full"
    >
      
      <ReceiptPreviewMain/>
    </SafeAreaView>
  );
};

export default index;
