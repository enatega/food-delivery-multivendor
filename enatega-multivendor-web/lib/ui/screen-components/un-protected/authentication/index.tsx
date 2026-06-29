"use client";
// Interfaces
import {
  IAuthFormData,
  IAuthModalProps,
  ILoginProfile,
} from "@/lib/utils/interfaces";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import { useEffect, useRef, useState } from "react";
// import { useTranslations } from "next-intl";

//Prime React
import { Dialog } from "primereact/dialog";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";

// Components
import { useConfig } from "@/lib/context/configuration/configuration.context";
import useToast from "@/lib/hooks/useToast";
import EmailVerification from "./email-verification";
import EnterPassword from "./enter-password";
import LoginWithEmail from "./login-with-email";
import LoginWithGoogle from "./login-with-google";
import PhoneVerification from "./phone-verification";
import SaveEmailAddress from "./save-email-address";
import SavePhoneNumber from "./save-phone-number";
import SignUpWithEmail from "./signup-with-email";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ChangePassword from "./change-password";
import VerificationEmailForChangePassword from "./change-password/email-otp";
import { Tooltip } from "react-tooltip";
import { useTranslations } from "next-intl";

export default function AuthModal({
  isAuthModalVisible,
  handleModalToggle,
}: IAuthModalProps) {
  // States
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [formData, setFormData] = useState<IAuthFormData>({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (!isAuthModalVisible) {
      setFormData({
        email: "",
        password: "",
        name: "",
        phone: "",
      });
    }
  }, [isAuthModalVisible]);
  // get the RTL direction
  const direction =
    typeof document !== "undefined"
      ? document.documentElement.getAttribute("dir") || "ltr"
      : "ltr";

  // Refs
  const authenticationPanelRef = useRef(null);

  // Hooks
  const {
    handleUserLogin,
    activePanel,
    setActivePanel,
    setUser,
    setIsAuthModalVisible,
    setIsLoading,
    sendOtpToEmailAddress,
  } = useAuth();
  const { showToast } = useToast();
  const t = useTranslations();
  const {
    GOOGLE_CLIENT_ID,
    SKIP_EMAIL_VERIFICATION,
    SKIP_MOBILE_VERIFICATION,
  } = useConfig();

  // Login With Google
  const googleLogin = async () => {
    try {
      setIsLoading(true);
      const idToken = await getGoogleIdToken();
      const userData = await getGoogleUserInfo(idToken);

      const userLoginResponse = await handleUserLogin({
        type: "google",
        email: userData.email,
        idToken,
        name: userData.name,
        notificationToken: "",
      });

      if (userLoginResponse) {
        setUser(userLoginResponse.login as ILoginProfile);
        if (
          !userLoginResponse.login.emailIsVerified &&
          SKIP_EMAIL_VERIFICATION
        ) {
          setActivePanel(5);
        } else if (
          !userLoginResponse.login.phoneIsVerified &&
          !SKIP_MOBILE_VERIFICATION
        ) {
          setActivePanel(4);
        } else {
          setActivePanel(0);
          setIsAuthModalVisible(false);

          // showToast({
          //   type: "success",
          //   title: t("login_success"),
          //   message: t("login_success_message"),
          // });
        }
        setIsLoading(false);
        console.log("userLoginResponse", userLoginResponse);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Google sign-in failed. Please try again.";
      showToast({
        type: "error",
        title: t("login_error"),
        message,
      });
      setIsLoading(false);
    }
  };

  const getGoogleIdToken = () =>
    new Promise<string>((resolve, reject) => {
      const google = (window as Window & { google?: unknown }).google as
        | {
            accounts?: {
              id?: {
                cancel: () => void;
                initialize: (options: Record<string, unknown>) => void;
                prompt: (
                  listener?: (notification: {
                    isNotDisplayed?: () => boolean;
                    isSkippedMoment?: () => boolean;
                  }) => void,
                ) => void;
              };
            };
          }
        | undefined;

      if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "not_found") {
        reject(
          new Error(
            "Social login is not configured right now. Please use email and password.",
          ),
        );
        return;
      }

      if (!google?.accounts?.id) {
        reject(
          new Error(
            "Social login is not configured right now. Please use email and password.",
          ),
        );
        return;
      }

      const googleAccountsId = google.accounts.id;

      let isSettled = false;
      const resolveOnce = (credential?: string) => {
        if (isSettled) return;
        isSettled = true;
        googleAccountsId.cancel();
        if (credential) {
          resolve(credential);
          return;
        }
        reject(
          new Error(
            "Your social sign-in did not return a valid token. Please try again.",
          ),
        );
      };

      const rejectOnce = (message: string) => {
        if (isSettled) return;
        isSettled = true;
        googleAccountsId.cancel();
        reject(new Error(message));
      };

      googleAccountsId.initialize({
        client_id: GOOGLE_CLIENT_ID,
        ux_mode: "popup",
        callback: (response: { credential?: string }) =>
          resolveOnce(response?.credential),
      });

      googleAccountsId.prompt((notification) => {
        if (notification?.isNotDisplayed?.()) {
          rejectOnce(
            "Social login is not configured right now. Please use email and password.",
          );
          return;
        }

        if (notification?.isSkippedMoment?.()) {
          rejectOnce("Google sign-in was cancelled. Please try again.");
        }
      });
    });

  const getGoogleUserInfo = async (idToken: string) => {
    const [, payload] = idToken.split(".");
    if (!payload) {
      throw new Error(
        "Your social sign-in token is invalid or expired. Please sign in again.",
      );
    }

    try {
      const normalizedPayload = payload
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(Math.ceil(payload.length / 4) * 4, "=");
      const decodedPayload = JSON.parse(atob(normalizedPayload));
      return {
        email: decodedPayload.email ?? "",
        name: decodedPayload.name ?? "",
      };
    } catch {
      throw new Error(
        "Your social sign-in token is invalid or expired. Please sign in again.",
      );
    }
  };

  // Handlers
  const handleChangePanel = (index: number) => {
    setActivePanel(index);
  };

  const handleFormChange = (name: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleResendEmailOtp = () => {
    sendOtpToEmailAddress(formData?.email || "", "password-recovery");
  };

  const handleSubmitAfterVerification = () => {
    setActivePanel(9);
    // setIsAuthModalVisible(false);
    showToast({
      type: "success",
      title: t("password_recovery_label"),
      message: t("update_your_password_now_message"),
    });
  };

  return (
    <Dialog
      contentClassName="dark:bg-gray-900 dark:text-gray-300"
      headerClassName="dark:bg-gray-900 dark:text-gray-300"
      visible={isAuthModalVisible}
      closeIcon
      onHide={handleModalToggle}
      closable={activePanel <= 3}
      className={`auth-dialog ${[3, 4, 5, 6].includes(activePanel) ? "wide" : "narrow"}`}
      contentStyle={{
        padding: "22px",
        borderRadius: "12px",
      }}
      headerStyle={{
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        height: "fit-content",
      }}
      closeOnEscape={activePanel <= 3}
      showHeader={false}
    >
      {/* close icon to close the modal */}
      <button
        onClick={handleModalToggle}
        className={` ${direction === "rtl" ? "left-0" : "right-0"} tooltip tooltip-left absolute top-3  z-10 transition-all duration-300 rounded-full p-2 dark:text-gray-300`}
        data-tip="Close"
        data-tooltip-id="close-auth-modal"
        data-tooltip-content="Close"
      >
        <FontAwesomeIcon
          size="sm"
          icon={faXmark}
          className="text-black dark:text-gray-300"
          width={30}
          height={30}
        />
        <Tooltip id="close-auth-modal" />
      </button>

      <Stepper ref={authenticationPanelRef} activeStep={activePanel}>
        <StepperPanel>
          <LoginWithGoogle
            googleLogin={googleLogin}
            handleChangePanel={handleChangePanel}
            handleFormChange={handleFormChange}
            formData={formData}
          />
        </StepperPanel>

        <StepperPanel>
          <LoginWithEmail
            handleChangePanel={handleChangePanel}
            handleFormChange={handleFormChange}
            formData={formData}
            setFormData={setFormData}
          />
        </StepperPanel>

        <StepperPanel>
          <SignUpWithEmail
            handleChangePanel={handleChangePanel}
            handleFormChange={handleFormChange}
            formData={formData}
            setFormData={setFormData}
          />
        </StepperPanel>

        <StepperPanel>
          <EmailVerification
            handleChangePanel={handleChangePanel}
            emailOtp={emailOtp}
            setEmailOtp={setEmailOtp}
            formData={formData}
            setFormData={setFormData}
          />
        </StepperPanel>
        <StepperPanel>
          <SavePhoneNumber />
        </StepperPanel>
        <StepperPanel>
          <SaveEmailAddress handleChangePanel={handleChangePanel} />
        </StepperPanel>
        <StepperPanel>
          <PhoneVerification
            formData={formData}
            handleChangePanel={handleChangePanel}
            phoneOtp={phoneOtp}
            setPhoneOtp={setPhoneOtp}
          />
        </StepperPanel>
        <StepperPanel>
          <EnterPassword
            formData={formData}
            setFormData={setFormData}
            handleChangePanel={handleChangePanel}
            handleFormChange={handleFormChange}
          />
        </StepperPanel>
        <StepperPanel>
          <VerificationEmailForChangePassword
            handleSubmitAfterVerification={() =>
              handleSubmitAfterVerification()
            }
            handleResendEmailOtp={handleResendEmailOtp}
            emailOtp={emailOtp}
            setEmailOtp={setEmailOtp}
            formData={formData}
          />
        </StepperPanel>
        <StepperPanel>
          <ChangePassword
            handleChangePanel={handleChangePanel}
            handleFormChange={handleFormChange}
            formData={formData}
            setFormData={setFormData}
          />
        </StepperPanel>
      </Stepper>
    </Dialog>
  );
}
