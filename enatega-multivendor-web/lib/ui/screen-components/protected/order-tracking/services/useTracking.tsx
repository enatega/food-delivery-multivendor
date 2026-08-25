"use client";
import { useMemo } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import {
  ORDER_LIVE_TRACKING,
  ORDER_TRACKING,
} from "@/lib/api/graphql/queries/order-tracking";
import {
  SUBSCRIPTION_ORDER,
  SUBSCRIPTION_ORDER_TRACKING,
} from "@/lib/api/graphql/subscription";
import { isLiveDeliveryTrackingStatus } from "./tracking-status";

function useTracking({ orderId }: { orderId: string }) {
  const { data: orderTrackingDetails, loading } = useQuery(ORDER_TRACKING, {
    fetchPolicy: "cache-and-network",
    // Keep the last-known data on screen while a background refetch is in
    // flight instead of dropping back to a loading state on every update.
    notifyOnNetworkStatusChange: false,
    variables: {
      orderDetailsId: orderId,
    },
  });

  const { data: subscriptionData } = useSubscription(SUBSCRIPTION_ORDER, {
    variables: { id: orderId },
  });

  const currentStatus =
    subscriptionData?.subscriptionOrder?.orderStatus ||
    orderTrackingDetails?.orderDetails?.orderStatus;
  const isDeliveryOrder = !orderTrackingDetails?.orderDetails?.isPickedUp;
  const trackingEnabled =
    Boolean(orderId) &&
    isDeliveryOrder &&
    isLiveDeliveryTrackingStatus(currentStatus);

  const { data: initialTrackingData } = useQuery(ORDER_LIVE_TRACKING, {
    variables: { id: orderId },
    skip: !trackingEnabled,
    fetchPolicy: "network-only",
  });
  const { data: liveTrackingData } = useSubscription(
    SUBSCRIPTION_ORDER_TRACKING,
    {
      variables: { id: orderId },
      skip: !trackingEnabled,
    },
  );

  const trackingData = useMemo(
    () =>
      liveTrackingData?.subscriptionOrderTracking ||
      initialTrackingData?.orderTracking ||
      null,
    [initialTrackingData, liveTrackingData],
  );

  return {
    orderTrackingDetails: orderTrackingDetails?.orderDetails,
    // Only surface the loading state on the very first fetch (before we have
    // any data). Background refetches keep the previous data visible so the
    // screen updates in place instead of flashing a full reload.
    isOrderTrackingDetailsLoading:
      loading && !orderTrackingDetails?.orderDetails,
    subscriptionData: subscriptionData?.subscriptionOrder,
    trackingData,
  };
}

export default useTracking;
