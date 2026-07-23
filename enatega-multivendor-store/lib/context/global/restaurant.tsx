import {
  ApolloError,
  ApolloQueryResult,
  NetworkStatus,
  useQuery,
} from "@apollo/client";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// API
import { GET_ORDERS } from "@/lib/apollo/queries/orders";
import { SUBSCRIBE_PLACE_ORDER } from "@/lib/apollo/subscriptions";
import { IRestaurantProviderProps } from "@/lib/utils/interfaces";
import { IOrder } from "@/lib/utils/interfaces/order.interface";

interface Printer {
  name?: string;
  url?: string;
  deviceName?: string;
  macAddress?: string;
}

interface RestaurantOrdersData {
  restaurantOrders: IOrder[];
}

interface IRestaurantContext {
  loading: boolean;
  error?: ApolloError;
  data?: RestaurantOrdersData;
  subscribeToMoreOrders: (force?: boolean) => Promise<void>;
  refetch: () => Promise<ApolloQueryResult<RestaurantOrdersData>>;
  networkStatus: NetworkStatus;
  printer: Printer | null;
  setPrinter: Dispatch<SetStateAction<Printer | null>>;
  notificationToken: string | null;
}

const Context = React.createContext<IRestaurantContext>(
  {} as IRestaurantContext,
);

const Provider = ({ children }: IRestaurantProviderProps) => {
  const [printer, setPrinter] = useState<Printer | null>(null);
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
        // Ignore invalid cached printer data.
      }
    })();
  }, []);

  // No pollInterval: new orders and status changes arrive instantly over the
  // subscription (subscribePlaceOrder + per-order subscriptionOrder). The
  // initial fetch loads the list; realtime keeps it current. Pull-to-refresh
  // still calls refetch() manually.
  const { loading, error, data, subscribeToMore, refetch, networkStatus } =
    useQuery<RestaurantOrdersData>(GET_ORDERS, {
      fetchPolicy: "cache-and-network",
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
        setNotificationToken(null);
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

  const subscribeToMoreOrders = useCallback(
    async (force = false) => {
      try {
        const restaurant = await AsyncStorage.getItem("store-id");
        if (!restaurant) {
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

        unsubscribeRef.current = subscribeToMore<{
          subscribePlaceOrder: { origin: string; order: IOrder };
        }>({
          document: SUBSCRIBE_PLACE_ORDER,
          variables: { restaurant },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const restaurantOrders = prev?.restaurantOrders ?? [];
            const { origin, order } = subscriptionData.data.subscribePlaceOrder;
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
          onError: () => {
            cleanupSubscription();
            clearRetryTimer();
            retryTimerRef.current = setTimeout(() => {
              refetch().catch(() => {});
              void subscribeToMoreOrders(true);
            }, 1500);
          },
        });
        subscribedRestaurantRef.current = restaurant;
      } catch {
        cleanupSubscription();
      }
    },
    [cleanupSubscription, clearRetryTimer, refetch, subscribeToMore],
  );

  useEffect(() => {
    void subscribeToMoreOrders();
    return () => {
      clearRetryTimer();
      cleanupSubscription();
    };
  }, [cleanupSubscription, clearRetryTimer, subscribeToMoreOrders]);

  const value = useMemo<IRestaurantContext>(
    () => ({
      loading,
      error,
      data,
      subscribeToMoreOrders,
      refetch,
      networkStatus,
      printer,
      setPrinter,
      notificationToken,
    }),
    [
      data,
      error,
      loading,
      networkStatus,
      notificationToken,
      printer,
      refetch,
      subscribeToMoreOrders,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useRestaurantContext = () => useContext(Context);
export default { Context, Provider };
