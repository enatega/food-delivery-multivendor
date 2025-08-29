// lib/utils/constants/profileDefaultTabs.ts
"use client";
import { useTranslations } from "next-intl";
import { ITabItem } from "@/lib/utils/interfaces";

export const useProfileDefaultTabs = (): ITabItem[] => {
  const t = useTranslations();
  return [
    { label: t("profileDefaultTabs.tab1"), path: "/profile" },
    { label: t("profileDefaultTabs.tab2"), path: "/profile/addresses" },
    { label: t("profileDefaultTabs.tab3"), path: "/profile/order-history" },
    { label: t("profileDefaultTabs.tab4"), path: "/profile/settings" },
    { label: t("profileDefaultTabs.tab5"), path: "/profile/getHelp" },
    { label: t("profileDefaultTabs.tab6"), path: "/profile/customerTicket" },
  ];
};
