// Expo
import * as Notifications from "expo-notifications";
import { Href, Redirect, useRouter } from "expo-router";

// Core
import { useCallback, useContext, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

// Context
import { AuthContext } from "@/lib/context/global/auth.context";

// API
import { RIDER_ORDERS } from "@/lib/apollo/queries";

// Constant
import { ROUTES } from "@/lib/utils/constants";

// Apollo
import { useApolloClient } from "@apollo/client";

// Interfaces
import { IOrder } from "@/lib/utils/interfaces/order.interface";

function App() {
  const client = useApolloClient();
  const router = useRouter();
  const { token, isAuthReady } = useContext(AuthContext);

  // Notification Handler
  const registerForPushNotification = useCallback(async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === "granted") {
      Notifications.setNotificationHandler({
        handleNotification: async () => {
          return {
            shouldShowAlert: false,
            shouldPlaySound: false,
            shouldSetBadge: false,
          };
        },
      });
    }
  }, []);

  const handleNotification = useCallback(
    async (response: Notifications.NotificationResponse) => {
      if (
        response &&
        response.notification &&
        response.notification.request &&
        response.notification.request.content &&
        response.notification.request.content.data
      ) {
        const { _id } = response.notification.request.content.data;
        const { data } = await client.query({
          query: RIDER_ORDERS,
          fetchPolicy: "network-only",
        });
        const order = data.riderOrders.find((o: IOrder) => o._id === _id);
        const lastNotificationHandledId = await AsyncStorage.getItem(
          "@lastNotificationHandledId"
        );
        if (lastNotificationHandledId === _id) return;
        await AsyncStorage.setItem("@lastNotificationHandledId", _id);

        router.navigate("/order-detail");
        router.setParams({ itemId: _id, order });
      }
    },
    [client, router]
  );

  // Use Effect
  useEffect(() => {
    const subscription =
      Notifications.addNotificationResponseReceivedListener(handleNotification);

    return () => subscription.remove();
  }, [handleNotification]);

  useEffect(() => {
    registerForPushNotification();

    Notifications.setNotificationHandler({
      handleNotification: async () => {
        return {
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        };
      },
    });
  }, [registerForPushNotification]);

  if (!isAuthReady) {
    return <></>;
  }

  if (!token) {
    return <Redirect href={ROUTES.login as Href} />;
  }

  return <Redirect href={ROUTES.home as Href} />;
}

export default App;
