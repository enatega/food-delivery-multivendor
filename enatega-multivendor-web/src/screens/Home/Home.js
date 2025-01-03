/* eslint-disable react-hooks/exhaustive-deps */
import {
  Grid,
  Container,
  Box,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import FlashMessage from "../../components/FlashMessage";
import { LoginHeader } from "../../components/Header";
import Header from "../../components/Header/Header";
import { SearchContainer } from "../../components/HomeScreen";
import UserContext from "../../context/User";
import { useLocation } from "../../hooks";
import Analytics from "../../utils/analytics";
import useStyles from "./styles";
import * as Sentry from "@sentry/react";
import CategoryCards from "../../components/HomeScreen/CategoryCards";
import WebApp from "../../assets/images/webapp.png";
import CustApp from "../../assets/images/cust-app.png";
import RiderApp from "../../assets/images/rider-app.png";
import RestaurantApp from "../../assets/images/restaurant-app.png";
import Dashboard from "../../assets/images/dashboard.png";
import Footer from "../../components/Footer/Footer";
import Fruits2 from "../../assets/images/fruits-2.png";
import AppComponent from "../../components/HomeScreen/AppComponent";
import Banner2 from "../../assets/images/banner-2.png";
import Banner1 from "../../assets/images/banner-1.png";
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation()
  const classes = useStyles();
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("md"));
  const medium = useMediaQuery(theme.breakpoints.down("lg"));

  const { error, loading } = useLocation();
  const [open, setOpen] = useState(!!error);
  const { isLoggedIn } = useContext(UserContext);
  let check = false;

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  useEffect(async () => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_HOME);
  }, []);
  useEffect(() => {
    if (check) {
      setOpen(!!error);
    } else {
      check = true;
    }
  }, [error]);

  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <Box className={classes.root}>
        <FlashMessage
          severity={loading ? "info" : "error"}
          alertMessage={error}
          open={open}
          handleClose={handleClose}
        />
        {isLoggedIn ? <Header /> : <LoginHeader showIcon />}
        {/* serch container (1st) */}
        <Box>
          <Grid container item>
            <SearchContainer loading={loading} isHome={true} />
          </Grid>
        </Box>
        {/* app container (2nd) */}
        <Box className={classes.appContainer}>
          <Box
            className={classes.appWrapper}
            style={{
              paddingTop: medium ? "8rem" : 0,
              zIndex: 10,
            }}
          >
            <img src={Fruits2} alt="fruits2" className={classes.upperFruits} />
            {!medium && (
              <Box
                className={classes.bannerContainer}
                display={"flex"}
                alignItems={"flex-start"}
              >
                <img
                  src={Banner2}
                  alt="banner2"
                  className={classes.bannerOne}
                />
                <img
                  src={Banner1}
                  alt="banner1"
                  className={classes.bannerTwo}
                />
              </Box>
            )}

            <AppComponent />
          </Box>
        </Box>
        {/* card container (3rd) */}
        <Box className={classes.cardContainer}>
          <Box className={classes.cardWrapper}>
            <Typography
              className={small ? classes.bgTextSmall : classes.bgText}
              style={{ top: "3%", right: "8%" }}
            >
              {t('FEATURES')}
            </Typography>
            <Container className={classes.topBottomMargin}>
              <Grid container justify="flex-end" spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box
                    display="flex"
                    justifyContent={small ? "flex-end" : "flex-start"}
                  >
                    <CategoryCards
                      title={"Rider App"}
                      image={RiderApp}
                      description={[
                        "• "+t('findingAddress'),
                        "• "+t('zonesFunctionality'),
                      ]}
                      android={
                        "https://play.google.com/store/apps/details?id=com.rami.multirider"
                      }
                      ios={
                        "https://apps.apple.com/ca/app/rami-rider/id6470451144"
                      }
                      isMobile={true}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box mt={small ? 15 : 0} />
                  <Box
                    display="flex"
                    justifyContent={small ? "flex-start" : "flex-end"}
                  >
                    <CategoryCards
                      title={"Restaurant App"}
                      image={RestaurantApp}
                      description={[
                        "• "+t('multipleRestaurants'),
                        "• "+t('realTimeOrder'),
                      ]}
                      android={
                        "https://play.google.com/store/apps/details?id=multivendor.rami.restaurant"
                      }
                      ios={
                        "https://apps.apple.com/ca/app/yalla-store/id6470450987"
                      }
                      isMobile={true}
                    />
                  </Box>
                </Grid>
                <Box mt={5} />
                <Grid item xs={12}>
                  <Box mt={small ? 15 : 0} />
                  <Box
                    display="flex"
                    justifyContent={small ? "flex-end" : "center"}
                  >
                    <CategoryCards
                      title={"Customer App"}
                      image={CustApp}
                      description={[
                        "• "+t('differentSections'),
                        "• "+t('previousOrder'),
                      ]}
                      android={
                        "https://play.google.com/store/apps/details?id=com.rami.multivendor"
                      }
                      ios={
                        "https://apps.apple.com/ca/app/yalla-customer/id6470450667"
                      }
                      isMobile={true}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box mt={small ? 15 : 0} />

                  <CategoryCards
                    title={"Admin Dashboard"}
                    image={Dashboard}
                    description={[
                      "• "+t('findingAddress'),
                      "• "+t('zonesFunctionality'),
                    ]}
                    web={true}
                    link={"https://yalla-admin.netlify.app"}
                    isMobile={false}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box mt={small ? 15 : 0} />
                  <Box display="flex" justifyContent="flex-end">
                    <CategoryCards
                      title={"Product Page"}
                      image={WebApp}
                      description={[
                        "• "+t('ourDelivery'),
                        "• "+t('builtOnCommunity'),
                      ]}
                      web={true}
                      link={"https://yalla-delivery.com/"}
                      isMobile={false}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Box>

        <Box className={classes.footerContainer}>
          <Box className={classes.footerWrapper}>
            <Footer />
          </Box>
        </Box>
      </Box>
    </Sentry.ErrorBoundary>
  );
}
export default Home;
