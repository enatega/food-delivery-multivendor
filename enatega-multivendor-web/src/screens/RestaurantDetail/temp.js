/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-scroll";
import Scrollspy from "react-scrollspy";
import FlashMessage from "../../components/FlashMessage";
import Footer from "../../components/Footer/Footer";
import { Header, LoginHeader } from "../../components/Header";
import Analytics from "../../utils/analytics";
import {
  RestaurantClose,
  RestaurantInfo,
  VariationModal,
} from "../../components/Modals";
import { Subheader } from "../../components/RestaurantComponent";
import {
  ItemCard,
  MRestaurantCart,
  RestaurantCart,
  RestaurantHeader,
} from "../../components/RestaurantDetailComponent";
import UserContext from "../../context/User";
import { useRestaurant } from "../../hooks";
import { DAYS } from "../../utils/constantValues";
import useStyles from "./styles";

function RestaurantDetail() {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const classes = useStyles();
  const { state } = useLocation();
  const query = useParams();
  const [isClose, setIsClose] = useState(false);
  const [mainError, setMainError] = useState({});
  const [addonData, setAddonData] = useState(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [variationModal, setVariationModal] = useState(false);
  const { data, loading, error } = useRestaurant(state?.id, query.slug);
  const allDeals = data?.restaurant?.categories.filter(
    (cat) => cat.foods.length
  );
  const {
    restaurant: restaurantCart,
    setCartRestaurant,
    checkItemCart,
    addCartItem,
    addQuantity,
    cart,
    clearCart,
    isLoggedIn,
  } = useContext(UserContext);
  const deals = allDeals?.map((c, index) => ({
    ...c,
    index,
  }));
  const headerData = {
    name: data?.restaurant?.name ?? "...",
    averageReview: data?.restaurant?.reviewData.ratings ?? "...",
    averageTotal: data?.restaurant?.reviewData.total ?? "...",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
    deals: deals,
  };
  const restaurantInfo = {
    _id: data?.restaurant._id ?? "",
    name: data?.restaurant?.name ?? "...",
    image: data?.restaurant?.image ?? "",
    deals: deals,
    reviewData: data?.restaurant?.reviewData ?? {},
    address: data?.restaurant?.address ?? "",
    deliveryCharges: data?.restaurant?.deliveryCharges ?? "",
    deliveryTime: data?.restaurant?.deliveryTime ?? "...",
    isAvailable: data?.restaurant?.isAvailable ?? true,
    openingTimes: data?.restaurant?.openingTimes ?? [],
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(async () => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_RESTAURANTS_DETAIL);
  }, []);
  useEffect(() => {
    if (data?.restaurant && (!isOpen || !data?.restaurant?.isAvailable)) {
      toggleCloseModal();
    }
  }, [data?.restaurant]);

  const toggleVariationModal = useCallback(() => {
    setVariationModal((prev) => !prev);
  }, []);

  const toggleReviewModal = useCallback(() => {
    setReviewModal((prev) => !prev);
  }, []);

  const toggleCloseModal = useCallback(() => {
    setIsClose((prev) => !prev);
  }, []);

  const isOpen = useCallback(() => {
    if (data) {
      if (data.restaurant.openingTimes.length < 1) return false;
      const date = new Date();
      const day = date.getDay();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const todaysTimings = data.restaurant.openingTimes.find(
        (o) => o.day === DAYS[day]
      );
      if (todaysTimings === undefined) return false;
      const times = todaysTimings.times.filter(
        (t) =>
          hours >= Number(t.startTime[0]) &&
          minutes >= Number(t.startTime[1]) &&
          hours <= Number(t.endTime[0]) &&
          minutes <= Number(t.endTime[1])
      );

      return times.length > 0;
    } else return false;
  }, [data]);

  const addFoodToCart = async (food) => {
    if (!restaurantInfo.isAvailable || !isOpen()) {
      toggleCloseModal();
      return;
    }
    if (!restaurantCart || food.restaurant === restaurantCart) {
      await addToCart(food, food.restaurant !== restaurantCart);
    }
  };

  const addToCart = async (food, clearFlag) => {
    if (
      food.variations.length === 1 &&
      food.variations[0].addons.length === 0
    ) {
      await setCartRestaurant(food.restaurant);
      const result = checkItemCart(food._id);
      if (result.exist) await addQuantity(result.key);
      else
        await addCartItem(food._id, food.variations[0]._id, 1, [], clearFlag);
    } else {
      if (clearFlag) await clearCart();
      setAddonData({
        food,
        addons: data?.restaurant.addons,
        options: data?.restaurant.options,
        restaurant: data?.restaurant._id,
      });
      toggleVariationModal();
    }
    await Analytics.track(Analytics.events.ADD_TO_CART, {
      title: food.title,
      restaurantName: food.restaurantName,
      variations: food.variations,
    });
  };

  const showMessage = useCallback((messageObj) => {
    setMainError(messageObj);
  }, []);

  const toggleSnackbar = useCallback(() => {
    setMainError({});
  }, []);

  if (loading || error) {
    return (
      <div style={{ backgroundColor: theme.palette.grey[200] }}>
        <Grid container>
          {isLoggedIn ? <Header /> : <LoginHeader showIcon />}
        </Grid>
        <Subheader />
        <Grid container style={{ display: "flex" }}>
          <Grid item lg={9} xs={12}>
            <Container
              maxWidth="xl"
              style={{
                marginLeft: "0px",
                paddingLeft: "0px",
                paddingRight: "0px",
              }}
            >
              <Box
                className={classes.imageContainer}
                style={{
                  backgroundImage: `url('${restaurantInfo?.image ?? ""}')`,
                }}
              />
              <Box style={{ backgroundColor: theme.palette.common.white }}>
                <RestaurantHeader headerData={restaurantInfo} loading />
              </Box>
              <Divider orientation="horizontal" light />
            </Container>
            <Box className={classes.spinnerContainer}>
              {error ? (
                <Typography>Unable to fetch data {error.message}</Typography>
              ) : (
                <CircularProgress color="primary" size={48} />
              )}
            </Box>
          </Grid>
        </Grid>
        <Box style={{ backgroundColor: theme.palette.common.white }}>
          <Footer />
        </Box>
      </div>
    );
  }

  return (
    <>
      <FlashMessage
        open={Boolean(mainError.type)}
        severity={mainError.type}
        alertMessage={mainError.message}
        handleClose={toggleSnackbar}
      />
      <div
        style={{
          backgroundColor: theme.palette.grey[200],
          scrollBehavior: "smooth",
        }}
      >
        <Grid container>
          {isLoggedIn ? <Header /> : <LoginHeader showIcon />}
        </Grid>
        <Subheader />
        <Grid
          container
          style={{ display: "flex", flexDirection: "row-reverse" }}
        >
          {!isTablet && <RestaurantCart showMessage={showMessage} />}
          <Grid item lg={9} xs={12}>
            <Container
              maxWidth="xl"
              style={{
                marginLeft: "0px",
                paddingLeft: "0px",
                paddingRight: "0px",
              }}
            >
              <Box
                className={classes.imageContainer}
                style={{
                  backgroundImage: `url('${restaurantInfo?.image ?? ""}')`,
                }}
              />
              <Box style={{ backgroundColor: theme.palette.common.white }}>
                <RestaurantHeader
                  toggleModal={toggleReviewModal}
                  headerData={headerData}
                />
              </Box>
              <Divider orientation="horizontal" light />
            </Container>
            <Container
              maxWidth="xl"
              style={{
                marginLeft: "0px",
                paddingLeft: "0px",
                paddingRight: "0px",
                position: "sticky",
                zIndex: 1200,
                top: "140px",
                display: "flex",
              }}
            >
              <div className={classes.tabContainer}>
                <Container style={{ marginLeft: "0px" }}>
                  <Scrollspy
                    offset={-220}
                    className={classes.scrollpyStyles}
                    items={deals.map((item) => item._id)}
                    currentClassName={classes.active}
                  >
                    {deals.map((item, index) => (
                      <li
                        key={`STICKY_${index}`}
                        className={classes.tabListStyle}
                      >
                        <Link
                          to={item._id}
                          spy={true}
                          smooth={true}
                          className={classes.anchorStyle}
                          offset={-220}
                        >
                          <Typography className={classes.tabTextStyle}>
                            {item.title}
                          </Typography>
                        </Link>
                      </li>
                    ))}
                  </Scrollspy>
                </Container>
              </div>
            </Container>
            <Container
              maxWidth="xl"
              style={{
                marginLeft: "0px",
                paddingLeft: "0px",
                paddingRight: "0px",
              }}
            >
              {deals.map((item, index) => (
                <section key={`SECTION_${index}`} id={item._id}>
                  <ItemCard
                    {...item}
                    onPress={addFoodToCart}
                    restaurant={{
                      restaurant: restaurantInfo._id,
                      restaurantName: restaurantInfo.name,
                      deliveryCharges: restaurantInfo.deliveryCharges,
                    }}
                  />
                </section>
              ))}
            </Container>
          </Grid>
        </Grid>
        <Box style={{ backgroundColor: theme.palette.common.white }}>
          <Footer />
        </Box>
        <RestaurantClose
          isVisible={isClose}
          toggleModal={toggleCloseModal}
          restaurant={restaurantInfo.name}
        />
        <VariationModal
          isVisible={variationModal}
          toggleModal={toggleVariationModal}
          data={addonData}
        />
        <RestaurantInfo
          isVisible={reviewModal}
          toggleModal={toggleReviewModal}
          restaurantInfo={restaurantInfo}
        />
        {isTablet && cart.length && (
          <MRestaurantCart showMessage={showMessage} />
        )}
      </div>
    </>
  );
}

export default RestaurantDetail;
