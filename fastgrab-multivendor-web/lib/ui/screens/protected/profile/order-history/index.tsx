"use client";
import { ORDERS } from "@/lib/api/graphql/queries/orders";
import {
  ActiveOrders,
  PastOrders,
} from "@/lib/ui/screen-components/protected/profile";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "@/lib/utils/constants/orders";
import { IOrder } from "@/lib/utils/interfaces/orders.interface";
import { useQuery } from "@apollo/client";

export default function OrderHistoryScreen() {
  const { data: ordersData, loading: isOrdersLoading } = useQuery(ORDERS, {
    fetchPolicy: "cache-and-network",
  });

  const activeOrders = ordersData?.orders?.filter((o: IOrder) =>
    ACTIVE_STATUS.includes(o.orderStatus)
  );
  const pastOrders = ordersData?.orders?.filter((o: IOrder) =>
    INACTIVE_STATUS.includes(o.orderStatus)
  );

  return (
    <div className="flex flex-col space-y-10 my-10">
      {/* Active Orders */}
      <ActiveOrders
        activeOrders={activeOrders}
        isOrdersLoading={isOrdersLoading}
      />
      {/* Past Orders  */}
      <PastOrders pastOrders={pastOrders} isOrdersLoading={isOrdersLoading} />
    </div>
  );
}
