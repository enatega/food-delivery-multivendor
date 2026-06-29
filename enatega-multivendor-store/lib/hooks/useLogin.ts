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

  function getLoginErrorMessage(error: ApolloError): string {
    const graphQLError = error?.graphQLErrors?.[0];
    const rawMessage =
      graphQLError?.message ??
      error?.networkError?.message ??
      error?.message ??
      "";
    const normalizedMessage = rawMessage.toLowerCase();
    const errorCode = graphQLError?.extensions?.code;

    if (
      errorCode === "TOO_MANY_REQUESTS" ||
      errorCode === "RATE_LIMITED" ||
      normalizedMessage.includes("rate limit") ||
      normalizedMessage.includes("too many request") ||
      normalizedMessage.includes("too many attempt")
    ) {
      return rawMessage;
    }

    return "Invalid credentials";
  }

  // Handlers
  async function onCompleted({
    restaurantLogin,
    lastOrderCreds,
  }: IStoreLoginCompleteResponse) {
    console.log("🚀 ~ onCompleted called with:", { restaurantLogin, lastOrderCreds });
    
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
    console.log("🚀 ~ onError called with:", { err });
    setIsLoading(false);
    FlashMessageComponent({
      message: getLoginErrorMessage(err),
    });
  }

  const onLogin = async (username: string, password: string) => {
    console.log("🚀 ~ onLogin called with:", { username, password: "***" });
    
    try {
      setIsLoading(true);

      // Validate inputs
      if (!username || !password) {
        throw new Error("Username and password are required");
      }

      // Get notification permissions
      const settings = await Notifications.getPermissionsAsync();
      let notificationPermissions = { ...settings };
      console.log("🚀 ~ Notification permissions:", { notificationPermissions, isDevice: Device.isDevice });

      // Request notification permissions if not granted or not provisional on iOS
      if (
        settings?.status !== "granted" ||
        (settings.ios && settings.ios?.status !== Notifications.IosAuthorizationStatus.PROVISIONAL)
      ) {
        console.log("🚀 ~ Requesting notification permissions...");
        notificationPermissions = await Notifications.requestPermissionsAsync({
          ios: {
            allowProvisional: true,
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        console.log("🚀 ~ New notification permissions:", notificationPermissions);
      }

      let notificationToken = null;
      
      // Get notification token if permissions are granted and it's a device
      if (
        (notificationPermissions?.status === "granted" ||
          (notificationPermissions.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL)) &&
        Device.isDevice
      ) {
        try {
          console.log("🚀 ~ Getting push token...");
          const projectId = Constants.expoConfig?.extra?.eas?.projectId;
          console.log("🚀 ~ Project ID:", projectId);
          
          if (projectId) {
            // const tokenResult = await Notifications.getExpoPushTokenAsync({
            //   projectId: projectId,
            // });
            const tokenResult =  (await Notifications.getDevicePushTokenAsync());
            notificationToken = tokenResult.data;
            console.log("🚀 ~ Got push token:", notificationToken);
          } else {
            console.warn("🚀 ~ No project ID found, skipping push token");
          }
        } catch (tokenError) {
          console.warn("🚀 ~ Failed to get push token:", tokenError);
          // Continue without token - don't fail the login
        }
      }

      console.log("🚀 ~ Performing login mutation...");
      
      // Perform mutation with the obtained data
      const { data } = await login({
        variables: {
          username: username,
          password: password,
          notificationToken: notificationToken,
        },
      });

      console.log("🚀 ~ Login mutation result:", data);

      // FIX: Check data first, then storeLoginData
      const restaurantId = data?.restaurantLogin?.restaurantId || storeLoginData?.restaurantLogin?.restaurantId;
      
      if (restaurantId) {
        await AsyncStorage.setItem("store-id", restaurantId);
        console.log("🚀 ~ Stored restaurant ID:", restaurantId);
      }

    } catch (err) {
      console.error("🚀 ~ Login error:", err);
      setIsLoading(false);
      
      const error = err as ApolloError;
      FlashMessageComponent({
        message: getLoginErrorMessage(error),
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
