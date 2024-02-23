/* eslint-disable react-hooks/exhaustive-deps */

import { useQuery } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { orderStripe } from "../../apollo/server";
import MastercardIcon from "../../assets/icons/MastercardIcon";
import VisaIcon from "../../assets/icons/VisaIcon";
import FlashMessage from "../../components/FlashMessage";
import Footer from "../../components/Footer/Footer";
import { Header } from "../../components/Header";
import { PaymentOrderCard } from "../../components/Orders";
import ConfigurableValues from "../../config/constants";
import Analytics from "../../utils/analytics";
import useStyles from "./styles";

const ORDER_STRIPE = gql`
  ${orderStripe}
`;


function Stripe() {
  const { SERVER_URL } = ConfigurableValues();
  const classes = useStyles();
  const theme = useTheme();
  let query = new URLSearchParams(useLocation().search);
  const id = query.get("id") ?? null;
  const [loader] = useState(false);
  const [mainError] = useState({});
  const { data, loading, error } = useQuery(ORDER_STRIPE, {
    variables: {
      id: id,
    },
  });
  
  const redirectToStripeCheckout = () => {
    window.location.href = `${SERVER_URL}stripe/create-checkout-session?id=${order.orderId}&platform=web`;
  };

  useEffect(() => {
    const trackEvent = async () => {
      await Analytics.track(Analytics.events.NAVIGATE_TO_STRIPE);
    };
    trackEvent();
  }, []);

  if (error) {
    return (
      <Grid container className={classes.root}>
        <Header />
        <Grid
          container
          item
          className={classes.mainContainer}
          justifyContent="center"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flex={1}
            style={{ maxWidth: "auto", width: "100%", minHeight: "55vh" }}
          >
            <Typography variant="h5">{error.message}</Typography>
          </Box>
        </Grid>
      </Grid>
    );
  }

  const order = data && data.orderStripe;

  return (
    <Grid container className={classes.root}>
      <FlashMessage
        open={Boolean(mainError.type)}
        severity={mainError.type}
        alertMessage={mainError.message}
      />
      <Header />
      <Grid
        container
        item
        className={classes.mainContainer}
        justifyContent="center"
      >
        {loading || loader ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            className={classes.spinnerContainer}
          >
            <CircularProgress size={48} />
          </Box>
        ) : (
          <>
            {order && <PaymentOrderCard {...order} />}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flex={1}
              style={{
                maxWidth: "auto",
                width: "100%",
                marginTop: "50px",
              }}
            >
              <Box
                style={{
                  width: "100%",
                  height: "auto",
                  textAlign: "center",
                }}
              >
                <Button
                  className={classes.btn}
                  variant="contained"
                  color="primary"
                  onClick={redirectToStripeCheckout}
                >
                  <Box display="flex" alignItems="center">
                    <Typography
                      variant="h6"
                      color="textPrimary"
                      style={{ fontWeight: "bold" }}
                    >
                      {"Stripe"}
                    </Typography>
                  </Box>
                  <Box display="flex">
                    <VisaIcon width={50} height={40} />
                    <Box ml={theme.spacing(1)} />
                    <MastercardIcon width={50} height={40} />
                  </Box>
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Grid>
      <Footer />
    </Grid>
  );
}

export default React.memo(Stripe);
