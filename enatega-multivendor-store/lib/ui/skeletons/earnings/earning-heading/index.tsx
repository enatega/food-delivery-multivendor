// Moti
import { useEarningsTheme } from "@/lib/ui/screen-components/earnings/theme";
import { MotiView, Text } from "moti";

// Hooks
import { useTranslation } from "react-i18next";

export default function EarningHeadingSkeleton() {
  // Hooks
  const earningsTheme = useEarningsTheme();
  const { t } = useTranslation();
  return (
    <MotiView
      style={{
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 12,
        paddingTop: 24,
      }}
    >
      <Text
        style={{
          color: earningsTheme.primaryText,
          fontSize: 20,
          fontWeight: "800",
        }}
      >
        {t("Recent Activity")}
      </Text>
      <Text
        style={{
          color: earningsTheme.accent,
          fontSize: 14,
          fontWeight: "700",
        }}
      >
        {t("See More")}
      </Text>
    </MotiView>
  );
}
