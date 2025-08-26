// Icons
import { useApptheme } from "@/lib/context/theme.context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

// Core
import { Text, View } from "react-native";

export default function NoRecordFound({
  msg = "No record found",
}: {
  msg?: string;
}) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  return (
    <View className="items-center flex flex-row my-24 justify-center">
      <Text
        className="font-bold text-center"
        style={{ color: appTheme.fontMainColor }}
      >
        {t(msg)}
      </Text>
      <Ionicons name="sad-outline" color={appTheme.primary} size={20} />
    </View>
  );
}
