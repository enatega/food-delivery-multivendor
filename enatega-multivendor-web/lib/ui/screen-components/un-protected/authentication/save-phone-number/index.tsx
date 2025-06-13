// Components
import CustomPhoneTextField from "@/lib/ui/useable-components/phone-input-field";

// Icons
import PhoneIcon from "@/lib/utils/assets/svg/phone";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import useToast from "@/lib/hooks/useToast";
import useUser from "@/lib/hooks/useUser";
import CustomButton from "@/lib/ui/useable-components/button";
import { useTranslations } from "next-intl";

export default function SavePhoneNumber() {

  // Hooks
  const t = useTranslations();
  const { sendOtpToPhoneNumber, setUser, user, isLoading } = useAuth();
  const {profile}=useUser();
  const { showToast } = useToast();

  // Handlers
  const handleChange = (val:string) => {
    setUser((prev) => ({
      ...prev,
      phone: val,
    }))
  }
  const handleSubmit = async () => {
    try {
      if(!user?.phone) {
        showToast({
          type: "error",
          title: t("Error"),
          message: "Please enter a valid phone number",
        });
        return;
      }else if(profile?.phoneIsVerified){
        showToast({
          type: "info",
          title: t("Phone Verification"),
          message: t("Your phone number is already verified"),
        });
        return;
      }else{
        await sendOtpToPhoneNumber(user?.phone)
      }
    } catch (error) {
      console.log(error);
      showToast({
        type: "error",
        title: t("Error"),
        message: t("An error occured while saving the phone number"),
      });
    }
  };
  return (
    <div className="flex flex-col justify-between p-3 items-start w-[100%] ">
      <div className="self-start my-1">
        <PhoneIcon />
      </div>
      <h2 className="font-bold text-xl my-1">
        {t("Whats your mobile number")}
        {/*Put an apostrophy comma as "What's" and put a "?" mark at the end of sentence in the translation*/}
      </h2>
      <p className="my-1">
        {t("We need this to verify and secure your account")}
      </p>
      <div className="flex my-1">
        <CustomPhoneTextField
          mask="999 999 999 999"
          name="phone"
          showLabel={false}
          type="text"
          className="min-w-[22vw]"
          value={user?.phone}
          onChange={handleChange}
        />
      </div>
      <CustomButton
        className={`bg-[#5AC12F] flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72 my-1`}
        onClick={handleSubmit}
        loading={isLoading}
        label={t("Continue")}
      />
    </div>
  );
}
