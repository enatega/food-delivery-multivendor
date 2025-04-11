// Contexts
import { useUserContext } from "@/lib/context/global/user.context";

// Interfaces
import { IRiderEarningsArray } from "@/lib/utils/interfaces/rider-earnings.interface";

// Core

// Components
import { useApptheme } from "@/lib/context/global/theme.context";
import { NoRecordFound } from "@/lib/ui/useable-components";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import OrderStack from "../order-stack";

export default function EarningsOrderDetailsMain() {
  // States
  const [recentOrderEarnings, setRecentOrderEarnings] = useState<
    IRiderEarningsArray[]
  >([] as IRiderEarningsArray[]);

  // Hooks
  const { appTheme } = useApptheme();
  const { riderOrderEarnings } = useUserContext();

  // UseEffects
  useEffect(() => {
    if (riderOrderEarnings?.length) {
      const sortedOrderEarnings = [...riderOrderEarnings].sort(
        (a, b) =>
          new Date(String(b?.date)).setHours(0, 0, 0, 0) -
          new Date(String(a?.date)).setHours(23, 59, 59, 999),
      );
      setRecentOrderEarnings(sortedOrderEarnings);
    }
  }, [riderOrderEarnings?.length]);

  if (!recentOrderEarnings.length) return <NoRecordFound />;
  return (
    <View style={{ backgroundColor: appTheme.themeBackground, height: "100%" }}>
      <FlatList
        data={recentOrderEarnings}
        contentContainerClassName="scroll-smooth"
        keyExtractor={(_, index) => index.toString()}
        style={{ height: "55%" }}
        ListEmptyComponent={<NoRecordFound />}
        renderItem={(info) => {
          return (
            <OrderStack
              isLast={info.index === recentOrderEarnings?.length - 1}
              key={info.index}
              amount={info.item.totalEarnings}
              orderId={info.item.orderDetails.orderId}
            />
          );
        }}
      />
    </View>
  );
}
