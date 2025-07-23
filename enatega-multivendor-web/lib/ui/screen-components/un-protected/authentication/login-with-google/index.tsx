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
import { useRouter } from "next/navigation";

// Font Awesome

export default function LoginWithGoogle({
  googleLogin,
  handleChangePanel,
}: ILoginWithGoogleProps) {
  // Hooks
  const t = useTranslations();
  const { isLoading } = useAuth();

  const router = useRouter();

  return (
    <div>
      <div className="flex flex-col gap-y-2  left-0">
        <h3 className="font-medium text-2xl text-black">{t("Welcome")}!</h3>
        <p className="font-normal">{t("Sign up or log in to continue")}</p>
      </div>
      <div className="my-4">
        <CustomIconButton
          loading={isLoading}
          SvgIcon={GoogleLogo}
          title={t("Sign In With Google")}
          handleClick={googleLogin}
        />
      </div>

      <div className="flex items-center justify-between w-full">
        <Divider color="border-gray-200" />
        <span className="mx-1">or</span>
        <Divider color="border-gray-200" />
      </div>
      <div className="my-4">
        <CustomButton
          label={t("Login")}
          className={`bg-[#5AC12F] flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72`}
          onClick={() => handleChangePanel(1)}
        />
      </div>
      <div className="my-4">
        <CustomButton
          label={t("Sign Up")}
          className="bg-white flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 m-auto w-72"
          onClick={() => handleChangePanel(2)}
        />
      </div>
      <p>
        {t("By signing up, you agree to our")} &nbsp;
        <span className="font-bold ">
          <Link href="/terms">{t("Terms")}</Link>
        </span>{" "}
        &nbsp;
        {t("and Conditions and")} &nbsp;
        <span
          className="font-bold cursor-pointer"
        >
           <Link href="/privacy">
          {t("Privacy Policy")}
          </Link>
        </span>
        .
      </p>
    </div>
  );
}
