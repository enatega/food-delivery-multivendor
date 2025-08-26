// Moti
import { MotiView } from "moti";

// Components
import WalletHeadingSkeleton from "./wallet-heading";
import WalletRecentTransactionSkeleton from "./wallet-recent-transactions";
import WalletTopInfoSkeleton from "./wallet-top-info";

// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";

export default function WalletScreenMainLoading() {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <MotiView
      className="flex flex-co justify-evenly h-full w-full"
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <WalletTopInfoSkeleton />
      <WalletHeadingSkeleton />
      <WalletRecentTransactionSkeleton />
    </MotiView>
  );
}
