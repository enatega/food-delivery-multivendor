import { ApolloError, useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useContext, useState } from "react";

import { Href, router } from "expo-router";
import { STORE_LOGIN } from "../api/graphql/mutation/login";
import { AuthContext } from "../context/global/auth.context";
import { setItem } from "../services";
import { FlashMessageComponent } from "../ui/useable-components";
import { ROUTES } from "../utils/constants";
import { IStoreLoginCompleteResponse } from "../utils/interfaces/auth.interface";

const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Context
  const { setTokenAsync } = useContext(AuthContext);

  // API
  const [login, { data: storeLoginData }] = useMutation(STORE_LOGIN, {
    onCompleted,
    onError,
    fetchPolicy: "no-cache",
  });

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

    if (
      errorCode === "UNAUTHENTICATED" ||
      normalizedMessage.includes("invalid credential") ||
      normalizedMessage.includes("invalid credentials") ||
      normalizedMessage.includes("invalid username") ||
      normalizedMessage.includes("invalid password") ||
      normalizedMessage.includes("incorrect password") ||
      normalizedMessage.includes("user not found")
    ) {
      return "Invalid credentials";
    }

    return rawMessage || "Login failed";
  }

  // Handlers
  async function onCompleted({
    restaurantLogin,
  }: IStoreLoginCompleteResponse) {
    setIsLoading(false);

    if (restaurantLogin) {
      await setItem("store-id", restaurantLogin?.restaurantId);
      await setTokenAsync(restaurantLogin?.token);
      router.replace(ROUTES.home as Href);
    }
  }

  function onError(err: ApolloError) {
    setIsLoading(false);
    FlashMessageComponent({
      message: getLoginErrorMessage(err),
    });
  }

  const onLogin = async (username: string, password: string) => {
    try {
      setIsLoading(true);

      // Validate inputs
      if (!username || !password) {
        throw new Error("Username and password are required");
      }

      // Get notification permissions
      const settings = await Notifications.getPermissionsAsync();
      let notificationPermissions = { ...settings };

      // Request notification permissions if not granted or not provisional on iOS
      if (
        settings?.status !== "granted" ||
        (settings.ios && settings.ios?.status !== Notifications.IosAuthorizationStatus.PROVISIONAL)
      ) {
        notificationPermissions = await Notifications.requestPermissionsAsync({
          ios: {
            allowProvisional: true,
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
      }

      let notificationToken = null;
      
      // Get notification token if permissions are granted and it's a device
      if (
        (notificationPermissions?.status === "granted" ||
          (notificationPermissions.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL)) &&
        Device.isDevice
      ) {
        try {
          const projectId = Constants.expoConfig?.extra?.eas?.projectId;

          if (projectId) {
            // const tokenResult = await Notifications.getExpoPushTokenAsync({
            //   projectId: projectId,
            // });
            const tokenResult =  (await Notifications.getDevicePushTokenAsync());
            notificationToken = tokenResult.data;
          }
        } catch (tokenError) {
          // Continue without token - don't fail the login
        }
      }

      // Perform mutation with the obtained data
      const { data } = await login({
        variables: {
          username: username,
          password: password,
          notificationToken: notificationToken,
        },
        context: {
          headers: {
            authorization: "",
          },
        },
      });

      // FIX: Check data first, then storeLoginData
      const restaurantId = data?.restaurantLogin?.restaurantId || storeLoginData?.restaurantLogin?.restaurantId;

      if (restaurantId) {
        await AsyncStorage.setItem("store-id", restaurantId);
      }

    } catch (err) {
      setIsLoading(false);

      const error = err as ApolloError;
      FlashMessageComponent({
        message: getLoginErrorMessage(error),
      });
    }
  };

  return {
    onLogin,
    isLogging: isLoading,
  };
};

export default useLogin;
