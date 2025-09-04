// Components
import CustomButton from "@/lib/ui/useable-components/button";

// Interfaces
import {
  IPhoneVerificationProps,
  IUpdateUserPhoneArguments,
  IUpdateUserResponse,
} from "@/lib/utils/interfaces";
import { ApolloError, useMutation } from "@apollo/client";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import useToast from "@/lib/hooks/useToast";
import useUser from "@/lib/hooks/useUser";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import useVerifyOtp from "@/lib/hooks/useVerifyOtp";

// GQL
import { UPDATE_USER } from "@/lib/api/graphql";
import PhoneIcon from "@/lib/utils/assets/svg/phone";

export default function PhoneVerification({
  formData,
  phoneOtp,
  setPhoneOtp,
  handleChangePanel,
}: IPhoneVerificationProps) {
  // States
  // const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [userotp, setuserOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Hooks
  const { SKIP_MOBILE_VERIFICATION, TEST_OTP } = useConfig();
  const t = useTranslations();
  const {
    user,
    setOtp,
    sendOtpToPhoneNumber,
    setIsAuthModalVisible,
    isRegistering,
    setIsRegistering,
    isLoading,
    setIsLoading,
    handleCreateUser,
  } = useAuth();
  const { showToast } = useToast();
  const { profile } = useUser();
  const { verifyOTP, error } = useVerifyOtp();

  // Mutations
  const [updateUser] = useMutation<
    IUpdateUserResponse,
    undefined | IUpdateUserPhoneArguments
  >(UPDATE_USER, {
    onError: (error: ApolloError) => {
      showToast({
        type: "error",
        title: t("update_phone_name_update_error_title"),
        message:
          error.cause?.message || t("update_phone_name_update_error_msg"),
      });
    },
  });

  // Handlers
  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const otpResponse = await verifyOTP({
        variables: {
          otp: phoneOtp,
          phone: formData?.phone,
        },
      });

      console.log("OTP Response:", otpResponse);

      if (otpResponse.data?.verifyOtp && !!formData?.phone) {
        if (isRegistering) {
          const userData = await handleCreateUser({
            email: formData?.email,
            phone: formData?.phone,
            name: formData?.name,
            password: formData?.password,
          });

          if (!userData.phoneIsVerified) {
            await updateUser({
              variables: {
                name: userData?.name ?? "",
                phone: userData?.phone,
                phoneIsVerified: true,
              },
            });
          }

          setOtp("");
          setPhoneOtp("");

          showToast({
            type: "success",
            title: t("phone_verification_label"),
            message: t("your_phone_number_verified_successfully_message"),
          });
          showToast({
            type: "success",
            title: t("register_label"),
            message: t("successfully_registered_your_account_message"), // put an exclamation mark at the end of this sentence in the translations
          });

          setIsRegistering(false);
          handleChangePanel(0);
          setIsAuthModalVisible(false);
        } else {
          const args = isRegistering
            ? {
                name: user?.name ?? "",
                phoneIsVerified: true,
              }
            : {
                phone: user?.phone,
                name: user?.name ?? "",
                phoneIsVerified: true,
              };

          const userData = await updateUser({
            variables: args,
          });

          setOtp("");
          setPhoneOtp("");
          if (!userData.data?.updateUser?.emailIsVerified && !user?.email) {
            handleChangePanel(5);
          } else if (
            !userData.data?.updateUser?.emailIsVerified &&
            user?.email
          ) {
            handleChangePanel(3);
          } else {
            handleChangePanel(0);
            setIsAuthModalVisible(false);
          }
          return showToast({
            type: "success",
            title: t("update_phone_name_verification_success_title"),
            message: t("update_phone_name_verification_success_msg"),
          });
        }
      } else {
        showToast({
          type: "error",
          title: t("update_phone_name_otp_error_title"),
          message: t("update_phone_name_otp_error_msg"),
        });
      }
    } catch (error) {
      console.error(
        "Error while updating user and phone otp verification:",
        error
      );
    } finally {
      setIsLoading(false);
      setIsRegistering(false);
    }
  };

  const handleResendPhoneOtp = async () => {
    if (user?.phone || formData.phone) {
      // setIsResendingOtp(true);
      await sendOtpToPhoneNumber(user?.phone || formData.phone);
      showToast({
        type: "success",
        title: t("otp_resent_label"),
        message: t("resent_otp_code_to_your_phone_message"),
      });
      // setIsResendingOtp(false);
    } else {
      showToast({
        type: "error",
        title: t("Error"),
        message: t("update_phone_name_resend_error_msg"),
      });
      handleChangePanel(4);
    }
  };

  // UseEffects
  useEffect(() => {
    if (SKIP_MOBILE_VERIFICATION) {
      setOtp(TEST_OTP);
      showToast({
        type: "success",
        title: t("phone_verification_label"),
        message: t("your_phone_number_verified_successfully_message"),
      });
      if (!profile?.emailIsVerified) {
        handleChangePanel(5);
      } else {
        handleChangePanel(0);
        setIsAuthModalVisible(false);
      }
    }
  }, [SKIP_MOBILE_VERIFICATION]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);

    // Set initial values from phoneOtp if it exists
    if (phoneOtp) {
      const otpArray = phoneOtp.split("").slice(0, 6);
      setuserOtp(otpArray.concat(Array(6 - otpArray.length).fill("")));
    }
  }, []);

  // useEffect for displaying otp verification error
  useEffect(() => {
    if (error) {
      showToast({
        type: "error",
        title: t("OTP Error"),
        message: error.message,
      });
    }
  }, [error]);

  return (
    <div className="flex flex-col items-start justify-start w-full h-full px-4 py-6 md:px-8 dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col justify-items-start justify-start text-left">
        <div className="mb-4">
          <PhoneIcon />
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {t("OTP_Code_Sent")}
        </h2>

        <p className="text-md sm:text-xl font-semibold text-gray-800 dark:text-white mb-3 break-words">
          {formData?.phone || "your phone number"}
        </p>

        <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
          {t("please_check_your_inbox_message_1")}
        </p>
      </div>
      <div className="w-full mb-6">
        <div className="flex justify-center flex-wrap gap-2">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              maxLength={1}
              aria-label={`OTP digit ${index + 1}`}
              value={userotp[index]}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/, ""); // Only digits
                const updatedOtp = [...userotp];

                // Handle both new input and overwriting
                if (value.length === 0) {
                  updatedOtp[index] = "";
                } else if (value.length === 1) {
                  updatedOtp[index] = value;
                } else {
                  // If multiple characters (e.g., from paste), take the last one
                  updatedOtp[index] = value.slice(-1);
                }

                setuserOtp(updatedOtp);
                setPhoneOtp(updatedOtp.join(""));

                // Move focus to next box
                if (index < 5 && inputRefs.current[index + 1]) {
                  if (value && index < 5 && inputRefs.current[index + 1]) {
                    inputRefs.current[index + 1]?.focus();
                  }
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  const updatedOtp = [...userotp];
                  updatedOtp[index] = "";
                  setuserOtp(updatedOtp);
                  setPhoneOtp(updatedOtp.join(""));

                  if (index > 0 && !userotp[index]) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }
              }}
              className="w-9 h-10 sm:w-10 sm:h-12 md:w-14 md:h-16 text-xl text-center border dark:bg-gray-800 border-gray-300 rounded-lg focus:outline-none focus:border-[#5AC12F] focus:ring-2 focus:ring-[#5AC12F] focus:ring-opacity-20"
            />
          ))}
        </div>
      </div>
      {/* Button Spacer */}
      {/* <span className="mt-4" />
        {/* Continue Button */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center w-full">
        {t("otp_valid_for_10_minutes_label")}
      </p>

      <CustomButton
        label={t("continue_label")}
        loading={isLoading}
        className="bg-[#5AC12F] text-white flex items-center justify-center rounded-full p-3 w-full mb-4 h-12 sm:h-14 text-lg sm:text-md font-medium"
        onClick={handleSubmit}
      />

      <CustomButton
        label={t("resend_otp_label")}
        className="bg-white text-black flex items-center justify-center rounded-full border border-gray-300 p-3 w-full h-12 sm:h-14 text-lg sm:text-md font-medium"
        onClick={handleResendPhoneOtp}
      />
    </div>
  );
}
