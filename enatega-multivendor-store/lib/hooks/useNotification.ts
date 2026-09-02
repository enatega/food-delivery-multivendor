import { useLazyQuery, useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

// API
import { SAVE_TOKEN } from "@/lib/apollo/mutations/notification.mutation";
import { GET_RESTAURANT_BY_ID } from "@/lib/apollo/queries/store.query";
import { getStoreId } from "@/lib/services";
import { useStoreMode } from "@/lib/context/global/store-mode.context";

export default function useNotification() {
  const [storeLookupComplete, setStoreLookupComplete] = useState(false);
  const { mode, storeIdKey } = useStoreMode();
  const [getStore, { data }] = useLazyQuery(GET_RESTAURANT_BY_ID, {
    fetchPolicy: "cache-and-network",
    // variables: { id: userId },
  });
  const [sendTokenToBackend, { loading }] = useMutation(SAVE_TOKEN);

  // Handler
  const onGetStoreData = async () => {
    try {
      const userId = await getStoreId(storeIdKey);
      if (!userId) return;
      await getStore({
        variables: { id: userId },
      });
    } finally {
      setStoreLookupComplete(true);
    }
  };

  // Notification Handler
  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
      Alert.alert("Must use physical device for Push Notifications");
    }
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: "default",
        lightColor: "#FF231F7C",
      });
    }
  }

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
            shouldShowAlert: true, // ✅ show banner/alert
            shouldPlaySound: true, // ✅ play notification sound
            // shouldShowAlert: false, // Prevent the app from closing
            // shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowBanner: false,
            shouldShowList: false,
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
        if (typeof _id !== "string") return;
        const handledNotificationKey = `@enatega/store/${mode.toLowerCase()}/last-notification`;
        const lastNotificationHandledId = await AsyncStorage.getItem(
          handledNotificationKey,
        );
        if (lastNotificationHandledId === _id) return;
        await AsyncStorage.setItem(handledNotificationKey, _id);
      }
    },
    [mode],
  );

  // Use Effect
  useEffect(() => {
    const subscription =
      Notifications.addNotificationResponseReceivedListener(handleNotification);

    return () => subscription.remove();
  }, [handleNotification]);

  useEffect(() => {
    registerForPushNotification();
    registerForPushNotificationsAsync();
    onGetStoreData();
  }, [storeIdKey]);

  return {
    getPermission: Notifications.getPermissionsAsync,
    requestPermission: Notifications.requestPermissionsAsync,
    getExpoPushToken: Notifications.getExpoPushTokenAsync,
    getDevicePushToken: Notifications.getDevicePushTokenAsync,
    sendTokenToBackend,
    restaurantData: data,
    storeLookupComplete,
    savingToken: loading,
  };
}
