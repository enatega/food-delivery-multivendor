"use client";

import {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import { Skeleton } from "primereact/skeleton";
import { Dialog } from "primereact/dialog";
import { useQuery } from "@apollo/client";
import { PanelMenu } from "primereact/panelmenu";
import { MenuItem } from "primereact/menuitem";

// Context & Hooks
import useUser from "@/lib/hooks/useUser";
import useRestaurant from "@/lib/hooks/useRestaurant";

// Icons
import { ClockSvg, HeartSvg, InfoSvg, RatingSvg } from "@/lib/utils/assets/svg";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

// Components
import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import FoodItemDetail from "@/lib/ui/useable-components/item-detail";
import FoodCategorySkeleton from "@/lib/ui/useable-components/custom-skeletons/food-items.skeleton";
import { useMutation } from "@apollo/client";
import { ADD_FAVOURITE_RESTAURANT } from "@/lib/api/graphql/mutations/restaurant";
import { GET_USER_PROFILE } from "@/lib/api/graphql";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import Confetti from "react-confetti";
import CustomDialog from "@/lib/ui/useable-components/custom-dialog";
import EmptySearch from "@/lib/ui/useable-components/empty-search-results";

// API
import {
  GET_CATEGORIES_SUB_CATEGORIES_LIST,
  GET_POPULAR_SUB_CATEGORIES_LIST,
  GET_SUB_CATEGORIES,
} from "@/lib/api/graphql";

// Interface
import {
  ICategory,
  ICategoryDetailsResponse,
  ICategoryV2,
  IFood,
  IOpeningTime,
  ISubCategory,
  ISubCategoryV2,
} from "@/lib/utils/interfaces";

// Methods
import { toSlug } from "@/lib/utils/methods";
import ReviewsModal from "@/lib/ui/useable-components/reviews-modal";
import InfoModal from "@/lib/ui/useable-components/info-modal";
import ChatSvg from "@/lib/utils/assets/svg/chat";
import Image from "next/image";
import Loader from "@/app/(localized)/mapview/[slug]/components/Loader";
import { motion } from "framer-motion";
import { ToastContext } from "@/lib/context/global/toast.context";
import { useTranslations } from "next-intl";

export default function StoreDetailsScreen() {
  const t = useTranslations()
  // Access the UserContext via our custom hook
  const { cart, transformCartWithFoodInfo, updateCart, profile } = useUser();

  // Params
  const { id, slug }: { id: string; slug: string } = useParams();

  // State
  const [showDialog, setShowDialog] = useState<IFood | null>(null);
  const [showReviews, setShowReviews] = useState<boolean>(false);
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false);
  const [filter] = useState("");
  const [isScrolling, setIsScrolling] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { CURRENCY_SYMBOL } = useConfig();
  const [subCategoriesForCategories, setSubCategoriesForCategories] = useState<
    ICategoryDetailsResponse[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState({ value: false, id: "" });

  // Ref
  const selectedCategoryRefs = useRef<string>("");
  const selectedSubCategoryRefs = useRef<string>("");

  // Hooks
  const { data, loading } = useRestaurant(id, decodeURIComponent(slug));
  const {
    data: categoriesSubCategoriesList,
    loading: categoriesSubCategoriesLoading,
  } = useQuery(GET_CATEGORIES_SUB_CATEGORIES_LIST, {
    variables: {
      storeId: id,
    },
  });
  const { data: popularSubCategoriesList } = useQuery(
    GET_POPULAR_SUB_CATEGORIES_LIST,
    {
      variables: {
        restaurantId: id,
      },
    }
  );

  const { data: subcategoriesData, loading: subcategoriesLoading } =
    useQuery(GET_SUB_CATEGORIES);

  // Transform cart items when restaurant data is loaded
  useEffect(() => {
    if (data?.restaurant && cart.length > 0) {
      const transformedCart = transformCartWithFoodInfo(cart, data.restaurant);
      if (JSON.stringify(transformedCart) !== JSON.stringify(cart)) {
        updateCart(transformedCart);
      }
    }
  }, [data?.restaurant, cart.length, transformCartWithFoodInfo, updateCart]);

  useEffect(() => {
    if (profile?.favourite) {
      const isFavorite = profile.favourite.includes(id);
      setIsLiked(isFavorite);
    }
  }, [profile, id]);

  // Constants
  const allDeals = data?.restaurant?.categories?.filter(
    (cat: ICategory) => cat.foods.length
  );

  // Templates
  const parentItemRenderer = (item: MenuItem) => {
    const _url = item.url?.slice(1);
    const isClicked = _url === selectedCategoryRefs.current;

    return (
      <div
        className="flex align-items-center px-3 py-2 cursor-pointer"
        onClick={() => handleScroll(_url ?? "", true)}
      >
        <span
          className={`mx-2 ${item.items && "font-semibold"} text-${
            isClicked ? "[#5AC12F]" : "gray-600"
          }`}
        >
          {item.label}
        </span>
      </div>
    );
  };

  // Handle update is modal open if restaurant is not active
  const handleUpdateIsModalOpen = useCallback(
    (value: boolean, id: string) => {
      if (isModalOpen.value !== value || isModalOpen.id !== id) {
        setIsModalOpen({ value, id });
      }
    },
    [isModalOpen]
  );

  const itemRenderer = (item: MenuItem) => {
    const _url = item.url?.slice(1);
    const isClicked = _url === selectedSubCategoryRefs.current;

    return (
      <div
        className={`flex align-items-center px-3 py-2 cursor-pointer bg-${
          isClicked ? "[#F3FFEE]" : ""
        }`}
        onClick={() => handleScroll(_url ?? "", false, 80)}
      >
        <span
          className={`mx-2 ${item.items && "font-semibold"} text-${
            isClicked ? "[#5AC12F]" : "gray-600"
          }`}
        >
          {item.label}
        </span>
      </div>
    );
  };

  const deals = useMemo(() => {
    const subCategories = subcategoriesData?.subCategories;
    if (!allDeals || !subCategories) return [];

    const allDealCategories =
      allDeals
        .map((category: ICategory, index: number) => {
          const subCats = subCategories.filter(
            (sc: ISubCategory) => sc.parentCategoryId === category._id
          );

          const groupedFoods: Record<string, IFood[]> = {};

          category.foods.forEach((food) => {
            const subCatId = food.subCategory || "uncategorized";
            if (!groupedFoods[subCatId]) groupedFoods[subCatId] = [];
            groupedFoods[subCatId].push({
              ...food,
              title: food.title.toLowerCase(),
            });
          });

          const subCategoryGroups = subCats
            .map((subCat: ISubCategory) => {
              const foods = groupedFoods[subCat._id] || [];

              return foods.length > 0
                ? {
                    _id: subCat._id,
                    title: subCat.title,
                    foods,
                  }
                : null;
            })
            .filter(Boolean) as {
            _id: string;
            title: string;
            foods: IFood[];
          }[];

          if (groupedFoods["uncategorized"]?.length > 0) {
            subCategoryGroups.push({
              _id: "uncategorized",
              title: t("StoresPage.Uncategorized"),
              foods: groupedFoods["uncategorized"],
            });
          }

          if (subCategoryGroups.length === 0) return null;

          return {
            ...category,
            index,
            subCategories: subCategoryGroups,
          };
        })
        .filter(Boolean) || [];

    // 🔥 Add "Popular Items" category
    const popularItems = popularSubCategoriesList?.popularItems || [];

    if (popularItems.length > 0) {
      const popularFoods: IFood[] = [];

      for (const popular of popularItems) {
        for (const category of allDealCategories) {
          for (const subCat of category.subCategories) {
            const match = subCat.foods.find((food) => food._id === popular.id);
            if (match && !popularFoods.find((f) => f._id === match._id)) {
              popularFoods.push(match);
            }
          }
        }
      }

      if (popularFoods.length > 0) {
        allDealCategories.unshift({
          _id: "popular-items",
          title: t('StoresPage.popitems'),
          foods: [],
          subCategories: [
            {
              _id: "popular-items-sub",
              foods: popularFoods,
            },
          ],
        });
      }
    }

    return allDealCategories;
  }, [
    allDeals,
    filter,
    subcategoriesData?.subCategories,
    popularSubCategoriesList?.popularItems,
  ]);

  const menuItems = useMemo(() => {
    const baseItems =
      categoriesSubCategoriesList?.fetchCategoryDetailsByStoreId?.map(
        (item: ICategoryDetailsResponse) => ({
          id: item.id,
          label: item.label,
          url: item.url,
          template: parentItemRenderer,
          items:
            item.items?.map((subItem) => ({
              id: subItem.id,
              label: subItem.label,
              url: subItem.url,
              template: itemRenderer,
            })) || [],
        })
      ) || [];

    const popularItems = popularSubCategoriesList?.popularItems || [];

    // If popularItems exist, map them to menu format by matching with 'deals'
    if (popularItems.length > 0 && deals.length > 0) {
      const matchedPopularFoods: {
        id: string;
        label: string;
        url?: string;
        template?: any;
      }[] = [];

      popularItems.forEach((popularItem: { id: string }) => {
        // Loop through all deals -> subCategories -> foods
        for (const dealCategory of deals) {
          for (const subCat of dealCategory.subCategories) {
            const matchedFood = subCat.foods.find(
              (food) => food._id === popularItem.id
            );
            if (matchedFood) {
              matchedPopularFoods.push({
                id: matchedFood._id,
                label: matchedFood.title,
                template: itemRenderer,
              });
              break;
            }
          }
        }
      });

      if (matchedPopularFoods.length > 0) {
        baseItems.unshift({
          id: "popular-items",
          label: t('StoresPage.popitems'),
          title: t('StoresPage.popitems'),

          url: "#popular-items",
          template: parentItemRenderer,
          items: matchedPopularFoods,
        });
      }
    }

    return baseItems;
  }, [
    categoriesSubCategoriesList?.fetchCategoryDetailsByStoreId,
    popularSubCategoriesList?.popularItems,
    deals,
  ]);

  // Handlers
  const handleScroll = (id: string, isParent = true, offset: number = 120) => {
    console.log("handleScrollId", id);
    if (isParent) {
      setSelectedCategory(id);
      selectedCategoryRefs.current = id || "";
      // Filter SubCategories
      const sliderSubCategories =
        menuItems?.find(
          (item: ICategoryDetailsResponse) => toSlug(item.label) === id
        )?.items || [];

      setSubCategoriesForCategories(sliderSubCategories);
    } else {
      selectedSubCategoryRefs.current = id || "";
      setSelectedSubCategory(id);
    }
    const element = document.getElementById(id);
    const container = document.body; // Adjust selector

    if (element && container) {
      const headerOffset = offset;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      container.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleMouseEnterCategoryPanel = () => {
    if (!isScrolling) {
      setIsScrolling(true);
    }
  };

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

  // Function to handle opening the food item modal
  const handleOpenFoodModal = (food: IFood) => {
    if (food.isOutOfStock) return;

    if (
      !restaurantInfo?.isAvailable ||
      !restaurantInfo?.isActive ||
      !isWithinOpeningTime(restaurantInfo?.openingTimes)
    ) {
      handleUpdateIsModalOpen(true, food?._id);
      return;
    }
    // Add restaurant ID to the food item
    setShowDialog({
      ...food,
      restaurant: data?.restaurant?._id,
    });
  };

  // Function to close the food item modal
  const handleCloseFoodModal = () => {
    setShowDialog(null);
  };

  const [addFavorite, { loading: addFavoriteLoading }] = useMutation(
    ADD_FAVOURITE_RESTAURANT,
    {
      onCompleted: () => {
        const wasLiked = isLiked;
        setIsLiked(!isLiked);

        // Only show confetti when adding a favorite (not removing)
        if (!wasLiked) {
          console.log("Favorite added, triggering confetti!");
          setShowConfetti(true);

          // Reset confetti after a longer delay
          setTimeout(() => {
            setShowConfetti(false);
          }, 5000);
        }
      },
      onError: (error) => {
        console.error("Error toggling favorite:", error);
      },
      refetchQueries: [{ query: GET_USER_PROFILE }],
    }
  );

  // Constants
  const headerData = {
    name: data?.restaurant?.name ?? "...",
    averageReview: data?.restaurant?.reviewData?.ratings ?? "...",
    averageTotal: data?.restaurant?.reviewData?.total ?? "...",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
    deliveryTime: data?.restaurant?.deliveryTime,
  };
  const { showToast } = useContext(ToastContext);
  const handleFavoriteClick = () => {
    if (!profile) {
      showToast({
        type: "error",
        title: "Login Required",
        message: "Please Login to add favorites",
      });
      return;
    }

    addFavorite({
      variables: {
        id: id,
      },
    });
  };

  const restaurantInfo = {
    _id: data?.restaurant?._id ?? "",
    name: data?.restaurant?.name ?? "...",
    image: data?.restaurant?.image ?? "",
    reviewData: data?.restaurant?.reviewData ?? {},
    address: data?.restaurant?.address ?? "",
    deliveryCharges: data?.restaurant?.deliveryCharges ?? "",
    deliveryTime: data?.restaurant?.deliveryTime ?? "...",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
    isActive: data?.restaurant?.isActive ?? true,
  };

  const restaurantInfoModalProps = {
    deliveryTime: data?.restaurant.deliveryTime ?? "30-45",
    deliveryTax: data?.restaurant.tax ?? "0",
    MinimumOrder: data?.restaurant.minimumOrder ?? "0",
    _id: data?.restaurant._id ?? "",
    name: data?.restaurant?.name ?? "...",
    username: data?.restaurant?.username ?? "N/A",
    phone: data?.restaurant?.phone ?? "N/A",
    address: data?.restaurant?.address ?? "N/A",
    location: data?.restaurant?.location ?? "N/A",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
    description:
      data?.restaurant?.description ??
      t("restaurant_modal_label"),
  };

  // Handlers
  // Function to handle the logic for seeing reviews
  const handleSeeReviews = () => {
    setShowReviews(true);
  };

  // Function to handle the logic for seeing more information
  const handleSeeMoreInfo = () => {
    setShowMoreInfo(true);
  };

  // Effect to select the first category on page load
  useEffect(() => {
    if (menuItems?.length > 0 && !selectedCategory) {
      const firstCategorySlug = toSlug(menuItems[0].label);
      setSelectedCategory(firstCategorySlug);
      selectedCategoryRefs.current = firstCategorySlug;
    }
  }, [menuItems]);

  // Effect to update selected category during scrolling
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

      if (selected && selected !== selectedCategoryRefs.current) {
        setSelectedCategory(selected);
        selectedCategoryRefs.current = selected;
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
      {/* Reviews Modal  */}
      <ReviewsModal
        restaurantId={id}
        visible={showReviews && !loading}
        onHide={() => setShowReviews(false)}
      />
      {/* See More  Info Modal */}
      <InfoModal
        restaurantInfo={restaurantInfoModalProps}
        // make sure data is not loading because if configuration data is not available it can cause error on google map due to unavailability of api key
        visible={showMoreInfo && !loading}
        onHide={() => setShowMoreInfo(false)}
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
              zIndex: 10000,
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
        </>
      )}

      {/* Banner */}
      <div className="relative">
        {loading ? (
          <Skeleton width="100%" height="20rem" borderRadius="0" />
        ) : (
          <Image
            src={restaurantInfo.image}
            alt="McDonald's banner with a burger and fries"
            width={1200}
            height={300}
            className="w-full h-72 object-cover"
          />
        )}

        {!loading && (
          <div className="absolute bottom-0 left-0 md:left-20 p-4">
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
          onClick={handleFavoriteClick}
          disabled={addFavoriteLoading}
          className="absolute top-4 right-4 md:bottom-4 md:right-4 md:top-auto rounded-full bg-white h-8 w-8 flex justify-center items-center transform transition-transform duration-300 hover:scale-110 active:scale-95"
        >
          {addFavoriteLoading ? (
            <Loader style={{ width: "1.5rem", height: "1.5rem" }} />
          ) : (
            <HeartSvg filled={isLiked} />
          )}
        </button>
      </div>

      {/* Restaurant Info */}
      <div className="bg-gray-50 shadow-[0px_1px_3px_rgba(0,0,0,0.1)]  p-3 md:h-[80px] h-fit flex justify-between items-center">
        <PaddingContainer>
          <div className="p-3  h-full w-full flex flex-col md:flex-row gap-2 items-center justify-between">
            <div className="w-full md:w-[80%]">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {/* Time */}
                <span className="flex items-center gap-1 text-gray-600 font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle">
                  <ClockSvg />
                  {loading ? (
                    <Skeleton width="2rem" height="1.5rem" />
                  ) : (
                    headerData.deliveryTime
                  )}
                  <span>mins</span>
                </span>

                {/* Rating */}
                <span className="flex items-center gap-2 text-gray-600 font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle">
                  <RatingSvg />
                  {loading ? (
                    <Skeleton width="2rem" height="1.5rem" />
                  ) : (
                    headerData.averageReview
                  )}
                </span>

                {/* Info Link */}
                <a
                  className="flex items-center gap-2 text-[#0EA5E9] font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle"
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
                    t('StoresPage.SeeStoreinfo')
                  )}
                </a>
                {/* Review Link */}
                <a
                  className="flex items-center gap-2 text-[#0EA5E9] font-inter font-normal text-sm sm:text-base md:text-lg leading-5 sm:leading-6 md:leading-7 tracking-[0px] align-middle"
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
                    t('StoresPage.storereviews')
                  )}
                </a>
              </div>
            </div>
          </div>
        </PaddingContainer>
      </div>

      {/* Category Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:top-[90px] top-[103px]"
        style={{
          position: "sticky",

          zIndex: 50,
          backgroundColor: "white",
          boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <PaddingContainer>
          <div className="p-3  w-full flex flex-col md:hidden gap-2 items-center justify-between">
            {/* Categories */}
            <div
              className="w-full overflow-x-auto overflow-y-hidden flex items-center 
                  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <ul className="flex space-x-4 items-center w-max flex-nowrap">
                {menuItems?.map(
                  (category: ICategoryDetailsResponse, index: number) => {
                    const _slug = toSlug(category.label);

                    return (
                      <li key={index} className="shrink-0">
                        <button
                          className={`bg-${
                            selectedCategory === _slug
                              ? "[#F3FFEE]"
                              : "gray-100"
                          } text-${
                            selectedCategory === _slug
                              ? "[#5AC12F]"
                              : "gray-600"
                          } rounded-full px-3 py-2 text-[10px] sm:text-sm md:text-base font-medium whitespace-nowrap`}
                          onClick={() => handleScroll(_slug, true, 100)}
                        >
                          {category.label}
                        </button>
                      </li>
                    );
                  }
                )}
              </ul>
            </div>

            {/* Sub-Categories */}
            {subCategoriesForCategories.length > 0 && (
              <div
                className="w-full overflow-x-auto overflow-y-hidden flex items-center 
                  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                <ul className="flex space-x-4 items-center w-max flex-nowrap">
                  {subCategoriesForCategories?.map(
                    (sub_category: ICategoryDetailsResponse, index: number) => {
                      const _slug = toSlug(sub_category.label);

                      return (
                        <li key={index} className="shrink-0">
                          <button
                            className={`bg-${
                              selectedSubCategory === _slug
                                ? "[#F3FFEE]"
                                : "gray-100"
                            } text-${
                              selectedSubCategory === _slug
                                ? "[#5AC12F]"
                                : "gray-600"
                            } rounded-full px-3 py-2 text-[10px] sm:text-sm md:text-base font-medium whitespace-nowrap`}
                            onClick={() => handleScroll(_slug, false, 170)}
                          >
                            {sub_category.label}
                          </button>
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            )}
          </div>
        </PaddingContainer>
      </motion.div>

      {/* Main Section */}
      <PaddingContainer>
        {loading || categoriesSubCategoriesLoading || subcategoriesLoading ? (
          <div className=" w-full">
            <FoodCategorySkeleton />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row w-full">
            <div className="hidden md:block md:w-1/5 p-3 h-screen z-10  sticky top-14 left-0">
              <div className="h-full overflow-hidden group">
                <div
                  className={`h-full overflow-y-auto transition-all duration-300 ${
                    isScrolling
                      ? "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                      : "overflow-hidden"
                  }`}
                  onScroll={handleMouseEnterCategoryPanel}
                >
                  <PanelMenu
                    model={menuItems}
                    className="w-full"
                    expandIcon={<span></span>}
                    collapseIcon={<span></span>}
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-4/5 p-3 h-full overflow-y-auto">
              {deals.map((category: ICategoryV2, catIndex: number) => (
                <div
                  key={catIndex}
                  className="mb-4"
                  id={toSlug(category.title)}
                >
                  <h2 className="mb-2 font-inter text-gray-900 font-bold text-2xl sm:text-xl leading-snug tracking-tight">
                    {category.title}
                  </h2>

                  {category.subCategories.map(
                    (subCategory: ISubCategoryV2, subCatIndex: number) => (
                      <div
                        key={subCatIndex}
                        className="mb-4"
                        id={toSlug(subCategory.title)}
                      >
                        {subCategory.title !== "Uncategorized" && (
                          <h3 className="mb-2 font-inter text-gray-600 font-semibold text-lg sm:text-base leading-snug tracking-normal">
                            {subCategory.title}
                          </h3>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ">
                          {subCategory.foods.map((meal: IFood, mealIndex) => (
                            <div
                              key={mealIndex}
                              className="flex items-center gap-4 rounded-lg border border-gray-300 shadow-sm bg-white p-3 relative transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer"
                              onClick={() => handleOpenFoodModal(meal)}
                            >
                              {/* Text Content */}
                              <div className="flex-grow text-left md:text-left space-y-2 ">
                                <div className="flex flex-col lg:flex-row justify-between flex-wrap">
                                  <h3 className="text-gray-900 text-lg font-semibold font-inter">
                                    {meal.title}
                                  </h3>
                                  {meal.isOutOfStock && (
                                    <span className="text-red-500">
                                      {t('out_of_stock_label')}
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-500 text-sm">
                                  {meal.description}
                                </p>

                                <div className="flex items-center gap-2">
                                  <span className="text-[#0EA5E9] text-lg font-semibold">
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
                                  width={100}
                                  height={100}
                                />
                              </div>

                              {/* Add Button */}
                              <div className="absolute top-2 right-2">
                                <button
                                  className="bg-[#0EA5E9] rounded-full shadow-md w-6 h-6 flex items-center justify-center"
                                  onClick={() => handleOpenFoodModal(meal)}
                                  type="button"
                                >
                                  <FontAwesomeIcon
                                    icon={faPlus}
                                    color="white"
                                  />
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
                                  handleUpdateIsModalOpen(
                                    false,
                                    meal?._id?.toString()
                                  )
                                }
                              >
                                <div className="text-center pb-10 pt-10">
                                  <p className="text-lg font-bold pb-3">
                                    {t("restaurant_is_closed")}
                                  </p>
                                  <p className="text-sm">
                                    {t("cannot_order_food_item_now")}
                                   <br></br> 
                                   {t("please_try_again_later")}
                                  </p>
                                </div>
                              </CustomDialog>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && deals.length == 0 && (
          <div className="text-center py-6 text-gray-500 flex flex-col items-center justify-center">
            <EmptySearch />
          </div>
        )}
      </PaddingContainer>

      {/* Food Item Detail Modal */}
      <Dialog
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
        {showDialog && (
          <FoodItemDetail
            foodItem={showDialog}
            addons={data?.restaurant?.addons}
            options={data?.restaurant?.options}
            onClose={handleCloseFoodModal}
          />
        )}
      </Dialog>
    </>
  );
}
