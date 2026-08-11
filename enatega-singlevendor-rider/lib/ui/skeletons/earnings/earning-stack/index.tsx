// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";

// Moti
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";

export default function EarningStackSkeleton() {
  // Hooks
  const { appTheme, currentTheme } = useApptheme();
  return (
    <MotiView
      className="flex flex-row justify-between items-center p-4 w-[95%] mx-auto my-2  border-b-2 w"
      style={{ borderBottomColor: appTheme.borderLineColor }}
    >
      <MotiView className="flex flex-row gap-2 items-center flex-2">
        <Skeleton width={70} height={30} colorMode={currentTheme ?? "light"} />
        <Skeleton width={70} height={30} colorMode={currentTheme ?? "light"} />
      </MotiView>
      <MotiView>
        <Skeleton width={40} height={30} colorMode={currentTheme ?? "light"} />
      </MotiView>
    </MotiView>
  );
}
