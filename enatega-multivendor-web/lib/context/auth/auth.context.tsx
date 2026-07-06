"use client";

// Hooks
import useToast from "@/lib/hooks/useToast";
import { useTranslations } from "next-intl";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

// Context
import { useConfig } from "../configuration/configuration.context";

// GQL
import {
  CREATE_USER,
  EMAIL_EXISTS,
  FORGOT_PASSWORD,
  GET_USER_PROFILE,
  LOGIN,
  PHONE_EXISTS,
  RESET_PASSWORD,
  RESET_PASSWORD_WITH_TOKEN,
  SENT_OTP_TO_EMAIL,
  SENT_OTP_TO_PHONE,
} from "@/lib/api/graphql";

// Interface & Types
import {
  IAuthContextProps,
  IAuthFormData,
  ICreateUserArguments,
  ICreateUserData,
  ICreateUserResponse,
  IEmailExistsResponse,
  ILoginProfile,
  ILoginProfileResponse,
  IPhoneExistsResponse,
  ISendOtpToEmailResponse,
  ISendOtpToPhoneResponse,
  IUserLoginArguments,
} from "@/lib/utils/interfaces";

// Apollo
import { ApolloError, useLazyQuery, useMutation } from "@apollo/client";

// Google API
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";
import {
  hasValidAuthToken,
  invalidateClientSession,
  setAuthTokens,
} from "@/lib/utils/methods/auth";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";

