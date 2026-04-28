// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { app_theme } from "@/lib/utils/types/theme";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

// Core
import { Text, View } from "react-native";
import { Switch } from "react-native-switch";

export default function OtherDetailsSection() {
  // Hooks
  const { t } = useTranslation();
  const { dataProfile } = useUserContext();
  const { currentTheme, toggleTheme, appTheme } = useApptheme();

  return (
    <View className="flex flex-col justify-between items-start h-[40%] w-full px-4 py-2 pb-20 my-5">
      <View className="flex flex-row items-center justify-between w-full">
        <Text
          className="text-xl font-bold"
          style={{ color: appTheme.mainTextColor }}
        >
          {t("Other information")}
        </Text>
      </View>
      <View
        className="flex flex-col gap-3 item-start justify-between w-full   h-20 p-4 rounded-md my-4"
        style={{
          backgroundColor: appTheme.themeBackground,
          borderWidth: 1,
          borderColor: appTheme.borderLineColor,
        }}
      >
        <Text style={{ color: appTheme.fontSecondColor }}>{t("Email")}</Text>
        <View className="flex-1 h-12 text-base text-black">
          <Text className="h-12" style={{ color: appTheme.fontSecondColor }}>
            {dataProfile?.email ?? "example@email.com"}
          </Text>
        </View>
      </View>
      <View
        className="flex flex-col gap-3 item-start justify-between w-full   h-20 p-4 rounded-md my-4"
        style={{
          backgroundColor: appTheme.themeBackground,
          borderWidth: 1,
          borderColor: appTheme.borderLineColor,
        }}
      >
        <Text style={{ color: appTheme.fontSecondColor }}>{t("Password")}</Text>
        <View className="flex-1 h-12 text-base text-black">
          <Text className="h-12" style={{ color: appTheme.fontSecondColor }}>
            {dataProfile?.password ?? "Password@123"}
          </Text>
        </View>
      </View>
      <View
        className="flex flex-col gap-3 item-start justify-between w-full   h-20 p-4 rounded-md my-4"
        style={{
          backgroundColor: appTheme.themeBackground,
          borderWidth: 1,
          borderColor: appTheme.borderLineColor,
        }}
      >
        <Text style={{ color: appTheme.fontSecondColor }}>{t("Phone")}</Text>
        <View className="flex-1 h-12 text-base text-black">
          <Text className="h-12" style={{ color: appTheme.fontSecondColor }}>
            {dataProfile?.phone ?? "+324 234 328979"}
          </Text>
        </View>
      </View>
      <View className="flex flex-row items-center justify-between w-full">
        <Text
          className="text-xl font-bold"
          style={{
            color: appTheme.mainTextColor,
          }}
        >
          {t("Theme")}
        </Text>
        <View className="flex flex-row gap-2 items-center justify-center">
          <Switch
            containerStyle={{ width: "20%" }}
            switchWidthMultiplier={3}
            activeText={"Dark"}
            inActiveText={"Light"}
            renderInsideCircle={() => {
              return (
                <Ionicons
                  name={
                    currentTheme === "dark"
                      ? "moon"
                      : currentTheme === "light"
                        ? "sunny"
                        : "phone-portrait"
                  }
                  size={22}
                />
              );
            }}
            circleActiveColor={appTheme.primary}
            backgroundActive={appTheme.primary}
            activeTextStyle={{ color: appTheme.black }}
            value={currentTheme === "dark"}
            onValueChange={() => toggleTheme(currentTheme as app_theme)}
          />
        </View>
      </View>
    </View>
  );
}
