import { useState, useContext } from "react";
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
  const activeOrders: IOrder[] =
    data &&
    data?.restaurantOrders?.filter(
      (order: IOrder) => order?.orderStatus === "PENDING",
    );

  const processingOrders: IOrder[] =
    data &&
    data?.restaurantOrders?.filter((order: IOrder) =>
      ["ACCEPTED", "ASSIGNED", "PICKED"].includes(order?.orderStatus ?? ""),
    );

  const deliveredOrders: IOrder[] =
    data &&
    data?.restaurantOrders?.filter(
      (order: IOrder) => order?.orderStatus === "DELIVERED",
    );

  const hasNewOrders = activeOrders?.length > 0;

  return {
    loading,
    error,
    data,
    refetch,
    networkStatus,
    hasNewOrders,
    activeOrders,
    processingOrders,
    deliveredOrders,
    currentTab,
    setCurrentTab,
  };
}
