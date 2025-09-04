/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
// Components
import AppTopbar from "@/lib/ui/screen-components/un-protected/layout/app-bar";

// Interface & Types
import { IProvider } from "@/lib/utils/interfaces";

// Google OAuth
import { useConfig } from "@/lib/context/configuration/configuration.context";
import { GoogleMapsProvider } from "@/lib/context/global/google-maps.context";
import AuthModal from "@/lib/ui/screen-components/un-protected/authentication";
import AppFooter from "../../screen-components/un-protected/layout/app-footer";

// Search Context 
import { useSearchUI } from "@/lib/context/search/search.context";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import { usePathname } from "next/navigation";

const AppLayout = ({ children }: IProvider) => {
  const pathname = usePathname();
  const [isScrolled , setIsScrolled] = useState(false);
  // Hooks
  const { isAuthModalVisible, setIsAuthModalVisible, setActivePanel } = useAuth();
  const { isSearchFocused } = useSearchUI();
  
  // Hook
  const { GOOGLE_MAPS_KEY, LIBRARIES } = useConfig();

  const handleModalToggle = () => {
    setIsAuthModalVisible((prev) => {
      if (prev) {
        setActivePanel(0);
      }
      return !prev;
    });
  };

  useEffect(() => {
    setIsScrolled(false);
    window.document.body.scrollTo({top:0, behavior:"smooth"})
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 300 ? true : false);
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [])

  const UI = (
    <div className="layout-main">
      <div className={`
        layout-top-container transtion-all duration-300 ease-in-out h-[100px] md:h-[64px]
        ${isScrolled ? '!fixed !top-0 left-0 shadow-lg' : ''}
      `}>
        <AppTopbar handleModalToggle={handleModalToggle} />
      </div>
      <div className={`layout-main-container ${isSearchFocused && 'blur-md overflow-hidden h-screen '}`}>
        <div className="layout-main w-full min-h-screen dark:bg-gray-900">{children}</div>
      </div>
      <div className="pb-[45px] md:pb-0 bg-[#141414]">
        <AppFooter />
      </div>
      <AuthModal
        handleModalToggle={handleModalToggle}
        isAuthModalVisible={isAuthModalVisible}
      />
    </div>
  );

  useEffect(() => {}, [GOOGLE_MAPS_KEY]);

  return GOOGLE_MAPS_KEY ?
      <GoogleMapsProvider apiKey={GOOGLE_MAPS_KEY} libraries={LIBRARIES}>
        <>{UI}</>
      </GoogleMapsProvider>
    : <>{UI}</>;
};

export default AppLayout;
