/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import RiderImage from "../../../assets/images/rider.png";
import UserContext from "../../../context/User";
import { useRestaurant } from "../../../hooks";
import CartItem from "./CartItem";
import PricingView from "./PricingView";
import useStyles from "./styles";
import { useTranslation } from "react-i18next";

function CartView(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const [loadingData, setLoadingData] = useState(true);
  const {
    clearCart,
    restaurant: cartRestaurant,
    cart,
    cartCount,
    addQuantity,
    removeQuantity,
    updateCart,
  } = useContext(UserContext);
  const { data } = useRestaurant(cartRestaurant);
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
          const foodItemTitle = `${foodItem.title}${
            variationItem.title ? `(${variationItem.title})` : ""
          }`;
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
            type: t("warning"),
            message: t("warningText"),
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

  if (loadingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        style={{
          background:
            "linear-gradient(260.99deg, theme.palette.primary.main 2.79%, theme.palette.success.light 96.54%)",
          borderRadius: "20px",
          padding: "30px 20px",
        }}
        display="flex"
        alignItems={"center"}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          {/* <DeliveryIcon /> */}
          <img src={RiderImage} alt="rider" />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          style={{
            marginLeft: "5px",
          }}
        >
          <Typography
            style={{
              ...theme.typography.body1,
              color: theme.palette.common.black,
              fontSize: "1.275rem",
              fontWeight: 600,
            }}
          >
            {t("deliveryTime")}
          </Typography>
          <Typography
            style={{
              ...theme.typography.body1,
              color: theme.palette.text.disabled,
              fontSize: "0.875rem",
            }}
          >
            {`${restaurantData?.deliveryTime ?? "..."}  min`}
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            style={{ fontSize: "0.78rem" }}
            className={classes.textBold}
          >
            {`${t("orderFrom")} ${restaurantData?.name ?? "..."}`}
          </Typography>
        </Box>
      </Box>
      <Container
        style={{
          maxHeight: "30vh",
          overflowY: "scroll",
          paddingBottom: theme.spacing(2),
          background: theme.palette.common.white,
          marginBottom: 10,
        }}
      >
        {cart?.map((foodItem) => (
          <CartItem
            key={`ITEM_${foodItem.key}`}
            quantity={foodItem.quantity}
            dealName={foodItem.title}
            foodTitle={foodItem.foodTitle}
            variationTitle={foodItem.variationTitle}
            optionTitles={foodItem.optionTitles}
            dealPrice={(parseFloat(foodItem.price) * foodItem.quantity).toFixed(
              2
            )}
            addQuantity={() => {
              addQuantity(foodItem.key);
            }}
            removeQuantity={() => {
              removeQuantity(foodItem.key);
            }}
          />
        ))}
      </Container>
      <PricingView
        restaurantData={restaurantData}
        deliveryCharges={restaurantData.deliveryCharges}
      />
    </>
  );
}
export default React.memo(CartView);
