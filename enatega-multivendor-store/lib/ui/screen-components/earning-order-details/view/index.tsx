// Contexts
import { useUserContext } from "@/lib/context/global/user.context";

// Interfaces
import { IStoreEarningsArray } from "@/lib/utils/interfaces/rider-earnings.interface";

// Components
import { NoRecordFound } from "@/lib/ui/useable-components";
import { FlatList, View } from "react-native";
import OrderStack from "../order-stack";

// Hooks
import { useApptheme } from "@/lib/context/theme.context";
import { useEffect, useState } from "react";

export default function EarningsOrderDetailsMain() {
  // States
  const [recentOrderEarnings, setRecentOrderEarnings] = useState<
    IStoreEarningsArray[]
  >([] as IStoreEarningsArray[]);

  // Hooks
  const { appTheme } = useApptheme();
  const { storeOrdersEarnings } = useUserContext();

  // UseEffects
  useEffect(() => {
    if (storeOrdersEarnings?.length) {
      const sortedOrderEarnings = [...storeOrdersEarnings].sort(
        (a, b) =>
          new Date(String(b?.date)).setHours(0, 0, 0, 0) -
          new Date(String(a?.date)).setHours(23, 59, 59, 999),
      );
      setRecentOrderEarnings(sortedOrderEarnings);
    }
  }, [storeOrdersEarnings?.length]);

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
              amount={info.item.totalOrderAmount}
              orderId={info.item.orderDetails.orderId}
              date={info.item.date}
            />
          );
        }}
      />
    </View>
  );
}
