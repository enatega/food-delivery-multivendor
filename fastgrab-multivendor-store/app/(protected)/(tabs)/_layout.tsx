import { useApptheme } from "@/lib/context/theme.context";
import { HapticTab } from "@/lib/ui/useable-components/HapticTab";
import {
  CurrencyIcon,
  HomeIcon,
  PersonIcon,
  WalletIcon,
} from "@/lib/ui/useable-components/svg";
import { Tabs, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

const RootLayout = () => {
  const [tabKey, setTabKey] = useState(0);
  const pathName = usePathname();
  const { t } = useTranslation();
  const { appTheme } = useApptheme();

  useEffect(() => {
    setTabKey((prev) => prev + 1);
  }, [pathName]);

  return (
    <Tabs
      key={tabKey}
      screenOptions={{
        tabBarActiveTintColor: appTheme.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: appTheme.tabNaviatorBackground,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 0.5,
            shadowColor: appTheme.black,
            shadowOffset: { width: 0, height: -5 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            zIndex: 0,
          },
          android: {
            position: "absolute",
            backgroundColor: appTheme.tabNaviatorBackground,
            display: pathName.startsWith("/wallet/success") ? "none" : "flex",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 0.5,
            elevation: 5,
            shadowOffset: { width: 0, height: -5 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          href: "/(protected)/(tabs)/home/orders",
          title: t("Home"),
          tabBarIcon: ({ color }) => (
            <HomeIcon
              color={color}
              width={25}
              height={25}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: t("Wallet"),
          tabBarIcon: ({ color }) => (
            <WalletIcon
              color={color}
              width={25}
              height={25}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: t("Earnings"),
          tabBarIcon: ({ color }) => (
            <CurrencyIcon
              color={color}
              width={25}
              height={25}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: true,
          headerTitle: t("Profile"),
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: appTheme.themeBackground },
          headerTitleStyle: { color: appTheme.fontMainColor },
          title: t("Profile"),
          tabBarIcon: ({ color }) => (
            <PersonIcon
              color={color}
              width={25}
              height={25}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default RootLayout;
