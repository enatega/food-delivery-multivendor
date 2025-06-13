// Components
import CustomButton from "@/lib/ui/useable-components/button";
import CustomPasswordTextField from "@/lib/ui/useable-components/password-input-field";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import useToast from "@/lib/hooks/useToast";
import { useTranslations } from "next-intl";

// Interfaces
import { IEnterPasswordProps } from "@/lib/utils/interfaces";

export default function ChangePassword({
  handleFormChange,
  setFormData,
  formData,
}: IEnterPasswordProps) {
  // Hooks
  const t = useTranslations();
  const { handlePasswordReset, isLoading } =
    useAuth();
  const { showToast } = useToast();
  // Handlers
  const handleSubmit = async () => {
    if (!formData?.password || formData?.password?.length < 6) {
      return showToast({
        type: "error",
        title: t("Error"),
        message: t("Please enter a valid password"),
      });
    }
    try {
      // update the password
      await handlePasswordReset(
        formData?.password || '',
        formData?.email || '',
        setFormData
      );
    } catch (error) {
      showToast({
        type: "error",
        title: t("Error"),
        message: t("Failed to reset password. Please try again."),
      });
    }

  }
  return (
    <div className="flex flex-col items-start justify-between w-full h-full mt-4">
      <h1>Update Password</h1>
      <div className="flex flex-col gap-y-1 my-3 w-full">
        <CustomPasswordTextField
          value={formData?.password}
          showLabel={false}
          name="password"
          placeholder={t("Password")}
          onChange={(e) => handleFormChange("password", e.target.value)}
        />

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
