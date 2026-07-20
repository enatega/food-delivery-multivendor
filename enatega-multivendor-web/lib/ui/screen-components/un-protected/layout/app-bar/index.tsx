"use client";

// Core
import { Sidebar } from "primereact/sidebar";
import { Menu } from "primereact/menu";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/providers/ThemeProvider";
import { flushSync } from "react-dom";
import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

// Components
import Cart from "@/lib/ui/useable-components/cart";
import UserAddressComponent from "@/lib/ui/useable-components/address";
import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import MainSection from "@/lib/ui/useable-components/restaurant-main-section";

// Hook
import { useUserAddress } from "@/lib/context/address/address.context";
import { useAuth } from "@/lib/context/auth/auth.context";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import useLocation from "@/lib/hooks/useLocation";
import useSetUserCurrentLocation from "@/lib/hooks/useSetUserCurrentLocation";
import useUser from "@/lib/hooks/useUser";
import { useSearchUI } from "@/lib/context/search/search.context";
import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";

import Logo from "@/lib/utils/assets/svg/Logo";

import { AnimatePresence, motion } from "framer-motion";

// Icons
import {
  CartSvg,
  CircleCrossSvg,
  ClockSvg,
  LocationSvg,
  SearchSvg,
} from "@/lib/utils/assets/svg";
// import AnimatedLogo from "@/lib/assets/gif/logo.gif";
import { faChevronDown, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faGlobe } from "@fortawesome/free-solid-svg-icons";
// Interface
import { IAppBarProps } from "@/lib/utils/interfaces";
import { ToastContext } from "@/lib/context/global/toast.context";
// Methods
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";
import {
  deleteSearchedKeywords,
  getSearchedKeywords,
} from "@/lib/utils/methods";
import { hasValidAuthToken } from "@/lib/utils/methods/auth";

// Constnats
import {
  languageTypes,
  USER_CURRENT_LOCATION_LS_KEY,
} from "@/lib/utils/constants";
import EmptySearch from "@/lib/ui/useable-components/empty-search-results";
import { useLocale, useTranslations } from "next-intl";
import { TLocale } from "@/lib/utils/types/locale";
import { setUserLocale } from "@/lib/utils/methods/locale";
import { Dialog } from "primereact/dialog";

import CustomButton from "@/lib/ui/useable-components/button";