const AuthContext = createContext({} as IAuthContextProps);
const SOCIAL_AUTH_MESSAGES = {
  missingToken:
    "Your social sign-in did not return a valid token. Please try again.",
  invalidToken:
    "Your social sign-in token is invalid or expired. Please sign in again.",
  notConfigured:
    "Social login is not configured right now. Please use email and password.",
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  // States
  const [activePanel, setActivePanel] = useState(0);
  const [authToken, setAuthToken] = useState("");
  const [user, setUser] = useState<ILoginProfile | null>(null);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [otp, setOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [refetchProfileData, setRefetchProfileData] = useState(false);

  // Hooks
  const {
    GOOGLE_CLIENT_ID,
    SKIP_EMAIL_VERIFICATION,
    SKIP_MOBILE_VERIFICATION,
    TEST_OTP,
  } = useConfig();
  const { showToast } = useToast();
  const t = useTranslations();
  const router = useRouter();

  // Mutations
  const [checkEmailExistsMutation] = useMutation<
    IEmailExistsResponse,
    undefined | { email: string }
  >(EMAIL_EXISTS);
  const [checkPhoneExistsMutation] = useMutation<
    IPhoneExistsResponse,
    undefined | { phone: string }
  >(PHONE_EXISTS);
  const [mutateLogin] = useMutation<
    ILoginProfileResponse,
    undefined | IUserLoginArguments
  >(LOGIN, { onCompleted: onLoginCompleted, onError: onLoginError });
  const [sendOtpToPhone] =
    useMutation<ISendOtpToPhoneResponse>(SENT_OTP_TO_PHONE);
  const [sendOtpToEmail] =
    useMutation<ISendOtpToEmailResponse>(SENT_OTP_TO_EMAIL);
  const [createUser] = useMutation<
    ICreateUserResponse,
    undefined | ICreateUserArguments
  >(CREATE_USER);
  const [mutateForgotPassword] = useMutation<
    { forgotPassword: { result: boolean } },
    undefined | { email: string }
  >(FORGOT_PASSWORD);
  const [mutateResetPassword] = useMutation<
    { resetPassword: { result: boolean } },
    undefined | { password: string; email: string }
  >(RESET_PASSWORD);
  const [mutateResetPasswordWithToken] = useMutation<
    { resetPassword: { result: boolean } },
    undefined | { password: string; email: string; token: string }
  >(RESET_PASSWORD_WITH_TOKEN);

  // Checkers
  const checkEmailExists = useCallback(async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const emailResponse = await checkEmailExistsMutation({
        variables: { email: email },
      });
      return Boolean(emailResponse.data?.emailExist);
    } catch (err) {
      const error = err as ApolloError;
      console.error("Error while checking email:", error);
      showToast({
        type: "error",
        title: t("email_check_error"),
        message: error.cause?.message || t("error_checking_email"),
        duration: 3000
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [checkEmailExistsMutation, showToast, t]);

  const checkPhoneExists = useCallback(async (phone: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const resp = await checkPhoneExistsMutation({ variables: { phone } });
      const exists = Boolean(resp.data?.phoneExist);

      // if (exists) {
      // showToast({
      //   type: "error",
      //   title: t("phone_check_error"),
      //   message: t("phone_already_registered"), // fix punctuation in translations file
      //   sticky: true,
      // });
      //}
      return exists; // true = already registered, false = not registered
    } catch (err) {
      const error = err as ApolloError;
      console.error("Error while checking phone:", error);

      showToast({
        type: "error",
        title: t("phone_check_error"),
        message: error.cause?.message || t("error_checking_phone"),
        duration: 3000
      });

      // Safer fallback: treat as "exists" so the flow stops on error
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [checkPhoneExistsMutation, showToast, t]);
  // handlers

  const handlePasswordReset = useCallback(async (
    password: string,
    email: string,
    token?: string,
    setFormData?: Dispatch<SetStateAction<IAuthFormData>>
  ) => {
    try {
      setIsLoading(true);
      const resetPasswordResponse = token
        ? await mutateResetPasswordWithToken({
            variables: { password, email, token },
          })
        : await mutateResetPassword({
            variables: { password, email },
          });
      if (resetPasswordResponse?.data?.resetPassword?.result === true) {
        showToast({
          type: "success",
          title: t("password_reset"),
          message: t("password_reset_success"),
        });
        setFormData?.({} as IAuthFormData);
        setActivePanel(0);
        // setIsAuthModalVisible(false);
      }
    } catch (err) {
      const error = err as ApolloError;
      console.error("Error while resetting password:", error);
      showToast({
        type: "error",
        title: t("password_reset_error"),
        message: error.cause?.message || t("error_resetting_password"),
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  }, [mutateResetPassword, mutateResetPasswordWithToken, showToast, t]);

  const handleForgotPassword = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      await mutateForgotPassword({
        variables: { email: email.trim().toLowerCase() },
      });
      showToast({
        type: "success",
        title: t("please_check_your_inbox_message"),
        message: t("reset_password_email_sent_generic_message"),
      });
    } catch (err) {
      const error = err as ApolloError;
      console.error("Error while requesting password reset:", error);
      showToast({
        type: "error",
        title: t("password_reset_error"),
        message: error.cause?.message || t("error_resetting_password"),
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [mutateForgotPassword, showToast, t]);

  const handleUserLogin = useCallback(async (user: IUserLoginArguments) => {
    try {
      setIsLoading(true);
      if (
        (user.type === "google" || user.type === "apple") &&
        !user.idToken
      ) {
        showToast({
          type: "error",
          title: t("login_error"),
          message: SOCIAL_AUTH_MESSAGES.missingToken,
        });
        return;
      }
      const userResponse = await mutateLogin({
        variables: { ...user },
      });

      const { data } = userResponse;
      setAuthTokens({
        userId: data?.login.userId,
        token: data?.login.token,
        tokenExpiration: data?.login.tokenExpiration,
        userType: 'USER',
      });
      setAuthToken(data?.login.token ?? "");

      return data;
    } catch (err) {
      const error = err as ApolloError;
      console.error(
        "An error occured while performing login of type:",
        user.type,
        "ERROR:",
        error
      );
      showToast({
        type: "error",
        title: t("login_error"),
        message: getLoginErrorMessage(error, user.type),
        // sticky: true,
      });
    } finally {
      setIsLoading(false);
      setRefetchProfileData(true);
    }
  }, [mutateLogin, router, setAuthToken, showToast, t]);

  const handleCreateUser = useCallback(async (
    user: ICreateUserArguments
  ): Promise<ICreateUserData> => {
    try {
      setIsLoading(true);
      const userData = await createUser({
        variables: {
          ...user,
          isPhoneExists: user.isPhoneExists,
        },
      });
      if (userData.data?.createUser && userData.data.createUser.userId) {
        setAuthTokens({
          userId: userData.data.createUser.userId,
          token: userData.data.createUser.token,
          tokenExpiration: userData.data.createUser.tokenExpiration,
          userType: 'USER',
        });
        setAuthToken(userData.data.createUser.token ?? "");
        const {
          userId,
          email,
          emailIsVerified,
          phoneIsVerified,
          name,
          phone,
          token,
          isNewUser,
          picture,
          userTypeId,
        } = userData.data.createUser;
        setUser(() => ({
          userId,
          email,
          emailIsVerified,
          phoneIsVerified,
          name,
          phone,
          token,
          isNewUser,
          picture,
          userTypeId,
        }));
        showToast({
          type: "success",
          title: t("create_user_label"),
          message: t("registration_success"),
        });
        setAuthTokens({
          userId: userData.data.createUser.userId,
          token: userData.data.createUser.token,
          tokenExpiration: userData.data.createUser.tokenExpiration,
          userType: 'USER',
        });
        return userData.data.createUser as ICreateUserData;
      } else {
        return {} as ICreateUserData;
      }
    } catch (err) {
      const error = err as ApolloError;
      console.error("An error occured while creating the user", error);
      showToast({
        type: "error",
        title: t("create_user_label"),
        message: t("phone_number_already_associated_with_different_account"),
        duration: 3000
      });
      return {} as ICreateUserData;
    } finally {
      setIsLoading(false);
      setRefetchProfileData(true);
    }
  }, [createUser, showToast, t]);
  const [fetchProfile] = useLazyQuery(GET_USER_PROFILE, {
    fetchPolicy: "cache-and-network",
  });
  // GQL Handlers
  async function onLoginCompleted(data: ILoginProfileResponse) {
    try {
      setUser(data.login);

      setAuthTokens({
        userId: data?.login?.userId,
        token: data?.login?.token,
        tokenExpiration: data?.login?.tokenExpiration,
        userType: 'USER',
      });
      setAuthToken(data?.login?.token ?? "");
      await fetchProfile();
      if (!data.login.emailIsVerified) {
        setActivePanel(5);
      } else if (!data.login.phoneIsVerified) {
        setActivePanel(4);
      } else {
        if (data.login?.phoneIsVerified && data.login?.emailIsVerified) {
          setActivePanel(0);
          setIsAuthModalVisible(false);
          showToast({
            type: "success",
            title: t("login_success"),
            message: t("login_success_message"),
          });
        } else {
          setActivePanel(4);
        }
        router.push("/");
      }
    } catch (err) {
      const error = err as ApolloError;
      console.error("Error while logging in:", error);
      showToast({
        type: "error",
        title: t("login_error"),
        message: t("invalid_credentials"),
      });
    }
  }

  function onLoginError(error: ApolloError) {
    console.error("Error while logging in:", error);
    showToast({
      type: "error",
      title: t("login_error"),
      message: getLoginErrorMessage(error),
    });
  }

  const getLoginErrorMessage = useCallback((error: ApolloError, loginType?: string) => {
    const rawMessage =
      error.graphQLErrors[0]?.message ||
      error.networkError?.message ||
      error.message;
    const normalizedMessage = rawMessage.toLowerCase();

    if (
      normalizedMessage.includes("not configured") ||
      normalizedMessage.includes("not supported") ||
      normalizedMessage.includes("social login is not configured")
    ) {
      return SOCIAL_AUTH_MESSAGES.notConfigured;
    }

    if (
      normalizedMessage.includes("idtoken") ||
      normalizedMessage.includes("identity token") ||
      normalizedMessage.includes("missing token")
    ) {
      return SOCIAL_AUTH_MESSAGES.missingToken;
    }

    if (
      (loginType === "google" || loginType === "apple") &&
      (normalizedMessage.includes("invalid token") ||
        normalizedMessage.includes("expired token") ||
        normalizedMessage.includes("jwt") ||
        normalizedMessage.includes("token"))
    ) {
      return SOCIAL_AUTH_MESSAGES.invalidToken;
    }

    if (
      normalizedMessage.includes("invalid token") ||
      normalizedMessage.includes("expired token")
    ) {
      return SOCIAL_AUTH_MESSAGES.invalidToken;
    }

    return rawMessage || t("invalid_credentials");
  }, [t]);

  // OTP Handlers
  const sendOtpToEmailAddress = useCallback(async (email: string, type?: string) => {
    try {
      setIsLoading(true);
      if (SKIP_EMAIL_VERIFICATION) {
        setOtp(TEST_OTP);
        if (type && type !== "password-recovery") {
          setActivePanel(5);
        }
        return;
      } else {
        const otpResponse = await sendOtpToEmail({
          variables: { email: email },
        });
        if (otpResponse.data?.sendOtpToEmail?.result) {
          if (type && type !== "password-recovery") {
            setActivePanel(3);
          }
          showToast({
            type: "info",
            title: t("email_verification_label"),
            message: t("please_enter_valid_otp_code_message"),
          });
          return;
        } else {
          showToast({
            type: "error",
            title: t("Error Sending OTP"),
            message: t("An error occurred while sending the OTP"),
            duration: 3000
          });
          return;
        }
      }
    } catch (err) {
      const error = err as ApolloError;
      console.error("Error while sending OTP to email:", error);
      showToast({
        type: "error",
        title: t("email_otp_error"),
        message: error.cause?.message || t("error_sending_otp_to_email"),
       duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  }, [SKIP_EMAIL_VERIFICATION, TEST_OTP, sendOtpToEmail, setActivePanel, setOtp, showToast, t]);

  const sendOtpToPhoneNumber = useCallback(async (phone: string) => {
    try {
      setIsLoading(true);
      if (SKIP_MOBILE_VERIFICATION) {
        setOtp(TEST_OTP);
        setActivePanel(6);
        return;
      } else {
        const otpResponse = await sendOtpToPhone({
          variables: { phone: phone },
        });
        if (!otpResponse.data?.sendOtpToPhoneNumber?.result) {
          showToast({
            type: "error",
            title: t("error_sending_otp"),
            message: t("error_sending_otp_message"),
            duration: 3000
          });
          return;
        } else {
          showToast({
            type: "info",
            title: t("phone_verification_label"),
            message: t(
              `${t("otp_sent_phone_verify_number")} ${phone} ${t("please_verify_your_phone_number")}`
            ),
          });
          setActivePanel(6);
        }
      }
    } catch (err) {
      const error = err as ApolloError;
      console.error("Error while sending OTP to phone:", error);
      showToast({
        type: "error",
        title: t("phone_otp_error"),
        message: error.cause?.message || t("error_sending_otp_to_phone"),
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  }, [SKIP_MOBILE_VERIFICATION, TEST_OTP, sendOtpToPhone, setActivePanel, setOtp, showToast, t]);

  // Use Effects
  useEffect(() => {
    if (typeof window === "undefined") return; // ⛔ Prevent SSR execution

    if (hasValidAuthToken()) {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }
      return;
    }

    invalidateClientSession();
    setAuthToken("");
  }, []);

  useEffect(() => {
    if (typeof user?.token !== "undefined" && !!user?.token) {
      onUseLocalStorage("save", "userToken", user.token);
    }
    if (typeof user?.addresses !== "undefined" && !!user?.addresses) {
      onUseLocalStorage("save", "userAddress", JSON.stringify(user.addresses));
    }
  }, [user]);

  const contextValue = useMemo(
    () => ({
      authToken,
      setAuthToken,
      user,
      setUser,
      checkEmailExists,
      checkPhoneExists,
      handleUserLogin,
      activePanel,
      setActivePanel,
      isAuthModalVisible,
      setIsAuthModalVisible,
      otp,
      setOtp,
      sendOtpToEmailAddress,
      sendOtpToPhoneNumber,
      handleForgotPassword,
      handleCreateUser,
      setIsLoading,
      isLoading,
      isRegistering,
      setIsRegistering,
      refetchProfileData,
      setRefetchProfileData,
      handlePasswordReset,
    }),
    [
      authToken,
      setAuthToken,
      user,
      setUser,
      checkEmailExists,
      checkPhoneExists,
      handleUserLogin,
      activePanel,
      setActivePanel,
      isAuthModalVisible,
      setIsAuthModalVisible,
      otp,
      setOtp,
      sendOtpToEmailAddress,
      sendOtpToPhoneNumber,
      handleForgotPassword,
      handleCreateUser,
      setIsLoading,
      isLoading,
      isRegistering,
      setIsRegistering,
      refetchProfileData,
      setRefetchProfileData,
      handlePasswordReset,
    ]
  );

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID ?? "not_found"}>
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export const useAuth = () => useContext(AuthContext);
