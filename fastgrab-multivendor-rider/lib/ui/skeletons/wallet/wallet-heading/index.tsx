// Moti
import { MotiView, Text } from "moti";

// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";
import { useTranslation } from "react-i18next";

export default function WalletHeadingSkeleton() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  return (
    <MotiView
      className="p-3"
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <Text
        className="font-bold text-lg pb-5 mt-0"
        style={{
          backgroundColor: appTheme.themeBackground,
          color: appTheme.fontMainColor,
        }}
      >
        {t("Recent Transactions")}
      </Text>
    </MotiView>
  );
}
