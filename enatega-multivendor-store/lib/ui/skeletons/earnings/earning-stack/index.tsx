import { useEarningsTheme } from "@/lib/ui/screen-components/earnings/theme";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";

interface EarningStackSkeletonProps {
  isFirst?: boolean;
  isLast?: boolean;
}

export default function EarningStackSkeleton({
  isFirst = false,
  isLast = false,
}: EarningStackSkeletonProps) {
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
    <MotiView
      style={{
        alignItems: "center",
        backgroundColor: earningsTheme.surface,
        borderBottomColor: earningsTheme.divider,
        borderBottomLeftRadius: isLast ? 14 : 0,
        borderBottomRightRadius: isLast ? 14 : 0,
        borderBottomWidth: isLast ? 0 : 1,
        borderTopLeftRadius: isFirst ? 14 : 0,
        borderTopRightRadius: isFirst ? 14 : 0,
        flexDirection: "row",
        minHeight: 76,
        paddingHorizontal: 16,
        paddingVertical: 13,
      }}
    >
      <Skeleton height={42} radius={10} width={42} {...skeletonProps} />
      <MotiView style={{ flex: 1, gap: 8, marginStart: 10 }}>
        <Skeleton height={15} radius={5} width={122} {...skeletonProps} />
        <Skeleton height={12} radius={4} width={84} {...skeletonProps} />
      </MotiView>
      <MotiView style={{ alignItems: "flex-end", gap: 8 }}>
        <Skeleton height={15} radius={5} width={68} {...skeletonProps} />
        <Skeleton height={10} radius={4} width={18} {...skeletonProps} />
      </MotiView>
    </MotiView>
  );
}
