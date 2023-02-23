/* eslint-disable react-hooks/exhaustive-deps */
import { useApolloClient, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import gql from "graphql-tag";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import StripeCheckout from "react-stripe-checkout";
import { myOrders, orderStripe } from "../../apollo/server";
import MastercardIcon from "../../assets/icons/MastercardIcon";
import VisaIcon from "../../assets/icons/VisaIcon";
import FlashMessage from "../../components/FlashMessage";
import Footer from "../../components/Footer/Footer";
import { Header } from "../../components/Header";
import { PaymentOrderCard } from "../../components/Orders";
import { SERVER_URL, STRIPE_PUBLIC_KEY } from "../../config/constants";
import UserContext from "../../context/User";
import Analytics from "../../utils/analytics";
import useStyles from "./styles";

const ORDER_STRIPE = gql`
  ${orderStripe}
`;

const ORDERS = gql`
  ${myOrders}
`;

function Stripe() {
  const classes = useStyles();
  const theme = useTheme();
  const client = useApolloClient();
  const navigate = useNavigate();
  let query = new URLSearchParams(useLocation().search);
  const id = query.get("id") ?? null;
  const [loader, setLoader] = useState(false);
  const [mainError, setMainError] = useState({});
  const { clearCart } = useContext(UserContext);
  const { data, loading, error } = useQuery(ORDER_STRIPE, {
    variables: {
      id: id,
    },
  });

  const showMessage = useCallback((messageObj) => {
    setMainError(messageObj);
  }, []);

  const toggleSnackbar = useCallback(() => {
    setMainError({});
  }, []);
  useEffect(async () => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_STRIPE);
  }, []);
  async function handleResponse() {
    await clearCart();
    const result = await client.query({
      query: ORDERS,
      fetchPolicy: "network-only",
    });
    const order = result.data.orders.find(
      (item) => item.orderId === data.orderStripe.orderId
    );
    setLoader(false);
    navigate(`/order-detail/${order._id}`, { replace: true });
  }

  const onToken = (token) => {
    setLoader(true);
    fetch(`${SERVER_URL}stripe/charge?id=${order.orderId}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.redirect === "stripe/success") {
          handleResponse();
        } else {
          showMessage({
            type: "error",
            message: "Stripe card error",
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        showMessage({
          type: "error",
          message: error.message,
        });
      });
  };

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
  const order = data?.orderStripe ?? undefined;

  return (
    <Grid container className={classes.root}>
      <FlashMessage
        open={Boolean(mainError.type)}
        severity={mainError.type}
        alertMessage={mainError.message}
        handleClose={toggleSnackbar}
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
                <StripeCheckout
                  label={`Pay Now $${order?.orderAmount} `}
                  name="Enatega"
                  description={`Your total is $${order?.orderAmount}`}
                  amount={order?.orderAmount * 100}
                  panelLabel="Pay Now"
                  token={onToken}
                  stripeKey={STRIPE_PUBLIC_KEY}
                >
                  <Button
                    className={classes.btn}
                    variant="contained"
                    color="primary"
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
                </StripeCheckout>
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
