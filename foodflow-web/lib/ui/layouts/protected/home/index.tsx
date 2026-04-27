"use client";

import { IProtectedHomeLayoutComponent } from "@/lib/utils/interfaces";
import { usePathname, useRouter } from "next/navigation";

// Svg
import { CutlerySvg,StoreSvg } from "@/lib/utils/assets/svg";
import PaddingContainer from "@/lib/ui/useable-components/containers/padding";
import { useEffect, useState } from "react";
// context
import { useSearchUI } from "@/lib/context/search/search.context";
import TabItem from "@/lib/ui/useable-components/tab-item/TabItem";
import { useTranslations } from "next-intl";
import homeTabSvg from "@/lib/utils/assets/svg/houseTabsvg";

export default function HomeLayout({
  children,
}: IProtectedHomeLayoutComponent) {
  const router = useRouter();
  const pathname = usePathname();
  const [stickyTop, setStickyTop] = useState(0);
  const { isSearchFocused, setIsSearchFocused } = useSearchUI();

  const onChangeScreen = (name: "Discovery" | "Restaurants" | "Store") => {
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
      default:
        router.push("/discovery");
        break;
    }
  };

  const isDiscovery = pathname === "/discovery";
  const isRestaurants = pathname === "/restaurants";
  const isStore = pathname === "/store";


  const t = useTranslations();
  
  useEffect(() => {
    const handleScroll = () => {
      setStickyTop(window.scrollY > 300 ? 16 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <div className="w-screen h-full flex flex-col ">
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
        className={`sm:sticky sm:top-${stickyTop} sm:left-0 fixed bottom-0 left-0 w-full bg-gray-100 dark:bg-gray-900 sm:bg-white z-30 pt-2 pb-2 sm:pt-3 sm:pb-3 ${isSearchFocused && "opacity-0"}`}
      >
        <div className="flex justify-center items-center space-x-4 md:space-x-6 p-2 md:p-4 overflow-x-auto mt-6 lg:mt-0">
          <TabItem
            active={isDiscovery}
            label={t("tab_discovery")}
            onClick={() => onChangeScreen("Discovery")}
            Icon={homeTabSvg}
          />
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
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        className={`flex-1 overflow-auto bg-white dark:bg-gray-900 mt-4 sm:mt-0 ${isSearchFocused && "blur-md cursor-default"}`}
      >
        <PaddingContainer>{children}</PaddingContainer>
      </div>
    </div>
  );
}
