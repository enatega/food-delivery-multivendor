// Icons
import PersonIcon from "@/lib/utils/assets/svg/person";

// Components
import CustomButton from "@/lib/ui/useable-components/button";
import CustomTextField from "@/lib/ui/useable-components/input-field";
import CustomPasswordTextField from "@/lib/ui/useable-components/password-input-field";
import CustomPhoneTextField from "@/lib/ui/useable-components/phone-input-field";

// Interfaces
import { ILoginWithEmailProps } from "@/lib/utils/interfaces";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import useToast from "@/lib/hooks/useToast";
import { useTranslations } from "next-intl";
import { FcGoogle } from "react-icons/fc";

// Apollo
import { ApolloError } from "@apollo/client";

export default function SignUpWithEmail({
  handleChangePanel,
  formData,
  handleFormChange,
}: ILoginWithEmailProps) {
  // Hooks
  const t = useTranslations();
  const {
    handleCreateUser,
    setUser,
    sendOtpToEmailAddress,
    sendOtpToPhoneNumber,
    isLoading,
    setIsLoading,
    setIsRegistering,
    setIsAuthModalVisible,
  } = useAuth();
  const { showToast } = useToast();
  const { SKIP_EMAIL_VERIFICATION, SKIP_MOBILE_VERIFICATION } = useConfig();

  // Validation
  const validatePassword = (password: string) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return strongPasswordRegex.test(password);
  };

  // Handlers
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setIsRegistering(true);
      if (Object.values(formData).some((val) => !val)) {
        return showToast({
          type: "error",
          title: t("create_user_label"),
          message: t("all_fields_are_required_to_be_filled_message"),
        });
      }
      const namePattern = /^[A-Za-z\s]+$/;
      if (!namePattern.test(formData.name || "")) {
        return showToast({
          type: "error",
          title: t("create_user_label"),
          message: t("please_enter_a_valid_name_message"), // add this key in translations
        });
      }
      if (!validatePassword(formData.password || "")) {
        return showToast({
          type: "error",
          title: t("create_user_label"),
          message: t("password_not_strong_enough_message"),
        });
      } else {
        const userData = await handleCreateUser({
          email: formData.email,
          phone: formData.phone,
          name: formData.name,
          password: formData.password,
        });

        if (
          !userData.emailIsVerified &&
          userData.email &&
          !SKIP_EMAIL_VERIFICATION
        ) {
          setUser((prev) => ({
            ...prev,
            email: userData.email,
          }));
          sendOtpToEmailAddress(userData.email);
          // Verify email OTP
          handleChangePanel(3);
        } else if (
          !userData.phoneIsVerified &&
          userData.phone &&
          !SKIP_MOBILE_VERIFICATION
        ) {
          setUser((prev) => ({
            ...prev,
            phone: userData.phone,
          }));
          sendOtpToPhoneNumber(userData.phone);
          // Verify Phone OTP
          handleChangePanel(6);
        } else if (
          userData.userId &&
          SKIP_EMAIL_VERIFICATION &&
          SKIP_MOBILE_VERIFICATION
        ) {
          // Navigate to first modal
          handleChangePanel(0);
          setIsAuthModalVisible(false);
          showToast({
            type: "success",
            title: t("register_label"),
            message: t("successfully_registered_your_account_message"), // put an exclamation mark at the end of this sentence in the translations
          });
        }
      }
    } catch (err) {
      const error = err as ApolloError;
      console.error("An error occured while registering a new user", error);
      showToast({
        type: "error",
        title: t("register_label"),
        message:
          error?.cause?.message ||
          t("an_error_occurred_while_registering_message"),
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-start justify-between w-full h-full">
      <PersonIcon />
      <div className="flex flex-col w-full h-auto self-start left-2 my-2">
        <h3 className="text-3xl font-semibold">
          {t("lets_get_you_started_label")}
        </h3>
        {/*replace lets with let's in the translation*/}
        <p>{t("first_lets_create_your_account_message")}</p>
        {/*replace "First" with "First," in the translation*/}
      </div>
      <div className="flex flex-col gap-y-1 my-3 w-full">
        <CustomTextField
          value={formData.name}
          showLabel={false}
          name="name"
          type="text"
          placeholder={t("nameLabel")}
          onChange={(e) => handleFormChange("name", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-y-1 my-3 w-full">
        <CustomTextField
          value={formData.email}
          showLabel={false}
          name="email"
          type="email"
          placeholder={t("emailLabel")}
          onChange={(e) => handleFormChange("email", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-y-1 my-3 w-full">
        <CustomPhoneTextField
          value={formData.phone}
          showLabel={false}
          mask={"999 999 999"}
          name="phone"
          type="text"
          placeholder={t("phone_label")}
          onChange={(val) => handleFormChange("phone", val)}
        />
      </div>
      <div className="flex flex-col gap-y-1 my-3 w-full">
        <CustomPasswordTextField
          value={formData.password}
          showLabel={false}
          name="password"
          placeholder={t("password_label")}
          onChange={(e) => handleFormChange("password", e.target.value)}
        />
        <button
          type="button"
          onClick={() => handleChangePanel(0)}
          className="flex items-center justify-center gap-2 rounded-full py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200 w-full md:w-auto self-center"
        >
          <FcGoogle className="text-lg" />
          {t("continue_with_google_instead_label")}
        </button>
      </div>
      <CustomButton
        label={t("continue_label")}
        className={`bg-[#5AC12F] flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72`}
        onClick={handleSubmit}
        loading={isLoading}
      />
    </div>
  );
}
