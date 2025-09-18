"use client";

// Core
import { Sidebar } from "primereact/sidebar";
import { Menu } from "primereact/menu";
import { useRouter } from "next/navigation";
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

// Constnats
import { USER_CURRENT_LOCATION_LS_KEY } from "@/lib/utils/constants";
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
  const { queryData = [] } = useNearByRestaurantsPreview();

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

  console.log(userAddress);

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
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, []);

  const onHandleAddressModelVisibility = () => {
    if (authToken) {
      setIsUserAddressModalOpen(true);
    } else {
      setIsAuthModalVisible(true);
    }
  };

  const { showToast } = useContext(ToastContext);
  const onLogout = () => {
    router.replace("/");
    setActivePanel(0);
    setAuthToken("");
    localStorage.removeItem("userToken");
    localStorage.removeItem("token");
    //Give Toast Alert You Logout Successfully
    showToast({
      type: "success",
      title: t("logoutSuccessToastTitle"),
      message: t("logoutSuccessToastMessage"),
    });
    setLogoutConfirmationVisible(false);
  };

  // Logo click handler
  const logoClickHandler = () => {
    if (isLogin) {
      router.push("/discovery");
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
  }, [filter]);

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
              className="text-sm font-normal mb-2 text-sky-500 hover:cursor-pointer dark:text-[#94e469]"
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

  return (
    <>
      <nav
        className={`w-screen shadow-sm z-50 bg-white dark:bg-gray-900 layout-top-bar ${isSearchFocused ? "sticky top-0" : ""}`}
      >
        <div className="w-full">
          <PaddingContainer>
            <div className="flex items-center justify-between w-full h-16 gap-2 flex-wrap md:flex-nowrap">
              {/* Left Section */}
              <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
                {!isSearchFocused && (
                  <div
                    onClick={logoClickHandler}
                    className="text-xl font-bold text-gray-900 dark:text-white"
                  >
                    <Logo
                      className="w-32 h-auto"
                      fillColor="#000000"
                      darkmode="#FFFFFFFF"
                    />
                  </div>
                )}
                {!isSearchFocused && (
                  <div
                    className={`flex items-center ${isSearchFocused && "hidden"} hidden lg:flex`}
                    onClick={onHandleAddressModelVisibility}
                  >
                    {/* Show on large screens only */}
                    <div className="hidden md:block p-[4px] m-2 rounded-full">
                      <LocationSvg width={22} height={22} />
                    </div>

                    <span className="hidden md:inline text-xs sm:text-sm md:text-base text-[#94e469] font-inter font-normal leading-6 tracking-normal mr-2 truncate">
                      {fittedAddress(userAddress?.deliveryAddress)}
                    </span>

                    <div className="hidden sm:flex items-center">
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        width={12}
                        hanging={12}
                        color="#94e469"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Center Section */}
              <div
                className={`flex-grow transition-all duration-500 ease-in-out ${isSearchFocused ? "max-w-full" : "max-w-md"} px-2`}
              >
                <div className="relative w-full">
                  <input
                    id="search-input"
                    value={filter}
                    onChange={handleSearchInputChange}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder={t("SearchBarPlaceholder")}
                    className={`
                w-full px-4 py-2 pr-10 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-500
                ${!isSearchFocused ? "hidden" : "block"} sm:block
                dark:bg-gray-800 dark:text-white
              `}
                  />

                  {isSearchFocused && (
                    <div
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-gray-100 dark:bg-gray-700 rounded-full w-6 h-6 items-center justify-center cursor-pointer hidden sm:flex"
                      onClick={() => setFilter("")}
                    >
                      <CircleCrossSvg color="black" width={16} height={16} />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center justify-end gap-2 flex-shrink-0">
                {!isSearchFocused && (
                  <div className="sm:hidden flex justify-end items-center w-full">
                    <div
                      className="w-7 h-7 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={() => setIsSearchFocused(true)}
                    >
                      <SearchSvg width={16} height={16} />
                    </div>
                  </div>
                )}
                {!authToken && !isSearchFocused ? (
                  <button
                    className="w-auto min-w-[64px] h-fit py-2 md:py-3 px-4 bg-[#5AC12F] rounded text-sm lg:text-[16px] md:text-md flex items-center justify-center"
                    onClick={handleModalToggle}
                  >
                    <span className="text-white font-semibold text-xs md:text-[16px] whitespace-nowrap">
                      {t("login_label")}
                    </span>
                  </button>
                ) : (
                  <div
                    className={`flex items-center space-x-2 rounded-md p-2 hover:bg-[#d8d8d837] ${isSearchFocused && "hidden"}`}
                    onClick={(event) => menuRef.current?.toggle(event)}
                    aria-controls="popup_menu_right"
                    aria-haspopup
                  >
                    <div
                      className="h-6 w-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white font-semibold select-none uppercase"
                      style={{ backgroundColor: "#94e469" }}
                    >
                      {profile?.name
                        ?.trim()
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("") || "U"}
                    </div>

                    {cartCount == 0 && (
                      <span className="hidden xl:inline hover:cursor-pointer dark:text-white">
                        {profile?.name || ""}
                      </span>
                    )}

                    <FontAwesomeIcon
                      icon={faChevronDown}
                      width={12}
                      hanging={12}
                      color="#94e469"
                    />
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
                                onClick={() =>
                                  setLogoutConfirmationVisible(true)
                                }
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
                )}
                {/* Language Dropdown */}{" "}
                {!isSearchFocused && (
                  <div className="relative" title="Languages">
                    {" "}
                    <button
                      onClick={(e) => languageMenuRef.current?.toggle(e)}
                      className="flex items-center justify-center"
                    >
                      {" "}
                      <FontAwesomeIcon
                        icon={faGlobe}
                        width={24}
                        height={24}
                        className="text-gray-700 dark:text-gray-400"
                      />{" "}
                    </button>{" "}
                    <Menu
                      className="dark:bg-gray-800 dark:text-white mt-5"
                      model={[
                        {
                          label: "ENGLISH",
                          template(item) {
                            return (
                              <div
                                className={`${currentLocale === "en" ? "bg-[#5AC12F]" : ""} p-2 cursor-pointer`}
                                onClick={() => onLocaleChange("en")}
                              >
                                {" "}
                                {item.label}{" "}
                              </div>
                            );
                          },
                          command: () => {
                            onLocaleChange("en");
                          },
                        },
                        {
                          label: "ARABIC",
                          template(item) {
                            return (
                              <div
                                className={`${currentLocale === "ar" ? "bg-[#5AC12F]" : ""} p-2 cursor-pointer`}
                                onClick={() => onLocaleChange("ar")}
                              >
                                {" "}
                                {item.label}{" "}
                              </div>
                            );
                          },
                          command: () => {
                            onLocaleChange("ar");
                          },
                        },
                        {
                          label: "FRENCH",
                          template(item) {
                            return (
                              <div
                                className={`${currentLocale === "fr" ? "bg-[#5AC12F]" : ""} p-2 cursor-pointer`}
                                onClick={() => onLocaleChange("fr")}
                              >
                                {" "}
                                {item.label}{" "}
                              </div>
                            );
                          },
                          command: () => {
                            onLocaleChange("fr");
                          },
                        },
                        {
                          label: "HEBREW",
                          template(item) {
                            return (
                              <div
                                className={`${currentLocale === "hr" ? "bg-[#5AC12F]" : ""} p-2 cursor-pointer`}
                                onClick={() => onLocaleChange("hr")}
                              >
                                {" "}
                                {item.label}{" "}
                              </div>
                            );
                          },
                          command: () => {
                            onLocaleChange("hr");
                          },
                        },
                      ]}
                      popup
                      ref={languageMenuRef}
                      id="language_menu_popup"
                      popupAlignment="left"
                    />{" "}
                  </div>
                )}
                {/* Cart Button */}
                <div className="p-1 cursor-pointer">
                  {cartCount > 0 && !isSearchFocused && (
                    <div
                      className="hidden lg:flex items-center justify-between bg-[#5AC12F] rounded-lg px-4 py-3 w-64 cursor-pointer"
                      onClick={() => {
                        if (!authToken) {
                          setIsAuthModalVisible(true); // ⬅️ Show login/signup modal
                        } else {
                          setIsCartOpen(true); // ⬅️ Open cart drawer
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="bg-white text-[#5AC12F] rounded-full w-5 h-5 flex items-center justify-center text-[10px] sm:text-[12px]">
                          {cartCount}
                        </div>
                        <span className="ml-2 text-white text-[14px] font-semibold sm:text-[14px]">
                          {t("show_items_btn")}
                        </span>
                      </div>
                      <span className="text-white text-[14px] sm:text-[16px]">
                        {formattedSubtotal}
                      </span>
                    </div>
                  )}
                  {isSearchFocused ? (
                    <div
                      className="flex items-center justify-center rounded-full w-10 h-10 bg-gray-100 dark:bg-gray-700 relative cursor-pointer"
                      onClick={() => {
                        setIsSearchFocused(false);
                        setFilter("");
                      }}
                    >
                      <CircleCrossSvg color="black" width={24} height={24} />
                    </div>
                  ) : (
                    <div
                      className={`${cartCount > 0 ? "lg:hidden" : ""} flex items-center justify-center rounded-full w-8 h-8 md:w-10 md:h-10 bg-gray-100 dark:bg-gray-500 relative`}
                      onClick={() => setIsCartOpen(true)}
                    >
                      <div className="block sm:hidden">
                        <CartSvg color="black" width={18} height={18} />
                      </div>
                      <div className="hidden sm:block">
                        <CartSvg color="black" width={22} height={22} />
                      </div>
                      {cartCount > 0 && authToken && (
                        <div className="absolute -top-1 -right-1 bg-black text-[#5AC12F] text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                          {cartCount}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
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
              <div
                className="my-2 lg:hidden"
                onClick={onHandleAddressModelVisibility}
              >
                <div className="flex gap-4">
                  <LocationSvg width={22} height={22} />
                  <p className="text-[14px] text-[#94e469]">
                    {userAddress?.deliveryAddress}
                  </p>
                  <div className="sm:flex items-center">
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      width={12}
                      hanging={12}
                      color="#94e469"
                    />
                  </div>
                </div>
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
              className="w-1/2 h-fit flex items-center justify-center gap-2 bg-[#5AC12F] text-white py-2 rounded-full text-sm font-medium"
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
