// React Native Async Storage

// Expo
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Href, router } from "expo-router";

// Contexts
import { AuthContext } from "../context/global/auth.context";

// GraphQL
import {
  DEFAULT_RIDER_CREDS,
  RIDER_LOGIN,
} from "../api/graphql/mutation/login";

// Components
import { FlashMessageComponent } from "../ui/useable-components";

// Interfaces
import { IRiderLoginCompleteResponse } from "../utils/interfaces/auth.interface";

// Constants
import { ROUTES } from "../utils/constants";

// Hooks
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { setItem } from "../services/async-storage";

const useLogin = () => {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Hooks
  const { t } = useTranslation();

  // Context
  const { setTokenAsync } = useContext(AuthContext);

  // API
  const [login] = useMutation(RIDER_LOGIN, {
    onCompleted,
    onError,
  });

  useQuery(DEFAULT_RIDER_CREDS, { onCompleted, onError });

  // Handlers
  async function onCompleted({
    riderLogin,
    lastOrderCreds,
  }: IRiderLoginCompleteResponse) {
    setIsLoading(false);
    if (riderLogin) {
      //  await AsyncStorage.setItem("rider-id", riderLogin.userId);

      await setItem("rider-id", riderLogin.userId);

      await setTokenAsync(riderLogin.token);
      router.replace(ROUTES.home as Href);
    } else if (
      lastOrderCreds &&
      lastOrderCreds?.riderUsername &&
      lastOrderCreds?.riderPassword
    ) {
      setCreds({
        username: lastOrderCreds?.riderUsername,
        password: lastOrderCreds?.riderPassword,
      });
    }
  }
  function onError(err: ApolloError) {
    const error = err as ApolloError;

    setIsLoading(false);
    FlashMessageComponent({
      message:
        error?.graphQLErrors[0]?.message ??
        error?.networkError?.message ??
        t("Something went wrong"),
    });
  }
  const onLogin = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      // Get notification permissions
      const settings = await Notifications.getPermissionsAsync();
      let notificationPermissions = { ...settings };

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
      await login({
        variables: {
          username: username.toLowerCase(),
          password: password,
          notificationToken: notificationToken,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });
    } catch (err) {
      const error = err as ApolloError;
      // FlashMessageComponent({
      //   message:
      //     error?.graphQLErrors[0]?.message ??
      //     error?.networkError?.message ??
      //     t("Something went wrong"),
      // });
      console.log("login error", error);
    }
  };

  return {
    creds,
    onLogin,
    isLogging: isLoading,
  };
};
export default useLogin;
