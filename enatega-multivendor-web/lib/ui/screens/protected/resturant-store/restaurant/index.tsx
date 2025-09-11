"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import { Skeleton } from "primereact/skeleton";
import { useMutation } from "@apollo/client";
import { ADD_FAVOURITE_RESTAURANT } from "@/lib/api/graphql/mutations/restaurant";
import { GET_USER_PROFILE } from "@/lib/api/graphql";
import { useQuery } from "@apollo/client";

// Context & Hooks
import useUser from "@/lib/hooks/useUser";
import useRestaurant from "@/lib/hooks/useRestaurant";

// Icons
import { ClockSvg, HeartSvg, InfoSvg, RatingSvg } from "@/lib/utils/assets/svg";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";

// Components
import Spacer from "@/lib/ui/useable-components/spacer";
import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import CustomIconTextField from "@/lib/ui/useable-components/input-icon-field";
import FoodItemDetail from "@/lib/ui/useable-components/item-detail";
import FoodCategorySkeleton from "@/lib/ui/useable-components/custom-skeletons/food-items.skeleton";
import ClearCartModal from "@/lib/ui/useable-components/clear-cart-modal";
import Confetti from "react-confetti";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import EmptySearch from "@/lib/ui/useable-components/empty-search-results";
// Interface
import { ICategory, IFood, IOpeningTime } from "@/lib/utils/interfaces";

// Methods
import { toSlug } from "@/lib/utils/methods";
import ChatSvg from "@/lib/utils/assets/svg/chat";
import ReviewsModal from "@/lib/ui/useable-components/reviews-modal";
import InfoModal from "@/lib/ui/useable-components/info-modal";
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";

