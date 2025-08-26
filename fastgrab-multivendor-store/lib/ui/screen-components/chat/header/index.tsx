import { useApptheme } from "@/lib/context/theme.context";
import { CallIcon, CircleCrossIcon } from "@/lib/ui/useable-components/svg";
import { callNumber } from "@/lib/utils/methods";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

export default function ChatHeader() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const route = useRoute();
  const router = useRouter();
  const { orderId, phoneNumber } = route.params as {
    orderId: string;
    phoneNumber: string;
  };

  return (
    <View
      className="mt-2 p-2"
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <View className="flex-row justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <CircleCrossIcon color={appTheme.fontMainColor} />
        </TouchableOpacity>
        <Text style={{ color: appTheme.fontMainColor }}>
          {t("Contact Customer")}
        </Text>
        <TouchableOpacity onPress={() => callNumber(phoneNumber ?? "")}>
          <CallIcon color={appTheme.fontMainColor} />
        </TouchableOpacity>
      </View>
      <View
        className="h-[1px] w-full mt-4"
        style={{ backgroundColor: appTheme.borderLineColor }}
      ></View>
      <View className="flex-row gap-x-2 items-center mt-4 mb-4">
        <Text
          className="font-[Inter] font-[12px]"
          style={{ color: appTheme.fontMainColor }}
        >
          {t("Order number")}:
        </Text>
        <View
          className="w-fit p-2 pl-6 pr-6 border rounded-2xl"
          style={{
            backgroundColor: appTheme.themeBackground,
            borderColor: appTheme.borderLineColor,
          }}
        >
          <Text style={{ color: appTheme.fontMainColor }}>
            {orderId ?? "-"}
          </Text>
        </View>
      </View>
      <View
        className="h-[1px] w-full mb-4"
        style={{ backgroundColor: appTheme.borderLineColor }}
      ></View>
    </View>
  );
}
