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
import useVerifyOtp from "@/lib/hooks/useVerifyOtp";

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
    setOtp,
    sendOtpToEmailAddress,
    sendOtpToPhoneNumber,
    isLoading,
  } = useAuth();
  const { showToast } = useToast();
  const { profile } = useUser();
  const { verifyOTP, error } = useVerifyOtp();

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
          t("An error occurred while updating the user"),
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
            title: t("Email Verification"),
            message: t("Your email is verified successfully"),
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
            title: t("Email Verification"),
            message: t("Your email is verified successfully"),
          });
          setOtp(TEST_OTP);
          handleChangePanel(4);
        }
      } else {
        const otpResponse = await verifyOTP({
          variables: {
            otp: emailOtp,
            email: user?.email
          }
        })
        if (otpResponse.data?.verifyOtp && !!user?.email) {
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
              title: t("Email Verification"),
              message: t("Your email is verified successfully"),
            });
            showToast({
              type: "success",
              title: t("Login"),
              message: t("You have logged in successfully"), // put ! at the end of the statement in the translation
            });
            handleChangePanel(0);
            setIsAuthModalVisible(false);
          } else if (
            !userData?.data?.updateUser?.phoneIsVerified &&
            user.phone
          ) {
            showToast({
              type: "success",
              title: t("Email Verification"),
              message: t("Your email is verified successfully"),
            });
            sendOtpToPhoneNumber(user.phone);
            handleChangePanel(6);
          } else {
            showToast({
              type: "success",
              title: t("Email Verification"),
              message: t("Your email is verified successfully"),
            });
            handleChangePanel(4);
          }
        }
      }
    } catch (error) {
      console.error("An error occured while email verification:", error);
      showToast({
        type: "error",
        title: t("Error"),
        message: t("An error occurred while verifying the email"),
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
        message: t("Please enter a valid email address"),
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
          message: t("You have logged in successfully"), // put ! at the end of the statement in the translation
        });
      } else {
        handleChangePanel(4);
      }
      showToast({
        type: "success",
        title: t("Email Verification"),
        message: t("Your email is verified successfully"),
      });
      setOtp("");
      setEmailOtp("");
    }
  }, [SKIP_EMAIL_VERIFICATION]);

    // useEffect for displaying otp verification error
    useEffect(() => {
      if (error) {
        showToast({
          type: "error",
          title: t("OTP Error"),
          message: error.message,
        });
    }
    }, [error])
  
  return (
    <>
 <div className="flex items-center justify-center w-full min-h-screen mx-auto px-4 py-6 sm:px-6 md:px-8 bg-gray-50">
  <div className="w-full max-w-md flex flex-col bg-white shadow-lg rounded-2xl p-4 sm:p-6 md:p-8">
    
    {/* Heading Section */}
    <div className="mb-6 text-left">
      <h2 className="text-3xl sm:text-xl font-semibold text-gray-800 leading-tight">
        {t("Verify Your Email")}
      </h2>
      <p className="text-gray-600 mt-2 text-sm sm:text-base leading-snug">
        {t("We have sent an OTP to")}{" "}
        <span className="font-semibold text-gray-800 break-all">
          {user?.email ?? "example@email.com"}
        </span>
      </p>
      <p className="text-xs sm:text-sm text-gray-500 mt-1">
        {t("Please check your inbox and enter the code below.")}
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
        label={t("Continue")}
        loading={isLoading}
        onClick={handleSubmit}
      />

      <CustomButton
        label={t("Resend OTP")}
        loading={isResendingOtp}
        onClick={handleOtpResend}
      />
    </div>
  </div>
</div>

    </>
  );
}
