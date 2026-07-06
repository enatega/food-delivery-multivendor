// React Native Async Storage

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
import {
  IRiderDefaultCredsResponse,
  IRiderLoginResponse,
} from "../utils/interfaces/auth.interface";

// Constants
import { ROUTES } from "../utils/constants";

// Hooks
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { setItem } from "../services/async-storage";
import { getNotificationToken } from "../utils/methods/permission";

const useLogin = () => {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Hooks
  const { t } = useTranslation();

  // Context
  const { setTokenAsync } = useContext(AuthContext);

  // API
  const [login] = useMutation(RIDER_LOGIN, {
    onCompleted: onLoginCompleted,
    onError,
  });

  useQuery(DEFAULT_RIDER_CREDS, { onCompleted: onDefaultCredsCompleted });

  // Handlers
  // For login mutation
async function onLoginCompleted({ riderLogin }: { riderLogin: IRiderLoginResponse }) {
  setIsLoading(false);
  if (riderLogin) {
    // Store the token (and clear the Apollo cache) before the rider-id, since
    // writing rider-id un-skips the profile/orders queries. Doing it in this
    // order avoids clearStore() cancelling those queries mid-flight, which
    // left assignedOrders stuck at [] until the app was restarted.
    await setTokenAsync(riderLogin.token);
    await setItem("rider-id", riderLogin.userId);
    router.replace(ROUTES.home as Href);
  }
}

// For default credentials query
function onDefaultCredsCompleted({ lastOrderCreds }: { lastOrderCreds: IRiderDefaultCredsResponse }) {
  // Only prefill the username; never fetch or auto-fill the password.
  if (lastOrderCreds?.riderUsername) {
    setCreds({
      username: lastOrderCreds.riderUsername,
      password: "",
    });
  }
}

  function onError(err: ApolloError) {
    const error = err as ApolloError;
    setIsLoading(false);
    // Show a uniform credential error instead of the backend's message so the UI
    // can't distinguish "user not found" from "wrong password" (enumeration).
    const message = error?.graphQLErrors?.length
      ? t("Invalid username or password")
      : error?.networkError
        ? t("Unable to connect. Please try again.")
        : t("Something went wrong");
    FlashMessageComponent({ message });
  }
  
  const onLogin = async (username: string, password: string) => {
    try {
      setIsLoading(true);

      const notificationToken = await getNotificationToken();
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      await login({
        variables: {
          username: username.toLowerCase(),
          password,
          notificationToken,
          timeZone,
        },
      });
    } catch {
      FlashMessageComponent({ message: t("Something went wrong") });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    creds,
    onLogin,
    isLogging: isLoading,
  };
};
export default useLogin;
