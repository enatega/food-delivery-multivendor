/* eslint-disable max-lines */
"use client";

// Core
import { faBicycle, faStore } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ApolloCache,
  ApolloError,
  useMutation,
  useQuery,
} from "@apollo/client";
import { Message } from "primereact/message";
import { useRouter } from "next/navigation";

import {
  GoogleMap,
  DirectionsService,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";

// Componentns
import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import Divider from "@/lib/ui/useable-components/custom-divider";
import UserAddressComponent from "@/lib/ui/useable-components/address";

// Context
import { GoogleMapsContext } from "@/lib/context/global/google-maps.context";
import { CartItem } from "@/lib/context/User/User.context";
import { useConfig } from "@/lib/context/configuration/configuration.context";

// Hooks
import useUser from "@/lib/hooks/useUser";
import useToast from "@/lib/hooks/useToast";
import useRestaurant from "@/lib/hooks/useRestaurant";
import { useUserAddress } from "@/lib/context/address/address.context";
import { useAuth } from "@/lib/context/auth/auth.context";

// Asssets
import { InfoSvg } from "@/lib/utils/assets/svg";

// Constants
import { DAYS } from "@/lib/utils/constants/orders";
import { PAYMENT_METHOD_LIST } from "@/lib/utils/constants";

// API
import { PLACE_ORDER, VERIFY_COUPON, ORDERS } from "@/lib/api/graphql";

// Interfaces
import {
  ICoupon,
  ICouponData,
  IOpeningTime,
  IOrder,
} from "@/lib/utils/interfaces";

// Types
import { OrderTypes } from "@/lib/utils/types/order";

// Methods
import {
  calculateAmount,
  calculateDistance,
  checkPaymentMethod,
} from "@/lib/utils/methods";

// Asets
import HomeIcon from "../../../../../assets/home_icon.png";
import RestIcon from "../../../../../assets/rest_icon.png";
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTheme } from "@/lib/providers/ThemeProvider";
import { darkMapStyle } from "@/lib/utils/mapStyles/mapStyle";
import { GET_TIPS } from "@/lib/api/graphql/queries/tipping";

//Coupon localStorage Keys
const COUPON_STORAGE_KEY = "applied_coupon";
const COUPON_TEXT_STORAGE_KEY = "coupon_text";
const COUPON_APPLIED_STORAGE_KEY = "is_coupon_applied";
const COUPON_RESTAURANT_KEY = "coupon_restaurant_id";

