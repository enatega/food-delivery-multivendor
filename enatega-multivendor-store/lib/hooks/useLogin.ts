import { ApolloError, useMutation, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useContext, useState } from "react";

import { Href, router } from "expo-router";
import {
  DEFAULT_STORE_CREDS,
  STORE_LOGIN,
} from "../api/graphql/mutation/login";
import { AuthContext } from "../context/global/auth.context";
import { setItem } from "../services";
import { FlashMessageComponent } from "../ui/useable-components";
import { ROUTES } from "../utils/constants";
import { IStoreLoginCompleteResponse } from "../utils/interfaces/auth.interface";

const useLogin = () => {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Context
  const { setTokenAsync } = useContext(AuthContext);

  // API
  const [login, { data: storeLoginData }] = useMutation(STORE_LOGIN, {
    onCompleted,
    onError,
  });

  useQuery(DEFAULT_STORE_CREDS, { onCompleted, onError });

  // Handlers
  async function onCompleted({
    restaurantLogin,
    lastOrderCreds,
  }: IStoreLoginCompleteResponse) {
    setIsLoading(false);
    if (restaurantLogin) {
      await setItem("store-id", restaurantLogin?.restaurantId);
      await setTokenAsync(restaurantLogin?.token);
      router.replace(ROUTES.home as Href);
    } else if (
      lastOrderCreds &&
      lastOrderCreds?.restaurantUsername &&
      lastOrderCreds?.restaurantPassword
    ) {
      setCreds({
        username: lastOrderCreds?.restaurantUsername,
        password: lastOrderCreds?.restaurantPassword,
      });
    }
  }
  function onError(err: ApolloError) {
    console.log({ err });
    const error = err as ApolloError;
    setIsLoading(false);
    FlashMessageComponent({
      message:
        error?.graphQLErrors[0]?.message ??
        error?.networkError?.message ??
        "Something went wrong",
    });
  }
  const onLogin = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      // Get notification permisssions
      const settings = await Notifications.getPermissionsAsync();
      let notificationPermissions = { ...settings };
      console.log({ notificationPermissions, isDevice: Device.isDevice });

      // Request notification permissions if not granted or not provisional on iOS
      if (
        settings?.status !== "granted" ||
        settings.ios?.status !==
          Notifications.IosAuthorizationStatus.PROVISIONAL
      ) {
        notificationPermissions = await Notifications.requestPermissionsAsync({
          ios: {
            allowProvisional: true,
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            //   allowAnnouncements: true
          },
        });
      }

      let notificationToken = null;
      // Get notification token if permissions are granted and it's a device
      if (
        (notificationPermissions?.status === "granted" ||
          notificationPermissions.ios?.status ===
            Notifications.IosAuthorizationStatus.PROVISIONAL) &&
        Device.isDevice
      ) {
        notificationToken = (
          await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas.projectId,
          })
        ).data;
      }

      // Perform mutation with the obtained data
      const { data } = await login({
        variables: {
          username: username,
          password: password,
          notificationToken: notificationToken,
        },
      });
      if (
        storeLoginData.restaurantLogin?.restaurantId ||
        data.restaurantLogin?.restaurantId
      ) {
        await AsyncStorage.setItem(
          "store-id",
          data.restaurantLogin?.restaurantId ||
            storeLoginData.restaurantLogin?.restaurantId
        );
      }
    } catch (err) {
      const error = err as ApolloError;
      FlashMessageComponent({
        message:
          error?.graphQLErrors[0]?.message ??
          error?.networkError?.message ??
          "Something went wrong",
      });
    }
  };
  return {
    creds,
    onLogin,
    isLogging: isLoading,
  };
};
export default useLogin;
