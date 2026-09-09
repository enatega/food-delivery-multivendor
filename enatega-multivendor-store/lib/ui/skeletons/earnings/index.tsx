// Moti
import { MotiScrollView, MotiView } from "moti";

// Components
import EarningHeadingSkeleton from "./earning-heading";
import EarningStackSkeleton from "./earning-stack";
import EarningTopChartSkeleton from "./earning-top-chart";

// Hooks
import { useEarningsTheme } from "@/lib/ui/screen-components/earnings/theme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function EarningScreenMainLoading() {
  // Hooks
  const earningsTheme = useEarningsTheme();
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <MotiView style={{ backgroundColor: earningsTheme.canvas, flex: 1 }}>
      <MotiScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + 24,
          paddingHorizontal: 16,
          paddingTop: 10,
        }}
      >
        <EarningTopChartSkeleton />
        <EarningHeadingSkeleton />
        <MotiView>
          {[...Array(4)].map((_, index) => (
            <EarningStackSkeleton
              isFirst={index === 0}
              isLast={index === 3}
              key={index}
            />
          ))}
        </MotiView>
      </MotiScrollView>
    </MotiView>
  );
}
