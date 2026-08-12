"use client";
import CustomButton from "@/lib/ui/useable-components/button";
import TextComponent from "@/lib/ui/useable-components/text-field";
import VendorModeToggle from "@/lib/ui/useable-components/vendor-mode-toggle";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";

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
      <div className="flex w-full justify-center">
        <VendorModeToggle compact />
      </div>
    </div>
  );
}
