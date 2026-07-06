"use client";

import { useAuth } from "@/lib/context/auth/auth.context";
import CustomButton from "@/lib/ui/useable-components/button";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function LoginPage() {
  const t = useTranslations();
  const { setActivePanel, setIsAuthModalVisible } = useAuth();

  useEffect(() => {
    setActivePanel(1);
    setIsAuthModalVisible(true);
  }, [setActivePanel, setIsAuthModalVisible]);

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold">{t("login_label")}</h1>
      <p className="mt-3 text-sm text-neutral-600">
        {t("password_reset_success")}
      </p>
      <CustomButton
        label={t("open_login_label")}
        onClick={() => {
          setActivePanel(1);
          setIsAuthModalVisible(true);
        }}
        className="mt-6 rounded-full bg-primary-color p-3"
      />
    </div>
  );
}
