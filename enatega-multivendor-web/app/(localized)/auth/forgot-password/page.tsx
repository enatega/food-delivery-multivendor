"use client";

import { useAuth } from "@/lib/context/auth/auth.context";
import CustomButton from "@/lib/ui/useable-components/button";
import CustomTextField from "@/lib/ui/useable-components/input-field";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function ForgotPasswordPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const { handleForgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [submitted, setSubmitted] = useState(false);

  const invalidLinkMessage = useMemo(() => {
    return searchParams.get("error") === "invalid"
      ? t("reset_link_invalid_or_expired_message")
      : "";
  }, [searchParams, t]);

  const handleSubmit = async () => {
    if (!email.trim()) return;
    await handleForgotPassword(email);
    setSubmitted(true);
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold">{t("password_recovery_label")}</h1>
      <p className="mt-3 text-sm text-neutral-600">
        {submitted
          ? t("reset_password_email_sent_generic_message")
          : t("whats_your_email_label")}
      </p>
      {invalidLinkMessage ? (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {invalidLinkMessage}
        </p>
      ) : null}
      <div className="mt-6">
        <CustomTextField
          value={email}
          showLabel={false}
          name="email"
          type="email"
          placeholder="example@domain.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <CustomButton
        label={t("continue_label")}
        loading={isLoading}
        onClick={handleSubmit}
        className="mt-6 rounded-full bg-primary-color p-3"
      />
    </div>
  );
}
