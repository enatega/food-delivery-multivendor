/* eslint-disable @typescript-eslint/no-require-imports */
// Core
import { Image, InteractionManager, Text, View } from "react-native";
import Modal from "react-native-modal";

// Interface
import { IWellDoneComponentProps } from "@/lib/utils/interfaces";

// Hooks
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

const DELIVERED_REDIRECT_DELAY_MS = 4500;

export default function WelldoneComponent({
  orderId = "",
  status = "Delivered",
  setOrderId,
}: IWellDoneComponentProps) {
  const router = useRouter();

  // Use Effect
  useEffect(() => {
    if (!orderId) return;
    const timeoutId = setTimeout(() => {
      setOrderId("");
      InteractionManager.runAfterInteractions(() => {
        router.replace("/(tabs)/home/orders");
      });
    }, DELIVERED_REDIRECT_DELAY_MS);
    return () => clearTimeout(timeoutId);
  }, [orderId, router, setOrderId]);

  // Hooks
  const { t } = useTranslation();
  return (
    <Modal
      isVisible={!!orderId}
      collapsable={true}
      coverScreen={false}
    >
      <View className="h-fit w-full bg-transparent items-center">
        <View className="h-[120px] w-[95%] items-center justify-around bg-white border-white rounded-[16px]">
          {/* <View> */}
          {/* <WellDoneIcon /> */}
          <Image
            source={require("../../../assets/images/welldone.png")}
            className="h-[40px] w-[40px]"
          />

          {/* </View> */}
          <View className="items-center">
            <Text className="font-inter text-lg font-bold text-centertext-gray-900">
              {t("Well Done Rider")}
            </Text>
            <Text className="font-inter text-sm font-normal leading-[22px] text-center">
              {t("Order Number")} #{orderId.substring(0, 5)} {status}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
