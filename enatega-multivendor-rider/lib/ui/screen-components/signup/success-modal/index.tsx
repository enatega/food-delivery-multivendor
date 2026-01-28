import { useApptheme } from "@/lib/context/global/theme.context";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SuccessModal({ visible, onClose }: SuccessModalProps) {
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-center items-center px-6"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <View
          className="w-full rounded-3xl p-8 items-center"
          style={{ backgroundColor: appTheme.themeBackground }}
        >
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: "#10b981" }}
          >
            <FontAwesome name="check" size={40} color="#fff" />
          </View>

          <Text
            className="text-2xl font-bold text-center mb-2"
            style={{ color: appTheme.fontMainColor }}
          >
            {t("Application Submitted!")}
          </Text>

          <Text
            className="text-center text-base mb-6"
            style={{ color: appTheme.fontSecondColor }}
          >
            {t(
              "Your rider application has been submitted successfully. We'll review your application and get back to you soon."
            )}
          </Text>

          <View
            className="w-full p-4 rounded-lg mb-6"
            style={{ backgroundColor: `${appTheme.primary}10` }}
          >
            <Text
              className="text-sm text-center"
              style={{ color: appTheme.fontMainColor }}
            >
              {t("Status:")} <Text className="font-bold">{t("Pending Review")}</Text>
            </Text>
          </View>

          <TouchableOpacity
            className="w-full py-4 rounded-full"
            style={{ backgroundColor: appTheme.primary }}
            onPress={onClose}
          >
            <Text className="text-center text-base font-semibold">
              {t("Back to Login")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
