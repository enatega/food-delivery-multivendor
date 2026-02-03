import { useMutation } from "@apollo/client";
import { CREATE_RIDER } from "@/lib/apollo/mutations/rider.mutation";
import { IRiderInput, ISignUpInitialValues } from "@/lib/utils/interfaces/auth.interface";
import { useState } from "react";

export default function useSignup() {
  const [createRider, { loading, error }] = useMutation(CREATE_RIDER);
  const [signupError, setSignupError] = useState<string | null>(null);

  const onSignup = async (values: ISignUpInitialValues) => {
    try {
      setSignupError(null);

      const riderInput: IRiderInput = {
        _id: "",
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
        phone: values.phone,
        available: true,
        vehicleType: values.vehicleType,
        zone: values.zone,
        madeBy: "RIDER_REQUEST",
        riderRequestStatus: "PENDING",
        ...(values.referralCode && { referralCode: values.referralCode }),
      };

      const response = await createRider({
        variables: { riderInput },
      });

      return {
        success: true,
        data: response.data.createRider,
      };
    } catch (err: any) {
      const errorMessage = err.message || "Signup failed. Please try again.";
      setSignupError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  return {
    onSignup,
    loading,
    error: signupError || error?.message,
  };
}
