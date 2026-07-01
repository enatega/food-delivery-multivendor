import { useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// API
import { GET_ORDERS } from "@/lib/apollo/queries/orders";
import { SUBSCRIBE_PLACE_ORDER } from "@/lib/apollo/subscriptions";
import { IRestaurantProviderProps } from "@/lib/utils/interfaces";

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

  const { loading, error, data, subscribeToMore, refetch, networkStatus } =
    useQuery(GET_ORDERS, {
      fetchPolicy: "cache-and-network",
      pollInterval: 60000,
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
          const { restaurantOrders } = prev;
          const { origin, order } = subscriptionData.data.subscribePlaceOrder;
          if (origin === "new") {
            return {
              restaurantOrders: [order, ...restaurantOrders],
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