// Queries
import { GET_POPULAR_SUB_CATEGORIES_LIST } from "@/lib/api/graphql";
import { Dialog } from "primereact/dialog";
import Loader from "@/app/(localized)/mapview/[slug]/components/Loader";
import { motion } from "framer-motion";
import CustomDialog from "@/lib/ui/useable-components/custom-dialog";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function RestaurantDetailsScreen() {
  // Access the UserContext via our custom hook
  const {
    cart,
    transformCartWithFoodInfo,
    updateCart,
    restaurant: cartRestaurant,
    clearCart,
  } = useUser();

  // Params from route
  const { id, slug }: { id: string; slug: string } = useParams();

  // Refs
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const selectedCategoryRef = useRef<string>("");

  // get the RTL direction
  const direction = document.documentElement.getAttribute("dir") || "ltr";

  // State
  const [filter, setFilter] = useState("");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<IFood | null>(null);
  const [showClearCartModal, setShowClearCartModal] = useState<boolean>(false);
  const [pendingRestaurantAction, setPendingRestaurantAction] =
    useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { CURRENCY_SYMBOL } = useConfig();
  const [isModalOpen, setIsModalOpen] = useState({ value: false, id: "" });

  // Get user profile from context
  const { profile } = useUser();

  // Fetch restaurant data
  const { data, loading } = useRestaurant(id, decodeURIComponent(slug));

  // fetch popular deals id
  const { data: popularSubCategoriesList } = useQuery(
    GET_POPULAR_SUB_CATEGORIES_LIST,
    {
      variables: {
        restaurantId: id,
      },
    }
  );
  // Transform cart items when restaurant data is loaded - only once when dependencies change
  useEffect(() => {
    if (data?.restaurant && cart.length > 0) {
      const transformedCart = transformCartWithFoodInfo(cart, data.restaurant);
      if (JSON.stringify(transformedCart) !== JSON.stringify(cart)) {
        updateCart(transformedCart);
      }
    }
  }, [data?.restaurant, cart?.length, transformCartWithFoodInfo, updateCart]);

  // Filter food categories based on search term
  const allDeals = data?.restaurant?.categories?.filter(
    (cat: ICategory) => cat.foods.length
  );

  // Check if restaurant is favorited when profile is loaded
  useEffect(() => {
    if (profile?.favourite) {
      const isFavorite = profile.favourite.includes(id);
      setIsLiked(isFavorite);
    }
  }, [profile, id]);

  // Handle update is modal open if restaurant is not active
  const handleUpdateIsModalOpen = useCallback(
    (value: boolean, id: string) => {
      if (isModalOpen.value !== value || isModalOpen.id !== id) {
        setIsModalOpen({ value, id });
      }
    },
    [isModalOpen]
  );

  const popularDealsIds = popularSubCategoriesList?.popularItems?.map(
    (item: any) => item.id
  );

  const deals = useMemo(() => {
    const filteredDeals =
      (allDeals || [])
        .filter((c: ICategory) => {
          if (filter.trim() === "") return true;

          const categoryMatches = c.title
            .toLowerCase()
            .includes(filter.toLowerCase());
          const foodsMatch = c.foods.some((food: IFood) =>
            food.title.toLowerCase().includes(filter.toLowerCase())
          );

          return categoryMatches || foodsMatch;
        })
        .map((c: ICategory, index: number) => ({
          ...c,
          index,
          foods: c.foods.filter((food) => {
            // If filter is empty, include all foods
            if (filter.trim() === "") return true;

            // Include food if title or description matches filter
            return (
              food.title.toLowerCase().includes(filter.toLowerCase()) ||
              (food.description &&
                food.description.toLowerCase().includes(filter.toLowerCase()))
            );
          }),
        }))
        .filter((c: ICategory) => c.foods.length > 0) || [];

    // Flatten all foods from all categories
    const allFoods = filteredDeals.flatMap((cat: ICategory) => cat.foods);

    // Filter foods that are in popularDealsIds
    const popularFoods = allFoods.filter((food: IFood) =>
      popularDealsIds?.includes(food._id)
    );

    // Create a "Popular Deals" category if there are matching foods
    const popularDealsCategory: ICategory | null = popularFoods.length
      ? {
          _id: "popular-deals",
          title: "Popular Deals",
          foods: popularFoods,
          // index can be used for custom ordering if needed
        }
      : null;

    // Add the new category at the top
    return popularDealsCategory
      ? [popularDealsCategory, ...filteredDeals]
      : filteredDeals;
  }, [allDeals, filter, popularDealsIds]);

  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (deals.length > 0 && !selectedCategory) {
      setSelectedCategory(toSlug(deals[0]?.title)); // first category selected by default
    }
  }, [deals, selectedCategory]);

  const [addFavorite, { loading: addFavoriteLoading }] = useMutation(
    ADD_FAVOURITE_RESTAURANT,
    {
      onCompleted: () => {
        const wasLiked = isLiked;
        setIsLiked(!isLiked);

        // Only show confetti when adding a favorite (not removing)
        if (!wasLiked) {
          setShowConfetti(true);

          // Reset confetti after a longer delay
          setTimeout(() => {
            setShowConfetti(false);
          }, 5000); // Increased from 3000ms to 5000ms
        }
      },
      onError: (error) => {
        console.error("Error adding favorite:", error);
        setIsLiked((prev) => !prev); // Revert the like state on error
      },
      refetchQueries: [{ query: GET_USER_PROFILE }],
    }
  );

  const t = useTranslations();
  const handleFavoriteClick = () => {
    if (!profile) {
      // // Handle case where user is not logged in
      return;
    }

    addFavorite({
      variables: {
        id: id,
      },
    });
  };

  // Restaurant info
  const headerData = {
    name: data?.restaurant?.name ?? "...",
    averageReview: data?.restaurant?.reviewData?.ratings ?? "...",
    averageTotal: data?.restaurant?.reviewData?.total ?? "...",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
    deals: deals,
    deliveryTime: data?.restaurant?.deliveryTime,
  };

  const restaurantInfo = {
    _id: data?.restaurant?._id ?? "",
    name: data?.restaurant?.name ?? "...",
    image: data?.restaurant?.image ?? "",
    deals: deals,
    reviewData: data?.restaurant?.reviewData ?? {},
    address: data?.restaurant?.address ?? "",
    deliveryCharges: data?.restaurant?.deliveryCharges ?? "",
    deliveryTime: data?.restaurant?.deliveryTime ?? "...",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
    isActive: data?.restaurant?.isActive ?? true,
  };

  const restaurantInfoModalProps = {
    _id: data?.restaurant?._id ?? "",
    name: data?.restaurant?.name ?? "...",
    username: data?.restaurant?.username ?? "N/A",
    phone: data?.restaurant?.phone ?? "N/A",
    address: data?.restaurant?.address ?? "N/A",
    location: data?.restaurant?.location ?? "N/A",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
    description: data?.restaurant?.description ?? t("restaurant_modal_label"),
    deliveryTime: data?.restaurant?.deliveryTime ?? "...",
    deliveryTax: data?.restaurant?.deliveryTax ?? 0,
    MinimumOrder: data?.restaurant?.MinimumOrder ?? 0,
  };

  // States
  const [visibleItems, setVisibleItems] = useState(10); // Default visible items
  const [showAll, setShowAll] = useState(false);
  const [headerHeight, setHeaderHeight] = useState("64px"); // Default for desktop
  const [showReviews, setShowReviews] = useState<boolean>(false);
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false);

  // Function to check weather time exisis
  const isWithinOpeningTime = (openingTimes: IOpeningTime[]): boolean => {
    const now = new Date();
    const currentDay = now
      .toLocaleString("en-US", { weekday: "short" })
      .toUpperCase(); // e.g., "MON", "TUE", ...
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const todayOpening = openingTimes.find((ot) => ot.day === currentDay);
    if (!todayOpening) return false;

    return todayOpening.times.some(({ startTime, endTime }) => {
      const [startHour, startMinute] = startTime.map(Number);
      const [endHour, endMinute] = endTime.map(Number);

      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;
      const nowTotal = currentHour * 60 + currentMinute;

      return nowTotal >= startTotal && nowTotal <= endTotal;
    });
  };

  // Function to handle clicking on a restaurant
  const handleRestaurantClick = (food: IFood) => {
    if (food.isOutOfStock) return;
    if (
      !restaurantInfo?.isAvailable ||
      !restaurantInfo?.isActive ||
      !isWithinOpeningTime(restaurantInfo?.openingTimes)
    ) {
      // Store the action we want to perform after cart confirmation
      handleUpdateIsModalOpen(true, food?._id);
      return;
    }
    // Check if there's a different restaurant in the cart
    if (cartRestaurant && id !== cartRestaurant) {
      // Store the action we want to perform after cart confirmation
      setPendingRestaurantAction({
        type: "foodModal",
        payload: food,
      });
      // Show clear cart confirmation
      setShowClearCartModal(true);
    } else {
      // No conflict, open food modal directly
      handleOpenFoodModal(food);
    }
  };

  // Function to handle clear cart confirmation
  const handleClearCartConfirm = async () => {
    await clearCart();

    // Execute the pending action
    if (pendingRestaurantAction) {
      if (pendingRestaurantAction.type === "foodModal") {
        handleOpenFoodModal(pendingRestaurantAction.payload);
      }
      // Reset the pending action
      setPendingRestaurantAction(null);
    }

    onUseLocalStorage("save", "restaurant", data?.restaurant?._id);
    onUseLocalStorage("save", "restaurant-slug", data?.restaurant?.slug);
    onUseLocalStorage(
      "save",
      "currentShopType",
      data?.restaurant?.shopType === "restaurant" ? "restaurant" : "store"
    );

    // Hide the modal
    setShowClearCartModal(false);
  };

  // Handlers
  const handleScroll = (id: string) => {
    setSelectedCategory(id);
    selectedCategoryRef.current = id;
    const element = document.getElementById(id);
    const container = document.body;

    if (element && container) {
      const headerOffset = 120;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      container.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Function to handle opening the food item modal
  const handleOpenFoodModal = (food: IFood) => {
    // Add restaurant ID to the food item
    setSelectedFood({
      ...food,
      restaurant: restaurantInfo._id,
    });
    setShowDialog(true);
    console.log("Food ModAL dETAISL", food);
  };

  // Function to close the food item modal
  const handleCloseFoodModal = () => {
    setShowDialog(false);
    setSelectedFood(null);
  };

  // Function to handle the logic for seeing reviews
  const handleSeeReviews = () => {
    setShowReviews(true);
  };

  // Function to handle the logic for seeing more information
  const handleSeeMoreInfo = () => {
    setShowMoreInfo(true);
  };

  // Function to show all categories
  useEffect(() => {
    // Adjust visible items based on screen width
    const updateVisibleItems = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleItems(3); // Small screens
      } else if (width < 1024) {
        setVisibleItems(4); // Medium screens
      } else {
        setVisibleItems(5); // Large screens
      }
    };

    const updateHeight = () => {
      if (window.innerWidth >= 1024)
        setHeaderHeight("64px"); // lg (desktop)
      else if (window.innerWidth >= 768)
        setHeaderHeight("80px"); // md (tablet)
      else if (window.innerWidth >= 640)
        setHeaderHeight("100px"); // sm (larger phones)
      else setHeaderHeight("120px"); // xs (small phones)
    };

    updateHeight();
    updateVisibleItems();
    window.addEventListener("resize", updateHeight);
    window.addEventListener("resize", updateVisibleItems);

    return () => {
      window.removeEventListener("resize", updateVisibleItems);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  // Highlight categories on scroll observer
  useEffect(() => {
    const handleScrollUpdate = () => {
      const container = document.body;
      if (!container) return;

      let selected = "";
      deals.forEach((category) => {
        const element = document.getElementById(toSlug(category.title));
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            selected = toSlug(category.title);
          }
        }
      });

      if (selected && selected !== selectedCategoryRef.current) {
        setSelectedCategory(selected);
        selectedCategoryRef.current = selected;
      }
    };

    const container = document.body;
    container?.addEventListener("scroll", handleScrollUpdate);

    return () => {
      container?.removeEventListener("scroll", handleScrollUpdate);
    };
  }, [deals]);

  return (
    <>
      {/* Reviews Modal */}
      <ReviewsModal
        restaurantId={id}
        visible={showReviews && !loading}
        onHide={() => setShowReviews(false)}
      />

      {/* See More Info Modal */}
      <InfoModal
        restaurantInfo={restaurantInfoModalProps}
        // make sure data is not loading because if configuration data is not available it can cause error on google map due to unavailability of api key
        visible={showMoreInfo && !loading}
        onHide={() => setShowMoreInfo(false)}
      />

      {/* Clear Cart Modal */}
      <ClearCartModal
        isVisible={showClearCartModal}
        onHide={() => setShowClearCartModal(false)}
        onConfirm={handleClearCartConfirm}
      />
      {showConfetti && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pointerEvents: "none",
              zIndex: 10000, // Increased z-index
            }}
          >
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={1000}
              gravity={0.3}
            />
          </div>
          {/* Backdrop overlay to ensure confetti is visible on all backgrounds */}
        </>
      )}

      {/* Banner */}
      <div className="relative">
        {loading ? (
          <Skeleton width="100%" height="18rem" borderRadius="0" />
        ) : (
          <Image
            src={restaurantInfo.image}
            alt={`${restaurantInfo.name} banner`}
            width={1200}
            height={300}
            className="w-full h-72 object-cover"
          />
        )}

        {!loading && (
          <div
            className={`${direction === "rtl" ? "right-0 md:right-20" : "left-0 md:left-20"} absolute bottom-0  p-4`}
          >
            <div className="flex flex-col items-start">
              <Image
                src={restaurantInfo.image}
                alt={`${restaurantInfo.name} logo`}
                width={50}
                height={50}
                className="w-12 h-12 mb-2 object-cover"
              />

              <div className="text-white space-y-2">
                <h1 className="font-inter font-extrabold text-[32px] leading-[100%] sm:text-[40px] md:text-[48px]">
                  {restaurantInfo.name}
                </h1>
                <p className="font-inter font-medium text-[18px] leading-[28px] sm:text-[20px] sm:leading-[30px] md:text-[24px] md:leading-[32px]">
                  {restaurantInfo.address}
                </p>
              </div>
            </div>
          </div>
        )}
        <button
          disabled={addFavoriteLoading}
          onClick={handleFavoriteClick}
          className={`absolute top-4 ${direction === "rtl" ? "left-4 md:left-4" : "right-4 md:right-4"} md:bottom-4 md:top-auto rounded-full bg-white dark:bg-gray-700 h-8 w-8 flex justify-center items-center transform transition-transform duration-300 hover:scale-110 active:scale-95`}
        >
          {addFavoriteLoading ? (
            <Loader style={{ width: "1.5rem", height: "1.5rem" }} />
          ) : (
            <HeartSvg filled={isLiked} />
          )}
        </button>
      </div>
      {/* Restaurant Info */}
      <div className="bg-gray-50 dark:bg-gray-800 shadow-[0px_1px_3px_rgba(0,0,0,0.1)] p-3 h-[80px] flex justify-between items-center">
        <PaddingContainer>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Time */}
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle">
              <ClockSvg />
              {loading ? (
                <Skeleton width="1rem" height="1.5rem" />
              ) : (
                `${headerData.deliveryTime} mins`
              )}
            </span>

            {/* Rating */}
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300  font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle">
              <RatingSvg />
              {loading ? (
                <Skeleton width="1rem" height="1.5rem" />
              ) : (
                headerData.averageReview
              )}
            </span>

            {/* Info Link */}
            <a
              className="flex items-center gap-2 text-[#0EA5E9] dark:text-sky-400 font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSeeMoreInfo();
              }}
            >
              <InfoSvg />
              {loading ? (
                <Skeleton width="10rem" height="1.5rem" />
              ) : (
                t("see_more_information")
              )}
            </a>

            {/* Review Link */}
            <a
              className="flex items-center gap-2 text-[#0EA5E9] dark:text-sky-400 font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSeeReviews();
              }}
            >
              <ChatSvg />
              {loading ? (
                <Skeleton width="10rem" height="1.5rem" />
              ) : (
                t("see_reviews")
              )}
            </a>
          </div>
        </PaddingContainer>
      </div>

      {/* Category Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:top-[60px] top-[95px] sticky z-50 bg-white dark:bg-gray-900 shadow-[0_1px_1px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_1px_rgba(255,255,255,0.05)]"
      >
        <PaddingContainer height={headerHeight}>
          <div className="p-3 h-full w-full flex flex-col md:flex-row gap-2 items-center justify-between">
            {/* Category List - Full Width on Small Screens, 80% on Larger Screens */}
            <div className="relative w-full md:w-[80%]">
              <div
                className="h-12 w-full overflow-x-auto overflow-y-hidden flex items-center 
                  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                <ul className="flex space-x-4 items-center w-max flex-nowrap">
                  {(showAll ? deals : deals.slice(0, visibleItems)).map(
                    (category: ICategory, index: number) => {
                      const _slug = toSlug(category.title);
                      return (
                        <li key={index} className="shrink-0">
                          <button
                            type="button"
                            className={`${
                              selectedCategory === _slug
                                ? "bg-[#F3FFEE] text-[#5AC12F] dark:bg-[#2E3B23] dark:text-[#D2F29E]"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            } rounded-full px-3 py-2 text-[10px] sm:text-sm md:text-base font-medium whitespace-nowrap`}
                            onClick={() => handleScroll(toSlug(category.title))}
                          >
                            {category.title}
                          </button>
                        </li>
                      );
                    }
                  )}

                  {!showAll && deals.length > visibleItems && (
                    <li className="shrink-0">
                      <button
                        type="button"
                        className="bg-blue-500 text-white dark:bg-blue-600 rounded-full px-4 py-2 font-medium text-[14px] cursor-pointer"
                        onClick={() => setShowAll(true)}
                      >
                        {t("more_button")}
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Search Input - 20% Width on Large Screens, Full Width on Small Screens */}
            <div className="h-full w-full md:w-[20%]">
              {
                <CustomIconTextField
                  value={filter}
                  className="w-full md:h-10 h-9 rounded-full pl-10 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  iconProperties={{
                    icon: faSearch,
                    position: "left",
                    style: { marginTop: "-10px" },
                  }}
                  placeholder={t("search_for_food_items_placeholder")}
                  type="text"
                  name="search"
                  showLabel={false}
                  isLoading={loading}
                  onChange={(e) => setFilter(e.target.value)}
                />
              }
            </div>
          </div>
        </PaddingContainer>
      </motion.div>

      <Spacer height="20px" />

      {/* Food Categories and Items */}
      <PaddingContainer className="pb-10">
        {loading ? (
          <FoodCategorySkeleton />
        ) : (
          deals.map((category: ICategory, catIndex: number) => {
            const categorySlug = toSlug(category.title);

            return (
              <div
                key={catIndex}
                className="mb-4 p-3"
                id={categorySlug}
                data-category-id={categorySlug}
                ref={(el) => {
                  categoryRefs.current[categorySlug] = el;
                }}
              >
                <h2 className="mb-4 font-inter text-gray-900 dark:text-gray-100 font-bold text-2xl sm:text-xl leading-snug tracking-tight">
                  {category.title}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {category.foods.map((meal: IFood, mealIndex) => (
                    <div
                      key={mealIndex}
                      className="flex gap-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-800 p-3 relative cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                      onClick={() => handleRestaurantClick(meal)}
                    >
                      {/* Text Content */}
                      <div className="flex-grow text-left md:text-left space-y-2">
                        <div className="flex flex-col lg:flex-row justify-between flex-wrap">
                          <h3 className="text-gray-900 dark:text-gray-100  text-lg font-semibold font-inter">
                            {meal.title}
                          </h3>
                          {meal.isOutOfStock && (
                            <span className="text-red-500">
                              {t("out_of_stock_label")}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-500 dark:text-gray-400 text-sm text-wrap">
                          {meal.description}
                        </p>

                        <div className="flex items-center gap-2">
                          <span className="text-[#0EA5E9] dark:text-sky-400 text-lg font-semibold">
                            {CURRENCY_SYMBOL} {meal.variations[0].price}
                          </span>
                        </div>
                      </div>

                      {/* Image */}
                      <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28">
                        <Image
                          alt={meal.title}
                          className="w-full h-full rounded-md object-cover mx-auto md:mx-0"
                          src={meal.image}
                          width={112}
                          height={112}
                        />
                      </div>

                      {/* Add Button */}
                      <div
                        className={`${direction === "rtl" ? "left-2" : "right-2"} absolute top-2`}
                      >
                        <button
                          className="bg-[#0EA5E9] rounded-full shadow-md w-6 h-6 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering parent onClick
                            handleRestaurantClick(meal);
                          }}
                          type="button"
                        >
                          <FontAwesomeIcon icon={faPlus} color="white" />
                        </button>
                      </div>

                      {/* create a modal that will be show that this restaurant is closed do want to see menu or want to close if click on the see menu then will move to the next page other wise modal will be closed */}
                      <CustomDialog
                        className="max-w-[300px]"
                        visible={
                          isModalOpen.value &&
                          isModalOpen.id === meal?._id?.toString()
                        }
                        onHide={() =>
                          handleUpdateIsModalOpen(false, meal?._id?.toString())
                        }
                      >
                        <div className="text-center pb-10 pt-10">
                          <p className="text-lg font-bold pb-3 dark:text-gray-100">
                            {t("restaurant_is_closed")}
                          </p>
                          <p className="text-sm dark:text-gray-300">
                            {t("cannot_order_food_item_now")}
                            <br></br> {t("please_try_again_later")}
                          </p>
                        </div>
                      </CustomDialog>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
        {!loading && deals.length == 0 && (
          <div className="text-center py-6 text-gray-500 flex flex-col items-center justify-center">
            <EmptySearch />
          </div>
        )}
      </PaddingContainer>

      {/* Food Item Detail Modal */}
      <Dialog
        contentClassName="dark:bg-gray-800 dark:text-gray-300"
        headerClassName="dark:bg-gray-800 dark:text-gray-300"
        visible={!!showDialog}
        className="mx-3 sm:mx-4 md:mx-0 " // Adds margin on small screens
        onHide={handleCloseFoodModal}
        showHeader={false}
        contentStyle={{
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
          padding: "0px",
        }} // Rounds top corners
        style={{ borderRadius: "1rem" }} // Rounds full box including top corners
      >
        {selectedFood && (
          <FoodItemDetail
            foodItem={selectedFood}
            addons={data?.restaurant?.addons}
            options={data?.restaurant?.options}
            restaurant={data?.restaurant}
            onClose={handleCloseFoodModal}
          />
        )}
      </Dialog>
    </>
  );
}
