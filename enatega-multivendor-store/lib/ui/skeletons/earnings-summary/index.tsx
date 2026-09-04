// Moti
import { MotiScrollView, MotiText, MotiView } from "moti";

// Components
import EarningStackSkeleton from "../earnings/earning-stack";
import EarningSummaryHeader from "./earnings-summary-header";

// Hooks
import { useEarningsTheme } from "@/lib/ui/screen-components/earnings/theme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";

export default function EarningsSummaryMainLoading() {
  // Hooks
  const earningsTheme = useEarningsTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const { t } = useTranslation();
  return (
    <MotiView style={{ backgroundColor: earningsTheme.canvas, flex: 1 }}>
      <MotiScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + 24,
          paddingHorizontal: 16,
          paddingTop: 12,
        }}
      >
        <EarningSummaryHeader />
        <MotiText
          style={{
            color: earningsTheme.primaryText,
            fontSize: 20,
            fontWeight: "800",
            paddingBottom: 12,
          }}
        >
          {t("Recent Activity")}
        </MotiText>
        {[...Array(7)].map((_, index) => (
          <EarningStackSkeleton
            isFirst={index === 0}
            isLast={index === 6}
            key={index}
          />
        ))}
      </MotiScrollView>
    </MotiView>
  );
}
