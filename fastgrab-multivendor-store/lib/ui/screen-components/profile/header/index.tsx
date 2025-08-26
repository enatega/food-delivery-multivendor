// Hooks
import { useUserContext } from "@/lib/context/global/user.context";
import { useTranslation } from "react-i18next";

// Constants

// Core
import { useApptheme } from "@/lib/context/theme.context";
import { Image, ImageBackground, Text, View } from "react-native";

export default function ProfileHeader() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { dataProfile } = useUserContext();

  return (
    <ImageBackground
      source={{ uri: dataProfile?.image as string }}
      width={100}
      height={100}
      resizeMode="cover"
      className="backdrop-blur-3xl"
    >
      <View
        className={`justify-between flex-row h-[130px] w-[55%] items-center p-4 shadow-xl sticky top-5`}
      >
        <View
          className="p-1 rounded-[100px]"
          style={{ backgroundColor: appTheme.themeBackground }}
        >
          <View
            className="w-[54px] h-[54px] rounded-full items-center justify-center overflow-hidden"
            style={{ backgroundColor: appTheme.white }}
          >
            {dataProfile?.logo ? (
              <Image
                source={{ uri: dataProfile.logo }}
                width={100}
                height={100}
                resizeMode="cover"
                style={{ backgroundColor: "white" }}
              />
            ) : (
              <Text
                className="text-[16px] font-semibold"
                style={{
                  color: appTheme.primary,
                  textShadowColor: appTheme.black,
                  textShadowOffset: { width: 22, height: 22 },
                  textShadowRadius: 40,
                }}
              >
                {(() => {
                  const name = dataProfile?.name;
                  if (!name || typeof name !== "string") return "JS";

                  const nameParts = name.split(" ");
                  const firstInitial =
                    nameParts[0]?.substring(0, 1)?.toUpperCase() || "";
                  const secondInitial =
                    nameParts[1]?.substring(0, 1)?.toUpperCase() || "";

                  return firstInitial + secondInitial || "JS";
                })()}
              </Text>
            )}
          </View>
        </View>
        <View className="left-5">
          <Text
            className={`font-semibold xs`}
            style={{
              color: appTheme.fontMainColor,
              fontWeight: "semibold",
              padding: 3,
              borderRadius: 70,
              backgroundColor: appTheme.themeBackground,
            }}
          >
            {dataProfile?.name ?? t("store name")}
          </Text>
          <Text
            className="font-medium my-1"
            style={{
              color: appTheme.fontMainColor,
              fontWeight: "semibold",
              padding: 3,
              borderRadius: 70,
              backgroundColor: appTheme.themeBackground,
            }}
          >
            {dataProfile?._id.substring(0, 9).toUpperCase() ?? t("store id")}
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}
