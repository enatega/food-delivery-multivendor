// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";
import { useUserContext } from "@/lib/context/global/user.context";

// Constants
import { useTranslation } from "react-i18next";

// Core
import { Text, View } from "react-native";

export default function ProfileHeader() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { dataProfile } = useUserContext();
  return (
    <View
      className="justify-between flex-row h-[8rem] w-full items-center p-4"
      style={{
        backgroundColor: appTheme.screenBackground,
        borderBottomColor: appTheme.white,
        borderBottomWidth: 2,
      }}
    >
      <View className="flex flex-row gap-2 items-center">
        <View
          className="w-[54px] h-[54px] rounded-full items-center justify-center overflow-hidden"
          style={{ backgroundColor: appTheme.white }}
        >
          <Text
            className="text-[16px] font-semibold"
            style={{
              color: appTheme.primary,
            }}
          >
            {dataProfile?.name
              ?.split(" ")[0]
              ?.substring(0, 1)
              ?.toUpperCase()
              ?.concat(
                dataProfile?.name?.split(" ")[1]?.length > 0
                  ? dataProfile?.name
                      ?.split(" ")[1]
                      ?.substring(0, 1)
                      ?.toUpperCase()
                  : "",
              ) ?? "JS"}
          </Text>
        </View>
        <View className="left-0 float-left ml-0">
          <Text
            className="font-semibold text-[16px]"
            style={{
              color: appTheme.mainTextColor,
            }}
          >
            {dataProfile?.name ?? t("rider name")}
          </Text>
          <Text
            className="font-medium"
            style={{
              color: appTheme.fontSecondColor,
            }}
          >
            {dataProfile?._id.substring(0, 9).toUpperCase() ?? "rider id"}
          </Text>
        </View>
      </View>
    </View>
  );
}
