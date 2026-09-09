import { useEarningsTheme } from "@/lib/ui/screen-components/earnings/theme";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";

export default function EarningTopChartSkeleton() {
  const earningsTheme = useEarningsTheme();
  const skeletonProps = {
    backgroundColor: earningsTheme.skeletonBase,
    colors: [
      earningsTheme.skeletonBase,
      earningsTheme.skeletonHighlight,
      earningsTheme.skeletonBase,
    ],
  };

  return (
    <MotiView style={{ gap: 18 }}>
      <MotiView
        style={{
          alignItems: "center",
          backgroundColor: earningsTheme.surfaceRaised,
          borderRadius: 14,
          flexDirection: "row",
          justifyContent: "space-between",
          minHeight: 130,
          paddingHorizontal: 20,
          paddingVertical: 22,
        }}
      >
        <MotiView style={{ flex: 1, gap: 11 }}>
          <Skeleton height={15} radius={5} width={104} {...skeletonProps} />
          <Skeleton height={32} radius={7} width={162} {...skeletonProps} />
        </MotiView>
        <Skeleton height={54} radius={12} width={54} {...skeletonProps} />
      </MotiView>

      <MotiView
        style={{
          backgroundColor: earningsTheme.surface,
          borderRadius: 14,
          minHeight: 278,
          paddingBottom: 18,
          paddingHorizontal: 16,
          paddingTop: 16,
        }}
      >
        <MotiView
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Skeleton height={20} radius={6} width={148} {...skeletonProps} />
          <Skeleton height={34} radius={10} width={100} {...skeletonProps} />
        </MotiView>
        <MotiView
          style={{
            alignItems: "flex-end",
            flexDirection: "row",
            flex: 1,
            gap: 18,
            justifyContent: "space-around",
            paddingHorizontal: 12,
            paddingTop: 30,
          }}
        >
          {[72, 118, 54, 146].map((height, index) => (
            <MotiView key={height} style={{ alignItems: "center", gap: 9 }}>
              <Skeleton
                height={height}
                radius={6}
                width={30}
                {...skeletonProps}
              />
              <Skeleton
                height={10}
                radius={4}
                width={34 + index * 2}
                {...skeletonProps}
              />
            </MotiView>
          ))}
        </MotiView>
      </MotiView>
    </MotiView>
  );
}
