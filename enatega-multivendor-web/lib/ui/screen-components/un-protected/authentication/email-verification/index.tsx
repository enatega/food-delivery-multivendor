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
        } else {
          return showToast({
            type: "error",
            title: t("OTP Error"),
            message: t("Please enter a valid OTP code"),
          });
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
  return (
    <div className="flex flex-col justify-between item-center self-center p-4">
      <p>
        {t("We have sent OTP code to")}&nbsp;
        <span className="font-bold">{user?.email ?? "example@email.com"}</span>
      </p>
      <p className="font-light mb-3 text-sm flex ">
        {t("Please check your inbox")}
      </p>
      <InputOtp
        value={emailOtp}
        onChange={(e) => setEmailOtp(String(e.value))}
        color="red"
        autoFocus={true}
        mask
        maxLength={6}
        length={6}
        className=" w-full flex flex-wrap h-16 sm:h-20 my-2 "
      />
      {/* create a span and give a margin top */}
      <span className="mt-4"></span>
      <CustomButton
        label={t("Continue")}
        loading={isLoading}
        className={`bg-[#5AC12F] flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72 my-1`}
        onClick={handleSubmit}
      />
      <CustomButton
        label={t("Resend OTP")}
        loading={isResendingOtp}
        className={`bg-[#fff] flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72 my-1`}
        onClick={handleOtpResend}
      />
    </div>
  );
}
