"use client";

// Core
import { Sidebar } from "primereact/sidebar";
import { Menu } from "primereact/menu";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

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
} from "@/lib/utils/assets/svg";
// import AnimatedLogo from "@/lib/assets/gif/logo.gif";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Interface
import { IAppBarProps } from "@/lib/utils/interfaces";

// Methods
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";
import {
  deleteSearchedKeywords,
  getSearchedKeywords,
} from "@/lib/utils/methods";

// Constnats
import { USER_CURRENT_LOCATION_LS_KEY } from "@/lib/utils/constants";
import EmptySearch from "@/lib/ui/useable-components/empty-search-results";

const AppTopbar = ({ handleModalToggle }: IAppBarProps) => {
  // State for cart sidebar
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserAddressModalOpen, setIsUserAddressModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  // REf
  const menuRef = useRef<Menu>(null);

  // Hooks
  const router = useRouter();
  const { GOOGLE_MAPS_KEY } = useConfig();
  const {
    cartCount,
    
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

  const handleCartClose = () => {
    setIsCartOpen(false);
    localStorage.setItem(
      "newOrderInstructions",
      localStorage.getItem("orderInstructions") || ""
    );
    localStorage.removeItem("orderInstructions");
    window.dispatchEvent(new Event("orderInstructionsUpdated"));
  }; 


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

  const onLogout = () => {
    router.replace("/");
    setActivePanel(0);
    setAuthToken("");
    localStorage.clear();
  };

  // Logo click handler
  const logoClickHandler = () => {
    if (isLogin) {
      router.push("/discovery");
    } else {
      router.push("/");
    }
  };

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
          <div className="text-center py-4 text-gray-500">
            🔍 Start typing to search for restaurants or stores.
          </div>
        );
      }

     
      // Subcase: Display recent history
      return (
        <div>
          <div className="flex flex-row justify-between">
            <span className="text-sm font-normal mb-2 text-gray-500">
              You recently searched
            </span>
            <span
              className="text-sm font-normal mb-2 text-sky-500 hover:cursor-pointer"
              onClick={() => {
                deleteSearchedKeywords();
                setSearchedKeywords([]);
              }}
            >
              Clear history
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {searchedKeywords.map((keyword, i) => (
              <div
                key={i}
                className="flex items-center gap-1 p-1 hover:cursor-pointer"
                onClick={() => setFilter(keyword)}
              >
                <ClockSvg width={18} height={18} color="gray" />
                <span className="text-base">{keyword}</span>
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
          title={`Restaurant and stores: ${filter}`}
          data={filteredResults.slice(0, 3)}
          loading={false}
          error={false}
          search={true}
        />
      );
    }

    // Case 3: No results found for the searched keyword
    return (
      <div className="text-center py-6 text-gray-500 flex flex-col items-center justify-center">
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
        className={`w-screen shadow-sm z-50 bg-white layout-top-bar ${isSearchFocused ? "sticky top-0" : ""}`}
      >
        <div className={`w-full`}>
          <PaddingContainer>
            <div className="flex flex-row items-center justify-center w-full h-16">
              {/* Left Section */}
              <div className={`w-1/3 flex gap-x-2 items-center cursor-pointer`}>
                {!isSearchFocused && (
                  <div
                    onClick={logoClickHandler}
                    className="text-xl font-bold text-gray-900"
                  >
                    <Logo className="w-32 h-auto" fillColor="#000000" />
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

                    {/* Show on medium and up */}
                    <span className="hidden md:inline text-xs sm:text-sm md:text-base text-[#94e469] font-inter font-normal leading-6 tracking-normal mr-2 truncate">
                      {/* {userAddress?.deliveryAddress} */}
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
                className={`flex justify-center items-center transition-all duration-500 ease-in-out ${isSearchFocused ? "w-10/12" : "w-1/3"}`}
              >
                <div className="relative w-full">
                  
                 {/* Search Input - hidden on mobile unless focused */}
                  <input
                    id="search-input"
                    value={filter}
                    onChange={handleSearchInputChange}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search in enatega"
                    className={`
      w-full px-4 py-2 pr-10 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-500
      ${!isSearchFocused ? "hidden" : "block"} sm:block
    `}
                  />

                  {/* Clear Icon */}
                  {isSearchFocused && (
                    <div
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-gray-100 rounded-full w-6 h-6 items-center justify-center cursor-pointer hidden sm:flex"
                      onClick={() => {
                        setFilter("");
                      }}
                    >
                      <CircleCrossSvg color="black" width={16} height={16} />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section */}
              <div className={`flex w-1/3 justify-end items-center space-x-4`}>
                {isSearchFocused ? (
                  // 🔁 Show cancel button instead of login/cart when search is active
                  <div
                    className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      setIsSearchFocused(false);
                      setFilter("");
                    }}
                  >
                    <CircleCrossSvg color="black" width={16} height={16} />
                  </div>
                ) : (
                  <>
                    {/* Login Button */}
                    {!authToken ? (
                      <button
                        className="md:w-20 w-16 h-fit py-3 text-gray-900 md:py-3 px-3 bg-[#5AC12F] rounded text-sm lg:text-[16px] md:text-md "
                        onClick={handleModalToggle}
                      >
                        <span className="text-white font-semibold text-[16px]">
                          Login
                        </span>
                      </button>
                    ) : (
                      <div
                        className="flex items-center space-x-2 rounded-md p-2 hover:bg-[#d8d8d837]"
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
                        <span className="hidden xl:inline">
                          {profile?.name || ""}
                        </span>
                        <FontAwesomeIcon icon={faChevronDown} width={12} />
                        <Menu
                          model={[
                            {
                              label: "Profile",
                              command: () => router.push("/profile"),
                            },
                            {
                              label: "Get Help",
                              command: () => router.push("/profile/getHelp"),
                            },
                            { label: "Logout", command: onLogout },
                          ]}
                          popup
                          ref={menuRef}
                          id="popup_menu_right"
                          popupAlignment="right"
                        />
                      </div>
                    )}

                    {/* Cart Button - Always visible */}
                    <div className="p-1">
                      <div
                        className="flex items-center justify-center rounded-full w-8 h-8 md:w-10 md:h-10 bg-gray-100 relative cursor-pointer"
                        onClick={() => {
                          if (!authToken) {
                            alert(
                              "Please sign up or log in to view your cart and proceed to checkout."
                            );
                            setIsAuthModalVisible(true);
                          } else {
                            setIsCartOpen(true);
                          }
                        }}
                      >
                        <div className="block sm:hidden">
                          <CartSvg color="black" width={18} height={18} />
                        </div>
                        <div className="hidden sm:block">
                          <CartSvg color="black" width={22} height={22} />
                        </div>
                        <div className="absolute -top-1 -right-1 bg-black text-[#5AC12F] text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                          {cartCount || 0}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

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
                      className="w-full h-[10%] mt-2 max-h-[60vh] bg-white overflow-scroll"
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

      {/* Cart Sidebar */}
      <Sidebar
        visible={isCartOpen}
        onHide={handleCartClose}
        position="right"
        className="!p-0 !m-0 w-full md:w-[430] lg:w-[580px]"
       >
      <Cart onClose={handleCartClose} />
      </Sidebar>

      <UserAddressComponent
        visible={isUserAddressModalOpen}
        onHide={() => setIsUserAddressModalOpen(false)}
      />
    </>
  );
};

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;