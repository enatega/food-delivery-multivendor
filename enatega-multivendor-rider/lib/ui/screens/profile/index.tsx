// Core
import { useEffect, useState } from "react";
import { FlatList, SafeAreaView } from "react-native";

// Components
import ProfileHeader from "../../screen-components/profile/header";
import ProfileMain from "../../screen-components/profile/view/main";

// Types & Interfaces
import { useApptheme } from "@/lib/context/global/theme.context";
import { TRiderProfileBottomBarBit } from "@/lib/utils/types/rider";
import { Keyboard } from "react-native";
import ReactNativeModal from "react-native-modal";
import DrivingLicenseForm from "../../screen-components/profile/forms/liecense";
import VehiclePlateForm from "../../screen-components/profile/forms/vehicle";

export default function ComponentName() {
  // States
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isFormOpened, setIsFormOpened] =
    useState<TRiderProfileBottomBarBit>(null);

  // Hooks
  const { appTheme } = useApptheme();
  // UseEffects
  useEffect(() => {
    const isOpened = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });
    const isClosed = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });
    return () => {
      isOpened.remove();
      isClosed.remove();
    };
  }, [Keyboard, isKeyboardVisible]);
  return (
    <SafeAreaView style={{ backgroundColor: appTheme.screenBackground }}>
      <FlatList
        style={{ backgroundColor: appTheme.screenBackground }}
        data={[
          <ProfileHeader />,
          <ProfileMain
            isFormOpened={isFormOpened}
            setIsFormOpened={setIsFormOpened}
          />,
        ]}
        renderItem={(item) => {
          return item.item;
        }}
      />
      {isFormOpened !== null && (
        <ReactNativeModal
          isVisible={isFormOpened !== null}
          animationIn={"slideInUp"}
          animationOut={"slideOutDown"}
          onBackdropPress={() => {
            setIsFormOpened(null);
          }}
          style={{
            maxHeight:
              isKeyboardVisible && isFormOpened === "LICENSE_FORM" ? "100%"
              : !isKeyboardVisible && isFormOpened === "LICENSE_FORM" ? "65%"
              : isKeyboardVisible && isFormOpened === "VEHICLE_FORM" ? "100%"
              : !isKeyboardVisible && isFormOpened === "VEHICLE_FORM" ? "55%"
              : "65%",
            width: "100%",
            backgroundColor: appTheme.themeBackground,
            borderWidth: 1,
            borderColor: appTheme.borderLineColor,
            borderRadius: 20,
            padding: 2,
            alignItems: "center",
            justifyContent: "space-between",

            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            marginLeft: 0,
            marginTop:
              isFormOpened === "LICENSE_FORM" && !isKeyboardVisible ? "60%"
              : isFormOpened === "LICENSE_FORM" && isKeyboardVisible ? "0%"
              : isFormOpened === "VEHICLE_FORM" && !isKeyboardVisible ? "100%"
              : isFormOpened === "VEHICLE_FORM" && isKeyboardVisible ? "10%"
              : "0%",
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}
        >
          {isFormOpened === "LICENSE_FORM" && (
            <DrivingLicenseForm setIsFormOpened={setIsFormOpened} />
          )}
          {isFormOpened === "VEHICLE_FORM" && (
            <VehiclePlateForm setIsFormOpened={setIsFormOpened} />
          )}
          {isFormOpened === null && <></>}
        </ReactNativeModal>
      )}
    </SafeAreaView>
  );
}
