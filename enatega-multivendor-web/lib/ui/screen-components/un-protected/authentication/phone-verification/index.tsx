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
import { useEffect, useState } from "react";

// Prime React
import { InputOtp } from "primereact/inputotp";

// GQL
import { UPDATE_USER } from "@/lib/api/graphql";

export default function PhoneVerification({
  phoneOtp,
  setPhoneOtp,
  handleChangePanel,
}: IPhoneVerificationProps) {
  // States
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  // Hooks
  const { SKIP_MOBILE_VERIFICATION, TEST_OTP } = useConfig();
  const t = useTranslations();
  const {
    user,
    otp,
    setOtp,
    sendOtpToPhoneNumber,
    setIsAuthModalVisible,
    isRegistering,
    setIsRegistering,
    isLoading,
    setIsLoading,
  } = useAuth();
  const { showToast } = useToast();
  const { profile } = useUser();

  // Mutations
  const [updateUser] = useMutation<
    IUpdateUserResponse,
    undefined | IUpdateUserPhoneArguments
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
      setIsLoading(true);
      if (String(phoneOtp) === String(otp) && !!user?.phone) {
        const args =
          isRegistering ?
            {
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
        if (!userData.data?.updateUser?.emailIsVerified && !user.email) {
          handleChangePanel(5);
        } else if (!userData.data?.updateUser?.emailIsVerified && user.email) {
          handleChangePanel(3);
        } else {
          handleChangePanel(0);
          setIsAuthModalVisible(false);
        }
        return showToast({
          type: "success",
          title: t("Phone Verification"),
          message: t("Your phone number is verified successfully"),
        });
      } else {
        showToast({
          type: "error",
          title: t("OTP Error"),
          message: t("Please enter a valid OTP code"),
        });
      }
    } catch (error) {
      console.error(
        "Error while updating user and phone otp verification:",
        error,
      );
    } finally {
      setIsLoading(false);
      setIsRegistering(false);
    }
  };

  const handleResendPhoneOtp = async () => {
    if (user?.phone) {
      setIsResendingOtp(true);
      await sendOtpToPhoneNumber(user?.phone);
      showToast({
        type: "success",
        title: t("OTP Resent"),
        message: t("We have resent the OTP code to your phone"),
      });
      setIsResendingOtp(false);
    } else {
      showToast({
        type: "error",
        title: t("Error"),
        message: t("Please re-enter your valid phone number"),
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
        title: t("Phone Verification"),
        message: t("Your phone number is verified successfully"),
      });
      if (!profile?.emailIsVerified) {
        handleChangePanel(5);
      } else {
        handleChangePanel(0);
        setIsAuthModalVisible(false);
      }
    }
  }, [SKIP_MOBILE_VERIFICATION]);



  return (
    <div className=" flex flex-col justify-between item-center self-center">
      <p>
        {t("We have sent OTP code to")}
        <span className="font-bold">{user?.phone}</span>
      </p>
      <p className="font-light text-sm mb-2">{t("Please check your inbox")}</p>
      <InputOtp
        value={phoneOtp}
        onChange={(e) => setPhoneOtp(String(e.value))}
        color="red"
        autoFocus={true}
        mask
        maxLength={6}
        length={6}
        className=" w-full h-20 my-2"
        onPaste={(e) =>
          setPhoneOtp(
            String(e.clipboardData.items[0].getAsString((data) => data)),
          )
        }

        placeholder="12314"
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
        className={`bg-[#fff] flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72 my-1`}
        onClick={handleResendPhoneOtp}
        loading={isResendingOtp}
      />
    </div>
  );
}
