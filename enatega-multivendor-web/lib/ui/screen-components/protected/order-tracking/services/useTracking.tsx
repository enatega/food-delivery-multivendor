"use client";
import { useRef } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { ORDER_TRACKING } from "@/lib/api/graphql/queries/order-tracking";
import { SUBSCRIPTION_ORDER } from "@/lib/api/graphql/subscription";

function useTracking({ orderId }: { orderId: string }) {
  const {
    data: orderTrackingDetails,
    loading,
    refetch,
  } = useQuery(ORDER_TRACKING, {
    fetchPolicy: "cache-and-network",
    // Keep the last-known data on screen while a background refetch is in
    // flight instead of dropping back to a loading state on every update.
    notifyOnNetworkStatusChange: false,
    variables: {
      orderDetailsId: orderId,
    },
  });

  // Track the last order status we've already synced a full refetch for, so
  // repeated subscription pushes for the same status don't trigger reloads.
  const lastSyncedStatusRef = useRef<string | null>(null);

  // Subscribe to order updates
  const { data: subscriptionData } = useSubscription(SUBSCRIPTION_ORDER, {
    variables: { id: orderId },
    onSubscriptionData: ({ subscriptionData }) => {
      const nextStatus =
        subscriptionData.data?.subscriptionOrder?.orderStatus ?? null;

      // Only pull fresh full-order details when the status actually changes.
      // Other subscription fields (rider, completionTime) are already merged
      // from the subscription payload on the screen, so no refetch is needed.
      if (nextStatus && nextStatus !== lastSyncedStatusRef.current) {
        lastSyncedStatusRef.current = nextStatus;
        refetch();
      }
    },
  });

  return {
    orderTrackingDetails: orderTrackingDetails?.orderDetails,
    // Only surface the loading state on the very first fetch (before we have
    // any data). Background refetches keep the previous data visible so the
    // screen updates in place instead of flashing a full reload.
    isOrderTrackingDetailsLoading:
      loading && !orderTrackingDetails?.orderDetails,
    subscriptionData: subscriptionData?.subscriptionOrder,
  };
}

export default useTracking;
