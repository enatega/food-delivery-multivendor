"use client";

import { IProtectedHomeLayoutComponent } from "@/lib/utils/interfaces";
import { usePathname, useRouter } from "next/navigation";

// Svg
import { CutlerySvg, StoreSvg } from "@/lib/utils/assets/svg";
import PaddingContainer from "@/lib/ui/useable-components/containers/padding";
// context
import { useSearchUI } from "@/lib/context/search/search.context";
import TabItem from "@/lib/ui/useable-components/tab-item/TabItem";
import { useTranslations } from "next-intl";
import homeTabSvg from "@/lib/utils/assets/svg/houseTabsvg";
import { useAppMode } from "@/lib/mode";

export default function HomeLayout({
  children,
}: IProtectedHomeLayoutComponent) {
  const router = useRouter();
  const pathname = usePathname();
  const { isSearchFocused, setIsSearchFocused } = useSearchUI();
  const { isSingleVendor } = useAppMode();

  const onChangeScreen = (
    name: "Discovery" | "Restaurants" | "Store" | "Deals" | "Browse",
  ) => {
    switch (name) {
      case "Discovery":
        router.push("/discovery");
        break;
      case "Restaurants":
        router.push("/restaurants");
        break;
      case "Store":
        router.push("/store");
        break;
      case "Deals":
        router.push("/deals");
        break;
      case "Browse":
        router.push("/browse");
        break;
      default:
        router.push("/discovery");
        break;
    }
  };

  const isDiscovery = pathname === "/discovery";
  const isRestaurants = pathname === "/restaurants";
  const isStore = pathname === "/store";
  const isDeals = pathname === "/deals";
  const isBrowse = pathname === "/browse";

  const t = useTranslations();

  return (
    <div className="flex min-h-full w-full flex-col">
      {/* click-away handler */}
      {isSearchFocused && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsSearchFocused(false);
          }}
          className="fixed inset-0 z-40 bg-transparent cursor-default"
        />
      )}
      {/* Sticky Top Tabs */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-dispatch-line bg-dispatch-surface/95 shadow-[0_-8px_24px_rgba(21,25,20,0.06)] backdrop-blur-xl transition-opacity sm:sticky sm:top-[72px] sm:border-b sm:border-t-0 sm:bg-dispatch-surface sm:shadow-none sm:backdrop-blur-none dark:border-gray-800 dark:bg-gray-950/95 ${isSearchFocused ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <div className="mx-auto flex max-w-dispatch-page items-stretch justify-center overflow-x-auto px-2 sm:justify-start sm:gap-2 sm:px-5 lg:px-6 xl:px-8">
          <TabItem
            active={isDiscovery}
            label={t("tab_discovery")}
            onClick={() => onChangeScreen("Discovery")}
            Icon={homeTabSvg}
          />
          {isSingleVendor ? (
            <>
              <TabItem
                active={isDeals}
                label={t("discount_label")}
                onClick={() => onChangeScreen("Deals")}
                Icon={CutlerySvg}
              />
              <TabItem
                active={isBrowse}
                label={t("tab_store")}
                onClick={() => onChangeScreen("Browse")}
                Icon={StoreSvg}
              />
            </>
          ) : (
            <>
              <TabItem
                active={isRestaurants}
                label={t("tab_restaurants")}
                onClick={() => onChangeScreen("Restaurants")}
                Icon={CutlerySvg}
              />
              <TabItem
                active={isStore}
                label={t("tab_store")}
                onClick={() => onChangeScreen("Store")}
                Icon={StoreSvg}
              />
            </>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        className={`flex-1 bg-dispatch-ground dark:bg-gray-950 ${isSearchFocused ? "pointer-events-none blur-md" : ""}`}
      >
        <PaddingContainer className="pb-24 pt-5 sm:pb-12 sm:pt-7 lg:pt-9">
          {children}
        </PaddingContainer>
      </div>
    </div>
  );
}
