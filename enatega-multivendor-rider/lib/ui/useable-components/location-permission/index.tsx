import { useLocationContext } from "@/lib/context/global/location.context";
import { useApptheme } from "@/lib/context/global/theme.context";
import { ILocationPermissionComponentProps } from "@/lib/utils/interfaces";
import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  AppState,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import SpinnerComponent from "../spinner";

export default function LocationPermissionComponent({
  children,
}: ILocationPermissionComponentProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const {
    setLocationPermission,
    isBackgroundLocationDisclosureVisible,
    requestBackgroundLocationPermission,
    dismissBackgroundLocationDisclosure,
  } = useLocationContext();

  // States
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isBackgroundPermissionLoading, setBackgroundPermissionLoading] =
    useState(false);

  const getLocationPermission = useCallback(async () => {
    setLoading(true);
    const { status } = await Location.getForegroundPermissionsAsync();
    setLoading(false);
    if (status === "granted") {
      setLocationPermission(true);
      setIsModalVisible(false);
    } else {
      setIsModalVisible(true);
    }
  }, [setLocationPermission]);

  const LocationAlert = async () => {
    Alert.alert(
      "Location access",
      "Location permissions are required to use this app. Kindly open settings to allow location access.",
      [
        {
          text: "Open settings",
          onPress: async () => {
            await Linking.openSettings();
          },
        },
      ],
    );
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === "granted") {
      setLocationPermission(true);
      setIsModalVisible(false);
    }
  };

  const askLocationPermission = async () => {
    setLoading(true);
    const { status, canAskAgain } =
      await Location.getForegroundPermissionsAsync();
    setLoading(false);
    if (status === "granted") {
      setLocationPermission(true);
      setIsModalVisible(false);
    }
    if (canAskAgain) {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLoading(false);
      if (status === "granted") {
        setLocationPermission(true);
        setIsModalVisible(false);
      } else {
        LocationAlert();
      }
    } else {
      LocationAlert();
    }
  };

  const allowBackgroundLocation = async () => {
    setBackgroundPermissionLoading(true);
    try {
      await requestBackgroundLocationPermission();
    } catch (error) {
      if (__DEV__) {
        console.log("Unable to request background location permission", error);
      }
      Alert.alert(t("Location access"), t("Please check for permissions"));
    } finally {
      setBackgroundPermissionLoading(false);
    }
  };

  useEffect(() => {
    getLocationPermission();
  }, [getLocationPermission]);

  // Re-check permission when the app returns to the foreground (e.g. after the
  // user grants access in Settings). Checking synchronously right after opening
  // Settings always reads "denied" because the user hasn't acted yet.
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextState) => {
        if (nextState !== "active") return;
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === "granted") {
          setLocationPermission(true);
          setIsModalVisible(false);
        } else {
          setLocationPermission(false);
          setIsModalVisible(true);
        }
      },
    );
    return () => subscription.remove();
  }, [setLocationPermission]);

  return (
    <View className="flex-1">
      {children}

      <Modal
        isVisible={isModalVisible}
        coverScreen={false}
        backdropOpacity={0.5}
      >
        <View className="h-fit w-full bg-transparent justify-around items-center">
          <View
            className="h-fit w-[95%] p-4 items-center justify-around  rounded-[16px]"
            style={{
              backgroundColor: appTheme.themeBackground,
              borderColor: appTheme.borderLineColor,
              borderWidth: 1,
            }}
          >
            <View className="gap-y-2">
              <Text
                className="font-[Inter] font-semibold text-[20px] leading-[28px] tracking-[0px] text-center"
                style={{ color: appTheme.fontMainColor }}
              >
                {t("Location access for deliveries")}
              </Text>
              <Text
                className="font-[Inter] font-[400] text-[14px] leading-[28px] tracking-[0px] text-center"
                style={{ color: appTheme.fontSecondColor }}
              >
                {t(
                  "Enatega Multivendor Rider uses your precise location while you use the app to show your current position and support pickup and delivery navigation.",
                )}
              </Text>
            </View>

            <TouchableOpacity
              className="h-10 rounded-3xl py-2 mt-4 w-[90%]"
              style={{ backgroundColor: appTheme.primary }}
              onPress={() => {
                askLocationPermission();
              }}
            >
              {isLoading ? (
                <SpinnerComponent />
              ) : (
                <Text
                  className="text-center text-[14px] font-medium"
                  style={{ color: appTheme.black }}
                >
                  Continue
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={isBackgroundLocationDisclosureVisible}
        backdropOpacity={0.65}
        onBackdropPress={dismissBackgroundLocationDisclosure}
        onBackButtonPress={dismissBackgroundLocationDisclosure}
      >
        <View className="w-full items-center">
          <View
            className="w-[95%] p-5 rounded-[16px]"
            style={{
              backgroundColor: appTheme.themeBackground,
              borderColor: appTheme.borderLineColor,
              borderWidth: 1,
            }}
          >
            <Text
              className="font-[Inter] font-semibold text-[20px] leading-[28px] text-center"
              style={{ color: appTheme.fontMainColor }}
            >
              {t("Allow background location for live delivery tracking")}
            </Text>
            <Text
              className="font-[Inter] font-[400] text-[14px] leading-[22px] text-center mt-3"
              style={{ color: appTheme.fontSecondColor }}
            >
              {t(
                "Enatega Multivendor Rider collects and transmits your precise location to the delivery server to enable live delivery tracking for customers and dispatchers during an active delivery, even when the app is not in use. Location sharing starts only after you accept a delivery and stops when the delivery ends or you log out.",
              )}
            </Text>

            <TouchableOpacity
              className="h-11 rounded-3xl py-2.5 mt-5 w-full"
              style={{ backgroundColor: appTheme.primary }}
              disabled={isBackgroundPermissionLoading}
              onPress={allowBackgroundLocation}
            >
              {isBackgroundPermissionLoading ? (
                <SpinnerComponent />
              ) : (
                <Text
                  className="text-center text-[14px] font-medium"
                  style={{ color: appTheme.black }}
                >
                  {t("Allow delivery tracking")}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="h-11 py-2.5 mt-2 w-full"
              disabled={isBackgroundPermissionLoading}
              onPress={dismissBackgroundLocationDisclosure}
            >
              <Text
                className="text-center text-[14px] font-medium"
                style={{ color: appTheme.fontMainColor }}
              >
                {t("Not now")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
