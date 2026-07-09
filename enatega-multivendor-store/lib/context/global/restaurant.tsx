import { useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";

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
      onError: () => {},
    });

  let unsubscribe = null;

  useEffect(() => {
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    subscribeToMoreOrders();
  }, []);

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

  const subscribeToMoreOrders = async () => {
    try {
      const restaurant = await AsyncStorage.getItem("store-id");
      if (!restaurant) return;
      unsubscribe = subscribeToMore({
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
        onError: () => {},
      });
    } catch {
    }
  };

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
