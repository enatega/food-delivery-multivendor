// Core
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { useContext } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

// Context
import { AuthContext } from "@/lib/context/global/auth.context";

// Drawer
import CustomDrawerHeader from "@/lib/ui/screen-components/home/drawer/drawer-header";

// UI-Componetns
import { useApptheme } from "@/lib/context/global/theme.context";
import {
  AboutIcon,
  LogoutIcon,
  PageIcon,
  PrivacyIcon,
  RightArrowIcon,
  UserIcon,
} from "@/lib/ui/useable-components/svg";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import { useUserContext } from "@/lib/context/global/user.context";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";

export default function CustomDrawerContent(
  props: DrawerContentComponentProps
) {
  // Hooks
  const { appTheme, currentTheme } = useApptheme();
  const { t } = useTranslation();
  const { logout } = useContext(AuthContext);

  return (
    <DrawerContentScrollView
      key={currentTheme?.concat("Drawer_Content")}
      {...props}
      // scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: appTheme.themeBackground,
        paddingBottom: 30,
        paddingStart: 0,
        paddingEnd: 0,
        paddingTop: 0,
      }}
    >
      <CustomDrawerHeader />
      {/* Drawer Items with Right Arrow */}
      <ScrollView
        key={currentTheme?.concat("Drawer_Content").concat("Scroll_View")}
        style={{
          backgroundColor: appTheme.themeBackground,
          height: "auto",
          paddingBottom: 20,
        }}
        scrollEnabled={true}
      >
        {props.state.routes.map((route, index) => {
          const isFocused = props.state.index === index;
          const { options } = props.descriptors[route.key];
          if (route.name === "profile") {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => {
                  router.replace("/(tabs)/profile");
                }}
                className={`flex-row justify-between items-center px-4 py-4 border-b-[0.5px]`}
                style={{ borderColor: appTheme.borderLineColor }}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-[30px] w-[40px] rounded-full items-center justify-center"
                    style={{
                      backgroundColor: appTheme.sidebarIconBackground,
                    }}
                  >
                    <UserIcon
                      width={16}
                      height={16}
                      color={appTheme.iconColor}
                    />
                  </View>
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: appTheme.buttonText,
                    }}
                  >
                    {t("Profile")}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          } else
            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => props.navigation.navigate(route.name)}
                className={`flex-row justify-between items-center px-4 py-3 border-b-[0.5px]`}
                style={{
                  backgroundColor: isFocused
                    ? appTheme.lowOpacityPrimaryColor
                    : appTheme.themeBackground,
                  borderColor: appTheme.borderLineColor,
                }}
              >
                {/* Left Icon and Label */}
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-[40px] w-[40px] rounded-full items-center justify-center"
                    style={{
                      backgroundColor: isFocused
                        ? appTheme.primary
                        : appTheme.sidebarIconBackground,
                    }}
                  >
                    {options.drawerIcon
                      ? options.drawerIcon({
                          color: isFocused
                            ? appTheme.primary
                            : appTheme.iconColor,
                          size: 16,
                          focused: true,
                        })
                      : null}
                  </View>
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: isFocused ? appTheme.primary : appTheme.buttonText,
                      fontWeight: isFocused ? "bold" : "normal",
                    }}
                  >
                    {(options.drawerLabel as string) ?? route.name}
                  </Text>
                </View>

                {/* Right Arrow Icon */}
                <RightArrowIcon
                  color={isFocused ? appTheme.primary : appTheme.fontMainColor}
                  height={20}
                  width={20}
                />
              </TouchableOpacity>
            );
        })}

        {/* EXTERNAL LINKS  */}
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://enatega.com/");
          }}
          className="flex-row justify-between items-center px-4 py-4 border-b-[0.5px]"
          style={{ borderColor: appTheme.borderLineColor }}
        >
          <View className="flex-row items-center gap-3">
            <View
              className="h-[30px] w-[40px] rounded-full items-center justify-center"
              style={{ backgroundColor: appTheme.sidebarIconBackground }}
            >
              <AboutIcon width={16} height={16} color={appTheme.iconColor} />
            </View>
            <Text
              className="text-sm font-semibold"
              style={{
                color: appTheme.buttonText,
              }}
            >
              {t("About Us")}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://multivendor.enatega.com/privacy");
          }}
          className="flex-row justify-between items-center px-4 py-4 border-b-[0.5px]"
          style={{ borderColor: appTheme.borderLineColor }}
        >
          <View className="flex-row items-center gap-3">
            <View
              className="h-[30px] w-[40px] rounded-full items-center justify-center"
              style={{ backgroundColor: appTheme.sidebarIconBackground }}
            >
              <PrivacyIcon width={16} height={16} color={appTheme.iconColor} />
            </View>
            <Text
              className="text-sm font-semibold"
              style={{
                color: appTheme.buttonText,
              }}
            >
              {t("Privacy Policy")}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://enatega-web.netlify.app/");
          }}
          className="flex-row justify-between items-center px-4 py-4 border-b-[0.5px]"
          style={{ borderColor: appTheme.borderLineColor }}
        >
          <View className="flex-row items-center gap-3">
            <View
              className="h-[30px] w-[40px] rounded-full items-center justify-center"
              style={{ backgroundColor: appTheme.sidebarIconBackground }}
            >
              <PageIcon width={16} height={16} color={appTheme.iconColor} />
            </View>
            <Text
              className="text-sm font-semibold"
              style={{
                color: appTheme.buttonText,
              }}
            >
              {t("Product Page")}
            </Text>
          </View>
        </TouchableOpacity>
        {/* Logout Button */}

        <TouchableOpacity
          onPress={() => {
            if (logout) logout();
          }}
          className="flex-row justify-between items-center px-4 py-4 border-b-[0.5px]"
          style={{ borderColor: appTheme.borderLineColor }}
        >
          <View className="flex-row items-center gap-3">
            <View
              className="h-[30px] w-[40px] rounded-full items-center justify-center"
              style={{ backgroundColor: appTheme.sidebarIconBackground }}
            >
              <LogoutIcon width={16} height={16} color={appTheme.iconColor} />
            </View>
            <Text
              className="text-sm font-semibold"
              style={{
                color: appTheme.buttonText,
              }}
            >
              {t("Logout")}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </DrawerContentScrollView>
  );
}
