import { useApptheme } from "@/lib/context/theme.context";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, Text, View } from "react-native";

export default function Layout() {
  // Hooks
  const { t } = useTranslation();
  const { appTheme } = useApptheme();

  return (
    <Tabs
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
              borderBottomWidth: focused ? 2 : 0,
              borderBottomColor: focused ? appTheme.primary : "transparent",
              paddingBottom: 8,
            }}
          >
            <Text
              style={{
                color: focused
                  ? appTheme.fontMainColor
                  : appTheme.fontSecondColor,
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
              android_ripple={{ color: "transparent" }}
              style={({ pressed }) => [
                props.style,
                { opacity: pressed ? 1 : 1 },
              ]}
            />
          );
        },
        tabBarPosition: "bottom",
        tabBarItemStyle: {
          height: 40,
          backgroundColor: "transparent",
        },

        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            top: 0,
            height: 30,
            backgroundColor: appTheme.themeBackground,
            shadowColor: appTheme.themeBackground,
            shadowOpacity: 0,
            paddingTop: 20,
          },
          android: {
            position: "absolute",
            top: 0,
            height: 50,
            backgroundColor: appTheme.themeBackground,
            shadowColor: appTheme.themeBackground,
            shadowOpacity: 0,
            paddingTop: 20,
            elevation: 0,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title:
            t("New Orders").length > 13
              ? t("New Orders").substring(0, 13).concat("..")
              : t("New Orders"),
        }}
      />
      <Tabs.Screen
        name="processing"
        options={{
          title:
            t("Processing").length > 13
              ? t("Processing").substring(0, 13).concat("..")
              : t("Processing"),
        }}
      />
      <Tabs.Screen
        name="delivered"
        options={{
          title:
            t("Delivered").length > 13
              ? t("Delivered").substring(0, 13).concat("..")
              : t("Delivered"),
        }}
      />
    </Tabs>
  );
}
