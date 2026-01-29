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
import { IRiderDefaultCredsResponse, IRiderLoginCompleteResponse, IRiderLoginResponse } from "../utils/interfaces/auth.interface";

// Constants
import { ROUTES } from "../utils/constants";

// Hooks
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { setItem } from "../services/async-storage";
import { getNotificationToken } from "../utils/methods/permission";
import { REAPPLY_RIDER } from "../apollo/mutations/rider.mutation";

interface RejectionError {
  isRejected: boolean;
  email: string;
}

const useLogin = () => {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rejectionError, setRejectionError] = useState<RejectionError | null>(null);

  // Hooks
  const { t } = useTranslation();

  // Context
  const { setTokenAsync } = useContext(AuthContext);

  // API
  const [login] = useMutation(RIDER_LOGIN, {
    onCompleted: onLoginCompleted,
    onError,
  });

  const [reapplyRider, { loading: reapplyLoading }] = useMutation(REAPPLY_RIDER, {
    onCompleted: onReapplyCompleted,
    onError: onReapplyError,
  });

  useQuery(DEFAULT_RIDER_CREDS, { onCompleted: onDefaultCredsCompleted });

  // Handlers
  // For login mutation
async function onLoginCompleted({ riderLogin }: { riderLogin: IRiderLoginResponse }) {
  setIsLoading(false);
  if (riderLogin) {
    console.log("riderLogin", riderLogin);
    await setItem("rider-id", riderLogin.userId);
    await setTokenAsync(riderLogin.token);
    router.replace(ROUTES.home as Href);
  } 
}

// For default credentials query
function onDefaultCredsCompleted({ lastOrderCreds }: { lastOrderCreds: IRiderDefaultCredsResponse }) {
  if (lastOrderCreds?.riderUsername && lastOrderCreds?.riderPassword) {
    console.log("lastOrderCreds", lastOrderCreds);
    setCreds({
      username: lastOrderCreds.riderUsername,
      password: lastOrderCreds.riderPassword,
    });
  }
}

  function onError(err: ApolloError) {
    const error = err as ApolloError;
    setIsLoading(false);
    
    // Check if error is about application rejection
    const errorMessage = error?.graphQLErrors[0]?.message || "";
    if (errorMessage.includes("Application rejected for")) {
      // Extract email from error message
      const emailMatch = errorMessage.match(/Application rejected for (.+)/);
      const email = emailMatch ? emailMatch[1].trim() : "";
      
      setRejectionError({
        isRejected: true,
        email,
      });
    } else {
      FlashMessageComponent({
        message:
          error?.graphQLErrors[0]?.message ??
          error?.networkError?.message ??
          t("Something went wrong"),
      });
    }
  }

  function onReapplyCompleted(data: any) {
    FlashMessageComponent({
      message: t("Your application has been resubmitted successfully"),
      type: "success",
    });
    setRejectionError(null);
  }

  function onReapplyError(err: ApolloError) {
    FlashMessageComponent({
      message: err?.graphQLErrors[0]?.message ?? t("Failed to reapply. Please try again."),
    });
  }
  
  const onLogin = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setRejectionError(null); // Clear any previous rejection errors

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
    } catch (err) {
      const error = err as ApolloError;
      console.log("Login error:", error);
      // Error is handled in onError callback
    } finally {
      setIsLoading(false);
    }
  };

  const onReapply = async (email: string) => {
    try {
      await reapplyRider({
        variables: {
          email,
        },
      });
    } catch (err) {
      console.log("Reapply error:", err);
    }
  };

  const clearRejectionError = () => {
    setRejectionError(null);
  };

  return {
    creds,
    onLogin,
    isLogging: isLoading,
    rejectionError,
    onReapply,
    clearRejectionError,
    reapplyLoading,
  };
};
export default useLogin;
