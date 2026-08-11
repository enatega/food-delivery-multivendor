// Core
import { Image, Text, View } from "react-native";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Assets
import { IMAGES } from "@/lib/assets/images";

// Expo
import { router } from "expo-router";

// Interfaces
import { IWalletSuccessModalProps } from "@/lib/utils/interfaces/withdraw.interface";

// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";
import { useTranslation } from "react-i18next";
const SuccessModal = ({ message }: IWalletSuccessModalProps) => {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  return (
    <View
      style={{
        shadowRadius: 480,
        shadowOpacity: 1,
        shadowColor: "black",
        borderWidth: 1,
        borderColor: appTheme.borderLineColor,
        backgroundColor: appTheme.themeBackground,
        justifyContent: "center",
        alignItems: "center",
        maxHeight: 400,
        marginTop: 0,
        borderRadius: 10,
        width: 350,
        padding: 12,
        boxShadow: `5px 5px 5px ${appTheme.secondaryTextColor}`,
      }}
    >
      <View className="absolute right-3 top-3">
        <Ionicons
          name="close-circle-outline"
          size={20}
          color={appTheme.fontMainColor}
          onPress={() => {
            router.back();
          }}
        />
      </View>

      <Image
        source={IMAGES.successWithdrawRequest}
        style={{ width: 200, height: 200 }}
        resizeMode="contain"
      />
      <View className="flex flex-col gap-3 items-center justify-center self-center mx-auto w-[80%]">
        <Text
          className="text-lg font-bold text-center"
          style={{ color: appTheme.fontMainColor }}
        >
          {message}
        </Text>
        <Text style={{ color: appTheme.fontSecondColor }}>
          {t("Usually it takes 1-2 business days")}
        </Text>
      </View>
    </View>
  );
};

export default SuccessModal;
