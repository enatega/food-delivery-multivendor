/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Container,
  Grid,
  LinearProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import clsx from "clsx";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import FlashMessage from "../../components/FlashMessage";
import Footer from "../../components/Footer/Footer";
import { Header } from "../../components/Header";
import { ActiveOrderCard, PastOrderCard } from "../../components/Orders";
import OrderTabs from "../../components/Orders/Tabs/Tabs";
import UserContext from "../../context/User";
import Analytics from "../../utils/analytics";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "../../utils/constantValues";
import useStyles from "./styles";
import FavouritesBg from "../../assets/images/fav-bg.png";

function MyOrders() {
  const firstTime = useRef(true);
  const theme = useTheme();
  const extraSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  const [error, setError] = useState({});
  const [tab, setTab] = useState(0);

  const { orders, loadingOrders, errorOrders, fetchOrders } =
    useContext(UserContext);
  const activeOrders = orders.filter((o) =>
    ACTIVE_STATUS.includes(o.orderStatus)
  );
  const pastOrders = orders.filter((o) =>
    INACTIVE_STATUS.includes(o.orderStatus)
  );
  useEffect(async () => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_ORDER);
  }, []);
  useEffect(() => {
    if (!firstTime.current && (errorOrders || fetchOrders) && !loadingOrders) {
      setError({
        type: "error",
        message: errorOrders || fetchOrders,
      });
    }
    if (!firstTime.current) {
      firstTime.current = true;
    }
  }, [errorOrders, fetchOrders, loadingOrders]);

  const toggleSnackbar = useCallback(() => {
    setError({});
  }, []);

  if (loadingOrders) {
    return (
      <Grid container className={classes.root}>
        <Header />
        <div
          style={{ width: "100%" }}
          className={clsx(classes.loadingContainer, classes.center)}
        >
          <LinearProgress size={extraSmall ? 48 : undefined} color="primary" />
        </div>
      </Grid>
    );
  }

  return (
    <Grid container className={classes.root}>
      <FlashMessage
        open={Boolean(error.type)}
        severity={error.type}
        alertMessage={error.message}
        handleClose={toggleSnackbar}
      />
      <Header />
      <Box className={classes.topContainer}>
        <img src={FavouritesBg} alt="fav-bg" className={classes.bg} />
      </Box>
      <Container className={classes.mainContainer} maxWidth="md">
        <OrderTabs tab={tab} setTab={setTab} />
        {tab === 0 ? (
          <Grid container className={classes.center}>
            <Grid container item justifyContent="center">
              <Grid item xs={12} sm={10} className={classes.contentContainer}>
                {activeOrders.length > 0 ? (
                  activeOrders.map((item) => (
                    <ActiveOrderCard key={item._id} {...item} />
                  ))
                ) : (
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    align="center"
                  >
                    You have no active orders.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid container className={classes.center}>
            <Grid container item justifyContent="center">
              <Grid item xs={12} sm={10} className={classes.contentContainer}>
                {pastOrders.length > 0 ? (
                  pastOrders.map((item) => (
                    <PastOrderCard key={item._id} item={item} />
                  ))
                ) : (
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    align="center"
                  >
                    You have no past orders.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Container>
      <Box className={classes.footerContainer}>
        <Box className={classes.footerWrapper}>
          <Footer />
        </Box>
      </Box>
    </Grid>
  );
}

export default MyOrders;
