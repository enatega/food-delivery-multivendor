"use client";
// Icons
import PersonIcon from "@/lib/utils/assets/svg/person";

// Components
import CustomButton from "@/lib/ui/useable-components/button";
import CustomTextField from "@/lib/ui/useable-components/input-field";
import CustomPasswordTextField from "@/lib/ui/useable-components/password-input-field";
import CustomPhoneTextField from "@/lib/ui/useable-components/phone-input-field";
import PhoneConflictModal from "../phone-conflict-modal";

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
import { useEffect, useState } from "react";
import useUser from "@/lib/hooks/useUser";

export default function SignUpWithEmail({
  handleChangePanel,
  formData,
  handleFormChange,
  setFormData,
}: ILoginWithEmailProps) {
  // Hooks
  const t = useTranslations();
  const {
    sendOtpToEmailAddress,
    sendOtpToPhoneNumber,
    isLoading,
    setIsLoading,
    setIsRegistering,
    setIsAuthModalVisible,
    handleCreateUser,
    checkPhoneExists,
    checkEmailExists,
  } = useAuth();
  const { showToast } = useToast();
  const { SKIP_EMAIL_VERIFICATION, SKIP_MOBILE_VERIFICATION } = useConfig();
  const [isValid, setIsValid] = useState(true);
  const [showPhoneConflictModal, setShowPhoneConflictModal] = useState(false);
  const { fetchProfile } = useUser();

  useEffect(() => {
    fetchProfile();
  }, []);

  // Validation
  const validatePassword = (password: string) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return strongPasswordRegex.test(password);
  };

  // Handlers
  const handleSubmit = async (isPhoneExists = false) => {
    try {
      setIsLoading(true);
      setIsRegistering(true);

      // Required fields
      if (Object.values(formData).some((val) => !val)) {
        showToast({
          type: "error",
          title: t("create_user_label"),
          message: t("all_fields_are_required_to_be_filled_message"),
        });
        return;
      }

      // Name validation
      const namePattern = /^[A-Za-z\s]+$/;
      if (!namePattern.test(formData.name || "")) {
        showToast({
          type: "error",
          title: t("create_user_label"),
          message: t("please_enter_a_valid_name_message"),
        });
        return;
      }
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValid(emailRegex.test(formData.email || ""));

      if (!emailRegex.test(formData.email || "")) {
        showToast({
          type: "error",
          title: t("create_user_label"),
          message: t("please_enter_valid_email_address_message"),
        });
        return;
      }

      // Password strength
      if (!validatePassword(formData.password || "")) {
        showToast({
          type: "error",
          title: t("create_user_label"),
          message: t("password_not_strong_enough_message"),
        });
        return;
      }

      // Check email existence first (before phone check)
      // Only check if we are NOT already continuing with isPhoneExists flag
      if (!isPhoneExists && formData.email) {
        console.log("Checking email existence for:", formData.email);
        const emailResult = await checkEmailExists(formData.email);
        const emailExists = !!emailResult?._id;
        console.log("Email exists result:", emailExists);

        if (emailExists) {
          // Email already exists - show toast and stop
          showToast({
            type: "error",
            title: t("create_user_label"),
            message: t("email_already_registered"),
          });
          return;
        }
      }

      // If phone provided, check existence
      // Only check if we are NOT continuing with isPhoneExists flag
      if (formData.phone && !isPhoneExists) {
        console.log("Checking phone existence for:", formData.phone);
        const phoneExists = await checkPhoneExists(formData.phone);
        console.log("Phone exists result:", phoneExists);

        if (phoneExists) {
          // Email is new but phone exists - show phone conflict modal
          console.log("Phone exists with new email, showing modal");
          setShowPhoneConflictModal(true);
          return;
        }
      }

      // Verification flow (prioritize email, then phone, then direct create)
      if (formData.email && !SKIP_EMAIL_VERIFICATION) {
        // Store isPhoneExists in formData before proceeding to email verification
        if (isPhoneExists) {
          setFormData({ ...formData, isPhoneExists: true });
        }
        sendOtpToEmailAddress(formData.email);
        handleChangePanel(3); // Email OTP step
        return;
      }

      if (formData.phone && !SKIP_MOBILE_VERIFICATION) {
        sendOtpToPhoneNumber(formData.phone);
        handleChangePanel(6); // Phone OTP step
        return;
      }

      // If both verifications are skipped → create user immediately
      if (SKIP_EMAIL_VERIFICATION && SKIP_MOBILE_VERIFICATION) {
        const userData = await handleCreateUser({
          email: formData.email,
          phone: formData.phone,
          name: formData.name,
          password: formData.password,
          emailIsVerified: false,
          isPhoneExists: isPhoneExists,
        });

        handleChangePanel(0);
        setIsAuthModalVisible(false);

        if (userData) {
          showToast({
            type: "success",
            title: t("register_label"),
            message: t("successfully_registered_your_account_message"),
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
      setIsRegistering(false);
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-start justify-between w-full h-full dark:bg-gray-900 dark:text-gray-100">
      <PersonIcon lightColor="#000000" darkColor="#FFFFFF" />
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
      {/* Email Validation message */}
      <div className={` ${isValid ? `hidden` : ``} h-[20px]  `}>
        {!isValid && (
          <p className="text-red-500 text-sm">
            {t("please_enter_valid_email_address_message")}
          </p>
        )}
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
          className="flex items-center justify-center gap-2 rounded-full py-2 px-4 text-sm font-medium mt-2 dark:bg-gray-500 dark:text-gray-300 dark:hover:bg-gray-600 text-gray-700 hover:bg-gray-100 transition-colors duration-200 w-full md:w-auto self-center"
        >
          <FcGoogle className="text-lg" />
          {t("continue_with_google_instead_label")}
        </button>
      </div>
      <CustomButton
        label={t("continue_label")}
        className={`bg-primary-color flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72`}
        onClick={() => handleSubmit()}
        loading={isLoading}
      />
      <PhoneConflictModal
        isVisible={showPhoneConflictModal}
        onCancel={() => setShowPhoneConflictModal(false)}
        onConfirm={() => {
          setFormData({ ...formData, isPhoneExists: true });
          setShowPhoneConflictModal(false);
          handleSubmit(true);
        }}
      />
    </div>
  );
}
