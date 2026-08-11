// Moti
import { MotiScrollView, MotiView } from "moti";

// Components
import EarningStackSkeleton from "../earnings/earning-stack";
import EarningSummaryHeader from "./earnings-summary-header";

// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";

export default function EarningsSummaryMainLoading() {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <MotiView style={{ backgroundColor: appTheme.screenBackground }}>
      <EarningSummaryHeader />
      <MotiScrollView>
        {[...Array(10)].map((_, index) => {
          return <EarningStackSkeleton key={index} />;
        })}
      </MotiScrollView>
    </MotiView>
  );
}
