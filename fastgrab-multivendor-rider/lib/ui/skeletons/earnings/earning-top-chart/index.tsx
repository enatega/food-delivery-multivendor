// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";

// Moti
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";

export default function EarningTopChartSkeleton() {
  // Hooks
  const { appTheme, currentTheme } = useApptheme();
  return (
    <MotiView
      className="h-[40%] flex flex-row w-[95%] p-2 justify-between items-end"
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <Skeleton width={60} height={80} colorMode={currentTheme ?? "light"} />
      <Skeleton width={60} height={170} colorMode={currentTheme ?? "light"} />
      <Skeleton width={60} height={190} colorMode={currentTheme ?? "light"} />
      <Skeleton width={60} height={30} colorMode={currentTheme ?? "light"} />
      <Skeleton width={60} height={80} colorMode={currentTheme ?? "light"} />
    </MotiView>
  );
}
