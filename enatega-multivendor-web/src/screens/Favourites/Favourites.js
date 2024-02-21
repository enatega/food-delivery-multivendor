/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@apollo/client";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import clsx from "clsx";
import gql from "graphql-tag";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FavouriteRestaurant } from "../../apollo/server";
import FavouriteIcon from "../../assets/icons/FavouriteIcon";
import HeartFilled from "../../assets/icons/HeartFilledIcon";
import Favourite from "../../assets/images/favs.png";
import FavouritesBg from "../../assets/images/fav-bg.png";
import FlashMessage from "../../components/FlashMessage";
import { Header } from "../../components/Header";
import { ClearCart } from "../../components/Modals";
import { ProductCard, Subheader } from "../../components/RestaurantComponent";
import { LocationContext } from "../../context/Location";
import UserContext from "../../context/User";
import analytics from "../../utils/analytics";
import useStyles from "./styles";
import Footer from "../../components/Footer/Footer";
import { useTranslation } from 'react-i18next';

const RESTAURANTS = gql`
  ${FavouriteRestaurant}
`;

function EmptyView() {
  const { t } = useTranslation()
  const classes = useStyles();
  return (
    <Grid item xs={12} className={classes.mt2}>
      <Box className={classes.mt2} display="flex" justifyContent="center">
        <FavouriteIcon />
      </Box>
      <Box className={classes.mt2} display="flex" justifyContent="center">
        <Typography variant="h6" className={classes.textBold}>
          {t('titleEmptyFav')}
        </Typography>
      </Box>
      <Box className={classes.mt2} display="flex" justifyContent="center">
        <Typography
          variant="caption"
          className={clsx(classes.disableText, classes.smallText)}
        >
          {t('emptyFavDesc')}
        </Typography>
      </Box>
      <Box className={classes.mt2} display="flex" justifyContent="center">
        <Box className={classes.heartBG}>
          <HeartFilled />
        </Box>
      </Box>
      <Box className={classes.mt2} display="flex" justifyContent="center">
        <RouterLink to="/" style={{ textDecoration: "none" }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            disableElevation
            disableRipple
            disableFocusRipple
            disableTouchRipple
            className={classes.btnBase}
          >
            <Typography
              variant="caption"
              color="primary"
              className={clsx(classes.textBold, classes.smallText)}
            >
              {t('emptyFavBtn')}
            </Typography>
          </Button>
        </RouterLink>
      </Box>
    </Grid>
  );
}
function Favourites() {
  const { t } = useTranslation()
  const navigate = useNavigate();
  const firstTime = useRef(true);
  const classes = useStyles();
  const [mainError, setMainError] = useState({});
  const [clearModal, setClearModal] = useState(false);
  const { location } = useContext(LocationContext);
  const [navigateData, setNavigateData] = useState({});
  const { clearCart, restaurant: cartRestaurant } = useContext(UserContext);
  const { data, loading, error } = useQuery(RESTAURANTS, {
    variables: {
      longitude: location?.longitude ?? null,
      latitude: location?.latitude ?? null,
    },
    fetchPolicy: "network-only",
  });

  const navigateClearCart = useCallback(async () => {
    await clearCart();
    navigate(`/restaurant/${navigateData.slug}`, { state: navigateData });
  }, [navigateData]);
  const toggleClearCart = useCallback(() => {
    setClearModal((prev) => !prev);
  }, []);
  useEffect(async () => {
    await analytics.track(analytics.events.NAVIGATE_TO_FAVOURITES);
  }, []);
  useEffect(() => {
    if (!firstTime.current && error) {
      setMainError({
        type: "error",
        message: error,
      });
    }
    if (!firstTime.current) {
      firstTime.current = true;
    }
  }, [error]);

  const showMessage = useCallback((messageObj) => {
    setMainError(messageObj);
  }, []);

  const toggleSnackbar = useCallback(() => {
    setMainError({});
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

  if (loading) {
    return (
      <Grid container>
        <Header />
        <Subheader />
        <Box className={classes.spinnerContainer}>
          <CircularProgress color="primary" size={48} />
        </Box>
      </Grid>
    );
  }
  if (error) {
    return (
      <Grid container>
        <Header />
        <Subheader />
        <Box className={classes.spinnerContainer}>
          <Typography>Unable to fetch data</Typography>
        </Box>
      </Grid>
    );
  }

  const favouriteData = data?.userFavourite ?? [];

  return (
    <Grid container className={classes.root}>
      <FlashMessage
        open={Boolean(mainError.type)}
        severity={mainError.type}
        alertMessage={mainError.message}
        handleClose={toggleSnackbar}
      />
      <Header />
      <Subheader />
      <Box className={classes.topContainer}>
        <Box style={{ zIndex: 100 }}>
          <Typography variant="h5" align="center">
            {t('titleFavourite')}
          </Typography>
          <img src={Favourite} alt="fav" />
        </Box>
        <img src={FavouritesBg} alt="fav-bg" className={classes.bg} />
      </Box>
      <Grid container item className={classes.mainContainer}>
        <Grid item sm={1} />
        <Grid item xs={12} sm={10} className={classes.contentContainer}>
          <Grid container spacing={2} className={classes.PV3}>
            {favouriteData.length < 1 ? (
              <EmptyView />
            ) : (
              favouriteData.map((item) => (
                <Grid key={item._id} item xs={12} sm={6} md={4}>
                  <ProductCard
                    data={item}
                    grid={true}
                    showMessage={showMessage}
                    checkCart={checkCart}
                    cardImageHeight="144px"
                    isSmall={false}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
        <Grid item sm={1} />
      </Grid>
      <Box className={classes.footerContainer}>
        <Box className={classes.footerWrapper}>
          <Footer />
        </Box>
      </Box>
      <ClearCart
        isVisible={clearModal}
        toggleModal={toggleClearCart}
        action={navigateClearCart}
      />
    </Grid>
  );
}

export default Favourites;
