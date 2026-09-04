import { Text, TouchableOpacity, View } from "react-native";

import { useApptheme } from "@/lib/context/theme.context";
import { ICustomTabProps } from "@/lib/utils/interfaces";
import { useTranslation } from "react-i18next";

const CustomTab = ({
  options,
  selectedTab,
  setSelectedTab,
  deliveryCount,
  pickupCount,
}: ICustomTabProps) => {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  return (
    <View
      className="sticky top-0 z-10 w-full p-3"
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <View
        className="h-[50px] w-full flex-row p-2 justify-center items-center rounded-[8px]"
        style={{ backgroundColor: appTheme.themeBackground }}
      >
        {options.map((option, index) => {
          const count =
            option === "Delivery Orders"
              ? deliveryCount
              : option === "Pick up Orders"
                ? pickupCount
                : 0;

          return (
            <TouchableOpacity
              key={String(option)}
              onPress={() => setSelectedTab(option)}
              className="h-full py-2 flex-1 items-center justify-center rounded-[8px]"
              style={{
                backgroundColor:
                  selectedTab === option
                    ? appTheme.primary
                    : appTheme.themeBackground,
                borderColor: appTheme.borderLineColor,
                borderWidth: 1,
                marginLeft: index === 0 ? 0 : 4,
              }}
            >
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                style={{
                  color:
                    selectedTab === option
                      ? appTheme.fontMainColor
                      : appTheme.fontSecondColor,
                  paddingHorizontal: count > 0 ? 24 : 12,
                  textAlign: "center",
                }}
              >
                {t(option)}
              </Text>
              {count > 0 && (
                <View
                  style={{
                    backgroundColor: appTheme.error,
                    borderRadius: 100,
                    minWidth: 20,
                    height: 20,
                    paddingHorizontal: 4,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    right: 4,
                    top: 4,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: appTheme.white,
                      alignSelf: "center",
                    }}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTab;
