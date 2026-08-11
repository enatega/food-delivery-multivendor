/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

import {
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Hooks
import useAcceptOrder from "@/lib/hooks/useAcceptOrder";
import useOrderRing from "@/lib/hooks/useOrderRing";

// Constants
import { TIMES } from "@/lib/utils/constants";

// Interface
import { ISetOrderTimeComponentProps } from "@/lib/utils/interfaces";

// UI

// Icons
import { useApptheme } from "@/lib/context/theme.context";
import { useSoundContext } from "@/lib/context/global/sound.context";
import { useTranslation } from "react-i18next";
import CustomContinueButton from "../custom-continue-button";
import { CircleCrossIcon } from "../svg";
import usePrintOrder from "@/lib/hooks/usePrintOrder";

const SetTimeScreenAndAcceptOrder = ({
  id,
  orderId,
  handleDismissModal,
}: ISetOrderTimeComponentProps) => {
  // Hooks
  const { appTheme } = useApptheme();
  const { silenceRing } = useSoundContext();
  const { t } = useTranslation();

  // States
  const [selectedTime, setSelectedTime] = useState(TIMES[0]);
  const [isAcceptingOrder, setIsAcceptingOrder] = useState(false);

  const { muteRing, loading: loadingRing } = useOrderRing();
  const { acceptOrder, loading: loadingAcceptOrder } = useAcceptOrder();
  const { printOrder } = usePrintOrder();
  const isSubmitting = loadingAcceptOrder || loadingRing || isAcceptingOrder;

  const onAcceptOrderHandler = async () => {
    if (isSubmitting) return;

    try {
      await silenceRing();
      await acceptOrder(id, selectedTime?.toString() || "0");
      muteRing(orderId).catch(() => {});
      handleDismissModal();
    } catch {
      // FlashMessageComponent({ message: err?.message ?? "Order accept failed" });
    } finally {
      handleDismissModal();
    }
  };
  const onAcceptAndPrintOrderHandler = async () => {
    if (isSubmitting) return;

    try {
      setIsAcceptingOrder(true);
      const status = await printOrder(id);

      if (status) {
        // null means it's ioS so ignore printing and true mean print wa successfull
        await silenceRing();
        await acceptOrder(id, selectedTime?.toString() || "0");
        muteRing(orderId).catch(() => {});
      }

      setIsAcceptingOrder(false);
      handleDismissModal();
    } catch {
      // FlashMessageComponent({ message: err?.message ?? "Order accept failed" });
    } finally {
      setIsAcceptingOrder(false);
      handleDismissModal();
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-4 pb-20">
      <View className="mt-4 mb-4 text-center flex-row justify-between items-center">
        <Text
          className="flex-1 text-center text-[16px] font-[600]"
          style={{ color: appTheme.fontMainColor }}
        >
          {t("Set Preparation Time")}
        </Text>
        <TouchableOpacity onPress={handleDismissModal}>
          <CircleCrossIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      <View className="mb-6">
        <View className="flex-row flex-wrap gap-2 justify-between">
          {TIMES.map((time, index) => (
            <Pressable
              key={index}
              onPress={() => setSelectedTime(time)}
              className={`h-fit justify-center items-center  p-4 rounded-[8px] `}
              style={{
                backgroundColor:
                  selectedTime === time ? appTheme.primary : appTheme.white,
              }}
            >
              <Text
                className={`text-[Inter] text-center items-center text-[14px] font-medium`}
                style={{
                  color:
                    selectedTime === time ? appTheme.white : appTheme.black,
                }}
              >
                {`${time} mins`}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View>
        <CustomContinueButton
          disabled={isSubmitting}
          isLoading={loadingAcceptOrder || loadingRing}
          style={{ backgroundColor: appTheme.primary }}
          onPress={onAcceptOrderHandler}
          title={t("Done")}
        />
      </View>
      {Platform.OS === "android" && (
        <View>
          <CustomContinueButton
            disabled={isSubmitting}
            isLoading={isSubmitting}
            style={{ backgroundColor: appTheme.primary }}
            onPress={onAcceptAndPrintOrderHandler}
            title={t("AcceptAndPrint")}
          />
        </View>
      )}
    </View>
  );
};

export default SetTimeScreenAndAcceptOrder;
