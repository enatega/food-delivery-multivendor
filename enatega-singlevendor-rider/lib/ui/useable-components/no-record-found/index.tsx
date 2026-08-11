// Icons
import { useApptheme } from "@/lib/context/global/theme.context";
import { Ionicons } from "@expo/vector-icons";

// Hooks
import { useTranslation } from "react-i18next";

// Core
import { Text, View } from "react-native";

export default function NoRecordFound() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  return (
    <View className="items-center flex flex-row my-24 justify-center">
      <Text
        className="font-bold text-center"
        style={{ color: appTheme.fontMainColor }}
      >
        {t("No record found")}
      </Text>
      <Ionicons name="sad-outline" size={20} />
    </View>
  );
}
