// React Native Async Storage

import { Href, router } from "expo-router";

// Contexts
import { AuthContext } from "../context/global/auth.context";

// GraphQL
import { RIDER_LOGIN } from "../api/graphql/mutation/login";

// Components
import { FlashMessageComponent } from "../ui/useable-components";

// Interfaces
import { IRiderLoginResponse } from "../utils/interfaces/auth.interface";

// Constants
import { ROUTES } from "../utils/constants";

// Hooks
import { ApolloError, useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { setSecureItem } from "../services/secure-storage";
import { useUserContext } from "../context/global/user.context";
import { getNotificationToken } from "../utils/methods/permission";
import { useRiderMode } from "../context/global/rider-mode.context";

const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Hooks
  const { t } = useTranslation();

  // Context
  const { setTokenAsync } = useContext(AuthContext);
  const { setUserId } = useUserContext();
  const { riderIdKey } = useRiderMode();

  // API
  const [login] = useMutation(RIDER_LOGIN, {
    onCompleted: onLoginCompleted,
    onError,
  });

  //  useQuery(DEFAULT_RIDER_CREDS, { onCompleted: onDefaultCredsCompleted });

  // Handlers
  // For login mutation
  async function onLoginCompleted({
    riderLogin,
  }: {
    riderLogin: IRiderLoginResponse;
  }) {
    setIsLoading(false);
    if (riderLogin) {
      // Persist the rider id first and the token last so the token remains the
      // commit marker for a complete session. Keep setUserId until after the
      // Apollo cache clear so profile/order queries cannot start too early.
      await setSecureItem(riderIdKey, riderLogin.userId);
      await setTokenAsync(riderLogin.token);
      setUserId(riderLogin.userId);
      router.replace(ROUTES.home as Href);
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
    onLogin,
    isLogging: isLoading,
  };
};
export default useLogin;
