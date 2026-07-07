"use client";

import CustomButton from "@/lib/ui/useable-components/button";
import { USER_CURRENT_LOCATION_LS_KEY } from "@/lib/utils/constants";
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";
import { useTranslations } from "next-intl";

export default function ComingSoonScreen() {
  const t = useTranslations();

  // In tenant/white-label mode the API injects the zone's centroid so we can
  // offer a "go to our service area" shortcut instead of the hardcoded Islamabad.
  const zoneCenter =
    typeof window !== "undefined"
      ? window.__TENANT_BRANDING__?.zone_center ?? null
      : null;

  const isTenantMode = typeof window !== "undefined" && !!window.__TENANT_BRANDING__;

  const destination = zoneCenter
    ? {
        lat: zoneCenter.lat,
        lng: zoneCenter.lng,
        label: zoneCenter.title,
      }
    : {
        // Default fallback: Islamabad
        lat: 33.699619,
        lng: 73.036187,
        label: "Islamabad, Pakistan",
      };

  const handleClick = () => {
    onUseLocalStorage(
      "save",
      USER_CURRENT_LOCATION_LS_KEY,
      JSON.stringify({
        label: destination.label,
        location: {
          coordinates: [destination.lng, destination.lat],
        },
        _id: "",
        deliveryAddress: destination.label,
      })
    );
    window.location.reload();
  };

  const buttonLabel = isTenantMode && zoneCenter
    ? `Explore restaurants in ${zoneCenter.title}`
    : "Click anywhere on this screen to explore restaurants.";

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer relative flex flex-col rounded-lg items-center justify-center py-8 overflow-hidden mt-10 text-center bg-gradient-to-b from-primary-color to-primary-dark hover:from-primary-dark hover:to-primary-color text-white"
    >
      {/* Floating Food Emojis */}
      <span aria-hidden="true" className="absolute top-10 left-10 text-4xl opacity-20 animate-bounce">🍕</span>
      <span aria-hidden="true" className="absolute top-1/3 right-10 text-5xl opacity-20 animate-pulse">🍔</span>
      <span aria-hidden="true" className="absolute bottom-16 left-1/4 text-3xl opacity-20 animate-bounce">🥗</span>
      <span aria-hidden="true" className="absolute bottom-24 right-1/3 text-4xl opacity-20 animate-pulse">🍣</span>
      <span aria-hidden="true" className="absolute top-1/4 left-36 text-4xl opacity-20 animate-bounce">🍩</span>
      <span aria-hidden="true" className="absolute bottom-10 right-1/4 text-4xl opacity-20 animate-pulse">🌮</span>

      {/* Main Illustration */}
      <div className="w-40 h-40 md:w-56 md:h-56 rounded-full flex items-center justify-center bg-white/20 mb-8">
        <span className="text-5xl md:text-7xl">🍴</span>
      </div>

      {/* Heading */}
      <h1 className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-lg">
        {t("coming_soon_in_your_area_label")}
      </h1>

      {/* Sub Text */}
      <p className="text-lg md:text-xl text-white/90 max-w-xl mb-8">
        {isTenantMode && zoneCenter
          ? `We currently serve ${zoneCenter.title}. Tap below to explore!`
          : t("coming_soon_in_your_area_message")}
      </p>

      {/* Zone navigation button */}
      <CustomButton
        label={buttonLabel}
        className="px-8 py-3 rounded-full font-semibold bg-white text-primary-color shadow-lg hover:bg-white/90 hover:scale-105 transition-transform duration-200"
      />
    </div>
  );
}
