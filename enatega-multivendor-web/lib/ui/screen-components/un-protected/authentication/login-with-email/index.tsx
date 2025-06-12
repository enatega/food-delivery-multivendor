// Components
import CustomButton from "@/lib/ui/useable-components/button";
import CustomTextField from "@/lib/ui/useable-components/input-field";

// Interfaces
import { ILoginWithEmailProps } from "@/lib/utils/interfaces";

// Icons
import EmailIcon from "@/public/assets/images/svgs/email";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import useToast from "@/lib/hooks/useToast";
import { useTranslations } from "next-intl";

export default function LoginWithEmail({
  handleChangePanel,
  formData,
  handleFormChange,
}: ILoginWithEmailProps) {
  // Hooks
  const t = useTranslations();
  const { setUser, checkEmailExists, isLoading } = useAuth();
  const { showToast } = useToast();

  // Handlers
  const handleSubmit = async () => {
    if (!formData?.email) {
      return showToast({
        type: "error",
        title: t("Error"),
        message: t("Please enter a valid email address"),
      });
    } else {
      // Check if the email exits
      const emailExists = await checkEmailExists(formData?.email);
      if (emailExists._id && emailExists.userType !== "default") {
        showToast({
          type: "warn",
          title: t("Login"),
          message: t("The email is associated with another provider"),
        });
        // re-direct to main modal
        return handleChangePanel(0);
      } else if (emailExists.userType === "default") {
        // re-direct to enter password
        return handleChangePanel(7);
      } else {
        // re-direct to registration
        handleChangePanel(2);
      }
    }
  };

  const handleChange = (email: string) => {
    handleFormChange("email", email);
    setUser((prev) => ({
      ...prev,
      email,
    }));
  };
  return (
    <div className="flex flex-col items-start justify-between w-full h-full">
      <EmailIcon />
      <div className="flex flex-col w-full h-auto self-start left-2 my-2">
        <h3 className="text-2xl">{t("Whats your email")}?</h3>
        {/*replace whats with what's in the translation*/}
        <p>{t("Well check if you have an account")}</p>
        {/*replace well with we'll in the translation*/}
      </div>
      <div className="flex flex-col gap-y-1 my-6 w-full">
        <CustomTextField
          value={formData?.email}
          showLabel={false}
          name="email"
          type="text"
          placeholder={t("Email")}
          onChange={(e) => handleChange(e.target.value)}
        />
        <span
          className="self-end font-semibold text-sm underline cursor-pointer text-[#5AC12F]"
          onClick={() => handleChangePanel(0)}
        >
          {t("Continue with google instead")}
        </span>
      </div>
      <CustomButton
        label={t("Continue")}
        loading={isLoading}
        onClick={handleSubmit}
        className={`bg-[#5AC12F] flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72`}
      />
    </div>
  );
}
