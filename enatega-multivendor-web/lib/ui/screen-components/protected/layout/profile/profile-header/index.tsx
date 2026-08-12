"use client";
import CustomButton from "@/lib/ui/useable-components/button";
import TextComponent from "@/lib/ui/useable-components/text-field";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";
import VendorModeToggle from "@/lib/ui/useable-components/vendor-mode-toggle";

export default function ProfileHeader() {
  const router = useRouter();
  const t = useTranslations();
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full items-center justify-between gap-4">
        <TextComponent
          text={t("ProfileSection.profile_label")}
          className="font-semibold md:text-3xl text-xl"
        />
        <CustomButton
          onClick={() => router.push("/profile/getHelp")}
          label={t("ProfileSection.gethelp")}
          type="button"
          className="text-base font-light bg-primary-light dark:bg-gray-800 px-[16px] py-[8px] text-primary-color"
        />
      </div>
      <div className="w-full max-w-[564px] rounded-3xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <VendorModeToggle />
      </div>
    </div>
  );
}
