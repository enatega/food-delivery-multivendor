// Expo
import { Tabs } from "expo-router";

// Core
import { Platform, Pressable, Text, View } from "react-native";

// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";
import { useTranslation } from "react-i18next";

export default function Layout() {
  // Hooks
  const { t } = useTranslation();
  const { appTheme } = useApptheme();
  return (
    <Tabs
      // initialRouteName="processing"
      screenOptions={{
        tabBarIcon: () => null,
        tabBarActiveTintColor: appTheme.primary,

        headerShown: false,
        tabBarIconStyle: {
          display: "none",
        },
        tabBarLabel: ({ children, focused }) => (
          <View
            className="w-full"
            style={{
              alignItems: "center",
              borderBottomWidth: focused ? 2 : 0, // Bottom border when selected
              borderBottomColor: focused ? appTheme.primary : "transparent", // Black border for active tab
              paddingBottom: 8, // Space between text and border

              backgroundColor: appTheme.themeBackground,
            }}
          >
            <Text
              style={{
                color: focused ? appTheme.fontMainColor : "#6B7280",
                fontWeight: 500,
                fontSize: 14,
                fontFamily: "Inter",
              }}
            >
              {children}
            </Text>
          </View>
        ),

        tabBarButton: (props) => {
          return (
            <Pressable
              {...props}
              android_ripple={{ color: "transparent" }} // Remove ripple on Android
              style={({ pressed }) => [
                props.style,
                { opacity: pressed ? 1 : 1 }, // Remove opacity change on iOS
              ]}
            />
          );
        },
        tabBarPosition: "bottom",
        tabBarItemStyle: {
          height: 40,
          // backgroundColor: "transparent",
          backgroundColor: appTheme.themeBackground,
        },

        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            top: 0,
            height: 30,
            shadowColor: "white",
            shadowOpacity: 0,
            backgroundColor: appTheme.themeBackground,
            paddingTop: 20,
            color: appTheme.fontMainColor,
          },
          android: {
            position: "absolute",
            top: 0,
            height: 50,
            shadowColor: "white",
            shadowOpacity: 0,
            paddingTop: 20,
            backgroundColor: appTheme.themeBackground,
            elevation: 0,
            color: appTheme.fontMainColor,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("New Orders"),
        }}
      />
      <Tabs.Screen
        name="processing"
        options={{
          title: t("Processing"),
        }}
      />
      <Tabs.Screen
        name="delivered"
        options={{
          title: t("Delivered"),
        }}
      />
    </Tabs>
  );
}
