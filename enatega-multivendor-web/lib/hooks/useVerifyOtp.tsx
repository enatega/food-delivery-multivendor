import { useMutation } from "@apollo/client";
import { VERIFY_OTP } from "../api/graphql";
import { VerifyOtpResponse, VerifyOtpVariables } from "../utils/interfaces";

export default function useVerifyOtp() {
  const [verifyOTP, { error }] = useMutation<
    VerifyOtpResponse,
    VerifyOtpVariables
  >(VERIFY_OTP, {
    fetchPolicy: "network-only",
  });

  return {
    verifyOTP,
    error,
  };
}