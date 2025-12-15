"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ORDERS } from "@/lib/api/graphql/queries/orders";
import {
  ActiveOrders,
  PastOrders,
} from "@/lib/ui/screen-components/protected/profile";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "@/lib/utils/constants/orders";
import { IOrder } from "@/lib/utils/interfaces/orders.interface";

export default function OrderHistoryScreen() {
  const [page, setPage] = useState(1);
  const [allOrders, setAllOrders] = useState<IOrder[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const { data, loading, fetchMore, networkStatus } = useQuery(ORDERS, {
    variables: { page, limit },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  // Merge new orders & update hasMore
  useEffect(() => {
    if (data?.orders) {
      setAllOrders((prev) => {
        const newOrders = data.orders.filter(
          (order: IOrder) => !prev.some((p) => p._id === order._id)
        );
        return [...prev, ...newOrders];
      });

      if (data.orders.length < limit) {
        setHasMore(false);
      }
    }
  }, [data]);

  const activeOrders = allOrders.filter((o) =>
    ACTIVE_STATUS.includes(o.orderStatus)
  );
  const pastOrders = allOrders.filter((o) =>
    INACTIVE_STATUS.includes(o.orderStatus)
  );

  const loadMore = () => {
    if (!hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);

    fetchMore({
      variables: { page: nextPage, limit },
    });
  };

  return (
    <div className="flex flex-col space-y-10 my-10">
      {/* Active Orders */}
      <ActiveOrders
        activeOrders={activeOrders}
        isOrdersLoading={networkStatus === 1} // initial load only
      />

      {/* Past Orders */}
      <PastOrders
        pastOrders={pastOrders}
        isOrdersLoading={networkStatus === 1} // initial load only
      />

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-color dark:text-black text-white font-semibold rounded-full shadow-md hover:bg-primary-color transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
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
                <span>Loading orders </span>
              </>
            ) : (
              <span>Show more orders</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