export default function OrderCheckoutScreen() {
  const t = useTranslations();
  const [isAddressSelectedOnce, setIsAddressSelectedOnce] = useState(false);
  const [isUserAddressModalOpen, setIsUserAddressModalOpen] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState("Delivery");
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [isPickUp, setIsPickUp] = useState(false);
  const [selectedTip, setSelectedTip] = useState("");
  const [distance, setDistance] = useState("0.0");
  const [shouldLeaveAtDoor, setShouldLeaveAtDoor] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(
    PAYMENT_METHOD_LIST[0].value
  );
  const [taxValue, setTaxValue] = useState();
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [isCheckingCache, setIsCheckingCache] = useState(true);

  // Coupon
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponText, setCouponText] = useState("");
  const [coupon, setCoupon] = useState<ICouponData | null>(null);

  // Hooks
  const router = useRouter();
  const { CURRENCY_SYMBOL, CURRENCY, DELIVERY_RATE, COST_TYPE, SERVER_URL } =
    useConfig();
  const { authToken, setIsAuthModalVisible } = useAuth();
  const { showToast } = useToast();

  const {
    cart,
    restaurant: restaurantId,
    clearCart,
    profile,
    fetchProfile,
    loadingProfile,
  } = useUser();
  const { userAddress } = useUserAddress();
  const restaurantFromLocalStorage = localStorage.getItem("restaurant");
  const { data: restaurantData } = useRestaurant(restaurantId || "") || {
    data: restaurantFromLocalStorage
      ? JSON.parse(restaurantFromLocalStorage)
      : null,
    loading: false,
  };
  // Load restaurant data from localStorage if not available from GraphQL
  const [localRestaurantData, setLocalRestaurantData] = useState(null);

  useEffect(() => {
    if (!restaurantData && restaurantFromLocalStorage) {
      try {
        const restaurantDataStr =
          localStorage.getItem("restaurantData") || "{}";
        const parsedData = JSON.parse(restaurantDataStr);
        setLocalRestaurantData(parsedData);
      } catch (error) {
        console.error(
          "Error parsing restaurant data from localStorage:",
          error
        );
      }
    }
  }, [restaurantData, restaurantFromLocalStorage]);

  // Load saved coupon from localStorage when page loads

  // ============================================================================
  // FIX: Clear coupon when restaurant changes
  // ============================================================================

  // ADD THIS NEW CONSTANT with your other coupon constants (around line 76)

  // ============================================================================
  // STEP 1: Update couponCompleted to save restaurant ID
  // ============================================================================

  // Find the couponCompleted function (around line 420) and UPDATE it:

  function couponCompleted({ coupon }: { coupon: ICoupon }) {
    if (!coupon.success) {
      showToast({
        type: "info",
        title: t("coupon_not_found_title"),
        message: `${couponText} ${t("coupon_is_not_valid_message_with_title")}`,
      });
    } else if (coupon.coupon) {
      if (coupon.coupon.enabled) {
        showToast({
          type: "info",
          title: t("coupon_applied_title"),
          message: `${coupon.coupon.title} ${t("coupon_has_been_applied_message")}`,
        });
        setIsCouponApplied(true);
        setCoupon(coupon.coupon);

        // SAVE TO LOCALSTORAGE
        onUseLocalStorage(
          "save",
          COUPON_STORAGE_KEY,
          JSON.stringify(coupon.coupon)
        );
        onUseLocalStorage("save", COUPON_TEXT_STORAGE_KEY, couponText);
        onUseLocalStorage("save", COUPON_APPLIED_STORAGE_KEY, "true");

        // SAVE RESTAURANT ID WITH COUPON
        onUseLocalStorage("save", COUPON_RESTAURANT_KEY, restaurantId || "");
      } else {
        showToast({
          type: "info",
          title: t("coupon_not_found_title"),
          message: `${coupon.coupon.title} ${t("coupon_is_not_valid_message_with_title")}`,
        });
      }
    }
  }

  // ============================================================================
  // STEP 2: Add useEffect to check restaurant change
  // ============================================================================

  // ADD THIS NEW useEffect after your existing coupon useEffects (around line 185)

  // Clear coupon when restaurant changes
  useEffect(() => {
    // Only run this check if restaurantId has actually loaded
    if (typeof window !== "undefined" && isCouponApplied && restaurantId) {
      const savedRestaurantId = onUseLocalStorage("get", COUPON_RESTAURANT_KEY);

      // Only clear if both IDs exist and are different
      if (savedRestaurantId && savedRestaurantId !== restaurantId) {
        // Restaurant changed - clear coupon
        setIsCouponApplied(false);
        setCoupon({} as ICouponData);
        setCouponText("");

        onUseLocalStorage("delete", COUPON_STORAGE_KEY);
        onUseLocalStorage("delete", COUPON_TEXT_STORAGE_KEY);
        onUseLocalStorage("delete", COUPON_APPLIED_STORAGE_KEY);
        onUseLocalStorage("delete", COUPON_RESTAURANT_KEY);

        showToast({
          type: "info",
          title: t("coupon_removed_title"),
          message: t("coupon_removed_different_restaurant"),
        });

        console.log("Coupon cleared: restaurant changed");
      }
    }
  }, [restaurantId, isCouponApplied, showToast, t]);

  // ============================================================================
  // STEP 3: Update the load coupon useEffect to validate restaurant
  // ============================================================================

  // REPLACE your existing "Load saved coupon" useEffect (around line 160) with this:

  // Load saved coupon from localStorage when page loads
  useEffect(() => {
    // Wait until restaurantId is loaded before checking coupon
    if (typeof window !== "undefined" && restaurantId) {
      const savedCouponData = onUseLocalStorage("get", COUPON_STORAGE_KEY);
      const savedCouponText = onUseLocalStorage("get", COUPON_TEXT_STORAGE_KEY);
      const savedCouponApplied = onUseLocalStorage(
        "get",
        COUPON_APPLIED_STORAGE_KEY
      );
      const savedRestaurantId = onUseLocalStorage("get", COUPON_RESTAURANT_KEY);

      if (savedCouponData && savedCouponText && savedCouponApplied === "true") {
        // CHECK IF RESTAURANT MATCHES
        if (savedRestaurantId === restaurantId) {
          try {
            const parsedCoupon = JSON.parse(savedCouponData);
            setCoupon(parsedCoupon);
            setCouponText(savedCouponText);
            setIsCouponApplied(true);
          } catch (error) {
            // Clear invalid data
            onUseLocalStorage("delete", COUPON_STORAGE_KEY);
            onUseLocalStorage("delete", COUPON_TEXT_STORAGE_KEY);
            onUseLocalStorage("delete", COUPON_APPLIED_STORAGE_KEY);
            onUseLocalStorage("delete", COUPON_RESTAURANT_KEY);
          }
        } else {
          // DIFFERENT RESTAURANT - CLEAR COUPON
          console.log("Coupon not loaded: different restaurant");
          onUseLocalStorage("delete", COUPON_STORAGE_KEY);
          onUseLocalStorage("delete", COUPON_TEXT_STORAGE_KEY);
          onUseLocalStorage("delete", COUPON_APPLIED_STORAGE_KEY);
          onUseLocalStorage("delete", COUPON_RESTAURANT_KEY);
        }
      }
    }
  }, [restaurantId]); // restaurantId is the key dependency here

  // Clear coupon when cart is empty
  useEffect(() => {
    if (isCouponApplied && cart.length === 0) {
      // Cart is empty - clear coupon
      setIsCouponApplied(false);
      setCoupon({} as ICouponData);
      setCouponText("");

      onUseLocalStorage("delete", COUPON_STORAGE_KEY);
      onUseLocalStorage("delete", COUPON_TEXT_STORAGE_KEY);
      onUseLocalStorage("delete", COUPON_APPLIED_STORAGE_KEY);
    }
  }, [cart.length, isCouponApplied]);

  // Clear coupon when restaurant changes
  useEffect(() => {
    if (typeof window !== "undefined" && isCouponApplied && restaurantId) {
      const savedRestaurantId = onUseLocalStorage("get", COUPON_RESTAURANT_KEY);

      if (savedRestaurantId && savedRestaurantId !== restaurantId) {
        // Restaurant changed - clear coupon
        setIsCouponApplied(false);
        setCoupon({} as ICouponData);
        setCouponText("");

        onUseLocalStorage("delete", COUPON_STORAGE_KEY);
        onUseLocalStorage("delete", COUPON_TEXT_STORAGE_KEY);
        onUseLocalStorage("delete", COUPON_APPLIED_STORAGE_KEY);
        onUseLocalStorage("delete", COUPON_RESTAURANT_KEY);

        showToast({
          type: "info",
          title: t("coupon_removed_title"),
          message: t("coupon_removed_different_restaurant"),
        });

        console.log("Coupon cleared: restaurant changed");
      }
    }
  }, [restaurantId, isCouponApplied]);
  // Use local restaurant data if GraphQL data is not available
  const finalRestaurantData = restaurantData || localRestaurantData;

  // Context
  const { isLoaded } = useContext(GoogleMapsContext);

  // Ref
  // const contentRef = useRef<HTMLDivElement>(null);

  /*
    ##############
     Constants
    #############
   */
  const origin = {
    lat:
      Number(finalRestaurantData?.restaurant?.location?.coordinates?.[1]) || 0,
    lng:
      Number(finalRestaurantData?.restaurant?.location?.coordinates?.[0]) || 0,
  };

  const destination = {
    lat: Number(userAddress?.location?.coordinates?.[1]) || 0,
    lng: Number(userAddress?.location?.coordinates?.[0]) || 0,
  };
  const store_user_location_cache_key = `${origin?.lat},${origin?.lng}_${destination?.lat},${destination?.lng}`;

  const [orderInstructions, setOrderInstructions] = useState<string | null>(
    null
  );
  const { theme } = useTheme();

  // Initialize on client
  useEffect(() => {
    const stored = localStorage.getItem("newOrderInstructions");
    setOrderInstructions(stored);
  }, []);

  // Update on cross-tab localStorage changes
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "newOrderInstructions") {
        setOrderInstructions(event.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Optional: For same-tab updates via a custom event
  useEffect(() => {
    const handleCustomUpdate = () => {
      const updated = localStorage.getItem("newOrderInstructions");
      setOrderInstructions(updated);
    };
    window.addEventListener("orderInstructionsUpdated", handleCustomUpdate);
    return () =>
      window.removeEventListener(
        "orderInstructionsUpdated",
        handleCustomUpdate
      );
  }, []);

  // API
  const { data: tipData } = useQuery(GET_TIPS);
  const [placeOrder, { loading: loadingOrderMutation }] = useMutation(
    PLACE_ORDER,
    {
      onCompleted,
      onError,
      update,
    }
  );
  const [verifyCoupon, { loading: couponLoading }] = useMutation(
    VERIFY_COUPON,
    {
      onCompleted: couponCompleted,
    }
  );

  console.log("Tipps from admin:", tipData);
  // Handlers
  const onInit = () => {
    if (!finalRestaurantData) return;

    // Set Tax
    setTaxValue(finalRestaurantData?.restaurant?.tax);
    // Delivery Charges
    onInitDeliveryCharges();
  };

  // Update tax value when restaurant data is loaded
  useEffect(() => {
    if (finalRestaurantData?.restaurant?.tax !== undefined) {
      setTaxValue(finalRestaurantData.restaurant.tax);
    }
  }, [finalRestaurantData]);

  // Initialize tax value on component mount
  useEffect(() => {
    if (!taxValue && finalRestaurantData?.restaurant?.tax !== undefined) {
      setTaxValue(finalRestaurantData.restaurant.tax);
    }
  }, [finalRestaurantData, taxValue]);

  useEffect(() => {
    const savedCoupon = localStorage.getItem("appliedCoupon");

    if (savedCoupon) {
      const parsed = JSON.parse(savedCoupon);
      setCoupon(parsed);
      setIsCouponApplied(true);  // ← VERY IMPORTANT
    }
  }, []);


  const onInitDirectionCacheSet = () => {
    try {
      const stored_direction = onUseLocalStorage(
        "get",
        store_user_location_cache_key
      );
      if (stored_direction) {
        setDirections(JSON.parse(stored_direction));
      } else {
        setDirections(null);
      }
      setIsCheckingCache(false); // done checking
    } catch (err) {
      setDirections(null);
      setIsCheckingCache(false);
    }
  };
  const onInitDeliveryCharges = () => {
    const latOrigin =
      Number(finalRestaurantData?.restaurant?.location?.coordinates?.[1]) || 0;
    const lonOrigin =
      Number(finalRestaurantData?.restaurant?.location?.coordinates?.[0]) || 0;
    const latDest = userAddress?.location?.coordinates?.[1] || 0;
    const longDest = userAddress?.location?.coordinates?.[0] || 0;

    console.log("Restaurant:", latOrigin, lonOrigin);
    console.log("User:", latDest, longDest);

    const distance = calculateDistance(latOrigin, lonOrigin, latDest, longDest);
    console.log("Distance (km):", distance);

    let amount = calculateAmount(
      COST_TYPE as OrderTypes.TCostType,
      DELIVERY_RATE,
      distance
    );
    setDistance(distance.toFixed(2));
    setDeliveryCharges(amount > 0 ? amount : DELIVERY_RATE);
  };

  // const togglePriceSummary = () => {
  //   setIsOpen((prev) => !prev);
  // };

  function transformOrder(cartData: CartItem[]) {
    return cartData.map((food) => {
      return {
        food: food._id,
        quantity: food.quantity,
        variation: food.variation._id,
        addons: food.addons
          ? food.addons.map(({ _id, options }) => ({
            _id,
            options: options.map(({ _id }) => _id),
          }))
          : [],
        specialInstructions: food.specialInstructions,
      };
    });
  }

  const onCheckIsOpen = () => {
    if (!finalRestaurantData?.restaurant) return false;

    const date = new Date();
    const day = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const todaysTimings = finalRestaurantData.restaurant.openingTimes?.find(
      (o: any) => o.day === DAYS[day]
    );

    if (!todaysTimings) return false;

    const times = todaysTimings.times.filter(
      (t: any) =>
        hours >= Number(t.startTime[0]) &&
        minutes >= Number(t.startTime[1]) &&
        hours <= Number(t.endTime[0]) &&
        minutes <= Number(t.endTime[1])
    );

    return times.length > 0;
  };

  // API Handlers
  const onApplyCoupon = () => {
    verifyCoupon({ variables: { coupon: couponText, restaurantId: restaurantId } });
  };




  // function validateOrder() {
  //   if (!restaurantData.restaurant.isAvailable || !onCheckIsOpen()) {
  //     // toggleCloseModal();
  //     showToast({
  //       title: "Restaurant",
  //       message: "Restaurant is not available right now.",
  //       type: "error",
  //     });

  //     return;
  //   }
  //   if (!cart.length) {
  //     showToast({ title: "Cart", message: "Cart is empty", type: "error" });

  //     return false;
  //   }
  //   const delivery = isPickUp ? 0 : deliveryCharges;
  //   if (
  //     Number(calculatePrice(delivery, true)) <
  //     restaurantData?.restaurant?.minimumOrder
  //   ) {
  //     showToast({
  //       title: "Minimum Amount",
  //       message: `The minimum amount of (${CURRENCY_SYMBOL} ${restaurantData?.restaurant?.minimumOrder}) for your order has not been reached.`,
  //       type: "warn",
  //     });

  //     return false;
  //   }
  //   if (!userAddress) {
  //     showToast({
  //       title: "Missing Address",
  //       message: "Select your address.",
  //       type: "warn",
  //     });

  //     return false;
  //   }
  //   if (!paymentMethod) {
  //     showToast({
  //       title: "Missing Payment Method",
  //       message: "Set payment method before checkout",
  //       type: "warn",
  //     });

  //     return false;
  //   }
  //   if ((profile?.phone?.length || 0) < 1) {
  //     showToast({
  //       title: "Missing Phone number",
  //       message: "Phone number is missing.",
  //       type: "warn",
  //     });

  //     setTimeout(() => {
  //       router.replace("/phone-number");
  //     }, 1000);

  //     return false;
  //   }
  //   if (!profile?.phoneIsVerified) {
  //     showToast({
  //       title: "Unverified Phone number",
  //       message: "Phone Number is not verified",

  //       type: "warn",
  //     });

  //     setTimeout(() => {
  //       router.replace("/phone-number");
  //     }, 1000);

  //     return false;
  //   }
  //   return true;
  // }

  // Order

  // This is the fixed validateOrder function inside your OrderCheckoutScreen.js file

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

  function validateOrder() {
    if (!finalRestaurantData?.restaurant) {
      showToast({
        title: t("restaurant_label"),
        message: t("restaurant_data_not_loaded"),
        type: "error",
      });
      return false;
    }

    if (
      !finalRestaurantData.restaurant.isAvailable ||
      !finalRestaurantData.restaurant.isActive ||
      !isWithinOpeningTime(finalRestaurantData.restaurant.openingTimes) ||
      !onCheckIsOpen()
    ) {
      // toggleCloseModal();
      showToast({
        title: t("restaurant_label"),
        message: t("restaurant_unavailable"),
        type: "error",
      });
      return false;
    }

    if (!cart.length) {
      showToast({ title: "Cart", message: "Cart is empty", type: "error" });
      return false;
    }

    const delivery = isPickUp ? 0 : deliveryCharges;
    if (
      Number(calculatePrice(delivery, true)) <
      (finalRestaurantData.restaurant.minimumOrder || 0)
    ) {
      showToast({
        title: t("minimum_amount"),
        message: ` ${t("The_minimum_amount_of_(")} ${CURRENCY_SYMBOL} ${finalRestaurantData.restaurant.minimumOrder || 0} ${t(")_for_your_order_has_not_been_reached")}`,
        type: "warn",
      });
      return false;
    }

    if (!userAddress) {
      showToast({
        title: t("missing_address"),
        message: t("Select_your_address"),
        type: "warn",
      });
      return false;
    }

    if (!paymentMethod) {
      showToast({
        title: "Missing Payment Method",
        message: "Set payment method before checkout",
        type: "warn",
      });
      return false;
    }

    // Check if the profile data is being loaded
    if (loadingProfile) {
      showToast({
        title: "Loading Profile",
        message: "Please wait while we load your profile information.",
        type: "info",
      });
      return false;
    }

    // Check if profile exists
    if (!profile) {
      showToast({
        title: "Missing Profile",
        message:
          "Your profile information couldn't be loaded. Please try again or login again.",
        type: "error",
      });

      // Force fetch the profile
      fetchProfile();

      setTimeout(() => {
        router.replace("/profile");
      }, 1000);

      return false;
    }

    // Now safely check for phone number and verification status
    if (!profile.phone || profile.phone.length < 1) {
      showToast({
        title: t("Missing_Phone_number"),
        message: t("Phone_number_is_missing"),
        type: "warn",
      });

      setTimeout(() => {
        // router.replace("/phone-number");
      }, 1000);

      return false;
    }

    if (!profile.phoneIsVerified) {
      showToast({
        title: t("Unverified_Phone_number"),
        message: t("Phone_Number_is_not_verified"),
        type: "warn",
      });

      setTimeout(() => {
        // router.replace("/phone-number");
      }, 1000);

      return false;
    }

    return true;
  }

  async function onPlaceOrder() {
    // Check if user is autenticated
    if (!authToken) {
      setIsAuthModalVisible(true);
      return;
    }

    if (!validateOrder()) {
      return;
    }

    // if false then select the address
    if (!isAddressSelectedOnce && deliveryType === "Delivery") {
      setIsUserAddressModalOpen(true);
      return;
    }

    if (checkPaymentMethod(CURRENCY, paymentMethod)) {
      const items = transformOrder(cart);

      placeOrder({
        variables: {
          restaurant: restaurantId,
          orderInput: items,
          instructions: localStorage.getItem("newOrderInstructions") || "",
          paymentMethod: paymentMethod,
          couponCode: isCouponApplied ? coupon ? coupon.title : null : null,
          tipping: +selectedTip,
          taxationAmount: +taxCalculation(),
          // address: {
          //   label: location?.label,
          //   deliveryAddress: location?.deliveryAddress,
          //   details: location?.details,
          //   longitude: "" + location?.longitude,
          //   latitude: "" + location?.latitude,
          // },
          address: {
            label: userAddress?.label,
            deliveryAddress: userAddress?.deliveryAddress,
            details: userAddress?.details,
            longitude: "" + userAddress?.location?.coordinates[0],
            latitude: "" + userAddress?.location?.coordinates[1],
          },
          orderDate: new Date(),
          isPickedUp: isPickUp,
          deliveryCharges: isPickUp ? 0 : deliveryCharges,
        },
      });
    } else {
      showToast({
        title: "Unsupported Payment Method",
        message: "Payment method not supported",
        type: "warn",
      });
    }
  }

  async function onCompleted(data: { placeOrder: IOrder }) {
    localStorage.removeItem("orderInstructions");
    clearCart();
    // CLEAR COUPON FROM LOCALSTORAGE
    onUseLocalStorage("delete", COUPON_STORAGE_KEY);
    onUseLocalStorage("delete", COUPON_TEXT_STORAGE_KEY);
    onUseLocalStorage("delete", COUPON_APPLIED_STORAGE_KEY);
    onUseLocalStorage("delete", COUPON_RESTAURANT_KEY);
    if (paymentMethod === "COD") {
      router.replace(`/order/${data.placeOrder._id}/tracking`);
    } else if (paymentMethod === "PAYPAL") {
      router.replace(`/paypal?id=${data.placeOrder._id}`);
    } else if (paymentMethod === "STRIPE") {
      router.replace(
        `${SERVER_URL}stripe/create-checkout-session?id=${data?.placeOrder?.orderId}&platform=web`
      );
    }
  }

  function update(
    cache: ApolloCache<any>,
    { data }: { data?: { placeOrder: IOrder } }
  ) {
    const placeOrder = data?.placeOrder;

    if (placeOrder && placeOrder.paymentMethod === "COD") {
      const data = cache.readQuery({ query: ORDERS }) as { orders: IOrder[] };
      if (data) {
        cache.writeQuery({
          query: ORDERS,
          data: { orders: [placeOrder, ...data.orders] },
        });
      }
    }
  }

  function onError(error: ApolloError) {
    showToast({
      title: "Error",
      message:
        error.graphQLErrors[0]?.message ||
        error?.networkError?.message ||
        "Something went wrong",
      type: "error",
    });
  }

  // Pricing Handlers
  function calculatePrice(delivery = 0, withDiscount: boolean = false) {
    let itemTotal: number = 0;
    cart.forEach((cartItem) => {
      itemTotal = itemTotal + Number(cartItem?.price || 0) * cartItem.quantity;
    });
    if (withDiscount && coupon && coupon.discount && isCouponApplied) {
      itemTotal = itemTotal - (coupon.discount / 100) * itemTotal;
    }
    const deliveryAmount = delivery > 0 ? deliveryCharges : 0;
    return (itemTotal + deliveryAmount).toFixed(2);
  }

  function taxCalculation() {
    const tax = taxValue ?? 0;
    if (tax === 0) {
      return tax.toFixed(2);
    }
    const delivery = isPickUp ? 0 : deliveryCharges;
    const amount = +calculatePrice(delivery, true);
    const taxAmount = ((amount / 100) * tax).toFixed(2);
    return taxAmount;
  }

  /* function calculateTip() {
    if (selectedTip) {
      const _tip = parseFloat(selectedTip);
      let total = 0;
      const delivery = isPickUp ? 0 : deliveryCharges;
      total += +calculatePrice(delivery, true);
      total += +taxCalculation();
      const tipPercentage = ((total / 100) * _tip).toFixed(2);
      return tipPercentage;
    } else {
      return "0";
    }
  } */

  function calculateTotal() {
    let total: number = 0;
    const delivery = isPickUp ? 0 : deliveryCharges;
    total += +calculatePrice(delivery, true);
    total += +taxCalculation();
    total += selectedTip ? Number(selectedTip) : 0;
    return total.toFixed(2);
  }

  /*
   Use Callbacks
  */
  const directionsCallback = useCallback(
    (result: google.maps.DirectionsResult | null, status: string) => {
      if (status === "OK" && result) {
        setDirections(result);
        onUseLocalStorage(
          "save",
          store_user_location_cache_key,
          JSON.stringify(result)
        );
      } else {
        console.error("Directions request failed due to", status);
      }
    },
    []
  );

  // Filter PAYMENT_METHOD_LIST based on stripeDetailsSubmitted
  const filteredPaymentMethods = !finalRestaurantData?.restaurant
    ?.stripeDetailsSubmitted
    ? PAYMENT_METHOD_LIST.filter((method) => method.value === "COD")
    : PAYMENT_METHOD_LIST;

  // Use Effect
  useEffect(() => {
    if (finalRestaurantData?.restaurant) {
      onInit();
    }
  }, [finalRestaurantData]);

  useEffect(() => {
    onInitDirectionCacheSet();
  }, [store_user_location_cache_key]);

  return (
    <>
      {/* <!-- Header with map and navigation --> */}
      <div className="relative">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "35vh",
            }}
            options={{
              styles: theme === "dark" ? darkMapStyle : null,
              disableDefaultUI: true,
            }}
            center={{
              lat: 24.8607, // Example: Karachi
              lng: 67.0011,
            }}
            zoom={13}
          >
            {/* Custom Origin Marker */}
            <Marker
              position={origin}
              icon={{
                url: RestIcon.src, // Replace with your icon path or external URL
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />

            {/* Custom Destination Marker */}
            <Marker
              position={destination}
              icon={{
                url: HomeIcon.src, // Replace with your icon path or external URL
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />

            {!directions && !isCheckingCache && (
              <DirectionsService
                options={{
                  destination,
                  origin,
                  travelMode: google.maps.TravelMode.DRIVING,
                }}
                callback={directionsCallback}
              />
            )}
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  directions,
                  suppressMarkers: true, // Hide default markers
                  polylineOptions: {
                    strokeColor: "#5AC12F", // blue line
                    strokeOpacity: 0.8,
                    strokeWeight: 3, // thickness
                    zIndex: 10,
                  },
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <>
            <Image
              src="https://storage.googleapis.com/a1aa/image/jt1AynRJJVtM9j1LRb30CodA1xsK2R23pWTOmRv3nsM.jpg"
              alt="Map showing delivery route"
              width={1200}
              height={300}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-color text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
              H
            </div>{" "}
          </>
        )}
      </div>
      {/* <!-- Toggle Prices Button for Mobile --> 
          <div className="sm:hidden fixed top-14 left-0 right-0 bg-transparent z-10 p-4">
            <button
              className="bg-white text-primary-color w-full py-2 px-4 rounded-full border border-gray-300 flex justify-between items-center"
              onClick={togglePriceSummary}
            >
              <span className="font-inter text-[14px]">
                Total: {`${CURRENCY_SYMBOL} ${calculateTotal()}`}
              </span>

              <FontAwesomeIcon icon={faChevronDown} className="text-[14px]" />
            </button>
          </div>
          */}

      {/* <!-- Main Content --> */}
      <PaddingContainer className="pb-10">
        <div className="max-w-6xl md:pt-10 p-4 md:p-0 lg:flex lg:space-x-4">
          <div className="lg:w-3/4 md:mr-40 md:rtl:ml-40">
            {/* <!-- Delivery and Pickup Toggle --> */}
            <div className="flex justify-between bg-gray-100 dark:bg-gray-800 rounded-full p-2 mb-6">
              <button
                className={`w-1/2 ${deliveryType === "Delivery"
                  ? "bg-primary-color"
                  : "bg-gray-100 dark:bg-gray-700"
                  } text-white py-2 rounded-full flex items-center justify-center`}
                onClick={() => {
                  setDeliveryType("Delivery");
                  setIsPickUp(false);
                }}
              >
                <FontAwesomeIcon
                  icon={faBicycle}
                  className="mr-2 rtl:ml-2 text-gray-900 dark:text-gray-100"
                />
                <span className="font-medium text-gray-900 dark:text-gray-100 font-inter text-xs md:text-sm xl:[14px]">
                  {t("delivery_label")}
                </span>
              </button>

              <button
                className={`w-1/2 ${deliveryType === "Pickup"
                  ? "bg-primary-color"
                  : "bg-gray-100 dark:bg-gray-700"
                  } px-6 py-2 rounded-full mx-2 flex items-center justify-center`}
                onClick={() => {
                  setDeliveryType("Pickup");
                  setIsPickUp(true);
                }}
              >
                <FontAwesomeIcon
                  icon={faStore}
                  className="mr-2 rtl:ml-2 text-gray-900 dark:text-gray-100"
                />
                <span className="font-medium text-gray-900 dark:text-gray-100 font-inter text-xs md:text-sm xl:[14px]">
                  {t("pickup_label")}
                </span>
              </button>
            </div>

            {/* <!-- Section Title --> */}
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-base sm:text-lg md:text-[16px] lg:text-[18px]">
              {t("for_greater_hunger_title")}
            </h2>

            {/* <!-- Delivery Details --> */}
            <div className="bg-white dark:bg-gray-800 px-4 pt-4 pb-2 rounded-lg mb-4 border border-gray-300 dark:border-gray-700 w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {deliveryType === "Pickup" ? (
                    <FontAwesomeIcon
                      icon={faStore}
                      className="mr-2 rtl:ml-2 text-gray-900 dark:text-gray-100"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faBicycle}
                      className="mr-2 rtl:ml-2 text-gray-900 dark:text-gray-100"
                    />
                  )}

                  <p className="text-gray-900 dark:text-gray-100 leading-4 sm:leading-5 tracking-normal font-inter text-xs sm:text-sm md:text-sm align-middle">
                    <span className="font-semibold">
                      {" "}
                      {deliveryType === "Pickup"
                        ? t("pickup_label")
                        : t("delivery_label")}{" "}
                    </span>
                    <span className="font-normal">
                      {t("in_10_20_min_label")}{" "}
                    </span>
                    <span className="font-semibold">
                      {userAddress?.deliveryAddress}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* <!-- Leave at Door --> */}
            <div
              className={
                deliveryType === "Pickup"
                  ? "hidden"
                  : "bg-white dark:bg-gray-800 px-4 pt-4 pb-2 rounded-lg mb-4 border border-gray-300 dark:border-gray-700 w-full"
              }
            >
              <div className="flex items-center">
                <input
                  className="mr-2 rtl:ml-2"
                  id="leave-at-door"
                  type="checkbox"
                  checked={shouldLeaveAtDoor}
                  onChange={() => setShouldLeaveAtDoor((prev) => !prev)}
                />
                <label
                  className="text-gray-900 dark:text-gray-100 leading-4 sm:leading-5 tracking-normal font-inter text-xs sm:text-sm md:text-sm align-middle"
                  htmlFor="leave-at-door"
                >
                  {t("leave_order_at_my_door_label")}
                </label>
              </div>
              <p className="text-gray-300 dark:text-gray-400 leading-4 sm:leading-5 tracking-normal font-inter text-xs sm:text-sm md:text-sm align-middle mt-2">
                {t("leave_at_door_info")}
              </p>
            </div>

            {/* <!-- Selected Items --> */}
            <div className="bg-white dark:bg-gray-800 pt-4 px-3  pb-2 rounded-lg mb-4 w-full ">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-base sm:text-lg md:text-[16px] lg:text-[18px]">
                {t("selected_items_label")}
              </h2>
              {/* Map this below section */}
              {cart.map((item) => {
                return (
                  <div
                    key={item._id}
                    className="flex items-center justify-between mb-2"
                  >
                    <div className="flex items-start">
                      <Image
                        src={
                          item.image ||
                          "https://storage.googleapis.com/a1aa/image/cPA2BWDjl26C-OR-Sz-gd7gFcDc7QbvTZ_904FkN0Y.jpg"
                        }
                        alt="Big Share meal"
                        width={50}
                        height={50}
                        className="w-12 h-12 rounded-full mr-2 rtl:ml-2 object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base md:text-[12px] lg:text-[14px] xl:text-[16px]">
                          {item.foodTitle}
                        </h3>
                        <div className="flex flex-col items-start">
                          {item?.optionTitles?.map(
                            (optionTitle, optionIndex) => {
                              return (
                                <p
                                  key={`${optionTitle}-${optionIndex}`}
                                  className="text-gray-600  dark:text-gray-400 tracking-normal font-inter text-xs sm:text-[12px] md:text-[12px]"
                                >
                                  + {optionTitle}
                                </p>
                              );
                            }
                          )}
                        </div>
                        <p className="text-secondary-color font-semibold text-sm sm:text-base md:text-[11px] lg:text-[12px] xl:text-[14px]">
                          {CURRENCY_SYMBOL}
                          {item.price}
                        </p>
                      </div>
                    </div>

                    <div className="border border-secondary-color text-secondary-color py-1 px-3 rounded-lg text-xs sm:text-sm font-medium w-fit">
                      {item.quantity}
                    </div>
                  </div>
                );
              })}
              <button
                className="text-gray-900 dark:text-gray-100 mt-2 font-semibold mb-2 text-sm sm:text-base md:text-[12px] lg:text-[12px] xl:text-[14px]"
                onClick={() => {
                  const currentShopType = onUseLocalStorage(
                    "get",
                    "currentShopType"
                  );
                  const restaurantId = onUseLocalStorage("get", "restaurant");
                  const restaurantSlug = onUseLocalStorage(
                    "get",
                    "restaurant-slug"
                  );
                  router.replace(
                    `/${currentShopType}/${restaurantSlug}/${restaurantId}`
                  );
                }}
              >
                {t("add_more_items_button")}
              </button>
            </div>

            {orderInstructions && orderInstructions.length > 0 ? (
              <>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-base sm:text-lg md:text-[16px] lg:text-[18px]">
                  {t("order_instruction_label")}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4 leading-5 sm:leading-5 tracking-normal font-inter text-xs sm:text-sm md:text-sm align-middle mt-2">
                  {orderInstructions}
                </p>
              </>
            ) : (
              ""
            )}

            {/* <!-- Payment Details --> */}
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-base sm:text-lg md:text-[16px] lg:text-[18px]">
              {t("payment_details_label")}
            </h2>
            {filteredPaymentMethods.map((paymentMethodItem, methodIndex) => {
              return (
                <div
                  key={`${paymentMethodItem.value}-${methodIndex}`}
                  className="bg-white dark:bg-gray-800 px-4 pt-4 pb-2 rounded-lg mb-4 border border-gray-300 dark:border-gray-700 w-full"
                >
                  <div className="flex items-center justify-between mb-2">
                    <label
                      className="text-gray-600 dark:text-gray-300 flex items-center text-sm sm:text-base md:text-[12px] lg:text-[12px] xl:text-[14px]"
                      htmlFor="card"
                    >
                      <FontAwesomeIcon
                        icon={paymentMethodItem.icon}
                        className="text-gray-900 mr-2 dark:text-gray-100 rtl:ml-2"
                      />
                      {t(paymentMethodItem.label)}
                    </label>
                    <input
                      className="mr-2"
                      id="card"
                      name="payment"
                      type="radio"
                      checked={paymentMethod === paymentMethodItem.value}
                      value={paymentMethod}
                      onChange={() => setPaymentMethod(paymentMethodItem.value)}
                    />
                  </div>
                </div>
              );
            })}

            {/* <!-- Tip the Courier --> */}
            {!isPickUp && (
              <div className="bg-white dark:bg-gray-900 mb-6 w-full">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-base sm:text-lg md:text-[16px] lg:text-[18px]">
                  {t("tip_the_courier_label")}
                </h2>
                <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-5">
                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-5 sm:leading-5 tracking-normal font-inter text-xs sm:text-sm md:text-sm align-middle mt-2">
                    {t("tip_courier_info")}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {tipData?.tips.tipVariations.map(
                      (tip: string, index: number) => (
                        <button
                          key={index}
                          className={`text-[12px] ${selectedTip === tip
                            ? "text-white bg-secondary-color"
                            : "text-secondary-color bg-white dark:bg-gray-800 dark:text-secondary-color"
                            } border border-secondary-color px-4 py-2 rounded-full w-full`}
                          onClick={() => {
                            if (selectedTip === tip) {
                              setSelectedTip("");
                            } else {
                              setSelectedTip(tip);
                            }
                          }}
                        >
                          {tip !== "Other" ? CURRENCY_SYMBOL : ""}
                          {tip}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* <!-- Promo Code --> */}
            <div className="bg-white dark:bg-gray-900  pb-2 rounded-lg mb-4 w-full">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-base sm:text-lg md:text-[16px] lg:text-[18px]">
                {t("promo_code_label")}
              </h2>
              {isCouponApplied ? (
                <div className="flex items-center">
                  <Message
                    className="dark:bg-gray-800"
                    severity="success"
                    text={t("coupon_applied_successfully_message")}
                  />

                  <button
                    className="border border-red-500 text-red-500 hover:bg-red-50 dark:border-red-500 dark:hover:border-red-700 dark:hover:bg-inherit rtl:mr-3 ml-3 sm:mt-0 mt-2 sm:w-fit w-full h-10 px-8 space-x-2 font-medium   tracking-normal font-inter text-sm sm:text-base md:text-[12px] lg:text-[14px] rounded-full"
                    onClick={() => {
                      setIsCouponApplied(false);
                      setCoupon({} as ICouponData);
                      setCouponText("");

                      // CLEAR FROM LOCALSTORAGE
                      onUseLocalStorage("delete", COUPON_STORAGE_KEY);
                      onUseLocalStorage("delete", COUPON_TEXT_STORAGE_KEY);
                      onUseLocalStorage("delete", COUPON_APPLIED_STORAGE_KEY);
                      onUseLocalStorage("delete", COUPON_RESTAURANT_KEY);
                    }}
                  >
                    {couponLoading ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      <span>{t("Remove")}</span>
                    )}
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-5 sm:leading-5 tracking-normal font-inter text-xs sm:text-sm md:text-sm align-middle mt-2">
                    {t("promo_code_info")}
                  </p>
                  <div className="flex items-center flex-wrap space-x-2">
                    <input
                      className="flex-grow p-2 border border-gray-300 dark:border-gray-700 dark:text-gray-100 dark:bg-gray-800 rounded text-[12px] md:text-[14px]"
                      placeholder={t("enter_promo_code_placeholder")}
                      type="text"
                      value={couponText}
                      onChange={(e) => setCouponText(e.target.value)}
                      disabled={couponLoading}
                    />
                    <button
                      className="bg-primary-color rtl:mr-2 sm:mt-0 mt-2 sm:w-fit w-full h-10 px-8 space-x-2 font-medium text-gray-900 dark:text-gray-900  tracking-normal font-inter text-sm sm:text-base md:text-[12px] lg:text-[14px] rounded-full"
                      onClick={onApplyCoupon}
                    >
                      {couponLoading ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      ) : (
                        <span>{t("submit_button")}</span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* <!-- Order Summary - Large Screen --> */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="hidden sticky top-20 h-max lg:block lg:w-1/3 lg:m-0 pb-10"
          >
            <div
              className="bg-white dark:bg-gray-800 p-2  top-4 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 expandable max-h-0 sm:max-h-full lg:block hidden"
              id="price-summary"
            >
              <h2 className="text-sm lg:text-lg font-semibold text-left flex justify-between dark:text-white">
                {t("prices_in_label")} {CURRENCY}
                <InfoSvg />
              </h2>
              <p className="text-gray-400 dark:text-gray-400 mb-3 text-left leading-5 tracking-normal font-inter text-xs lg:text-[16px]">
                {t("inc_taxes_label")}
              </p>

              <div className="flex justify-between mb-1 text-xs lg:text-[14px]">
                <span className="font-inter text-gray-900 dark:text-white leading-5">
                  {t("item_subtotal_label")}
                </span>
                <span className="font-inter text-gray-900 dark:text-white leading-5">
                  {CURRENCY_SYMBOL}
                  {calculatePrice(0)}
                </span>
              </div>

              {deliveryType === "Delivery" && (
                <div className="flex justify-between mb-1 text-xs lg:text-[14px]">
                  <span className="font-inter text-gray-900 dark:text-white leading-5">
                    {t("delivery_with_distance_label")} ({distance} km)
                  </span>
                  <span className="font-inter text-gray-900  dark:text-white leading-5">
                    {CURRENCY_SYMBOL}
                    {deliveryCharges.toFixed()}
                  </span>
                </div>
              )}

              {selectedTip && (
                <div className="flex justify-between mb-1 text-xs lg:text-[14px]">
                  <span className="font-inter text-gray-900 dark:text-white leading-5">
                    {t("tip_label")}
                  </span>
                  <span className="font-inter text-gray-900 dark:text-white leading-5">
                    {`${CURRENCY_SYMBOL} ${selectedTip}`}
                    {/*    {`${CURRENCY_SYMBOL} ${parseFloat(calculateTip()).toFixed(
                      2
                    )}`} */}
                  </span>
                </div>
              )}

              <div className="flex justify-between mb-1 text-xs lg:text-[14px]">
                <span className="font-inter text-gray-900 dark:text-white leading-5">
                  {" "}
                  {t("tax_label")}{" "}
                </span>
                <span className="font-inter text-gray-900 dark:text-white leading-5">
                  {CURRENCY_SYMBOL}
                  {taxCalculation()}
                </span>
              </div>

              {/* <div className="flex justify-between mb-1 text-xs lg:text-[12px]">
                  <span className="font-inter text-gray-900 leading-5">
                    Service fee
                  </span>
                  <span className="font-inter text-gray-900 leading-5">
                    $0.40
                  </span>
                </div> */}

              <Divider />

              {isCouponApplied && (
                <div className="flex justify-between mb-1 text-xs lg:text-[14px]">
                  <span className="font-inter text-gray-900 dark:text-white leading-5">
                    {t("discount_label")}
                  </span>
                  <span className="font-inter text-gray-900 dark:text-white leading-5">
                    {`-${CURRENCY_SYMBOL} ${(
                      Number(calculatePrice(0, false)) -
                      Number(calculatePrice(0, true))
                    ).toFixed(2)}`}
                  </span>
                </div>
              )}

              {/* <div className="text-secondary-color mb-1 text-left font-inter text-xs lg:text-[12px]">
                    Choose an offer (1 available)
                  </div>

                  <Divider /> */}

              <div className="flex justify-between font-semibold mb-4 text-xs lg:text-[16px] dark:text-white ">
                <span>{t("total_sum_label")}</span>
                <span>{`${CURRENCY_SYMBOL} ${calculateTotal()}`}</span>
              </div>

              <button
                className="bg-primary-color text-gray-900 dark:text-gray-900 w-full py-2 rounded-full font-semibold text-xs lg:text-[16px]"
                onClick={onPlaceOrder}
              >
                {loadingOrderMutation ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <span> {t("click_to_order_button")}</span>
                )}
              </button>
            </div>
          </motion.div>

          {/* <!-- Order Summary - Medium & Small Screens --> */}
          <div className="block lg:hidden md:mr-40">
            <div
              className="bg-white dark:bg-gray-800 dark:text-white p-2 sticky top-4 rounded-lg shadow-md border border-gray-300 expandable h-fit lg:hidden block"
              id="price-summary"
            >
              <h2 className="text-sm lg:text-base font-semibold text-left flex justify-between dark:text-white ">
                {t("prices_in_label")} {CURRENCY}
                <InfoSvg />
              </h2>
              <p className="text-gray-400 dark:text-white mb-3 text-left leading-5 tracking-normal font-inter text-xs lg:text-[10px]">
                {t("inc_taxes_label")}
              </p>

              <div className="flex justify-between mb-1 text-xs lg:text-[12px]">
                <span className="font-inter text-gray-900 dark:text-white leading-5">
                  {t("item_subtotal_label")}
                </span>
                <span className="font-inter text-gray-900 dark:text-white leading-5">
                  {CURRENCY_SYMBOL}
                  {calculatePrice(0)}
                </span>
              </div>

              {deliveryType === "Delivery" && (
                <div className="flex justify-between mb-1 text-xs lg:text-[12px]">
                  <span className="font-inter text-gray-900 dark:text-white leading-5">
                    {t("delivery_with_distance_label", {
                      distance,
                      unit: t("km_unit"),
                    })}
                  </span>
                  <span className="font-inter text-gray-900 dark:text-white leading-5">
                    {CURRENCY_SYMBOL}
                    {deliveryCharges.toFixed()}
                  </span>
                </div>
              )}

              {selectedTip && (
                <div className="flex justify-between mb-1 text-xs lg:text-[12px]">
                  <span className="font-inter text-gray-900 dark:text-white leading-5">
                    {t("tip_label")}
                  </span>
                  <span className="font-inter text-gray-900 dark:text-white leading-5">
                    {`${CURRENCY_SYMBOL} ${selectedTip}`}
                    {/*    {`${CURRENCY_SYMBOL} ${parseFloat(calculateTip()).toFixed(
                      2
                    )}`} */}
                  </span>
                </div>
              )}

              <div className="flex justify-between mb-1 text-xs lg:text-[12px]">
                <span className="font-inter text-gray-900 dark:text-white leading-5">
                  {t("tax_label")}
                </span>
                <span className="font-inter text-gray-900 dark:text-white leading-5">
                  {CURRENCY_SYMBOL}
                  {taxCalculation()}
                </span>
              </div>

              {/* <div className="flex justify-between mb-1 text-xs lg:text-[12px]">
                  <span className="font-inter text-gray-900 leading-5">
                    Service fee
                  </span>
                  <span className="font-inter text-gray-900 leading-5">
                    $0.40
                  </span>
                </div> */}

              <Divider />

              {isCouponApplied && (
                <div className="flex justify-between mb-1 text-xs lg:text-[12px]">
                  <span className="font-inter text-gray-900 dark:text-white leading-5">
                    {t("discount_label")}
                  </span>
                  <span className="font-inter text-gray-900 dark:text-white leading-5">
                    {`-${CURRENCY_SYMBOL} ${(
                      Number(calculatePrice(0, false)) -
                      Number(calculatePrice(0, true))
                    ).toFixed(2)}`}
                  </span>
                </div>
              )}

              {/* <div className="text-secondary-color mb-1 text-left font-inter text-xs lg:text-[12px]">
                    Choose an offer (1 available)
                  </div> */}

              {/* <Divider /> */}

              <div className="flex justify-between font-semibold mb-4 text-xs lg:text-[14px ] dark:text-white">
                <span>{t("total_sum_label")}</span>
                <span>{`${CURRENCY_SYMBOL} ${calculateTotal()}`}</span>
              </div>

              <button
                className="bg-primary-color text-gray-900 dark:text-white w-full py-2 rounded-full text-xs lg:text-[12px]"
                onClick={onPlaceOrder}
              >
                {loadingOrderMutation ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <span> {t("click_to_order_button")} </span>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary - Small Screen */}
          {/* <div className="fixed top-4 right-0 mx-auto md:fixed lg:hidden xl:hidden m-4 p-4 w-full sm:w-64 ml-0 sm:ml-8 mt-16 sm:mt-0 lg:right-auto lg:m-0 lg:w-1/4 lg:sticky lg:top-6">
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      ref={contentRef}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white p-2 rounded-lg shadow-md border border-gray-300 overflow-hidden"
                    >
                      <h2 className="text-base font-semibold text-left flex justify-between">
                       
                        <InfoSvg />
                      </h2>
                      <p className="text-gray-300 mb-4 text-left  sm:leading-5 tracking-normal font-inter text-xs sm:text-sm md:text-sm align-middle ">
                        Inc. Taxes (if applicable)
                      </p>

                      <div className="flex justify-between mb-1 text-sm">
                        <span className="font-inter  text-gray-900 text-[14px] md:text-lg leading-6 md:leading-7">
                          
                        </span>
                        <span className="font-inter  text-gray-900 text-[14px] md:text-lg leading-6 md:leading-7">
                          {CURRENCY_SYMBOL}
                          {calculatePrice(0)}
                        </span>
                      </div>

                      <div className="flex justify-between mb-1 text-sm">
                        <span className="font-inter  text-gray-900 text-[14px] md:text-lg leading-6 md:leading-7">
                          Delivery ({dstance} km)
                        </span>
                        <span className="font-inter  text-gray-900 text-[14px] md:text-lg leading-6 md:leading-7">
                          {CURRENCY_SYMBOL}
                          {deliveryCharges.toFixed()}
                        </span>
                      </div>

                      {selectedTip && (
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="font-inter  text-gray-900 text-[14px] md:text-lg leading-6 md:leading-7">
                            Tip
                          </span>
                          <span className="font-inter  text-gray-900 text-[14px] md:text-lg leading-6 md:leading-7">
                            {`${CURRENCY_SYMBOL} ${selectedTip}`}
                              {`${CURRENCY_SYMBOL} ${parseFloat(
                          calculateTip()
                        ).toFixed(2)}`} 
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between mb-1 text-sm">
                        <span className="font-inter  text-gray-900 text-[14px] md:text-lg leading-6 md:leading-7">
                          Tax
                        </span>
                        <span className="font-inter  text-gray-900 text-[14px] md:text-lg leading-6 md:leading-7">
                          {CURRENCY_SYMBOL}
                          {taxCalculation()}
                        </span>
                      </div>

                        <div className="flex justify-between mb-1 text-sm">
                      <span className="font-inter  text-gray-900 text-[14px] md:text-lg leading-6 md:leading-7">
                        Service fee
                      </span>
                      <span className="font-inter  text-gray-900 text-[14px] md:text-lg leading-6 md:leading-7">
                        $0.40
                      </span>
                    </div> 

                      <Divider />

                      <div className="flex justify-between mb-1 text-sm">
                        <span className="font-inter  text-gray-900 text-[14px] md:text-lg leading-6 md:leading-7">
                          Discount
                        </span>
                        <span className="font-inter  text-gray-900 text-[14px] md:text-lg leading-6 md:leading-7">
                          {`-${CURRENCY_SYMBOL} ${(
                            Number(calculatePrice(0, false)) -
                            Number(calculatePrice(0, true))
                          ).toFixed(2)}`}
                        </span>
                      </div>

                      <div className="text-secondary-color mb-1 text-left font-inter text-[14px] md:text-lg leading-6 md:leading-7">
                        Choose an offer (1 available)
                      </div>
                      <Divider />

                      <div className="flex justify-between font-semibold mb-4 text-sm">
                        <span>Total sum</span>
                        <span>
                          {CURRENCY_SYMBOL}
                          {calculateTotal()}
                        </span>
                      </div>
                      <button
                        className="bg-primary-color text-gray-900 w-full py-2 rounded-full text-sm"
                        onClick={onPlaceOrder}
                      >
                        {loadingOrderMutation ?
                          <FontAwesomeIcon icon={faSpinner} spin />
                        : <span> Click to order</span>}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div> */}
        </div>
      </PaddingContainer>

      <UserAddressComponent
        confirmYourAddress={true}
        visible={isUserAddressModalOpen}
        onHide={() => {
          setIsUserAddressModalOpen(false);
          setIsAddressSelectedOnce(true);
        }}
      />
    </>
  );
}
