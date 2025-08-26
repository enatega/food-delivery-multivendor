import { useApptheme } from "@/lib/context/theme.context";
import { SafeAreaView } from "react-native";
import BankManagementMain from "../../screen-components/home/bank-management/view/main";
const index = () => {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <SafeAreaView
      style={{ backgroundColor: appTheme.themeBackground }}
      className="h-full w-full"
    >
      <BankManagementMain />
    </SafeAreaView>
  );
};

export default index;
