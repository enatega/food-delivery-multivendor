// Hooks
import { useUserContext } from "@/lib/context/global/user.context";
import { Stack, usePathname } from "expo-router";

// Components
import { useApptheme } from "@/lib/context/global/theme.context";
import EarningBottomBar from "@/lib/ui/screen-components/earnings/view/bottom-bar";
import { useTranslation } from "react-i18next";

export default function StackLayout() {
  // Hooks
  const { modalVisible, setModalVisible } = useUserContext();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { appTheme } = useApptheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerTitle:
            pathname.startsWith("/earnings/earnings-detail") ?
              t("Earnings Summary")
            : pathname.startsWith("/earnings/earnings-order-details") ?
              t("Deliveries")
            : t("Earnings"),

          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerTintColor: appTheme.fontMainColor,
          headerTitleStyle: { color: appTheme.fontMainColor },
          headerStyle: { backgroundColor: appTheme.themeBackground },
          contentStyle: {
            backgroundColor: appTheme.themeBackground,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: true, headerTitle: t("Earnings") }}
        />
        <Stack.Screen
          name="(routes)"
          options={{
            headerShown: true,
            headerTitle: t("Earnings Order Details"),
            headerBackTitle: t("Earnings"),
          }}
        />
      </Stack>
      <EarningBottomBar
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        totalDeliveries={modalVisible.earningsArray.length || 0}
        totalEarnings={modalVisible.totalEarningsSum}
        totalTips={modalVisible.totalTipsSum}
      />
    </>
  );
}
