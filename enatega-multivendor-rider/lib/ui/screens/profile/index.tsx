// Core
import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";

// Components
import ProfileHeader from "../../screen-components/profile/header";
import ProfileMain from "../../screen-components/profile/view/main";

// Types & Interfaces
import { useApptheme } from "@/lib/context/global/theme.context";
import { TRiderProfileBottomBarBit } from "@/lib/utils/types/rider";
import ReactNativeModal from "react-native-modal";
import DrivingLicenseForm from "../../screen-components/profile/forms/liecense";
import VehiclePlateForm from "../../screen-components/profile/forms/vehicle";

export default function ComponentName() {
  // States
  const [isFormOpened, setIsFormOpened] =
    useState<TRiderProfileBottomBarBit>(null);

  // Hooks
  const { appTheme } = useApptheme();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: appTheme.screenBackground }}
    >
      <FlatList
        style={{ flex: 1, backgroundColor: appTheme.screenBackground }}
        contentContainerStyle={{ flexGrow: 1 }}
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
          style={{ margin: 0, justifyContent: "flex-end" }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{
              width: "100%",
              maxHeight: "70%",
              backgroundColor: appTheme.themeBackground,
              borderWidth: 1,
              borderColor: appTheme.borderLineColor,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 2,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
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
          </KeyboardAvoidingView>
        </ReactNativeModal>
      )}
    </SafeAreaView>
  );
}
