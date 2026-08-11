// Core
import { useApptheme } from "@/lib/context/theme.context";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export default function CustomScreenHeader({ title }: { title: string }) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  return (
    <View className={`p-1 w-full mx-auto block justify-center items-center`}>
      <Text
        className="font-bold text-lg"
        style={{ color: appTheme.fontMainColor }}
      >
        {t(title)}
      </Text>
    </View>
  );
}
