// Hooks
import { useApptheme } from "@/lib/context/theme.context";

// Moti
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
export default function WalletTopInfoSkeleton() {
  // Hooks
  const { appTheme, currentTheme } = useApptheme();
  return (
    <MotiView
      transition={{
        type: "timing",
      }}
      className="w-full  items-center justify-center gap-4 p-12"
      animate={{ backgroundColor: appTheme.themeBackground }}
    >
      <Skeleton colorMode={currentTheme ?? "light"} width={170} />
      <Skeleton colorMode={currentTheme ?? "light"} width={250} />
      <Skeleton
        colorMode={currentTheme ?? "light"}
        width={320}
        height={50}
        radius={100}
      />
    </MotiView>
  );
}
