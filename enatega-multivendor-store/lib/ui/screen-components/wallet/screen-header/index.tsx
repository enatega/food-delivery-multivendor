// Components
import CustomScreenHeader from "@/lib/ui/useable-components/custom-screen-header";

// Hooks
import { useTranslation } from "react-i18next";

export default function WalletScreenHeader() {
  // Hooks
  const { t } = useTranslation();
  return <CustomScreenHeader title={t("Earnings")} />;
}
