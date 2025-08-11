// Hooks and Context
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/context/auth/auth.context";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import { useTranslations } from "next-intl";
import { useMutation, ApolloError } from "@apollo/client";
import useVerifyOtp from "@/lib/hooks/useVerifyOtp";

// Components and Utilities
import CustomButton from "@/lib/ui/useable-components/button";
import useToast from "@/lib/hooks/useToast";
import useUser from "@/lib/hooks/useUser";
import {
  IEmailVerificationProps,
  IUpdateUserEmailArguments,
  IUpdateUserResponse,
} from "@/lib/utils/interfaces";
import { UPDATE_USER } from "@/lib/api/graphql";

export default function EmailVerification({
  handleChangePanel,
  emailOtp,
  setEmailOtp,
}: IEmailVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  
  const t = useTranslations();
  const { SKIP_EMAIL_VERIFICATION, TEST_OTP } = useConfig();
  const { verifyOTP, error } = useVerifyOtp();
  const {
    user,
    setIsAuthModalVisible,
    setOtp: setStoredOtp,
    sendOtpToEmailAddress,
    sendOtpToPhoneNumber,
    isLoading,
  } = useAuth();
  const { showToast } = useToast();
  const { profile } = useUser();

  const [updateUser] = useMutation<
    IUpdateUserResponse,
    undefined | IUpdateUserEmailArguments
  >(UPDATE_USER, {
    onError: (error: ApolloError) => {
      showToast({
        type: "error",
        title: t("Error"),
        message: error.cause?.message || t("update_phone_name_update_error_msg"),
      });
    },
  });

  // Sync parent state with local OTP
  useEffect(() => {
    setEmailOtp(otp.join(""));
  }, [otp]);

  // Initialize on mount
  useEffect(() => {
    if (emailOtp) {
      const otpArray = emailOtp.split("").slice(0, 6);
      setOtp([...otpArray, ...Array(6 - otpArray.length).fill("")]);
    }
    if (!user?.email) handleChangePanel(4);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = Array(6).fill("");
    pasted.split("").forEach((digit, i) => (newOtp[i] = digit));
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async () => {
    if (SKIP_EMAIL_VERIFICATION) {
      setStoredOtp(TEST_OTP);
      showToast({
        type: "success",
        title: t("email_verification_label"),
        message: t("your_email_verified_successfully_message"),
      });
      if (profile?.phoneIsVerified) {
        showToast({ type: "success", title: t("Login"), message: t("login_success_message") });
        handleChangePanel(0);
        setIsAuthModalVisible(false);
      } else {
        handleChangePanel(4);
      }
      setStoredOtp("");
      setEmailOtp("");
      return;
    }

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
      setStoredOtp("");
      setEmailOtp("");
      if (userData?.data?.updateUser?.phoneIsVerified) {
        showToast({ type: "success", title: t("email_verification_label"), message: t("your_email_verified_successfully_message") });
        showToast({ type: "success", title: t("login_label"), message: t("login_success_message") });
        handleChangePanel(0);
        setIsAuthModalVisible(false);
      } else if (!userData?.data?.updateUser?.phoneIsVerified && user.phone) {
        sendOtpToPhoneNumber(user.phone);
        handleChangePanel(6);
      } else {
        handleChangePanel(4);
      }
    } else {
      showToast({
        type: "error",
        title: t("otp_error_label"),
        message: t("please_enter_valid_otp_code_message"),
      });
    }
  };

  const handleOtpResend = async () => {
    if (!user?.email) {
      return showToast({
        type: "error",
        title: t("Error"),
        message: t("please_enter_valid_email_address_message"),
      });
    }
    setIsResendingOtp(true);
    await sendOtpToEmailAddress(user.email);
    setIsResendingOtp(false);
  };

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
    <div className="flex flex-col items-start justify-start w-full h-full px-4 py-6 md:px-8">
      <div className="flex flex-col justify-start text-left w-full">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          {t("OTP_Code_Sent")}
        </h2>
        <p className="text-md sm:text-xl font-semibold text-gray-800 mb-3 break-words">
          {user?.email || "your@email.com"}
        </p>
        <p className="text-base text-gray-600 mb-6">{t("verify_your_email_label")}</p>
      </div>

      <div className="w-full mb-6">
        <div className="flex justify-center flex-wrap gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <input
              key={i}
              ref={(el) => {
            inputRefs.current[i] = el;
          }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[i]}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="w-9 h-10 sm:w-10 sm:h-12 md:w-14 md:h-16 text-xl text-center border border-gray-300 rounded-lg focus:outline-none focus:border-[#5AC12F] focus:ring-2 focus:ring-[#5AC12F] focus:ring-opacity-20"
              autoFocus={i === 0}
            />
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6 text-center w-full">{t("otp_valid_for_10_minutes_label")}</p>

      <CustomButton
        label={t("continue_label")}
        loading={isLoading}
        className="bg-[#5AC12F] text-white flex items-center justify-center rounded-full p-3 w-full mb-4 h-12 sm:h-14 text-lg sm:text-md font-medium"
        onClick={handleSubmit}
      />

      <CustomButton
        label={t("resend_otp_label")}
        loading={isResendingOtp}
        className="bg-white text-black flex items-center justify-center rounded-full border border-gray-300 p-3 w-full h-12 sm:h-14 text-lg sm:text-md font-medium"
        onClick={handleOtpResend}
      />
    </div>
  );
}
