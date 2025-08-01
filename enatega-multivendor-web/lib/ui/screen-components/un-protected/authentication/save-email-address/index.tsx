// Components
import CustomButton from "@/lib/ui/useable-components/button";
import CustomTextField from "@/lib/ui/useable-components/input-field";

// Interfaces
import { ISaveEmailAddressProps } from "@/lib/utils/interfaces";

// Icons
import EmailIcon from "@/public/assets/images/svgs/email";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import useToast from "@/lib/hooks/useToast";
import useUser from "@/lib/hooks/useUser";
import { useTranslations } from "next-intl";

export default function SaveEmailAddress({
  handleChangePanel,
}: ISaveEmailAddressProps) {
  // Hooks
  const t = useTranslations();
  const {showToast} = useToast();
  const { setUser, user, sendOtpToEmailAddress, setIsAuthModalVisible, isLoading} = useAuth();
  const {profile} = useUser();

  // Handlers
  const handleSubmit = async () => {
    try {
      if (!user?.email) {
        showToast({
          type: "error",
          title: t("Error"),
          message: t("please_enter_valid_email_address_message "),
        });
        return;
      }
      if (!profile?.emailIsVerified) {
        await sendOtpToEmailAddress(user?.email);
        handleChangePanel(3);
        return;
      } else{
        showToast({
          type:"info",
          title: t("email_verification_label"),
          message:t("your_email_already_verified_message")
        })
        if(profile?.phoneIsVerified){
          handleChangePanel(0);
          setIsAuthModalVisible(false)
          showToast({
            type: "success",
            title: t("Login"),
            message: t("login_success_message"), // put ! at the end of the statement in the translation
          });
        }else{
          handleChangePanel(4);
        }
        
      }
    } catch (error) {
      console.error('An error occurred while saving email address:', error);
    }
  }
  const handleChange = (email: string) => {
    setUser((prev) => ({
      ...prev,
      email,
    }));
  };
  return (
    <div className="flex flex-col items-start justify-between w-full h-full">
      <EmailIcon />
      <div className="flex flex-col w-full h-auto self-start left-2 my-2">
        <h3 className="text-2xl">
          {t("please_enter_your_email_address_label")}?
        </h3>
        <span className="font-bold">example@email.com</span>
      </div>
      <div className="flex flex-col gap-y-1 my-6 w-full">
        <CustomTextField
          value={user?.email}
          showLabel={false}
          name=""
          type="text"
          placeholder={t("email")}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      <CustomButton
        label={t("continue_label")}
        loading={isLoading}
        onClick={handleSubmit}
        className={`bg-[#5AC12F] flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72`}
      />
    </div>
  );
}
