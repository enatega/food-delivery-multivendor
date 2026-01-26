import { useApptheme } from "@/lib/context/global/theme.context";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export default function SignUpFormHeader() {
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  return (
    <View className="items-center gap-y-2 mb-6">
      <View
        className="w-16 h-16 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${appTheme.primary}20` }}
      >
        <FontAwesome name="user-plus" size={28} color={appTheme.primary} />
      </View>

      <Text
        className="text-center text-2xl font-bold"
        style={{ color: appTheme.fontMainColor }}
      >
        {t("Become a Rider")}
      </Text>
      <Text
        className="text-center text-sm px-8"
        style={{ color: appTheme.fontSecondColor }}
      >
        {t("Join our delivery network and start earning today")}
      </Text>
    </View>
  );
}
