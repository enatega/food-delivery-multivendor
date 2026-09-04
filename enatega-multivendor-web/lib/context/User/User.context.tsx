/* eslint-disable max-lines */
"use client";

import { GET_USER_PROFILE, ORDERS } from "@/lib/api/graphql";
import { saveNotificationTokenWeb } from "@/lib/api/graphql/mutations";
import { orderStatusChanged } from "@/lib/api/graphql/subscription";
import {
  ApolloError,
  gql,
  LazyQueryExecFunction,
  OperationVariables,
  useApolloClient,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 } from "uuid";

import {
  IAddon,
  ICategory,
  IFood,
  IOption,
  IOrder,
  IOrderEta,
  IProfileResponse,
  IRestaurant,
  IVariation,
} from "@/lib/utils/interfaces";
import { invalidateClientSession } from "@/lib/utils/methods/auth";
import { getAccessToken } from "@/lib/utils/methods/auth";
import { modeStorage, useAppMode } from "@/lib/mode";
import {
  getSingleVendorCartDisplayPricing,
  isSingleVendorCartConfiguration,
  serializeSingleVendorCartAddons,
  type SingleVendorCartAddonSelection,
} from "@/lib/mode/singleVendorCart";
import {
  SINGLE_VENDOR_ACTIVE_ORDERS,
  SINGLE_VENDOR_CLEAR_CART,
  SINGLE_VENDOR_CART,
  SINGLE_VENDOR_ORDER_STATUS,
  SINGLE_VENDOR_PROFILE,
  SINGLE_VENDOR_UPDATE_CART,
  SINGLE_VENDOR_UPDATE_CART_COUNT,
} from "@/lib/api/graphql/single-vendor";

const SUBSCRIPTION_ORDERS = gql`
  ${orderStatusChanged}
`;
const SAVE_NOTIFICATION_TOKEN_WEB = gql`
  ${saveNotificationTokenWeb}
`;

// Types
export interface CartItem {
  image: string;
  key: string;
  _id: string;
  quantity: number;
  variation: {
    _id: string;
  };
  addons?: SingleVendorCartAddonSelection[];
  specialInstructions?: string;
  title?: string; // Added after querying food info
  foodTitle?: string;
  variationTitle?: string;
  optionTitles?: string[];
  price?: string | number;
  actualUnitPrice?: number;
  discountedUnitPrice?: number;
  dealInfo?: {
    dealId?: string;
    dealTitle?: string;
    discountValue?: number;
    discountType?: string;
  } | null;
  categoryId?: string;
}

export interface SingleVendorCartQuantityInput {
  foodId: string;
  categoryId: string;
  variationId: string;
  quantity: number;
  image?: string;
  foodTitle?: string;
  variationTitle?: string;
  unitPrice?: number;
  addons?: SingleVendorCartAddonSelection[];
}

export interface ProfileType {
  _id: string;
  name: string;
  phone: string;
  phoneIsVerified: boolean;
  email: string;
  emailIsVerified: boolean;
  notificationToken: string;
  isOrderNotification: boolean;
  isOfferNotification: boolean;
  addresses: Array<{
    _id: string;
    label: string;
    deliveryAddress: string;
    details: string;
    location: {
      coordinates: [number, number];
    };
    selected: boolean;
  }>;
  favourite: string[];
  stripe_plan_id?: string;
}

export interface OrderType {
  _id: string;
  orderId: string;
  restaurant: {
    _id: string;
    name: string;
    image: string;
    slug: string;
    address: string;
    location: {
      coordinates: [number, number];
    };
  };
  deliveryAddress: {
    location: {
      coordinates: [number, number];
    };
    deliveryAddress: string;
  };
  items: CartItem[];
  user: {
    _id: string;
    name: string;
    phone: string;
  };
  rider?: {
    _id: string;
    name: string;
  };
  review?: {
    _id: string;
  };
  paymentMethod: string;
  paidAmount: number;
  orderAmount: number;
  orderStatus: string;
  deliveryCharges: number;
  tipping: number;
  taxationAmount: number;
  orderDate: string;
  expectedTime: string;
  isPickedUp: boolean;
  createdAt: string;
  completionTime: string;
  cancelledAt?: string;
  assignedAt?: string;
  deliveredAt?: string;
  acceptedAt?: string;
  pickedAt?: string;
  preparationTime: number;
  eta?: IOrderEta | null;
}

