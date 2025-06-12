// Components
import CustomButton from "@/lib/ui/useable-components/button";
import CustomPasswordTextField from "@/lib/ui/useable-components/password-input-field";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import useToast from "@/lib/hooks/useToast";
import { useTranslations } from "next-intl";

// Interfaces
import { useConfig } from "@/lib/context/configuration/configuration.context";
import { IAuthFormData, IEnterPasswordProps } from "@/lib/utils/interfaces";

export default function EnterPassword({
  handleChangePanel,
  handleFormChange,
  setFormData,
  formData,
}: IEnterPasswordProps) {
  // Hooks
  const t = useTranslations();
  const { handleUserLogin, sendOtpToEmailAddress, sendOtpToPhoneNumber, setIsAuthModalVisible, isLoading} =
    useAuth();
  const { showToast } = useToast();
  const {SKIP_EMAIL_VERIFICATION, SKIP_MOBILE_VERIFICATION} = useConfig()

  // Handlers
  const handleSubmit = async () => {
    if (!formData?.password) {
      return showToast({
        type: "error",
        title: t("Error"),
        message: t("Please enter a valid password"),
      });
    }

    // Check if the password is correct
    const userData = await handleUserLogin({
      type: "default",
      password: formData?.password,
      email: formData?.email,
    });
    const user = userData?.login;
    if (!user?.userId) {
      return showToast({
        type: "error",
        title: t("Error"),
        message: t("Please enter a valid password"),
      });
    } else {
      // Check for email & phone verification
      if (!user?.emailIsVerified&&!SKIP_EMAIL_VERIFICATION) {
        if (user?.email) {
          sendOtpToEmailAddress(user?.email);
          // re-direct to email-otp verification
          handleChangePanel(3);
        } else {
          // save the email address first
          handleChangePanel(5);
        }
      } else if (!user?.phoneIsVerified&&!SKIP_MOBILE_VERIFICATION) {
        if (user?.phone) {
          sendOtpToPhoneNumber(user?.phone);
          // re-direct to phone-otp verification
          handleChangePanel(4);
        } else {
          // save the phone number first
          handleChangePanel(6);
        }
      } else {
        handleChangePanel(0);
        setFormData({} as IAuthFormData);
        setIsAuthModalVisible(false)
        // showToast({
        //   type: "success",
        //   title: t("Login"),
        //   message: t("You have logged in successfully"),
        // });
      }
    }
  };

  return (
    <div className="flex flex-col items-start justify-between w-full h-full mt-4">
      <div className="flex flex-col gap-y-1 my-3 w-full">
        <CustomPasswordTextField
          value={formData?.password}
          showLabel={false}
          name="password"
          placeholder={t("Password")}
          onChange={(e) => handleFormChange("password", e.target.value)}
        />
        <div className="flex justify-between">
        <span
          className="self-end font-semibold text-sm underline cursor-pointer text-[#5AC12F]"
          onClick={() => handleChangePanel(8)}
        >
          {t("Forgot password")}
        </span>
        <span
          className="self-end font-semibold text-sm underline cursor-pointer text-[#5AC12F]"
          onClick={() => handleChangePanel(0)}
        >
          {t("Continue with google instead")}
        </span>
        </div>
         
      </div>
      <CustomButton
        label={t("Continue")}
        loading={isLoading}
        className={`bg-[#5AC12F] flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72`}
        onClick={handleSubmit}
      />
    </div>
  );
}
