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
        className="h-[50px] w-full flex-row p-2 justify-center items-center space-x-2 rounded-[8px]"
        style={{ backgroundColor: appTheme.themeBackground }}
      >
        {options.map((option) => (
          <TouchableOpacity
            key={String(option)}
            onPress={() => setSelectedTab(option)}
            className={`h-full px-4 py-2 w-1/2 flex items-center justify-center rounded-[8px]`}
            style={{
              backgroundColor:
                selectedTab === option
                  ? appTheme.primary
                  : appTheme.themeBackground,
              borderColor: appTheme.borderLineColor,
              borderWidth: 1,
              marginHorizontal: 2,
            }}
          >
            <Text
              style={{
                color:
                  selectedTab === option
                    ? appTheme.fontMainColor
                    : appTheme.fontSecondColor,
              }}
            >
              {t(option)}
            </Text>
            {option === "Delivery Orders" && (
              <View
                style={{
                  backgroundColor: appTheme.error,
                  borderRadius: 100,
                  width: 20,
                  height: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  left: -3,
                  top: -5,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: appTheme.white,
                    alignSelf: "center",
                  }}
                >
                  {deliveryCount}
                </Text>
              </View>
            )}
            {option === "Pick up Orders" && (
              <View
                style={{
                  backgroundColor: appTheme.error,
                  borderRadius: 100,
                  width: 20,
                  height: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  left: -3,
                  top: -5,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: appTheme.white,
                    alignSelf: "center",
                  }}
                >
                  {pickupCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CustomTab;