const AppTopbar = ({ handleModalToggle }: IAppBarProps) => {
  // State for cart sidebar
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserAddressModalOpen, setIsUserAddressModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [logoutConfirmationVisible, setLogoutConfirmationVisible] =
    useState(false);
  const t = useTranslations();
  const [, startTransition] = useTransition();
  const currentLocale = useLocale();

  // REf
  const menuRef = useRef<Menu>(null);
  const languageMenuRef = useRef<Menu>(null);

  //Theme Provider
  const { theme, toggleTheme } = useTheme();

  const [position, setPosition] = useState<"left" | "right">("right");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dir = document.documentElement.getAttribute("dir") || "ltr";
      setPosition(dir === "rtl" ? "left" : "right");
    }
  }, []);
  // Hooks
  const router = useRouter();
  const { GOOGLE_MAPS_KEY, CURRENCY_SYMBOL } = useConfig();
  const {
    cartCount,
    calculateSubtotal,
    profile,
    loadingProfile,
    fetchProfile,
    logout,
  } = useUser();
  const { userAddress, setUserAddress } = useUserAddress();
  const { getCurrentLocation } = useLocation();
  const { onSetUserLocation } = useSetUserCurrentLocation();
  const {
    authToken,
    setIsAuthModalVisible,
    setActivePanel,
    setAuthToken,
    refetchProfileData,
    setRefetchProfileData,
  } = useAuth();
  const { queryData = [] } = useNearByRestaurantsPreview(true, 1, 100);

  const {
    isSearchFocused,
    setIsSearchFocused,
    filter,
    setFilter,
    setSearchedData,
    setSearchedKeywords,
  } = useSearchUI();

  // Format subtotal for display
  const formattedSubtotal =
    cartCount > 0
      ? `${CURRENCY_SYMBOL}${calculateSubtotal()}`
      : `${CURRENCY_SYMBOL}0`;

  // Handlers
  const onInit = () => {
    const current_location_ls = onUseLocalStorage(
      "get",
      USER_CURRENT_LOCATION_LS_KEY
    );
    const user_current_location = current_location_ls
      ? JSON.parse(current_location_ls)
      : null;

    if (user_current_location) {
      setUserAddress(user_current_location);
      return;
    }

    const selectedAddress = profile?.addresses.find(
      (address) => address.selected
    );
    // ✅ If there's a selected address, use that
    if (selectedAddress) {
      setUserAddress(selectedAddress);
    } else {
      // Otherwise, get current location if profile is loaded and maps key exists
      if (!loadingProfile && GOOGLE_MAPS_KEY) {
        getCurrentLocation(onSetUserLocation);
      }
    }
  };

  //Locale Configuration
  function onLocaleChange(value: string) {
    const locale = value as TLocale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  useEffect(() => {
    setIsLogin(hasValidAuthToken());
  }, [authToken]);

  const onHandleAddressModelVisibility = () => {
    if (authToken) {
      setIsUserAddressModalOpen(true);
    } else {
      setIsAuthModalVisible(true);
    }
  };

  const { showToast } = useContext(ToastContext);
  const onLogout = () => {
    flushSync(() => {
      setLogoutConfirmationVisible(false);
    });

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("pending_app_toast");
    }

    showToast({
      type: "success",
      title: t("logoutSuccessToastTitle"),
      message: t("logoutSuccessToastMessage"),
    });

    window.setTimeout(() => {
      setActivePanel(0);
      setAuthToken("");
      setIsLogin(false);
      void logout().finally(() => {
        router.replace("/");
      });
    }, 100);
  };

  // Logo click handler
  const logoClickHandler = () => {
    if (isLogin) {
      router.push("/");
    } else {
      router.push("/");
    }
  };

  //Language DropDoDowm
  // const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // const handleLanguageChange = (lang: string) => {
  //   localStorage.setItem("language", lang);
  //   setShowLanguageDropdown(false);
  //   showToast({
  //     type: "success",
  //     title: "Language Changed",
  //     message: `Language switched to ${lang.toUpperCase()}`,
  //   });
  // };

  // UseEffects
  useEffect(() => {
    onInit();
  }, [GOOGLE_MAPS_KEY, profile]);

  useEffect(() => {
    if (refetchProfileData) {
      fetchProfile(); // this one is not working when a refetch is required, kindly check this whoever is working on this module
      onInit();
      setRefetchProfileData(false);
    }
  }, [refetchProfileData]);

  // filters search results
  let searchedKeywords = getSearchedKeywords();

  const filteredResults = useMemo(() => {
    if (!filter.trim()) return [];
    if (!queryData || !Array.isArray(queryData) || queryData.length === 0)
      return [];

    const searchText = filter.toLowerCase();
    return queryData.filter(({ name, address = "", cuisines = [] }) => {
      return (
        name.toLowerCase().includes(searchText) ||
        address.toLowerCase().includes(searchText) ||
        cuisines.join(" ").toLowerCase().includes(searchText)
      );
    });
  }, [filter, queryData]);

  //Language Dropdown UseEffect
  useEffect(() => {
    const closeDropdown = () => {
      // setShowLanguageDropdown(false);
    };
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  // Update searchedData in context whenever filter changes
  useEffect(() => {
    setSearchedData(filteredResults);
  }, [filteredResults, setSearchedData]);

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setFilter(e.target.value);
  };

  // Search results rendered
  const renderSearchResults = () => {
    // Case 1: Input is empty
    if (filter.length < 1) {
      // Subcase: No search history
      if (searchedKeywords.length === 0) {
        return (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            {t("start_typing_to_search_for_restaurants_or_stores")}
          </div>
        );
      }

      // Subcase: Display recent history
      return (
        <div className="p-3">
          <div className="flex flex-row justify-between">
            <span className="text-sm font-normal mb-2 text-gray-500 dark:text-gray-400">
              {t("you_recently_searched")}
            </span>
            <span
              className="text-sm font-normal mb-2 text-secondary-color hover:cursor-pointer dark:text-primary-color"
              onClick={() => {
                deleteSearchedKeywords();
                setSearchedKeywords([]);
              }}
            >
              {t("clear_history_btn")}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {searchedKeywords.map((keyword, i) => (
              <div
                key={i}
                className="flex items-center gap-1 p-1 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                onClick={() => setFilter(keyword)}
              >
                <ClockSvg width={18} height={18} color="gray" />
                <span className="text-base dark:text-white">{keyword}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Case 2: User searched something
    if (filteredResults.length > 0) {
      return (
        <MainSection
          title={`${t("restaurant_and_stores_title")}: ${filter}`}
          data={filteredResults.slice(0, 3)}
          loading={false}
          error={false}
          search={true}
        />
      );
    }

    // Case 3: No results found for the searched keyword
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center">
        <EmptySearch />
      </div>
    );
  };

  function fittedAddress(address: String | undefined) {
    if (address) {
      let adr = address.slice(0, 16);
      if (address.length > 16) {
        adr = adr + "...";
      }
      return adr;
    }
    return "";
  }

  // Language Modal
  const model = languageTypes.map((lang) => ({
    label: lang.value.toUpperCase(),
    template(item: any) {
      return (
        <div
          className={`hover:bg-primary-color ${currentLocale === lang.code ? "bg-primary-color" : ""} p-2 cursor-pointer`}
          onClick={() => onLocaleChange(lang.code)}
        >
          {item.label}
        </div>
      );
    },
    command: () => {
      onLocaleChange(lang.code);
    },
  }));

  const iconButtonClassName =
    "flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-gray-700 transition-all duration-200 hover:border-gray-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40 active:scale-95 dark:text-gray-200 dark:hover:border-gray-700 dark:hover:bg-gray-800";

  const userName =
    profile?.name?.trim() ||
    profile?.email?.split("@")[0] ||
    t("ProfileSection.profile_label");

  return (
    <>
      <nav
        className={`layout-top-bar z-50 w-screen border-b border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:shadow-gray-950/30 ${isSearchFocused ? "sticky top-0" : ""}`}
      >
        <div className="w-full">
          <PaddingContainer>
            <div className="flex min-h-[72px] w-full flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:min-h-[80px] md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-4 md:gap-y-0">
              {/* Left Section */}
              <div className="flex min-w-0 items-center gap-2 md:gap-3">
                {!isSearchFocused && (
                  <div
                    onClick={logoClickHandler}
                    className="flex shrink-0 cursor-pointer items-center text-xl font-bold text-gray-900 dark:text-white"
                  >
                    <Logo fillColor="#000000" darkmode="#FFFFFFFF" />
                  </div>
                )}
                {!isSearchFocused && (
                  <button
                    type="button"
                    title={userAddress?.deliveryAddress || ""}
                    className="hidden min-w-0 max-w-[220px] items-center gap-2 rounded-full border border-transparent px-2 py-2 text-left transition-all duration-200 hover:border-gray-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40 active:scale-[0.99] dark:hover:border-gray-700 dark:hover:bg-gray-800 lg:flex xl:max-w-[260px]"
                    onClick={onHandleAddressModelVisibility}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <LocationSvg width={20} height={20} />
                    </div>
                    <span
                      className="min-w-0 truncate text-sm font-normal leading-6 text-primary-color xl:text-[15px]"
                      title={userAddress?.deliveryAddress || ""}
                    >
                      {fittedAddress(userAddress?.deliveryAddress)}
                    </span>
                    <div className="flex shrink-0 items-center">
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className="text-xs text-primary-color"
                      />
                    </div>
                  </button>
                )}
              </div>

              {/* Center Section */}
              <div className="order-3 w-full md:order-none md:w-auto">
                <div
                  className={`mx-auto w-full transition-all duration-300 ease-in-out ${isSearchFocused ? "max-w-full" : "max-w-[760px]"} md:px-0`}
                >
                  <div className="relative w-full">
                    <input
                      id="search-input"
                      value={filter}
                      onChange={handleSearchInputChange}
                      onFocus={() => setIsSearchFocused(true)}
                      placeholder={t("SearchBarPlaceholder")}
                      className={`
                        w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 pr-11 text-sm text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-primary-color focus:outline-none focus:ring-2 focus:ring-primary-color/25
                        ${!isSearchFocused ? "hidden sm:block" : "block"}
                        dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-primary-color
                      `}
                    />

                    {!isSearchFocused && (
                      <div className="pointer-events-none absolute inset-y-0 right-3 hidden items-center sm:flex">
                        <SearchSvg width={18} height={18} />
                      </div>
                    )}

                    {isSearchFocused && (
                      <button
                        type="button"
                        aria-label={t("close_label")}
                        className="absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40 active:scale-95 dark:bg-gray-700 dark:hover:bg-gray-600 sm:flex"
                        onClick={() => setFilter("")}
                      >
                        <CircleCrossSvg color="black" width={16} height={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="ml-auto flex min-w-0 items-center justify-end gap-1 sm:gap-2">
                {!isSearchFocused && (
                  <button
                    type="button"
                    aria-label={t("SearchBarPlaceholder")}
                    className={`${iconButtonClassName} sm:hidden`}
                    onClick={() => setIsSearchFocused(true)}
                  >
                    <SearchSvg width={18} height={18} />
                  </button>
                )}
                {!authToken && !isSearchFocused ? (
                  <button
                    className="flex h-10 min-w-[72px] items-center justify-center rounded-full bg-primary-color px-4 text-sm font-semibold text-white transition-all duration-200 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40 active:scale-[0.98] md:h-11 md:px-5"
                    onClick={handleModalToggle}
                    type="button"
                  >
                    <span className="whitespace-nowrap text-xs font-semibold md:text-sm">
                      {t("login_label")}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`hidden min-w-0 items-center gap-2 rounded-full border border-transparent px-2 py-1.5 transition-all duration-200 hover:border-gray-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40 active:scale-[0.99] dark:hover:border-gray-700 dark:hover:bg-gray-800 md:flex ${isSearchFocused ? "hidden" : ""}`}
                    onClick={(event) => menuRef.current?.toggle(event)}
                    aria-controls="popup_menu_right"
                    aria-haspopup
                    title={userName}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-color text-sm font-semibold uppercase text-white select-none md:h-9 md:w-9">
                      {profile?.name
                        ?.trim()
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("") || "U"}
                    </div>
                    <span
                      className="max-w-[112px] truncate text-sm text-gray-800 dark:text-white lg:max-w-[140px]"
                      title={userName}
                    >
                      {userName}
                    </span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="shrink-0 text-xs text-primary-color"
                    />
                  </button>
                )}
                {!isSearchFocused && (
                  <div className="relative flex items-center gap-1 sm:gap-2">
                    <button
                      type="button"
                      onClick={toggleTheme}
                      aria-label={theme === "dark" ? "Enable light mode" : "Enable dark mode"}
                      className={iconButtonClassName}
                    >
                      <span className="text-lg leading-none">
                        {theme === "dark" ? "🌙" : "☀️"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => languageMenuRef.current?.toggle(e)}
                      aria-label="Languages"
                      title="Languages"
                      className={iconButtonClassName}
                    >
                      <FontAwesomeIcon
                        icon={faGlobe}
                        className="text-base"
                      />
                    </button>
                    <Menu
                      model={model}
                      popup
                      ref={languageMenuRef}
                      id="language_menu_popup"
                      popupAlignment="left"
                      className="
                      dark:bg-gray-800 dark:text-white mt-5
        [&_.p-menu-list]:max-h-72 
        [&_.p-menu-list]:overflow-y-auto
        [&_.p-menu-list]:scrollbar-thin
        shadow-lg
      "
                    />
                  </div>
                )}
                <div className="p-0">
                  {cartCount > 0 && !isSearchFocused && (
                    <div
                      className="hidden h-11 items-center justify-between gap-3 rounded-full bg-primary-color px-4 text-white shadow-sm transition-all duration-200 hover:brightness-95 lg:flex lg:min-w-[240px]"
                      onClick={() => {
                        if (!authToken) {
                          setIsAuthModalVisible(true);
                        } else {
                          setIsCartOpen(true);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-white px-1 text-xs font-semibold text-primary-color">
                          {cartCount}
                        </div>
                        <span className="text-sm font-semibold">
                          {t("show_items_btn")}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {formattedSubtotal}
                      </span>
                    </div>
                  )}
                  {isSearchFocused ? (
                    <button
                      type="button"
                      aria-label={t("close_label")}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40 active:scale-95 dark:bg-gray-700 dark:hover:bg-gray-600"
                      onClick={() => {
                        setIsSearchFocused(false);
                        setFilter("");
                      }}
                    >
                      <CircleCrossSvg color="black" width={22} height={22} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      aria-label={t("show_items_btn")}
                      className={`${cartCount > 0 ? "lg:hidden" : ""} relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-all duration-200 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40 active:scale-95 dark:bg-gray-800 dark:hover:bg-gray-700`}
                      onClick={() => {
                        if (!authToken) {
                          setIsAuthModalVisible(true);
                        } else {
                          setIsCartOpen(true);
                        }
                      }}
                    >
                      <CartSvg color="black" width={20} height={20} />
                      {cartCount > 0 && (
                        <div className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-color px-1 text-[10px] font-semibold text-white shadow-sm">
                          {cartCount}
                        </div>
                      )}
                    </button>
                  )}
                </div>
              </div>
              <Menu
                className="
                dark:bg-gray-800
                dark:text-white
              "
                model={[
                  {
                    label: t("ProfileSection.profile_label"),
                    template(item) {
                      return (
                        <div
                          className="text-gray-600 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-600  p-2 cursor-pointer"
                          onClick={() => router.push("/profile")}
                        >
                          {item.label}
                        </div>
                      );
                    },
                  },
                  {
                    label: t("ProfileSection.gethelp"),
                    template(item) {
                      return (
                        <div
                          className="text-gray-500 hover:bg-gray-300  dark:text-white dark:hover:bg-gray-600 p-2  cursor-pointer"
                          onClick={() => router.push("/profile/getHelp")}
                        >
                          {item.label}
                        </div>
                      );
                    },
                  },
                  {
                    label: t("ProfileSection.logout_appbar"),
                    template(item) {
                      return (
                        <div
                          className="text-gray-500 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-600 p-2  cursor-pointer"
                          onClick={() => setLogoutConfirmationVisible(true)}
                        >
                          {item.label}
                        </div>
                      );
                    },
                  },
                ]}
                popup
                ref={menuRef}
                id="popup_menu_right"
                popupAlignment="right"
              />
            </div>

            {/* Search Results */}
            <div className="flex items-center justify-center">
              <div className="w-full md:w-7/12 pr-5">
                <AnimatePresence>
                  {isSearchFocused && (
                    <motion.div
                      key="search-results"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="
                      w-full h-[10%] mt-2 max-h-[60vh] 
                      bg-white dark:bg-gray-800 
                      overflow-y-auto 
                      scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100
                      dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700
                      rounded-md
                    "
                    >
                      {renderSearchResults()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {!isSearchFocused && (
              <div className="my-1 flex items-center justify-between gap-3 lg:hidden">
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-transparent px-1 py-1 text-left transition-all duration-200 hover:border-gray-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40 active:scale-[0.99] dark:hover:border-gray-700 dark:hover:bg-gray-800"
                  onClick={onHandleAddressModelVisibility}
                  title={userAddress?.deliveryAddress || ""}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <LocationSvg width={20} height={20} />
                  </div>
                  <p
                    className="min-w-0 truncate text-sm text-primary-color"
                    title={userAddress?.deliveryAddress || ""}
                  >
                    {userAddress?.deliveryAddress}
                  </p>
                  <div className="flex shrink-0 items-center">
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="text-xs text-primary-color"
                    />
                  </div>
                </button>

                {authToken && (
                  <button
                    type="button"
                    className="flex max-w-[44%] shrink-0 items-center gap-2 rounded-full border border-transparent px-1 py-1 transition-all duration-200 hover:border-gray-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40 active:scale-[0.99] dark:hover:border-gray-700 dark:hover:bg-gray-800 md:hidden"
                    onClick={(event) => menuRef.current?.toggle(event)}
                    aria-controls="popup_menu_right"
                    aria-haspopup
                    title={userName}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-color text-sm font-semibold uppercase text-white select-none">
                      {profile?.name
                        ?.trim()
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("") || "U"}
                    </div>
                    <span className="min-w-0 truncate text-sm text-gray-800 dark:text-white">
                      {userName}
                    </span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="shrink-0 text-xs text-primary-color"
                    />
                  </button>
                )}
              </div>
            )}
          </PaddingContainer>
        </div>
      </nav>
      {/* Preventing everything at the background from being clickable when searchbar is open  */}
      {isSearchFocused && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsSearchFocused(false)}
        />
      )}

      {/* Cart Sidebar */}
      <Sidebar
        position={position} // ✅ dynamic position
        visible={isCartOpen}
        onHide={() => {
          setIsCartOpen(false);
          localStorage.setItem(
            "newOrderInstructions",
            localStorage.getItem("orderInstructions") || ""
          );
          localStorage.removeItem("orderInstructions");
          window.dispatchEvent(new Event("orderInstructionsUpdated"));
        }}
        className={`!ml-0 !p-0 !m-0 w-full md:w-[430px] lg:w-[580px] dark:bg-gray-800`}
      >
        <Cart
          onClose={() => {
            setIsCartOpen(false);
            localStorage.setItem(
              "newOrderInstructions",
              localStorage.getItem("orderInstructions") || ""
            );
            localStorage.removeItem("orderInstructions");
            window.dispatchEvent(new Event("orderInstructionsUpdated"));
          }}
        />
      </Sidebar>

      {/* Logout Confirmation Dialog */}
      <Dialog
        contentClassName="dark:bg-gray-800"
        maskClassName="bg-black/80"
        visible={logoutConfirmationVisible}
        onHide={() => setLogoutConfirmationVisible(false)}
        className="w-[95%] sm:w-[80%] md:w-[60%] lg:w-1/3 rounded-xl px-8 bg-white dark:bg-gray-800 dark:text-white"
        header={
          <div className="w-full flex justify-center">
            <span className="font-inter font-bold text-lg text-gray-800  dark:text-white ">
              {t("Are_you_sure_you_want_to_log_out?")}
            </span>
          </div>
        }
        headerClassName="!justify-center dark:bg-gray-800"
        closable={true}
        dismissableMask
      >
        <div className="flex flex-col items-center text-center space-y-4 dark:bg-gray-800 dark:text-white">
          {/* Action buttons */}
          <div className="flex justify-center gap-3 w-full ">
            <CustomButton
              label={t("cancel_address")}
              className="w-1/2 h-fit bg-transparent dark:text-white text-gray-900 py-2 border border-gray-400 rounded-full text-sm font-medium"
              onClick={() => setLogoutConfirmationVisible(false)}
            />

            <button
              className="w-1/2 h-fit flex items-center justify-center gap-2 bg-primary-color text-white py-2 rounded-full text-sm font-medium"
              onClick={onLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              {t("logoutButton")}
            </button>
          </div>
        </div>
      </Dialog>

      <UserAddressComponent
        visible={isUserAddressModalOpen}
        onHide={() => setIsUserAddressModalOpen(false)}
      />
    </>
  );
};

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
