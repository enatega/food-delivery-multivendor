import { useContext, useMemo, useState } from "react";
// Context
import RestaurantProvider from "@/lib/context/global/restaurant";
// Interface
import { IOrder } from "@/lib/utils/interfaces/order.interface";
import { ORDER_DISPATCH_TYPE } from "../utils/constants";

export default function useOrders() {
  const [currentTab, setCurrentTab] = useState<string>(ORDER_DISPATCH_TYPE[0]);

  const { loading, error, data, refetch, networkStatus } = useContext(
    RestaurantProvider.Context,
  );
  const activeOrders = useMemo(
    () =>
      data?.restaurantOrders?.filter(
        (order: IOrder) => order?.orderStatus === "PENDING",
      ) ?? [],
    [data?.restaurantOrders],
  );

  const processingOrders = useMemo(
    () =>
      data?.restaurantOrders?.filter((order: IOrder) =>
        ["ACCEPTED", "ASSIGNED", "PICKED"].includes(order?.orderStatus ?? ""),
      ) ?? [],
    [data?.restaurantOrders],
  );

  const deliveredOrders = useMemo(
    () =>
      data?.restaurantOrders?.filter(
        (order: IOrder) => order?.orderStatus === "DELIVERED",
      ) ?? [],
    [data?.restaurantOrders],
  );

  const hasNewOrders = useMemo(
    () => activeOrders.some((order: IOrder) => Boolean(order?.isRinged)),
    [activeOrders],
  );
  const ringedOrderIds = useMemo(
    () =>
      activeOrders
        .filter((order: IOrder) => Boolean(order?.isRinged))
        .map((order: IOrder) => order?._id)
        .sort()
        .join(","),
    [activeOrders],
  );

  return {
    loading,
    error,
    data,
    refetch,
    networkStatus,
    hasNewOrders,
    ringedOrderIds,
    activeOrders,
    processingOrders,
    deliveredOrders,
    currentTab,
    setCurrentTab,
  };
}
