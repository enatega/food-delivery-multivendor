// Expo
import { Drawer } from "expo-router/drawer";

// Components
import CustomDrawerContent from "@/lib/ui/screen-components/home/drawer/drawer-content";

// Icons
import {
  BikeRidingIcon,
  CardIcon,
  ClockIcon,
  HelpIcon,
  // UserIcon,
  HomeIcon,
  LanguageIcon,
} from "@/lib/ui/useable-components/svg";
import { Ionicons } from "@expo/vector-icons";

// Core
import { ColorSchemeName, TouchableOpacity } from "react-native";

// React Navigation
import { DrawerActions } from "@react-navigation/native";
// Hooks

import { AppTheme } from "@/lib/utils/interfaces/app-theme";
import { memo } from "react";
import { useTranslation } from "react-i18next";


const DrawerMain = ({
  currentTheme,
  appTheme,
}: {
  currentTheme: ColorSchemeName;
  appTheme: AppTheme;
}) => {
  const { t } = useTranslation();

  return (
    <Drawer
      key={currentTheme}
      drawerContent={CustomDrawerContent}
      initialRouteName="orders"
      screenOptions={({ navigation }) => ({
        swipeEnabled: false,
        lazy: true,
        headerStyle: {
          backgroundColor: appTheme.themeBackground,
        },
        headerTitleStyle: { color: appTheme.mainTextColor },
        headerLeft: () => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(DrawerActions.toggleDrawer());
              }}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="menu" size={24} color={appTheme.primary} />
            </TouchableOpacity>
          );
        },
        drawerHideStatusBarOnOpen: true,
        drawerActiveBackgroundColor: appTheme?.lowOpacityPrimaryColor,
        drawerActiveTintColor: appTheme?.mainTextColor,
        headerShadowVisible: false,
        headerTitleAlign: "center",
        drawerStatusBarAnimation: "slide",
        drawerItemStyle: {
          borderRadius: 0,
          // marginTop: 4,
        },
        drawerStyle: {
          backgroundColor: appTheme?.themeBackground,
          marginBottom: 45,
        },
      })}
    >
      <Drawer.Screen
        name="orders"
        options={{
          drawerLabel: t("Home"),
          title: t("Orders"),
          drawerIcon: ({ color, size }) => (
            <HomeIcon
              color={appTheme.iconColor ?? color}
              height={size}
              width={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="language"
        options={{
          drawerLabel: t("Language"),
          title: t("Language"),
          drawerIcon: ({ color, size }) => (
            <LanguageIcon
              color={appTheme.iconColor ?? color}
              height={size}
              width={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="vehicle-type"
        options={{
          drawerLabel: t("Vehicle Type"),
          title: t("Vehicle Type"),
          drawerIcon: ({ color, size }) => (
            <BikeRidingIcon
              color={appTheme.iconColor ?? color}
              height={size}
              width={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="work-schedule"
        options={{
          drawerLabel: t("Work Schedule"),
          title: t("Work Schedule"),
          drawerIcon: ({ color, size }) => (
            <ClockIcon
              color={appTheme.iconColor ?? color}
              height={size}
              width={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="bank-management"
        options={{
          drawerLabel: t("Bank Management"),
          title: t("Bank Management"),
          drawerIcon: ({ color, size }) => (
            <CardIcon
              color={appTheme.iconColor ?? color}
              height={size}
              width={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="help"
        options={{
          drawerLabel: t("Help"),
          title: t("Help"),
          drawerIcon: ({ color, size }) => (
            <HelpIcon
              color={appTheme.iconColor ?? color}
              height={size}
              width={size}
            />
          ),
        }}
      />
    </Drawer>
  );
};

export default memo(DrawerMain);
