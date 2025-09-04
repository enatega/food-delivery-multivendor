// Components
import { useAuth } from "@/lib/context/auth/auth.context";
import CustomButton from "@/lib/ui/useable-components/button";
import Divider from "@/lib/ui/useable-components/custom-divider";
import CustomIconButton from "@/lib/ui/useable-components/custom-icon-button";
import { ILoginWithGoogleProps } from "@/lib/utils/interfaces";

// Assets
import GoogleLogo from "@/public/assets/images/svgs/google-logo";

// Hooks
import { useTranslations } from "next-intl";

// Next
import Link from "next/link";

// Font Awesome

export default function LoginWithGoogle({
  googleLogin,
  handleChangePanel,
}: ILoginWithGoogleProps) {
  // Hooks
  const t = useTranslations();
  const { isLoading } = useAuth();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-2 py-6 md:px-8 dark:text-white dark:bg-gray-900">
      {/* Header Text */}
      
      <div className="flex flex-col gap-y-2 text-center w-full mb-6">

        <h3 className="text-2xl md:text-3xl font-semibold text-black dark:text-white">
          {t("welcome_label")}!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
          {t("sign_up_or_log_in_to_continue_message")}
        </p>
      </div>

      {/* Google Login */}
      <div className="w-full max-w-sm mb-4">
        <CustomIconButton
          loading={isLoading}
          SvgIcon={GoogleLogo}
          classNames="hover:bg-gray-100 dark:text-black w-full"
          title={t("sign_in_with_google_label")}
          handleClick={googleLogin}
        />
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center w-full max-w-sm mb-4">
        <Divider color="border-gray-200 dark:border-gray-600" />
        <span className="mx-2 text-sm text-gray-500 dark:text-gray-300">{t("or_label")}</span>
        <Divider color="border-gray-200 dark:border-gray-600" />
      </div>

      {/* Login Button */}
      <div className="w-full max-w-sm mb-4">
        <CustomButton
          label={t("login")}
          className="bg-[#5AC12F] hover:bg-[#54ad2e]  text-white dark:text-gray-100 w-full py-3 rounded-full border border-gray-300 dark:border-gray-600 flex justify-center items-center"
          onClick={() => handleChangePanel(1)}
        />
      </div>

      {/* Sign Up Button */}
      <div className="w-full max-w-sm mb-4">
        <CustomButton
          label={t("sign_up_label")}
          className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:text-white w-full py-3 rounded-full border border-gray-300 dark:border-gray-600 flex justify-center items-center text-black"
          onClick={() => handleChangePanel(2)}
        />
      </div>

      {/* Terms and Privacy */}
      <p className="text-center text-xs text-gray-500 max-w-sm px-2 dark:text-gray-300 ">
        {t("by_signing_up_you_agree_to_our_message")}&nbsp;
        <Link
          href="/terms"
          target="_blank"
          className="font-bold text-black dark:text-gray-300 underline hover:text-gray-700"
        >
          {t("terms_label")}{" "}
        {t("and_conditions_and_message")}&nbsp;
        </Link>
        {t("and_labed")}{" "}
        <Link
          href="/privacy"
          target="_blank"
          className="text-black dark:text-gray-300 font-bold underline hover:text-gray-700"
        >
          {t("privacy_policy_label")}
        </Link>
        .
      </p>
    </div>
  );
}
