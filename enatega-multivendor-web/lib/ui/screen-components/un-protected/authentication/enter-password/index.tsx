// Components
import CustomButton from "@/lib/ui/useable-components/button";
import CustomPasswordTextField from "@/lib/ui/useable-components/password-input-field";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import useToast from "@/lib/hooks/useToast";
import { useTranslations } from "next-intl";
import { FcGoogle } from "react-icons/fc";

// Interfaces
import { useConfig } from "@/lib/context/configuration/configuration.context";
import { IAuthFormData, IEnterPasswordProps } from "@/lib/utils/interfaces";
import PasswordIcon from "@/lib/utils/assets/svg/password";
export default function EnterPassword({
  handleChangePanel,
  handleFormChange,
  setFormData,
  formData,
}: IEnterPasswordProps) {
  // Hooks
  const t = useTranslations();
  const {
    handleUserLogin,
    sendOtpToEmailAddress,
    sendOtpToPhoneNumber,
    setIsAuthModalVisible,
    isLoading,
  } = useAuth();
  const { showToast } = useToast();
  const { SKIP_EMAIL_VERIFICATION, SKIP_MOBILE_VERIFICATION } = useConfig();

  // Handlers
  const handleSubmit = async () => {
    if (!formData?.password) {
      return showToast({
        type: "error",
        title: t("update_phone_name_update_error_title"),
        message: t("please_enter_valid_password_message"),
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
        title: t("update_phone_name_update_error_title"),
        message: t("please_enter_valid_password_message"),
      });
    } else {
      // Check for email & phone verification
      if (!user?.emailIsVerified && !SKIP_EMAIL_VERIFICATION) {
        if (user?.email) {
          sendOtpToEmailAddress(user?.email);
          // re-direct to email-otp verification
          handleChangePanel(3);
        } else {
          // save the email address first
          handleChangePanel(5);
        }
      } else if (!user?.phoneIsVerified && !SKIP_MOBILE_VERIFICATION) {
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
        setIsAuthModalVisible(false);
        // showToast({
        //   type: "success",
        //   title: t("Login"),
        //   message: t("You have logged in successfully"),
        // });
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full px-4 sm:px-6 lg:px-8 py-6 dark:bg-gray-900 dark:text-white">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-start">
            <PasswordIcon />
            <div className="mt-4">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
                {t("good_to_see_you_again")}
              </h3>
              <p className="text-gray-600  mt-1 text-sm sm:text-base">
                {t("enter_password_to_login")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <CustomPasswordTextField
              value={formData?.password}
              showLabel={false}
              name="password"
              placeholder={t("password")}
              onChange={(e) => handleFormChange("password", e.target.value)}
            />

            <div className="flex justify-end w-full">
              <span
                onClick={() => handleChangePanel(8)}
                className="text-primary-color hover:underline text-sm font-medium cursor-pointer"
              >
                {t("forgot_password_label")}
              </span>
            </div>

            <CustomButton
              label={t("continue_label")}
              loading={isLoading}
              className="bg-primary-color w-full rounded-full border border-gray-300 p-3"
              onClick={handleSubmit}
            />

            <button
              type="button"
              onClick={() => handleChangePanel(0)}
              className="flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300  dark:bg-gray-500 dark:hover:bg-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 w-full"
            >
              <FcGoogle className="text-xl" />
              {t("continue_with_google_instead_label")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
