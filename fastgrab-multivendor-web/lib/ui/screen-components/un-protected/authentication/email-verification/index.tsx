// Components
import CustomButton from "@/lib/ui/useable-components/button";

// Interfaces
import {
  IEmailVerificationProps,
  IUpdateUserEmailArguments,
  IUpdateUserResponse,
} from "@/lib/utils/interfaces";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import useToast from "@/lib/hooks/useToast";
import useUser from "@/lib/hooks/useUser";
import { ApolloError, useMutation } from "@apollo/client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

// GQL
import { UPDATE_USER } from "@/lib/api/graphql";

// Prime React
import { InputOtp } from "primereact/inputotp";

export default function EmailVerification({
  handleChangePanel,
  emailOtp,
  setEmailOtp,
}: IEmailVerificationProps) {
  // States
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  // Hooks
  const t = useTranslations();
  const { SKIP_EMAIL_VERIFICATION, TEST_OTP } = useConfig();
  const {
    user,
    setIsAuthModalVisible,
    otp,
    setOtp,
    sendOtpToEmailAddress,
    sendOtpToPhoneNumber,
    isLoading,
  } = useAuth();
  const { showToast } = useToast();
  const { profile } = useUser();

  // Mutations
  const [updateUser] = useMutation<
    IUpdateUserResponse,
    undefined | IUpdateUserEmailArguments
  >(UPDATE_USER, {
    onError: (error: ApolloError) => {
      showToast({
        type: "error",
        title: t("Error"),
        message:
          error.cause?.message ||
          t("update_phone_name_update_error_msg"),
      });
    },
  });

  // Handlers
  const handleSubmit = async () => {
    try {
      if (SKIP_EMAIL_VERIFICATION) {
        if (profile?.phoneIsVerified) {
          showToast({
            type: "success",
            title: t("email_verification_label"),
            message: t("your_email_verified_successfully_message"),
          });
          showToast({
            type: "success",
            title: t("Login"),
            message: t("You have logged in successfully"), // put ! at the end of the statement in the translation
          });
          handleChangePanel(0);
          setOtp("");
          setEmailOtp("");
          setIsAuthModalVisible(false);
        } else {
          showToast({
            type: "success",
            title: t("email_verification_label"),
            message: t("your_email_verified_successfully_message"),
          });
          setOtp(TEST_OTP);
          handleChangePanel(4);
        }
      } else {
        if (String(emailOtp) === String(otp) && !!user?.email) {
          const userData = await updateUser({
            variables: {
              name: user?.name ?? "",
              email: user?.email ?? "",
              emailIsVerified: true,
            },
          });
          setOtp("");
          setEmailOtp("");
          if (userData?.data?.updateUser?.phoneIsVerified) {
            showToast({
              type: "success",
              title: t("email_verification_label"),
              message: t("your_email_verified_successfully_message"),
            });
            showToast({
              type: "success",
              title: t("login_label"),
              message: t("login_success_message"), // put ! at the end of the statement in the translation
            });
            handleChangePanel(0);
            setIsAuthModalVisible(false);
          } else if (
            !userData?.data?.updateUser?.phoneIsVerified &&
            user.phone
          ) {
            showToast({
              type: "success",
              title: t("email_verification"),
              message: t("your_email_verified_successfully_message"),
            });
            sendOtpToPhoneNumber(user.phone);
            handleChangePanel(6);
          } else {
            showToast({
              type: "success",
              title: t("email_verification"),
              message: t("your_email_verified_successfully_message"),
            });
            handleChangePanel(4);
          }
        } else {
          return showToast({
            type: "error",
            title: t("otp_error_label"),
            message: t("please_enter_valid_otp_code_message"),
          });
        }
      }
    } catch (error) {
      console.error("An error occured while email verification:", error);
      showToast({
        type: "error",
        title: t("Error"),
        message: t("error_occurred_while_updating_user_message"),
      });
    }
  };

  const handleOtpResend = async () => {
    if (user?.email) {
      setIsResendingOtp(true);
      await sendOtpToEmailAddress(user?.email);
      setIsResendingOtp(false);
    } else {
      showToast({
        type: "error",
        title: t("Error"),
        message: t("please_enter_valid_email_address_message"),
      });
    }
  };
  // UseEffects
  useEffect(() => {
    if (!user?.email) {
      handleChangePanel(4);
    }
  }, [user?.email]);

  useEffect(() => {
    if (SKIP_EMAIL_VERIFICATION) {
      setOtp(TEST_OTP);
      if (profile?.phoneIsVerified) {
        handleChangePanel(0);
        setIsAuthModalVisible(false);
        showToast({
          type: "success",
          title: t("Login"),
          message: t("login_success_message"), // put ! at the end of the statement in the translation
        });
      } else {
        handleChangePanel(4);
      }
      showToast({
        type: "success",
        title: t("email_verification_label"),
        message: t("your_email_verified_successfully_message"),
      });
      setOtp("");
      setEmailOtp("");
    }
  }, [SKIP_EMAIL_VERIFICATION]);
  return (
    <>
 <div className="flex items-center justify-center w-full min-h-screen mx-auto px-4 py-6 sm:px-6 md:px-8 bg-gray-50">
  <div className="w-full max-w-md flex flex-col bg-white shadow-lg rounded-2xl p-4 sm:p-6 md:p-8">
    
    {/* Heading Section */}
    <div className="mb-6 text-left">
      <h2 className="text-3xl sm:text-xl font-semibold text-gray-800 leading-tight">
        {t("verify_your_email_label")}
      </h2>
      <p className="text-gray-600 mt-2 text-sm sm:text-base leading-snug">
        {t("OTP_Code_Sent")}{" "}
        <span className="font-semibold text-gray-800 break-all">
          {user?.email ?? "example@email.com"}
        </span>
      </p>
      <p className="text-xs sm:text-sm text-gray-500 mt-1">
        {t("please_check_your_inbox_message")}
      </p>
    </div>

    {/* OTP Input & Buttons */}
    <div className="flex flex-col items-center justify-center w-full">
      <InputOtp
        value={emailOtp}
        onChange={(e) => setEmailOtp(String(e.value))}
        mask
        autoFocus
        maxLength={6}
        length={6}
        className="w-full justify-center"
      />

      <CustomButton
        label={t("continue_label")}
        loading={isLoading}
        onClick={handleSubmit}
      />

      <CustomButton
        label={t("resend_otp_label")}
        loading={isResendingOtp}
        onClick={handleOtpResend}
      />
    </div>
  </div>
</div>

    </>
  );
}
