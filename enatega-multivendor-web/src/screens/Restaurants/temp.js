/* eslint-disable react-hooks/exhaustive-deps */
import { gql, useQuery } from "@apollo/client";
import { Box, CircularProgress, Grid, Typography, Button } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { restaurantList } from "../../apollo/server";
import FlashMessage from "../../components/FlashMessage";
import Footer from "../../components/Footer/Footer";
import { Header, LoginHeader } from "../../components/Header";
import { ClearCart } from "../../components/Modals";
import {
  RestaurantGrid,
  RestaurantRow,
  SearchRestaurant,
  Subheader,
} from "../../components/RestaurantComponent";
import { useLocationContext } from "../../context/Location";
import ActiveOrder from "../../components/Orders/ActiveOrder/Card/ActiveOrder";
import UserContext from "../../context/User";
import Analytics from "../../utils/analytics";
import useStyles from "./styles";
import DeliveryTabs from "../../components/Tabs/Tabs";

const RESTAURANTS = gql`
  ${restaurantList}
`;

function Restaurants() {
  const navigate = useNavigate();
  const { location } = useLocationContext();
  const [message, setMessage] = useState({});
  const [search, setSearch] = useState("");
  const { isLoggedIn } = useContext(UserContext);
  const [clearModal, setClearModal] = useState(false);
  const [navigateData, setNavigateData] = useState({});
  const classes = useStyles();
  const { clearCart, restaurant: cartRestaurant } = useContext(UserContext);
  const [active, setActive] = useState("delivery");

  const navigateClearCart = useCallback(async () => {
    await clearCart();
    navigate(`/restaurant/${navigateData.slug}`, { state: navigateData });
  }, [navigateData]);
  useEffect(async () => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_RESTAURANTS);
  }, []);
  const checkCart = useCallback(
    (id, name, image, slug) => {
      if (cartRestaurant && id !== cartRestaurant) {
        setNavigateData({ id, name, image, slug });
        toggleClearCart();
        return false;
      }
      return true;
    },
    [cartRestaurant]
  );

  const toggleClearCart = useCallback(() => {
    setClearModal((prev) => !prev);
  }, []);

  const showMessage = useCallback((messageObj) => {
    setMessage(messageObj);
  }, []);
  const toggleSnackbar = useCallback(() => {
    setMessage({});
  }, []);

  const { data, loading, error } = useQuery(RESTAURANTS, {
    variables: {
      longitude: location?.longitude || null,
      latitude: location?.latitude || null,
      ip: null,
    },
    fetchPolicy: "network-only",
    skip: !location,
  });

  if (loading || error) {
    return (
      <Grid container>
        {isLoggedIn ? <Header /> : <LoginHeader showIcon />}
        <Subheader />
        <Grid container item className={classes.marginHeader}>
          <SearchRestaurant search={""} setSearch={() => {}} />
        </Grid>
        <Box className={classes.spinnerContainer}>
          {loading ? (
            <CircularProgress color="primary" size={48} />
          ) : (
            <Typography>Unable to load data </Typography>
          )}
        </Box>
      </Grid>
    );
  }
  const { restaurants, sections } = data?.nearByRestaurants ?? {
    restaurants: [],
    sections: [],
  };
  const restaurantSections = sections.map((sec) => ({
    ...sec,
    restaurants: sec.restaurants
      .map((id) => restaurants.filter((res) => res._id === id))
      .flat(),
  }));

  const searchRestaurants = (searchText) => {
    const data = [];
    restaurants.forEach((restaurant) => {
      const regex = new RegExp(
        searchText.replace(/[\\[\]()+?.*]/g, (c) => "\\" + c),
        "i"
      );
      const result = restaurant.name.search(regex);
      if (result < 0) {
        const result = restaurant.categories.some((category) => {
          const result = category.title.search(regex);
          if (result < 0) {
            const result = category.foods.some((food) => {
              const result = food.title.search(regex);
              return result > -1;
            });
            return result;
          }
          return true;
        });
        if (!result) return;
      }
      data.push(restaurant);
    });
    return data;
  };

  const activeTabChange = () => {
    setActive("delivery");
  };
  const inactiveTabChange = () => {
    setActive("pickup");
  };

  const Map = () => {
    return (
      <Grid className={classes.mapImage}>
        <h3 className={classes.mapText}>Explore restaurants around you</h3>
        <Button
          className={classes.mapButton}
          onClick={() => navigate("/pickup")}
        >
          Show map
        </Button>
      </Grid>
    );
  };

  return (
    <Grid container>
      <FlashMessage
        open={Boolean(message.type)}
        severity={message.type}
        alertMessage={message.message}
        handleClose={toggleSnackbar}
      />
      {isLoggedIn ? <Header /> : <LoginHeader showIcon />}
      <Subheader />

      <Grid container item className={classes.marginHeader}>
        <DeliveryTabs
          active={active}
          activeTabChange={activeTabChange}
          inactiveTabChange={inactiveTabChange}
        />
        {active === "pickup" && <Map />}
        <SearchRestaurant search={search} setSearch={setSearch} />
      </Grid>
      <Grid container item>
        <ActiveOrder />
      </Grid>
      {search ? null : (
        <Grid container item>
          <RestaurantRow
            checkCart={checkCart}
            restaurantSections={restaurantSections}
            showMessage={showMessage}
          />
        </Grid>
      )}
      <Grid container item>
        <RestaurantGrid
          checkCart={checkCart}
          restaurants={search ? searchRestaurants(search) : restaurants}
          showMessage={showMessage}
        />
      </Grid>
      <Footer />
      <ClearCart
        isVisible={clearModal}
        toggleModal={toggleClearCart}
        action={navigateClearCart}
      />
    </Grid>
  );
}

export default Restaurants;
