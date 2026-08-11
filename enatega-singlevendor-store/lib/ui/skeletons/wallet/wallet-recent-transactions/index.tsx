// Hooks
import { useApptheme } from "@/lib/context/theme.context";

// Moti
import { MotiScrollView, MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
export default function WalletRecentTransactionSkeleton() {
  for (let i = 0; i < 20; i++) {
    return (
      <MotiScrollView>
        {[...Array(8)].map((_, index) => {
          return <SkeletonComp key={index} />;
        })}
      </MotiScrollView>
    );
  }
}

function SkeletonComp() {
  const { appTheme, currentTheme } = useApptheme();
  return (
    <MotiView
      transition={{
        type: "timing",
      }}
      className="w-full flex flex-row items-center justify-between px-5"
      animate={{ backgroundColor: appTheme.themeBackground }}
    >
      <MotiView className="flex flex-row gap-2 items-center my-2">
        <Skeleton colorMode={currentTheme ?? "light"} width={20} radius={12} />
        <MotiView className="flex flex-col gap-2">
          <Skeleton
            colorMode={currentTheme ?? "light"}
            width={200}
            radius={12}
          />
          <Skeleton
            colorMode={currentTheme ?? "light"}
            width={200}
            radius={12}
          />
        </MotiView>
      </MotiView>
      <Skeleton colorMode={currentTheme ?? "light"} width={50} radius={12} />
    </MotiView>
  );
}
