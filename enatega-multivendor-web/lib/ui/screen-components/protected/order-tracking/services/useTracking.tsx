"use client";
import { useEffect } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { ORDER_TRACKING } from "@/lib/api/graphql/queries/order-tracking";
import { SUBSCRIPTION_ORDER } from "@/lib/api/graphql/subscription";

function useTracking({ orderId }: { orderId: string }) {
    const { data: orderTrackingDetails, loading: isOrderTrackingDetailsLoading, refetch } = useQuery(ORDER_TRACKING, {
        fetchPolicy: "cache-and-network",
        variables: {
            orderDetailsId: orderId
        }
    });

    // Subscribe to order updates
    const { data: subscriptionData } = useSubscription(SUBSCRIPTION_ORDER, {
        variables: { id: orderId },
        onSubscriptionData: ({ subscriptionData }) => {
            console.log("Order subscription data:", subscriptionData);
            // Refetch the order details when subscription data comes in
            if (subscriptionData.data) {
                refetch();
            }
        }
    });

    // Update the order tracking details when subscription data changes
    useEffect(() => {
        if (subscriptionData?.subscriptionOrder) {
            console.log("Subscription order data received:", subscriptionData.subscriptionOrder);
        }
    }, [subscriptionData]);

  return {
    orderTrackingDetails: orderTrackingDetails?.orderDetails,
    isOrderTrackingDetailsLoading,
    subscriptionData: subscriptionData?.subscriptionOrder,
  };
}

export default useTracking;
