/* eslint-disable react-hooks/exhaustive-deps */
import {
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import {
  myOrders,
  orderStatusChanged,
  profile,
  saveNotificationTokenWeb,
} from "../apollo/server";

const PROFILE = gql`
  ${profile}
`;

const ORDERS = gql`
  ${myOrders}
`;
const SUBSCRIPTION_ORDERS = gql`
  ${orderStatusChanged}
`; // rename this 'subscriptionOrders' when user context is complete

const SAVE_NOTIFICATION_TOKEN_WEB = gql`
  ${saveNotificationTokenWeb}
`;

const UserContext = React.createContext({});

export const UserProvider = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const client = useApolloClient();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [cart, setCart] = useState([]); // use initial state of cart here
  const [restaurant, setRestaurant] = useState(null);
  const [saveNotificationToken] = useMutation(SAVE_NOTIFICATION_TOKEN_WEB, {
    onCompleted,
    onError,
  });
  const [
    fetchProfile,
    {
      called: calledProfile,
      loading: loadingProfile,
      error: errorProfile,
      data: dataProfile,
    },
  ] = useLazyQuery(PROFILE, {
    fetchPolicy: "network-only",
    onCompleted,
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
  ] = useLazyQuery(ORDERS, {
    fetchPolicy: "network-only",
    onCompleted,
    onError,
  });

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    let isSubscribed = true;
    (async () => {
      isSubscribed && setIsLoading(true);
      isSubscribed && (await fetchProfile());
      isSubscribed && (await fetchOrders());
      isSubscribed && setIsLoading(false);
    })();
    return () => {
      isSubscribed = false;
    };
  }, [token]);

  useEffect(() => {
    if (!dataProfile) return;
    subscribeOrders();
  }, [dataProfile]);

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      const restaurant = localStorage.getItem("restaurant");
      const cart = localStorage.getItem("cartItems");
      isSubscribed && setRestaurant(restaurant || null);
      isSubscribed && setCart(cart ? JSON.parse(cart) : []);
    })();
    return () => {
      isSubscribed = false;
    };
  }, []);

  function onCompleted({ profile, orders, saveNotificationTokenWeb }) {
    
    if (profile) {
      updateNotificationToken();
    }
  }

  function onError(error) {
    console.log("error", error.message);
  }

  const setTokenAsync = async (tokenReq, cb = () => {}) => {
    setToken(tokenReq);
    localStorage.setItem("token", tokenReq);
    cb();
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      setToken(null);
      await client.resetStore();
    } catch (error) {
      console.log("error on logout", error);
    }
  };

  const subscribeOrders = () => {
  
    try {
      const unsubscribeOrders = subscribeToMoreOrders({
        document: SUBSCRIPTION_ORDERS,
        variables: { userId: dataProfile.profile._id },
        updateQuery: (prev, { subscriptionData }) => {
      
          if (!subscriptionData.data) return prev;
          const { _id } = subscriptionData.data.orderStatusChanged.order;
          if (subscriptionData.data.orderStatusChanged.origin === "new") {
            if (prev?.orders?.findIndex((o) => o._id === _id) > -1) return prev;
            return {
              orders: [
                subscriptionData.data.orderStatusChanged.order,
                ...prev.orders,
              ],
            };
          } else {
            const { orders } = prev;
            let newList = [...orders];
            const orderIndex = newList.findIndex((o) => o._id === _id);
            if (orderIndex > -1) {
              newList[orderIndex] =
                subscriptionData.data.orderStatusChanged.order;
            }
            return {
              orders: [...newList],
            };
          }
        },
      });
      client.onResetStore(unsubscribeOrders);
    } catch (error) {
      console.log("error subscribing order", error.message);
    }
  };

  const fetchMoreOrdersFunc = () => {
    if (networkStatusOrders === 7) {
      fetchMoreOrders({
        variables: { offset: dataOrders.orders.length + 1 },
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
  };

  const clearCart = () => {
    setCart([]);
    setRestaurant(null);
    localStorage.removeItem("cartItems");
    localStorage.removeItem("restaurant");
  };

  const addQuantity = async (key, quantity = 1) => {
    const cartIndex = cart.findIndex((c) => c.key === key);
    cart[cartIndex].quantity += quantity;
    setCart([...cart]);
    localStorage.setItem("cartItems", JSON.stringify([...cart]));
  };

  const deleteItem = async (key) => {
    const cartIndex = cart.findIndex((c) => c.key === key);
    if (cartIndex > -1) {
      cart.splice(cartIndex, 1);
      const items = [...cart.filter((c) => c.quantity > 0)];
      setCart(items);
      if (items.length === 0) setRestaurant(null);
      localStorage.setItem("cartItems", JSON.stringify(items));
    }
  };

  const removeQuantity = async (key) => {
    const cartIndex = cart.findIndex((c) => c.key === key);
    cart[cartIndex].quantity -= 1;
    const items = [...cart.filter((c) => c.quantity > 0)];
    setCart(items);
    if (items.length === 0) setRestaurant(null);
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  const checkItemCart = (itemId) => {
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
  };

  const numberOfCartItems = () => {
    return cart
      .map((c) => c.quantity)
      .reduce(function (a, b) {
        return a + b;
      }, 0);
  };

  const addCartItem = async (
    _id,
    variation,
    quantity = 1,
    addons = [],
    clearFlag,
    specialInstructions = ""
  ) => {
    const cartItems = clearFlag ? [] : cart;
    cartItems.push({
      key: v4(),
      _id,
      quantity: quantity,
      variation: {
        _id: variation,
      },
      addons,
      specialInstructions,
    });

    localStorage.setItem("cartItems", JSON.stringify([...cartItems]));
    setCart([...cartItems]);
  };

  const updateCart = async (cart) => {
    setCart(cart);
    localStorage.setItem("cartItems", JSON.stringify(cart));
  };

  const setCartRestaurant = async (id) => {
    setRestaurant(id);
    localStorage.setItem("restaurant", id);
  };

  const updateNotificationToken = () => {
   
    const token = localStorage.getItem("messaging-token");
    if (token) {
     
      saveNotificationToken({ variables: { token } });
    }
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn: !!token,
        loadingProfile: loadingProfile && calledProfile,
        errorProfile,
        profile:
          dataProfile && dataProfile.profile ? dataProfile.profile : null,
        setTokenAsync,
        logout,
        loadingOrders: loadingOrders && calledOrders,
        errorOrders,
        orders: dataOrders && dataOrders.orders ? dataOrders.orders : [],
        fetchOrders,
        fetchMoreOrdersFunc,
        networkStatusOrders,
        cart,
        cartCount: numberOfCartItems(),
        clearCart,
        updateCart,
        addQuantity,
        removeQuantity,
        addCartItem,
        checkItemCart,
        deleteItem,
        restaurant,
        setCartRestaurant,
        isLoading,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export const UserConsumer = UserContext.Consumer;
export default UserContext;
