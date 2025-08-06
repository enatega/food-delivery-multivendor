"use client";
// Interfaces
import {
  IUpdateUserPhoneArguments,
  IUpdateUserResponse,
} from "@/lib/utils/interfaces";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import { useState } from "react";

// Components
import useToast from "@/lib/hooks/useToast";
import CustomDialog from "@/lib/ui/useable-components/custom-dialog";
import PhoneEntry from "./phone";
import VerificationPhone from "./verification-phone";

// Api
import { GET_USER_PROFILE, UPDATE_USER } from "@/lib/api/graphql";
import { ApolloError, useLazyQuery, useMutation } from "@apollo/client";
import useDebounceFunction from "@/lib/hooks/useDebounceForFunction";
import { useTranslations } from "next-intl";

export interface IUpdatePhoneModalProps {
  isUpdatePhoneModalVisible: boolean
  handleUpdatePhoneModal: () => void
}

export default function UpdatePhoneModal({
  isUpdatePhoneModalVisible,
  handleUpdatePhoneModal,
  
}: IUpdatePhoneModalProps) {
  // States
  const [phoneOtp, setPhoneOtp] = useState("");
  const [activeStep, setActiveStep] = useState(0);

    // Hooks
  const { sendOtpToPhoneNumber, setUser, user, otp, setOtp, checkPhoneExists } = useAuth();
  const { showToast } = useToast();
  const t = useTranslations()

  // Queries and mutations 

  // refetch user profile after updating phone number
   const [
      fetchProfile
    ] = useLazyQuery(GET_USER_PROFILE, {
      fetchPolicy: "network-only",
    });
  
    // update user phone number
    const [updateUser] = useMutation<
      IUpdateUserResponse,
      undefined | IUpdateUserPhoneArguments
    >(UPDATE_USER, {
      onError: (error: ApolloError) => {
        showToast({
          type: "error",
          title:             t('update_phone_name_update_error_title'),

          message:
            error.cause?.message ||
            t('update_phone_name_update_error_msg'),
        });
      },
    });
    

  // Handlers
  const handleChange = (val:string) => {
    setUser((prev) => ({
      ...prev,
      phone: val,
    }))
  }

 const handleSubmit = useDebounceFunction(async () => { 
  try {
    if(!user?.phone || user?.phone.length < 7) {
      showToast({
        type: "error",
        title: t("update_phone_name_update_error_title"),
        message: t("update_phone_name_invalid_number"),
      });
      return;
    }
    const phoneExists = await checkPhoneExists(user?.phone);

    // Only proceed with sending OTP if the phone number doesn't exist
    // The checkPhoneExists function already shows a toast error if phone exists
    if (!phoneExists) {
      await sendOtpToPhoneNumber(user?.phone || "");
      setActiveStep(1);
    }
    // If phoneExists is true, just return and don't proceed further
    
  } catch (error) {
    showToast({
      type: "error",
      title: t("update_phone_name_update_error_title"),
      message: t("update_phone_name_send_otp_error"),
    });
  }
},
  500, // Debounce time in milliseconds
)

    const handleSubmitAfterVerification = useDebounceFunction(async () => {
      try {
        if (String(phoneOtp) === String(otp) && !!user?.phone) {
          const args = {
            phone: user?.phone,
            name: user?.name ?? "",
            phoneIsVerified: true,
          };
          
          await updateUser({
            variables: args,
          });
          setOtp("");
          setPhoneOtp("");
          setActiveStep(0);
          handleUpdatePhoneModal();
          fetchProfile();
          return showToast({
            type: "success",
            title: t("update_phone_name_verification_success_title"),
            message: t("update_phone_name_verification_success_msg"),
          });
         
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
          error,
        );
      }
    },
      500, // Debounce time in milliseconds
  )
  
    const handleResendPhoneOtp = useDebounceFunction(() => {
      if (user?.phone) {
        sendOtpToPhoneNumber(user?.phone);
      } else {
        showToast({
          type: "error",
          title: t("update_phone_name_update_error_title"),
          message: t("update_phone_name_resend_error_msg")
        });
      }
    },
      500, // Debounce time in milliseconds
  )


  return(
     <CustomDialog visible={isUpdatePhoneModalVisible} onHide={handleUpdatePhoneModal} width="600px" >  
        {
            activeStep === 0 ? (
            <PhoneEntry
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                user={user}
                handleUpdatePhoneModal={handleUpdatePhoneModal}
            />
            ) : (
               <VerificationPhone
                handleSubmitAfterVerification={handleSubmitAfterVerification}
                handleResendPhoneOtp={handleResendPhoneOtp}
                phoneOtp={phoneOtp}
                setPhoneOtp={setPhoneOtp}
                user={user}
                showToast={showToast}
               />
            )
        } 
     </CustomDialog>
  )

}
