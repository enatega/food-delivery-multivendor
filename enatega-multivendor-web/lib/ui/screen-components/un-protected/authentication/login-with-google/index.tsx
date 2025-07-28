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
    <div className="w-full h-full flex flex-col items-center justify-center px-2 py-6 md:px-8">
      {/* Header Text */}
      
      <div className="flex flex-col gap-y-2 text-center w-full mb-6">

        <h3 className="text-2xl md:text-3xl font-semibold text-black">
          {t("Welcome")}!
        </h3>
        <p className="text-gray-600 text-sm md:text-base">
          {t("Sign up or log in to continue")}
        </p>
      </div>

      {/* Google Login */}
      <div className="w-full max-w-sm mb-4">
        <CustomIconButton
          loading={isLoading}
          SvgIcon={GoogleLogo}
          classNames="hover:bg-gray-100 w-full"
          title={t("Sign In With Google")}
          handleClick={googleLogin}
        />
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center w-full max-w-sm mb-4">
        <Divider color="border-gray-200" />
        <span className="mx-2 text-sm text-gray-500">{t("or")}</span>
        <Divider color="border-gray-200" />
      </div>

      {/* Login Button */}
      <div className="w-full max-w-sm mb-4">
        <CustomButton
          label={t("Login")}
          className="bg-[#5AC12F] hover:bg-[#54ad2e] text-white w-full py-3 rounded-full border border-gray-300 flex justify-center items-center"
          onClick={() => handleChangePanel(1)}
        />
      </div>

      {/* Sign Up Button */}
      <div className="w-full max-w-sm mb-4">
        <CustomButton
          label={t("Sign Up")}
          className="bg-white hover:bg-gray-100 w-full py-3 rounded-full border border-gray-300 flex justify-center items-center text-black"
          onClick={() => handleChangePanel(2)}
        />
      </div>

      {/* Terms and Privacy */}
      <p className="text-center text-xs text-gray-500 max-w-sm px-2">
        {t("By signing up, you agree to our")}&nbsp;
        <Link
          href="/terms"
          className="font-semibold underline hover:text-gray-700"
        >
          {t("Terms")}
        </Link>{" "}
        {t("and Conditions and")}&nbsp;
        <Link
          href="/privacy"
          className="font-semibold underline hover:text-gray-700"
        >
          {t("Privacy Policy")}
        </Link>
        .
      </p>
    </div>
  );
}
