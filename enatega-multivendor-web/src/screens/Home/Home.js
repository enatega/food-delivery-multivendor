/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Box, } from "@mui/material";
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
import NewFooter from "../../components/Footer/newFooter/NewFooter";
import Info from "../../components/HomeScreen/InfoComponent/Info";
import JoinPlatform from "../../components/HomeScreen/JoinPlatform/JoinPlatform";
import CardComponent from "../../components/HomeScreen/CardComponent/CardComponent";
import PlatformFeatures from "../../components/HomeScreen/PlatFormFeatures/PlatformFeatures";
import AppsInfo from "../../components/HomeScreen/AppsInfo/AppsInfo";
import OrderFavorites from "../../components/HomeScreen/OrderFavorites/OrderFavorites";
import Faq from "../../components/HomeScreen/Faqs/Faq";

function Home() {
  const classes = useStyles();

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

        <Info />
        <JoinPlatform />
        <CardComponent />
        <PlatformFeatures />
        <AppsInfo />
        <OrderFavorites />
        <Faq />

        <NewFooter></NewFooter>
      </Box>
    </Sentry.ErrorBoundary>
  );
}
export default Home;
