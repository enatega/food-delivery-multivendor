import { useApptheme } from "@/lib/context/global/theme.context";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface RejectionModalProps {
  visible: boolean;
  email: string;
  onReapply: () => void;
  onClose: () => void;
  loading?: boolean;
}

export const RejectionModal: React.FC<RejectionModalProps> = ({
  visible,
  email,
  onReapply,
  onClose,
  loading = false,
}) => {
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-5">
        <View
          className="w-full max-w-md rounded-2xl p-6"
          style={{ backgroundColor: appTheme.themeBackground }}
        >
          {/* Icon */}
          <View className="items-center mb-4">
            <View
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: `${appTheme.primary}20` }}
            >
              <FontAwesome name="exclamation" size={32} color="#EF4444" />
            </View>
          </View>

          {/* Title */}
          <Text
            className="text-xl font-bold text-center mb-2"
            style={{ color: appTheme.fontMainColor }}
          >
            {t("Application Rejected")}
          </Text>

          {/* Message */}
          <Text
            className="text-sm text-center mb-1"
            style={{ color: appTheme.fontSecondColor }}
          >
            {t("Your rider application has been rejected for")}
          </Text>

          {/* Email */}
          <Text
            className="text-base font-semibold text-center mb-6"
            style={{ color: appTheme.primary }}
          >
            {email}
          </Text>

          <Text
            className="text-sm text-center mb-6"
            style={{ color: appTheme.fontSecondColor }}
          >
            {t("You can reapply by clicking the button below")}
          </Text>

          {/* Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              className="py-3 rounded-lg items-center justify-center"
              style={{ backgroundColor: appTheme.primary }}
              onPress={onReapply}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-base font-semibold">
                  {t("Reapply")}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="py-3 rounded-lg items-center justify-center border"
              style={{ borderColor: appTheme.borderLineColor }}
              onPress={onClose}
              disabled={loading}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: appTheme.fontMainColor }}
              >
                {t("Close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
