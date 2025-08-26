// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";
import { useTranslation } from "react-i18next";

// Core
import { Text, View } from "react-native";

export default function FormHeader({ title }: { title: string }) {
  // Hooks
  const { t } = useTranslation();
  const { appTheme } = useApptheme();
  return (
    <View className="w-full my-auto h-auto items-start self-start border-b-2 border-b-gray-300 p-3">
      <Text
        className="text-lg"
        style={{
          color: appTheme.fontMainColor,
        }}
      >
        {t(title)}
      </Text>
    </View>
  );
}
