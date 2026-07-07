"use client";

import React from "react";
import Cities from "../Cities";
import Info from "../Info";
import GrowBussiness from "../GrowBussiness";
import MiniCards from "../MiniCards";
import Couriers from "../ForCouriers";
import TinyTiles from "@/lib/ui/useable-components/tinyTiles";
import MoveableCard from "@/lib/ui/useable-components/Moveable-Card";
import { useTranslations } from "next-intl";
import becomeStorePartnerImg from "@/lib/assets/become_store.png";
import reachNewCustomersImg from "@/lib/assets/we_do_heavy_lifting.png";
import deliveryFee from "@/public/assets/images/png/deliveryFee.webp";
import ZeroDelivery from "@/public/assets/images/png/0delivery.webp";

// ── Generic app card — replaces Enatega-branded phone mockups ─────────────────
// Matches HomeCard's exact dimensions (320px image area + text below)

const PhoneIcon = () => (
  <svg className="w-20 h-20 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth={2} />
  </svg>
);

const ForkIcon = () => (
  <svg className="w-20 h-20 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);

const BikeIcon = () => (
  <svg className="w-20 h-20 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M15 6a1 1 0 0 0-1-1h-1v1" />
    <path d="M6 17.7l-1.5-4.7 5-3 3.5 7" />
    <path d="M9 9l6 2-2 6" />
    <path d="M9 9l2-4h4l2 3.5" />
  </svg>
);

interface GenericAppCardProps {
  icon: React.ReactNode;
  gradientStyle: React.CSSProperties;
  heading?: string;
  subText?: string;
  link?: string;
}

const GenericAppCard: React.FC<GenericAppCardProps> = ({
  icon,
  gradientStyle,
  heading,
  subText,
  link,
}) => {
  const navigate = () => {
    if (link) window.open(link, "_blank");
  };

  return (
    <div>
      <div
        className="rounded-3xl flex items-center justify-center relative overflow-hidden cursor-pointer"
        style={{ height: "320px", ...gradientStyle }}
        onClick={navigate}
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
        {/* Icon */}
        <div className="relative z-10">{icon}</div>
      </div>
      <div className="my-8">
        <h1 className="font-extrabold text-[22px] my-2 dark:text-white">{heading}</h1>
        <button onClick={navigate} className="text-[#03c3e8] cursor-pointer">
          {subText}
        </button>
      </div>
    </div>
  );
};

// ── Tenant version of LifeWithEnatega — same layout, generic app cards ─────────

const TenantEnategaInfo: React.FC = () => {
  const t = useTranslations();

  return (
    <div className="mt-[80px] mb-[80px]">
      {/* Same tagline & subheading (deepReplaceValues handles "Enatega" → tenant name) */}
      <div className="flex flex-col justify-center items-center my-[20px] dark:text-white">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold m-4">
          {t("InfoCardHomeScreen.tagLine")}
        </h1>
        <p className="m-4 text-xl md:text-2xl lg:text-3xl">
          {t("InfoCardHomeScreen.subHeading")}
        </p>
      </div>

      {/* Same 2 MoveableCards (deliveryFee & ZeroDelivery are generic photos) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <MoveableCard
          image={deliveryFee}
          heading={t("InfoCardHomeScreen.Title1")}
          subText={t("InfoCardHomeScreen.SubText1")}
        />
        <MoveableCard
          image={ZeroDelivery}
          heading={t("InfoCardHomeScreen.Title2")}
          subText={t("InfoCardHomeScreen.SubText2")}
        />
      </div>

      {/* Generic gradient cards in place of Enatega-branded phone mockups */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-[30px] mb-[30px]">
        <GenericAppCard
          icon={<PhoneIcon />}
          gradientStyle={{
            background: "linear-gradient(135deg, var(--primary-color, #22c55e) 0%, #14532d 100%)",
          }}
          heading={t("Apps.heading1")}
          subText={t("Apps.subHeading1")}
          link="https://play.google.com/store/apps/details?id=com.enatega.multivendor&hl=en"
        />
        <GenericAppCard
          icon={<ForkIcon />}
          gradientStyle={{
            background: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)",
          }}
          heading={t("Apps.heading2")}
          subText={t("Apps.subHeading2")}
          link="https://play.google.com/store/apps/details?id=multivendor.enatega.restaurant&hl=en"
        />
        <GenericAppCard
          icon={<BikeIcon />}
          gradientStyle={{
            background: "linear-gradient(135deg, #374151 0%, #111827 100%)",
          }}
          heading={t("Apps.heading3")}
          subText={t("Apps.subHeading3")}
          link="https://play.google.com/store/apps/details?id=com.enatega.multirider&hl=en"
        />
      </div>
    </div>
  );
};

// ── Below-fold content for tenant subdomains ──────────────────────────────────
// Identical structure to the original Main sections; only the 3 app mockup
// cards are replaced with generic gradient cards above.

const TenantBelowFold: React.FC = () => {
  const t = useTranslations("MiniCardsHomeScreen");

  return (
    <div className="w-full">
      <Cities />
      <Info />
      <TenantEnategaInfo />
      <GrowBussiness />
      <MiniCards />
      <div className="grid grid-cols-1 md:grid-cols-2 my-[40px] gap-8">
        <TinyTiles
          image={reachNewCustomersImg.src}
          heading={t("title5")}
          buttonText={t("subText5")}
          backColor={"#eaf7fc"}
          link={"/restaurantInfo"}
        />
        <TinyTiles
          image={becomeStorePartnerImg.src}
          heading={t("title6")}
          buttonText={t("subText6")}
          backColor="#eaf7fc"
          link={"/restaurantInfo"}
        />
      </div>
      <Couriers />
    </div>
  );
};

export default TenantBelowFold;
