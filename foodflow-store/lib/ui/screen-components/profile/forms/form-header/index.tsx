import { useApptheme } from "@/lib/context/theme.context";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export default function FormHeader({ title }: { title: string }) {
  // Hooks
  const { t } = useTranslation();
  const { appTheme } = useApptheme();

  return (
    <View
      className="w-full h-auto items-start self-start p-3"
      style={{
        borderBottomWidth: 2,
        borderBottomColor: appTheme.borderLineColor,
      }}
    >
      <Text style={{ fontSize: 18, color: appTheme.fontSecondColor }}>
        {t(title)}
      </Text>
    </View>
  );
}
