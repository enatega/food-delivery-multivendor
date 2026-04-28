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
      } catch (error) {
        console.error("Error fetching printer data from AsyncStorage:", error);
      }
    })();
  }, []);

  const { loading, error, data, subscribeToMore, refetch, networkStatus } =
    useQuery(GET_ORDERS, {
      fetchPolicy: "network-only",
      pollInterval: 5000,
      onError: (error) => {
        console.log("GraphQL Query Error:", error);
      },
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
      } catch (error) {
        console.error(
          "Error fetching notification token from SecureStore:",
          error,
        );
      }
    }
    GetToken();
  }, []);

  const subscribeToMoreOrders = async () => {
    try {
      const restaurant = await AsyncStorage.getItem("restaurantId");
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
        onError: (error) => {
          console.error("Subscription Error:", error);
        },
      });
    } catch (error) {
      console.error("Error in subscribeToMoreOrders:", error);
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
