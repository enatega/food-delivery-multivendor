import { useUserContext } from "@/lib/context/global/user.context";
import { useApptheme } from "@/lib/context/theme.context";
import EarningBottomBar from "@/lib/ui/screen-components/earnings/view/bottom-bar";
import { Stack, usePathname } from "expo-router";
import { useTranslation } from "react-i18next";
import { useEarningsTheme } from "@/lib/ui/screen-components/earnings/theme";

export default function StackLayout() {
  // Hooks
  const { t } = useTranslation();
  const { appTheme } = useApptheme();
  const earningsTheme = useEarningsTheme();
  const { modalVisible, setModalVisible } = useUserContext();
  const pathname = usePathname();
  return (
    <>
      <Stack
        screenOptions={{
          headerTitle: pathname.startsWith("/earnings/earnings-detail")
            ? t("Earnings Summary")
            : pathname.startsWith("/earnings/earnings-order-details")
              ? t("Deliveries")
              : t("Earnings"),
          headerBackTitle: t("Earnings"),
          headerTitleAlign: "center",
          headerTintColor: appTheme.fontMainColor,
          headerTitleStyle: {
            color: earningsTheme.primaryText,
            fontSize: 20,
            fontWeight: "700",
          },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: earningsTheme.canvas },
          contentStyle: { backgroundColor: earningsTheme.canvas },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            headerTitle: t("Earnings"),
          }}
        />
        <Stack.Screen
          name="(routes)"
          options={{
            headerShown: true,
            headerTitle: t("Earnings Summary"),
            headerBackTitle: t("Earnings"),
          }}
        />
      </Stack>
      <EarningBottomBar
        totalDeliveries={modalVisible.totalDeliveries}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        totalEarnings={modalVisible?.totalEarningsSum ?? 0}
      />
    </>
  );
}
