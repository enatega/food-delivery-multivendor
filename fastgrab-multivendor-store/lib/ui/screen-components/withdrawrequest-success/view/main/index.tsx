// Components
import { useApptheme } from "@/lib/context/theme.context";
import SuccessModal from "../success-modal";

// Core
import { View } from "react-native";

export default function WithdrawRquestSuccessMain() {
  // Hooks
  const { appTheme } = useApptheme();

  return (
    <View
      className="items-center justify-center h-full"
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <SuccessModal message="Your request for withdrawal has been submitted" />
    </View>
  );
}
