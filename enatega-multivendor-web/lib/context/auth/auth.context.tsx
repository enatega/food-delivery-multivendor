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
  useEffect,
  useState,
} from "react";

// Context
import { useConfig } from "../configuration/configuration.context";

// GQL
import {
  CREATE_USER,
  EMAIL_EXISTS,
  GET_USER_PROFILE,
  LOGIN,
  PHONE_EXISTS,
  RESET_PASSWORD,
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
  IEmailExists,
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
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";

const AuthContext = createContext({} as IAuthContextProps);

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
  const [mutateEmailCheck] = useMutation<
    IEmailExistsResponse,
    undefined | { email: string }
  >(EMAIL_EXISTS);
  const [mutatePhoneCheck] = useMutation<
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
  const [mutateResetPassword] = useMutation<
    { resetPassword: { result: boolean } },
    undefined | { password: string; email: string }
  >(RESET_PASSWORD);

  // Checkers
  async function checkEmailExists(email: string): Promise<IEmailExists> {
    try {
      setIsLoading(true);
      const emailResponse = await mutateEmailCheck({
        variables: { email: email },
      });
      return emailResponse.data?.emailExist || ({} as IEmailExists);
    } catch (err) {
      const error = err as ApolloError;
      console.error("Error while checking email:", error);
      showToast({
        type: "error",
        title: t("email_check_error"),
        message: error.cause?.message || t("error_checking_email"),
        sticky: true,
      });
      return {} as IEmailExists;
    } finally {
      setIsLoading(false);
    }
  }

  async function checkPhoneExists(phone: string): Promise<boolean> {
    try {
      setIsLoading(true);

      const resp = await mutatePhoneCheck({ variables: { phone } });
      const exists = Boolean(resp.data?.phoneExist?._id);

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
        sticky: true,
      });

      // Safer fallback: treat as "exists" so the flow stops on error
      return true;
    } finally {
      setIsLoading(false);
    }
  }
  // handlers

  const handlePasswordReset = async (
    password: string,
    email: string,
    setFormData: Dispatch<SetStateAction<IAuthFormData>>
  ) => {
    try {
      setIsLoading(true);
      const resetPasswordResponse = await mutateResetPassword({
        variables: { password, email },
      });
      if (resetPasswordResponse?.data?.resetPassword?.result === true) {
        showToast({
          type: "success",
          title: t("password_reset"),
          message: t("password_reset_success"),
        });
        setFormData({} as IAuthFormData);
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
        sticky: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserLogin = async (user: IUserLoginArguments) => {
    try {
      setIsLoading(true);
      const userResponse = await mutateLogin({
        variables: { ...user },
      });

      const { data } = userResponse;
      localStorage.setItem("userId", data?.login.userId ?? "");
      localStorage.setItem("token", data?.login.token ?? "");

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
        message: t("invalid_credentials"),
        // sticky: true,
      });
    } finally {
      setIsLoading(false);
      setRefetchProfileData(true);
    }
  };

  const handleCreateUser = async (
    user: ICreateUserArguments
  ): Promise<ICreateUserData> => {
    try {
      setIsLoading(true);
      const userData = await createUser({
        variables: {
          ...user,
          isReset: user.isReset,
        },
      });
      if (userData.data?.createUser && userData.data.createUser.userId) {
        localStorage.setItem("token", userData.data.createUser.token);
        localStorage.setItem("userId", userData.data.createUser.userId);
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
        localStorage.setItem("token", userData.data.createUser.token);
        localStorage.setItem("userId", userData.data.createUser.userId);
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
        sticky: true,
      });
      return {} as ICreateUserData;
    } finally {
      setIsLoading(false);
      setRefetchProfileData(true);
    }
  };
  const [fetchProfile] = useLazyQuery(GET_USER_PROFILE, {
    fetchPolicy: "network-only",
  });
  // GQL Handlers
  async function onLoginCompleted(data: ILoginProfileResponse) {
    try {
      setUser(data.login);

      localStorage.setItem("token", data?.login?.token ?? "");
      localStorage.setItem("userId", data?.login?.userId ?? "");
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
    if (
      error.message
    ) {
      showToast({
        type: "error",
        title: t("login_error"),
        message: error.message,
      });
    } else {
      showToast({
        type: "error",
        title: t("login_error"),
        message: t("invalid_credentials"),
      });
    }
  }

  // OTP Handlers
  async function sendOtpToEmailAddress(email: string, type?: string) {
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
            sticky: true,
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
        sticky: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function sendOtpToPhoneNumber(phone: string) {
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
            sticky: true,
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
        sticky: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Use Effects
  useEffect(() => {
    if (typeof window === "undefined") return; // ⛔ Prevent SSR execution

    // Local Vars
    const token = localStorage.getItem("token");

    if (token) {
      setAuthToken(token);
    }
  }, [user]);

  useEffect(() => {
    if (typeof user?.token !== "undefined" && !!user?.token) {
      onUseLocalStorage("save", "userToken", user.token);
    }
    if (typeof user?.addresses !== "undefined" && !!user?.addresses) {
      onUseLocalStorage("save", "userAddress", JSON.stringify(user.addresses));
    }
  }, [user]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID ?? "not_found"}>
      <AuthContext.Provider
        value={{
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
          handleCreateUser,
          setIsLoading,
          isLoading,
          isRegistering,
          setIsRegistering,
          refetchProfileData,
          setRefetchProfileData,
          handlePasswordReset,
        }}
      >
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export const useAuth = () => useContext(AuthContext);
