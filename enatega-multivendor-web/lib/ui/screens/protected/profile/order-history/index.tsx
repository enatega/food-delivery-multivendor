"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_USERS_ACTIVE_ORDERS,
  GET_USERS_PAST_ORDERS,
} from "@/lib/api/graphql/queries/orders";
import {
  ActiveOrders,
  PastOrders,
} from "@/lib/ui/screen-components/protected/profile";
import { IOrder } from "@/lib/utils/interfaces/orders.interface";
import { useTranslations } from "next-intl";

export default function OrderHistoryScreen() {
  const [page, setPage] = useState(1);
  const [activeOrders, setActiveOrders] = useState<IOrder[]>([]);
  const [pastOrders, setPastOrders] = useState<IOrder[]>([]);
  const [activeOrderhasMore, setActiveOrderHasMore] = useState(true);
  const [pastOrderhasMore, setPastOrderHasMore] = useState(true);
  const limit = 5;
  const t = useTranslations()

  // const { data, loading, fetchMore, networkStatus } = useQuery(ORDERS, {
  //   variables: { page, limit },
  //   fetchPolicy: "cache-and-network",
  //   notifyOnNetworkStatusChange: true,
  // });

  const { data:pastOrder, loading:pastOrderLoading, fetchMore:pastOrderFetchMore, networkStatus:pastOrderNetwork } = useQuery(
    GET_USERS_PAST_ORDERS,
    {
      variables: {
        page,
        limit,
        offset: 0,
      },
    }
  );

    const { data:activeOrder, loading:activeOrderLoading, fetchMore:activeOrderFetchMore, networkStatus:activeOrderNetwork } = useQuery(
    GET_USERS_ACTIVE_ORDERS,
    {
      variables: {
        page,
        limit,
        offset: 0,
      },
    }
  );

  // Merge new orders & update hasMore
  useEffect(() => {
    if (activeOrder?.getUsersActiveOrders || pastOrder?.getUsersPastOrders) {
      // setAllOrders((prev) => {
      //   const newOrders = data.orders.filter(
      //     (order: IOrder) => !prev.some((p) => p._id === order._id)
      //   );
      //   return [...prev, ...newOrders];
      // });
       setActiveOrders((prev) => {
        const newActiveOrders = activeOrder?.getUsersActiveOrders?.filter(
          (order: IOrder) => !prev.some((p) => p._id === order._id)
        ) ?? [];
        return [...prev, ...newActiveOrders];
      });

       setPastOrders((prev) => {
        const newPastOrders = pastOrder?.getUsersPastOrders?.filter(
          (order: IOrder) => !prev.some((p) => p._id === order._id)
        )?? [];
        return [...prev, ...newPastOrders];
      });


      if (activeOrder?.getUsersActiveOrders?.length < limit ) {
        setActiveOrderHasMore(false);
      }
      if (pastOrder?.getUsersPastOrders?.length < limit ) {
        setPastOrderHasMore(false);
      }
    }
  }, [activeOrder,pastOrder]);

  // const activeOrders = allOrders.filter((o) =>
  //   ACTIVE_STATUS.includes(o.orderStatus)
  // );
  // const pastOrders = allOrders.filter((o) =>
  //   INACTIVE_STATUS.includes(o.orderStatus)
  // );

  const loadMore = () => {
    if (!activeOrderhasMore && !pastOrderhasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);

    activeOrderFetchMore({
      variables: { page: nextPage, limit,offset: 0 },
    });
     pastOrderFetchMore({
      variables: { page: nextPage, limit,offset: 0 },
    });
  };

  return (
    <div className="flex flex-col space-y-10 my-10">
      {/* Active Orders */}
      <ActiveOrders
        activeOrders={activeOrders}
        isOrdersLoading={activeOrderNetwork === 1} // initial load only
      />

      {/* Past Orders */}
      <PastOrders
        pastOrders={pastOrders}
        isOrdersLoading={pastOrderNetwork === 1} // initial load only
      />

      {/* Load More Button */}
      {(activeOrderhasMore || pastOrderhasMore) && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={activeOrderLoading || pastOrderLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-color dark:text-black text-white font-semibold rounded-full shadow-md hover:bg-primary-color transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {activeOrderLoading || pastOrderLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 dark:text-black text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>{t("loading_orders")}</span>
              </>
            ) : (
              <span>{t("show_more_orders")}</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
