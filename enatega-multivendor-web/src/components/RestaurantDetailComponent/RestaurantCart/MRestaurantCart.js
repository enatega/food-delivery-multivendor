/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@apollo/client";
import {
  CircularProgress,
  Hidden,
  Box,
  useTheme,
} from "@mui/material";
import gql from "graphql-tag";
import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { getTaxation } from "../../../apollo/server";
import UserContext from "../../../context/User";
import { useRestaurant } from "../../../hooks";

const TAXATION = gql`
  ${getTaxation}
`;

function MRestaurantCart(props) {
  const theme = useTheme();
  const [loadingData, setLoadingData] = useState(true);
  const {
    cart,
    cartCount,
    clearCart,
    updateCart,
    restaurant: cartRestaurant,
  } = useContext(UserContext);
 
  const { loading: loadingTax } = useQuery(TAXATION, {
    fetchPolicy: "network-only",
  });
  const { loading, data } = useRestaurant(cartRestaurant);
  const restaurantData = data?.restaurant ?? null;

  useEffect(() => {
    if (restaurantData) didFocus();
  }, [restaurantData, cartCount]);

  const didFocus = async () => {
    const foods = restaurantData.categories.map((c) => c.foods.flat()).flat();
    const { addons, options } = restaurantData;
    try {
      if (cart && cartCount) {
        const transformCart = cart.map((cartItem) => {
          const foodItem = foods.find((food) => food._id === cartItem._id);
          if (!foodItem) return null;
          const variationItem = foodItem.variations.find(
            (variation) => variation._id === cartItem.variation._id
          );
          if (!variationItem) return null;
          const foodItemTitle = `${foodItem.title}(${variationItem.title})`;
          let foodItemPrice = variationItem.price;
          let optionTitles = [];
          if (cartItem.addons) {
            cartItem.addons.forEach((addon) => {
              const cartAddon = addons.find((add) => add._id === addon._id);
              if (!cartAddon) return null;
              addon.options.forEach((option) => {
                const cartOption = options.find(
                  (opt) => opt._id === option._id
                );
                if (!cartOption) return null;
                foodItemPrice += cartOption.price;
                optionTitles.push(cartOption.title);
              });
            });
          }
          return {
            ...cartItem,
            title: foodItemTitle,
            foodTitle: foodItem.title,
            variationTitle: variationItem.title,
            optionTitles,
            price: foodItemPrice.toFixed(2),
          };
        });
        const updatedItems = transformCart.filter((item) => item);
        if (updatedItems.length === 0) await clearCart();
        await updateCart(updatedItems);
        setLoadingData((prev) => {
          if (prev) return false;
          else return prev;
        });
        if (transformCart.length !== updatedItems.length) {
          props.showMessage({
            type: "warning",
            message: "One or more item is not available",
          });
        }
      }
    } catch (e) {
      props.showMessage({
        type: "error",
        message: e.message,
      });
    } finally {
      setLoadingData((prev) => {
        if (prev) return false;
        else return prev;
      });
    }
  };

  /* const calculatePrice = useMemo(
    () => () => {
      let itemTotal = 0;
      cart.forEach((cartItem) => {
        itemTotal += cartItem.price * cartItem.quantity;
      });
      return itemTotal.toFixed(2);
    },
    [cart]
  ); */

 /*  const taxCalculation = useMemo(
    () => () => {
      const tax = restaurantData ? +restaurantData.tax : 0;
      if (tax === 0) {
        return tax.toFixed(2);
      }
      const amount = +calculatePrice();
      const taxAmount = ((amount / 100) * tax).toFixed(2);
      return taxAmount;
    },
    [calculatePrice, restaurantData]
  ); */

/*   const calculateTotal = useMemo(
    () => () => {
      let total = 0;
      total += +calculatePrice();
      total += +taxCalculation();
      return parseFloat(total).toFixed(2);
    },
    [calculatePrice, taxCalculation]
  );
 */
  return (
    <Hidden lgUp>
      <RouterLink
        to={loadingTax ? "#" : "/checkout"}
        style={{ textDecoration: "none" }}
      >
        <Box
          style={{
            background: theme.palette.common.white,
            position: "fixed",
            bottom: 0,
            width: "100%",
            borderRadius: "inherit",
          }}
        >
          {loadingTax || loadingData || loading ? (
            <CircularProgress color="secondary" size={25} />
          ) : (
           <></>
          )}
        </Box>
      </RouterLink>
    </Hidden>
  );
}

export default React.memo(MRestaurantCart);
