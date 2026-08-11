import HomeDeliveredOrdersMain from "@/lib/ui/screen-components/home/orders/main/delivered-orders";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
  // Hooks
  const { t } = useTranslation();
  return (
    <HomeDeliveredOrdersMain
      route={{ key: "delivered", title: t("Delivered Orders") }}
    />
  );
}
