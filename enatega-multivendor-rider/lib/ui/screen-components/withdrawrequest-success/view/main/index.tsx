// Components
import SuccessModal from "../success-modal";

// Core
import { View } from "react-native";

// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";
import { useTranslation } from "react-i18next";

export default function WithdrawRquestSuccessMain() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  return (
    <View
      className="items-center justify-center h-full"
      style={{ backgroundColor: appTheme.screenBackground }}
    >
      <SuccessModal
        message={t("Your request for withdrawal has been submitted")}
      />
    </View>
  );
}
