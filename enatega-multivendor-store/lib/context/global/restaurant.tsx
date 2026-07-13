import { useQuery } from "@apollo/client";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// API
import { GET_ORDERS } from "@/lib/apollo/queries/orders";
import { SUBSCRIBE_PLACE_ORDER } from "@/lib/apollo/subscriptions";
import { IRestaurantProviderProps } from "@/lib/utils/interfaces";
import { IOrder } from "@/lib/utils/interfaces/order.interface";

const Context = React.createContext({});

const Provider = ({ children }: IRestaurantProviderProps) => {
  const [printer, setPrinter] = useState();
  const [notificationToken, setNotificationToken] = useState<string | null>(
    null,
  );
  const unsubscribeRef = useRef<null | (() => void)>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subscribedRestaurantRef = useRef<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const printerStr = await AsyncStorage.getItem("printer");
        if (printerStr) setPrinter(JSON.parse(printerStr));
      } catch {
      }
    })();
  }, []);

  // No pollInterval: new orders and status changes arrive instantly over the
  // subscription (subscribePlaceOrder + per-order subscriptionOrder). The
  // initial fetch loads the list; realtime keeps it current. Pull-to-refresh
  // still calls refetch() manually.
  const { loading, error, data, subscribeToMore, refetch, networkStatus } =
    useQuery(GET_ORDERS, {
      fetchPolicy: "cache-and-network",
      onError: (queryError) => {
        console.log(
          `[STORE-SUB] initial orders query failed: ${queryError.message}`,
        );
      },
    });

  useEffect(() => {
    async function GetToken() {
      try {
        const result = await SecureStore.getItemAsync("notification-token");
        if (result) {
          setNotificationToken(JSON.parse(result));
        } else {
          setNotificationToken(null);
        }
      } catch {
      }
    }
    GetToken();
  }, []);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const cleanupSubscription = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    subscribedRestaurantRef.current = null;
  }, []);

  const subscribeToMoreOrders = useCallback(async (force = false) => {
    try {
      const restaurant = await AsyncStorage.getItem("store-id");
      if (!restaurant) {
        console.log("[STORE-SUB] store-id missing; subscription skipped");
        return;
      }

      if (
        !force &&
        unsubscribeRef.current &&
        subscribedRestaurantRef.current === restaurant
      ) {
        return;
      }

      clearRetryTimer();
      cleanupSubscription();

      unsubscribeRef.current = subscribeToMore({
        document: SUBSCRIBE_PLACE_ORDER,
        variables: { restaurant },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const restaurantOrders = prev?.restaurantOrders ?? [];
          const { origin, order } = subscriptionData.data.subscribePlaceOrder;
          console.log(
            `[STORE-SUB] subscribePlaceOrder origin=${origin} orderId=${order?._id} status=${order?.orderStatus}`,
          );
          if (origin === "new") {
            if (
              restaurantOrders?.findIndex(
                (o: IOrder) => o?._id === order?._id,
              ) > -1
            )
              return prev;
            return {
              restaurantOrders: [order, ...restaurantOrders],
            };
          } else if (origin === "update") {
            const orderIndex = restaurantOrders.findIndex(
              (o: IOrder) => o?._id === order?._id,
            );
            // Not in the list yet (e.g. the initial "new" event was missed
            // during a socket reconnect) — add it so the store self-heals.
            if (orderIndex < 0) {
              return {
                restaurantOrders: [order, ...restaurantOrders],
              };
            }
            const updatedOrders = [...restaurantOrders];
            updatedOrders[orderIndex] = order;
            return {
              restaurantOrders: updatedOrders,
            };
          }
          return prev;
        },
        onError: (subscriptionError) => {
          console.log(
            `[STORE-SUB] subscription failed: ${subscriptionError.message}`,
          );
          cleanupSubscription();
          clearRetryTimer();
          retryTimerRef.current = setTimeout(() => {
            refetch().catch(() => {});
            void subscribeToMoreOrders(true);
          }, 1500);
        },
      });
      subscribedRestaurantRef.current = restaurant;
      console.log(`[STORE-SUB] subscribed restaurant=${restaurant}`);
    } catch {
      cleanupSubscription();
    }
  }, [cleanupSubscription, clearRetryTimer, refetch, subscribeToMore]);

  useEffect(() => {
    void subscribeToMoreOrders();
    return () => {
      clearRetryTimer();
      cleanupSubscription();
    };
  }, [cleanupSubscription, clearRetryTimer, subscribeToMoreOrders]);

  return (
    <Context.Provider
      value={{
        loading,
        error,
        data,
        subscribeToMoreOrders,
        refetch,
        networkStatus,
        printer,
        setPrinter,
        notificationToken,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useRestaurantContext = () => useContext(Context);
export default { Context, Provider };
