// Contexts
import { useUserContext } from "@/lib/context/global/user.context";

// Interfaces
import { IStoreEarningsArray } from "@/lib/utils/interfaces/rider-earnings.interface";

// Components
import { NoRecordFound } from "@/lib/ui/useable-components";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
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
  const tabBarHeight = useBottomTabBarHeight();

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

  const renderOrderItem = ({
    item,
    index,
  }: {
    item: IStoreEarningsArray;
    index: number;
  }) => (
    <OrderStack
      isLast={index === recentOrderEarnings.length - 1}
      amount={item.totalOrderAmount}
      orderId={item.orderDetails.orderId}
      date={item.date}
    />
  );

  if (!recentOrderEarnings.length) return <NoRecordFound />;
  return (
    <View style={{ backgroundColor: appTheme.themeBackground, flex: 1 }}>
      <FlatList
        data={recentOrderEarnings}
        contentContainerClassName="scroll-smooth"
        contentContainerStyle={{ paddingBottom: tabBarHeight + 24 }}
        keyExtractor={(item, index) =>
          `${item.orderDetails.orderId}-${item.date}-${index}`
        }
        ListEmptyComponent={<NoRecordFound />}
        renderItem={({ item, index }) => renderOrderItem({ item, index })}
      />
    </View>
  );
}
