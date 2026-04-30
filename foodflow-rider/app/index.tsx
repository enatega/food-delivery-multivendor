// Expo
import * as Notifications from "expo-notifications";
import { Href, useRouter } from "expo-router";

// Core
import { useCallback, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

// Context
import { useLocationContext } from "@/lib/context/global/location.context";

// API
import { RIDER_ORDERS } from "@/lib/apollo/queries";

// Constant
import { RIDER_TOKEN, ROUTES } from "@/lib/utils/constants";

// Service
import setupApollo from "@/lib/apollo";

// Interfaces
import { IOrder } from "@/lib/utils/interfaces/order.interface";
import { useUserContext } from "@/lib/context/global/user.context";

function App() {
  const client = setupApollo();
  const router = useRouter();
  const { locationPermission } = useLocationContext();
  const { dataProfile } = useUserContext();
  // Handler

  const init = async () => {
    const token = await AsyncStorage.getItem(RIDER_TOKEN);
    if (token) {
      router.replace(ROUTES.home as Href);
      return;
    }
    router.replace(ROUTES.login as Href);
  };

  // Notification Handler
  const registerForPushNotification = async () => {
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
            shouldShowAlert: false, // Prevent the app from closing
            shouldPlaySound: false,
            shouldSetBadge: false,
          };
        },
      });
    }
  };

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
    []
  );

  // Use Effect
  useEffect(() => {
    const subscription =
      Notifications.addNotificationResponseReceivedListener(handleNotification);

    return () => subscription.remove();
  }, [handleNotification]);

  useEffect(() => {
    registerForPushNotification();

    // Register a notification handler that will be called when a notification is received.
    Notifications.setNotificationHandler({
      handleNotification: async () => {
        return {
          shouldShowAlert: false, // Prevent the app from closing
          shouldPlaySound: false,
          shouldSetBadge: false,
        };
      },
    });
  }, []);

  useEffect(() => {
    init();
  }, [locationPermission, router, dataProfile]);

  // return <Redirect href="/(tabs)/home/orders" />;
  // return <Redirect href="/login" />;
  return <></>;
}

export default App;
