// lib/utils/constants/profileDefaultTabs.ts
"use client";
import { useTranslations } from "next-intl";
import { ITabItem } from "@/lib/utils/interfaces";
import { useAppMode } from "@/lib/mode";

export const useProfileDefaultTabs = (): ITabItem[] => {
  const t = useTranslations();
  const { isSingleVendor } = useAppMode();
  const base = [
    { label: t("profileDefaultTabs.tab1"), path: "/profile" },
    { label: t("profileDefaultTabs.tab2"), path: "/profile/addresses" },
    { label: t("profileDefaultTabs.tab3"), path: "/profile/order-history" },
    { label: t("profileDefaultTabs.tab4"), path: "/profile/settings" },
    { label: t("profileDefaultTabs.tab5"), path: "/profile/getHelp" },
    { label: t("profileDefaultTabs.tab6"), path: "/profile/customerTicket" },
  ];
  return isSingleVendor ? [
    ...base.slice(0, 3),
    { label: "Favorites", path: "/profile/favorites" },
    { label: "Vouchers", path: "/profile/vouchers" },
    { label: "Wallet", path: "/profile/wallet" },
    { label: "Membership", path: "/profile/membership" },
    { label: "Referral", path: "/profile/referral" },
    ...base.slice(3),
  ] : base;
};
