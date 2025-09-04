"use client";
// Interfaces
import {
  IAuthFormData,
  IAuthModalProps,
  ILoginProfile,
} from "@/lib/utils/interfaces";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import { useGoogleLogin } from "@react-oauth/google";
import { useRef, useState } from "react";
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

  // get the RTL direction
  const direction = document.documentElement.getAttribute("dir") || "ltr";

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
  const { SKIP_EMAIL_VERIFICATION, SKIP_MOBILE_VERIFICATION } = useConfig();

  // Login With Google
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      const userInfo = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );
      const userData = await userInfo.json();

      const userLoginResponse = await handleUserLogin({
        type: "google",
        email: userData.email,
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
          SKIP_MOBILE_VERIFICATION
        ) {
          setActivePanel(4);
        } else {
          setActivePanel(0);
          setIsAuthModalVisible(false);

          showToast({
            type: "success",
            title: t("login_success"),
            message: t("login_success_message"),
          });
        }
        setIsLoading(false);
      }
    },

    onError: (errorResponse) => {
      console.log(errorResponse);
    },
  });

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
          />
        </StepperPanel>

        <StepperPanel>
          <SignUpWithEmail
            handleChangePanel={handleChangePanel}
            handleFormChange={handleFormChange}
            formData={formData}
          />
        </StepperPanel>

        <StepperPanel>
          <EmailVerification
            handleChangePanel={handleChangePanel}
            emailOtp={emailOtp}
            setEmailOtp={setEmailOtp}
            formData={formData}
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