export interface UserContextType {
  isLoggedIn: boolean;
  loadingProfile: boolean;
  errorProfile: ApolloError | undefined;
  profile: ProfileType | null;
  setTokenAsync: (token: string, cb?: () => void) => Promise<void>;
  logout: () => Promise<void>;
  loadingOrders: boolean;
  errorOrders: ApolloError | undefined;
  orders: OrderType[];
  fetchOrders: () => void;
  fetchMoreOrdersFunc: () => void;
  networkStatusOrders: number;
  cart: CartItem[];
  cartCount: number;
  clearCart: () => void;
  updateCart: (cart: CartItem[]) => Promise<void>;
  addQuantity: (key: string, quantity?: number) => Promise<void>;
  removeQuantity: (key: string) => Promise<void>;
  addItem: (
    image: string,
    foodId: string,
    variationId: string,
    restaurantId: string,
    quantity?: number,
    addons?: Array<{
      _id: string;
      options: Array<{
        _id: string;
      }>;
    }>,
    specialInstructions?: string,
  ) => Promise<void>;
  checkItemCart: (itemId: string) => {
    exist: boolean;
    quantity: number;
    key?: string;
  };
  deleteItem: (key: string) => Promise<void>;
  restaurant: string | null;
  setCartRestaurant: (id: string) => Promise<void>;
  isLoading: boolean;
  updateItemQuantity: (key: string, changeAmount: number) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  calculateSubtotal: () => string;
  transformCartWithFoodInfo: (
    cartItems: CartItem[],
    foodsData: IRestaurant,
  ) => CartItem[];
  fetchProfile: LazyQueryExecFunction<any, OperationVariables>;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setSingleVendorItemQuantity: (
    input: SingleVendorCartQuantityInput,
  ) => Promise<void>;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider: React.FC<{ children: ReactNode }> = (props) => {
  const { isSingleVendor } = useAppMode();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const client = useApolloClient();
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? getAccessToken() : null,
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [restaurant, setRestaurant] = useState<string | null>(null);

  const [saveNotificationToken] = useMutation(SAVE_NOTIFICATION_TOKEN_WEB, {
    onError,
  });
  const normalizeSingleCart = useCallback(
    (response: any): CartItem[] =>
      (response?.foods ?? []).flatMap((food: any) =>
        (food.variations ?? []).map((variation: any) => {
          const pricing = getSingleVendorCartDisplayPricing(variation);

          return {
            key: variation._id || `${food.foodId}-${variation.variationId}`,
            _id: food.foodId,
            image: food.foodImage || "",
            quantity: Number(variation.quantity) || 0,
            variation: { _id: variation.variationId },
            title: food.foodTitle,
            foodTitle: food.foodTitle,
            variationTitle: variation.variationTitle,
            price: pricing.discountedUnitPrice,
            actualUnitPrice: pricing.actualUnitPrice,
            discountedUnitPrice: pricing.discountedUnitPrice,
            dealInfo: variation.dealInfo,
            categoryId: food.categoryId,
            optionTitles: (variation.addons ?? [])
              .map((addon: any) => addon.title)
              .filter(Boolean),
            addons: (variation.addons ?? []).map((addon: any) => ({
              _id: addon.addonId,
              options: [{ _id: addon.optionId, title: addon.title }],
            })),
          };
        }),
      ),
    [],
  );
  const [fetchSingleCart] = useLazyQuery(SINGLE_VENDOR_CART, {
    fetchPolicy: "network-only",
    onCompleted: (data) => setCart(normalizeSingleCart(data?.getUserCart)),
  });
  const [updateSingleCart] = useMutation(SINGLE_VENDOR_UPDATE_CART, {
    onCompleted: (data) => setCart(normalizeSingleCart(data?.userCartData)),
  });
  const [updateSingleCartCount] = useMutation(SINGLE_VENDOR_UPDATE_CART_COUNT);
  const [clearSingleCart] = useMutation(SINGLE_VENDOR_CLEAR_CART);

  const [
    fetchProfile,
    {
      called: calledProfile,
      loading: loadingProfile,
      error: errorProfile,
      data: dataProfile,
    },
  ] = useLazyQuery(isSingleVendor ? SINGLE_VENDOR_PROFILE : GET_USER_PROFILE, {
    fetchPolicy: "cache-and-network",
    onCompleted: onProfileCompleted,
    onError,
  });

  const [
    fetchOrders,
    {
      called: calledOrders,
      loading: loadingOrders,
      error: errorOrders,
      data: dataOrders,
      networkStatus: networkStatusOrders,
      fetchMore: fetchMoreOrders,
      subscribeToMore: subscribeToMoreOrders,
    },
  ] = useLazyQuery(isSingleVendor ? SINGLE_VENDOR_ACTIVE_ORDERS : ORDERS, {
    variables: {
      page: 1,
      limit: 300,
    },
    fetchPolicy: "cache-and-network",
    onError,
  });

  // Universal cart transformation function that can be used anywhere
  const transformCartWithFoodInfo = useCallback(
    (cartItems: CartItem[], foodsData: IRestaurant): CartItem[] => {
      if (!foodsData || !cartItems.length) return cartItems;

      // Extract all foods from categories
      const foods = foodsData.categories
        ? foodsData.categories.flatMap((c: ICategory) => c.foods)
        : [];

      // Get addons and options data
      const { addons, options } = foodsData;

      if (!foods.length || !addons || !options) return cartItems;

      // Transform each cart item with display info
      return cartItems.map((cartItem) => {
        // Find the food item
        const foodItem = foods.find((food: IFood) => food._id === cartItem._id);
        if (!foodItem) return cartItem;

        // Find the variation
        const variationItem = foodItem.variations.find(
          (v: IVariation) => v._id === cartItem.variation._id,
        );
        if (!variationItem) return cartItem;

        // Create the full title
        const foodTitle = foodItem.title;
        const variationTitle = variationItem.title;
        const title = `${foodTitle}(${variationTitle})`;

        // Calculate price
        let totalPrice = variationItem.price;

        // Process addons and create optionTitles
        let optionTitles: string[] = [];

        if (cartItem.addons && cartItem.addons.length > 0) {
          cartItem.addons.forEach((addon) => {
            const addonItem = addons.find((a: IAddon) => a._id === addon._id);
            if (!addonItem) return;

            addon.options.forEach((opt) => {
              const optionItem = options.find(
                (o: IOption) => o._id === opt._id,
              );
              if (!optionItem) return;

              totalPrice += optionItem.price;
              if (optionItem.title) {
                optionTitles.push(optionItem.title);
              }
            });
          });
        }

        return {
          ...cartItem,
          foodTitle,
          variationTitle,
          title,
          optionTitles,
          price: totalPrice.toFixed(2),
        };
      });
    },
    [],
  );

  const onInit = useCallback(
    async (isSubscribed: boolean) => {
      if (!isSubscribed) return;

      setIsLoading(true);

      const _token = getAccessToken() || null;
      setToken(_token);

      if (_token) {
        await fetchProfile();
        await fetchOrders();
        if (isSingleVendor) await fetchSingleCart();
      }

      setIsLoading(false);
    },
    [fetchProfile, fetchOrders, fetchSingleCart, isSingleVendor],
  );

  // Define setCartRestaurant before it's used in dependencies
  const setCartRestaurant = useCallback(async (id: string) => {
    setRestaurant(id);
    if (typeof window !== "undefined") {
      modeStorage.set("restaurant", id);
    }
  }, []);

  // Initialize from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRestaurant = modeStorage.get("restaurant");
      const storedCart = modeStorage.get("cartItems");

      if (storedRestaurant) {
        setRestaurant(storedRestaurant);
      }

      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart));
        } catch (error) {
          console.error("Error parsing cart items from localStorage:", error);
          setCart([]);
        }
      }
    }

    setIsLoading(false);
  }, []);

  // Load user profile and orders
  useEffect(() => {
    let isSubscribed = true;

    onInit(isSubscribed);

    return () => {
      isSubscribed = false;
    };
    // Important: Include token as a dependency to refetch when it changes
  }, [token, onInit]);

  function onProfileCompleted(data: IProfileResponse) {
    if (data.profile) {
      updateNotificationToken();
    }
  }

  function onError(error: ApolloError) {
    console.log("error", error.message);
  }

  const setTokenAsync = useCallback(
    async (tokenReq: string, cb: () => void = () => {}) => {
      setToken(tokenReq);
      if (typeof window !== "undefined") {
        modeStorage.set("token", tokenReq);
      }
      cb();
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      invalidateClientSession();
      setCart([]);
      setRestaurant(null);
      setToken(null);
      await client.resetStore();
    } catch (error) {
      console.log("error on logout", error);
    }
  }, [client]);

  const subscribeOrders = useCallback(() => {
    if (!subscribeToMoreOrders || !dataProfile?.profile?._id) return;

    try {
      const unsubscribeOrders = subscribeToMoreOrders({
        document: isSingleVendor
          ? SINGLE_VENDOR_ORDER_STATUS
          : SUBSCRIPTION_ORDERS,
        variables: { userId: dataProfile.profile._id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const order = isSingleVendor
            ? subscriptionData.data.orderStatusChanged.rawOrder
            : subscriptionData.data.orderStatusChanged.order;
          const { _id } = order as IOrder;
          if (isSingleVendor) {
            const previous = prev?.getUsersActiveOrders ?? [];
            const existing = previous.findIndex(
              (item: IOrder) => item._id === _id,
            );
            const next =
              existing < 0
                ? [order, ...previous]
                : previous.map((item: IOrder) =>
                    item._id === _id ? { ...item, ...order } : item,
                  );
            return { ...prev, getUsersActiveOrders: next };
          }
          if (subscriptionData.data.orderStatusChanged.origin === "new") {
            if (
              ((prev?.orders as IOrder[]) || ([] as IOrder[]))?.findIndex(
                (o: IOrder) => o._id === _id,
              ) > -1
            )
              return prev;
            return {
              orders: [
                subscriptionData.data.orderStatusChanged.order,
                ...(prev.orders || ([] as IOrder[])),
              ],
            };
          } else {
            const { orders } = prev;
            let newList = [...((orders as IOrder[]) || ([] as IOrder[]))];
            const orderIndex = newList.findIndex((o: IOrder) => o._id === _id);
            if (orderIndex > -1) {
              const update = subscriptionData.data.orderStatusChanged.order;
              newList[orderIndex] = {
                ...newList[orderIndex],
                ...update,
                restaurant: {
                  ...newList[orderIndex].restaurant,
                  ...update.restaurant,
                },
              };
            }
            return {
              orders: [...newList],
            };
          }
        },
      });

      // Convert the function to return a Promise to satisfy TypeScript
      const unsubscribeAsPromise = () => {
        unsubscribeOrders();
        return Promise.resolve();
      };

      client.onResetStore(unsubscribeAsPromise);
    } catch (error: unknown) {
      const err = error as ApolloError;
      console.log("error subscribing order", err.message);
    }
  }, [client, dataProfile, isSingleVendor, subscribeToMoreOrders]);

  // Setup subscription when profile is loaded
  useEffect(() => {
    if (!dataProfile) return;
    subscribeOrders();
  }, [dataProfile, subscribeOrders]);

  const fetchMoreOrdersFunc = useCallback(() => {
    if (networkStatusOrders === 7 && fetchMoreOrders) {
      if (isSingleVendor) {
        void fetchMoreOrders({
          variables: {
            page:
              Math.floor((dataOrders?.getUsersActiveOrders?.length ?? 0) / 20) +
              1,
            limit: 20,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => ({
            ...previousResult,
            getUsersActiveOrders: [
              ...(previousResult.getUsersActiveOrders ?? []),
              ...(fetchMoreResult?.getUsersActiveOrders ?? []),
            ],
          }),
        });
        return;
      }
      fetchMoreOrders({
        variables: { offset: dataOrders?.orders?.length + 1 || 0 },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          // Don't do anything if there weren't any new items
          if (!fetchMoreResult || fetchMoreResult.orders.length === 0) {
            return previousResult;
          }
          return {
            // Append the new feed results to the old one
            orders: previousResult.orders.concat(fetchMoreResult.orders),
          };
        },
      });
    }
  }, [dataOrders, fetchMoreOrders, isSingleVendor, networkStatusOrders]);

  const clearCart = useCallback(() => {
    setCart([]);
    setRestaurant(null);
    if (typeof window !== "undefined") {
      modeStorage.remove("cartItems");
      modeStorage.remove("restaurant");
    }
    if (isSingleVendor) void clearSingleCart();
  }, [clearSingleCart, isSingleVendor]);

  const addQuantity = useCallback(async (key: string, quantity: number = 1) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const cartIndex = updatedCart.findIndex((c) => c.key === key);

      if (cartIndex !== -1) {
        // Important: Set the exact new quantity instead of adding to prevent potential double-increments
        updatedCart[cartIndex].quantity =
          updatedCart[cartIndex].quantity + quantity;

        // Save to local storage
        if (typeof window !== "undefined") {
          modeStorage.set("cartItems", JSON.stringify(updatedCart));
        }
      }

      return updatedCart;
    });
  }, []);

  const deleteItem = useCallback(async (key: string) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const cartIndex = updatedCart.findIndex((c) => c.key === key);

      if (cartIndex > -1) {
        updatedCart.splice(cartIndex, 1);
        const items = updatedCart.filter((c) => c.quantity > 0);

        // Update localStorage
        if (typeof window !== "undefined") {
          if (items.length === 0) {
            modeStorage.remove("cartItems");
            modeStorage.remove("restaurant");
            setRestaurant(null);
          } else {
            modeStorage.set("cartItems", JSON.stringify(items));
          }
        }

        return items;
      }

      return updatedCart;
    });
  }, []);

  const removeQuantity = useCallback(async (key: string) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const cartIndex = updatedCart.findIndex((c) => c.key === key);

      if (cartIndex === -1) return prevCart;

      // Important: Ensure we're only decreasing by exactly 1
      updatedCart[cartIndex].quantity = updatedCart[cartIndex].quantity - 1;
      const items = updatedCart.filter((c) => c.quantity > 0);

      // Update localStorage
      if (typeof window !== "undefined") {
        if (items.length === 0) {
          modeStorage.remove("cartItems");
          modeStorage.remove("restaurant");
          setRestaurant(null);
        } else {
          modeStorage.set("cartItems", JSON.stringify(items));
        }
      }

      return items;
    });
  }, []);

  const checkItemCart = useCallback(
    (itemId: string) => {
      const cartIndex = cart.findIndex((c) => c._id === itemId);
      if (cartIndex < 0) {
        return {
          exist: false,
          quantity: 0,
        };
      } else {
        return {
          exist: true,
          quantity: cart[cartIndex].quantity,
          key: cart[cartIndex].key,
        };
      }
    },
    [cart],
  );

  const numberOfCartItems = useCallback(() => {
    return cart.map((c) => c.quantity).reduce((a, b) => a + b, 0);
  }, [cart]);

  // Enhanced method that replaces the old addCartItem - uses setCartRestaurant which is defined above
  const addItem = useCallback(
    async (
      image: string,
      foodId: string,
      variationId: string,
      restaurantId: string,
      quantity: number = 1,
      addons: SingleVendorCartAddonSelection[] = [],
      specialInstructions: string = "",
    ) => {
      if (isSingleVendor) {
        void updateSingleCart({
          variables: {
            input: {
              food: [
                {
                  _id: foodId,
                  categoryId: restaurantId || "",
                  variation: {
                    _id: variationId,
                    addons: serializeSingleVendorCartAddons(addons),
                    count: quantity,
                  },
                },
              ],
            },
          },
        });
        return;
      }
      // Check if we need to clear the cart (different restaurant)
      const needsClear = Boolean(restaurantId && restaurant !== restaurantId);

      // Create new cart item
      const newItem: CartItem = {
        image,
        key: v4(),
        _id: foodId,
        quantity,
        variation: {
          _id: variationId,
        },
        addons,
        specialInstructions,
      };

      // Set restaurant first
      await setCartRestaurant(restaurantId);

      // Update cart
      setCart((prevCart) => {
        // Use empty array if needsClear is true, otherwise use current cart
        const cartItems = needsClear ? [] : [...prevCart];

        // Add the new item
        const updatedCart = [...cartItems, newItem];

        // Save to localStorage
        if (typeof window !== "undefined") {
          modeStorage.set("cartItems", JSON.stringify(updatedCart));
        }

        return updatedCart;
      });
    },
    [isSingleVendor, restaurant, setCartRestaurant, updateSingleCart],
  );

  const setSingleVendorItemQuantity = useCallback(
    async (input: SingleVendorCartQuantityInput) => {
      if (!isSingleVendor) return;

      const quantity = Math.max(0, Math.floor(input.quantity));
      const existing = cart.find((item) =>
        isSingleVendorCartConfiguration(
          item,
          input.foodId,
          input.variationId,
          input.addons,
        ),
      );

      setCart((currentCart) => {
        const currentIndex = currentCart.findIndex((item) =>
          isSingleVendorCartConfiguration(
            item,
            input.foodId,
            input.variationId,
            input.addons,
          ),
        );

        if (quantity === 0) {
          return currentCart.filter((_, index) => index !== currentIndex);
        }

        if (currentIndex >= 0) {
          return currentCart.map((item, index) =>
            index === currentIndex ? { ...item, quantity } : item,
          );
        }

        return [
          ...currentCart,
          {
            key: `optimistic:${input.foodId}:${input.variationId}`,
            _id: input.foodId,
            variation: { _id: input.variationId },
            quantity,
            categoryId: input.categoryId,
            image: input.image ?? "",
            title: input.foodTitle,
            foodTitle: input.foodTitle,
            variationTitle: input.variationTitle,
            price: input.unitPrice,
            addons: input.addons ?? [],
          },
        ];
      });

      try {
        if (existing && !existing.key.startsWith("optimistic:")) {
          const response = await updateSingleCartCount({
            variables: {
              input: {
                variation_id: existing.key,
                foodId: input.foodId,
                categoryId: input.categoryId || existing.categoryId,
                variationId: input.variationId,
                action:
                  quantity === 0
                    ? "delete"
                    : quantity > existing.quantity
                      ? "increase"
                      : "decrease",
                count: quantity,
              },
            },
          });

          if (!response.data?.updateUserCartCount?.success) {
            throw new Error(
              response.data?.updateUserCartCount?.message ||
                "Unable to update cart",
            );
          }
        } else if (quantity > 0) {
          const response = await updateSingleCart({
            variables: {
              input: {
                food: [
                  {
                    _id: input.foodId,
                    categoryId: input.categoryId,
                    variation: {
                      _id: input.variationId,
                      addons: serializeSingleVendorCartAddons(input.addons),
                      count: quantity,
                    },
                  },
                ],
              },
            },
          });

          if (!response.data?.userCartData?.success) {
            throw new Error(
              response.data?.userCartData?.message || "Unable to update cart",
            );
          }
        }
      } catch (error) {
        await fetchSingleCart();
        throw error;
      }
    },
    [
      cart,
      fetchSingleCart,
      isSingleVendor,
      updateSingleCart,
      updateSingleCartCount,
    ],
  );

  const updateCart = useCallback(
    async (updatedCart: CartItem[]) => {
      // Skip update if cart is empty or unchanged (prevents infinite loop)
      if (JSON.stringify(cart) === JSON.stringify(updatedCart)) {
        return;
      }

      setCart(updatedCart);
      if (typeof window !== "undefined") {
        modeStorage.set("cartItems", JSON.stringify(updatedCart));
      }
    },
    [cart],
  );

  const updateNotificationToken = useCallback(() => {
    if (typeof window !== "undefined") {
      const token = modeStorage.get("messaging-token");
      if (token) {
        saveNotificationToken({ variables: { token } });
      }
    }
  }, [saveNotificationToken]);

  const updateItemQuantity = useCallback(
    async (key: string, changeAmount: number) => {
      // Force change to be exactly +1 or -1
      const safeChange = changeAmount > 0 ? 1 : -1;

      if (isSingleVendor) {
        const item = cart.find((cartItem) => cartItem.key === key);
        if (!item?.categoryId) return;

        try {
          await setSingleVendorItemQuantity({
            foodId: item._id,
            categoryId: item.categoryId,
            variationId: item.variation._id,
            quantity: Math.max(0, item.quantity + safeChange),
            image: item.image,
            foodTitle: item.foodTitle || item.title,
            variationTitle: item.variationTitle,
            unitPrice: Number(item.price) || 0,
            addons: item.addons,
          });
        } catch (error) {
          console.error("Unable to update Single Vendor cart item", error);
        }
        return;
      }

      // Use a local variable that will be unique to each function call
      // This ensures the flag is reset for each new click
      let updateApplied = false;

      setCart((prevCart) => {
        // If we've already applied an update in this callback invocation, don't do it again
        if (updateApplied) {
          return prevCart;
        }

        const updatedCart = [...prevCart];
        const cartIndex = updatedCart.findIndex((c) => c.key === key);

        if (cartIndex === -1) {
          return prevCart;
        }

        const currentItem = updatedCart[cartIndex];
        const currentQuantity = currentItem.quantity;
        console.log(
          `[UserContext] Current quantity for ${key}: ${currentQuantity}`,
        );

        // For decrement
        if (safeChange < 0) {
          if (currentQuantity <= 1) {
            updatedCart.splice(cartIndex, 1);
          } else {
            updatedCart[cartIndex] = {
              ...currentItem,
              quantity: currentQuantity + safeChange,
            };
          }
        }
        // For increment
        else {
          updatedCart[cartIndex] = {
            ...currentItem,
            quantity: currentQuantity + safeChange,
          };
        }

        // Mark that we've applied an update
        updateApplied = true;

        // Update localStorage
        if (typeof window !== "undefined") {
          if (updatedCart.length === 0) {
            modeStorage.remove("cartItems");
            modeStorage.remove("restaurant");
            setRestaurant(null);
          } else {
            modeStorage.set("cartItems", JSON.stringify(updatedCart));
          }
        }

        return updatedCart;
      });
    },
    [cart, isSingleVendor, setSingleVendorItemQuantity],
  );

  const removeItem = useCallback(
    async (key: string) => {
      await deleteItem(key);
    },
    [deleteItem],
  );

  const calculateSubtotal = useCallback(() => {
    return cart
      .reduce((total, item) => {
        const priceRaw =
          (item.variation as { price?: number | string })?.price ??
          item.price ??
          0;
        const price =
          typeof priceRaw === "string" ? parseFloat(priceRaw) : priceRaw;
        const quantity = item.quantity ?? 0;
        return total + price * quantity;
      }, 0)
      .toFixed(2);
  }, [cart]);

  const contextValue = useMemo(
    () => ({
      isLoggedIn: !!token,
      loadingProfile: loadingProfile && calledProfile,
      errorProfile,
      profile: dataProfile && dataProfile.profile ? dataProfile.profile : null,
      fetchProfile,
      setTokenAsync,
      logout,
      loadingOrders: loadingOrders && calledOrders,
      errorOrders,
      orders: isSingleVendor
        ? (dataOrders?.getUsersActiveOrders ?? [])
        : (dataOrders?.orders ?? []),
      fetchOrders,
      fetchMoreOrdersFunc,
      networkStatusOrders,
      cart,
      cartCount: numberOfCartItems(),
      clearCart,
      updateCart,
      addQuantity,
      removeQuantity,
      addItem,
      checkItemCart,
      deleteItem,
      restaurant,
      setCartRestaurant,
      isLoading,
      updateItemQuantity,
      removeItem,
      calculateSubtotal,
      transformCartWithFoodInfo,
      setCart,
      setSingleVendorItemQuantity,
    }),
    [
      token,
      loadingProfile,
      calledProfile,
      errorProfile,
      dataProfile,
      fetchProfile,
      setTokenAsync,
      logout,
      loadingOrders,
      calledOrders,
      errorOrders,
      dataOrders,
      fetchOrders,
      fetchMoreOrdersFunc,
      networkStatusOrders,
      cart,
      numberOfCartItems,
      clearCart,
      updateCart,
      addQuantity,
      removeQuantity,
      addItem,
      checkItemCart,
      deleteItem,
      restaurant,
      setCartRestaurant,
      isLoading,
      updateItemQuantity,
      removeItem,
      calculateSubtotal,
      transformCartWithFoodInfo,
      setCart,
      setSingleVendorItemQuantity,
    ],
  );

  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  );
};

export const UserConsumer = UserContext.Consumer;
export default UserContext;
