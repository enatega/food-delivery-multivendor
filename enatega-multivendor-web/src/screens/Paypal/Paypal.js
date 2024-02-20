/* eslint-disable react-hooks/exhaustive-deps */
import { useApolloClient, useQuery } from "@apollo/client";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import gql from "graphql-tag";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { useLocation, useNavigate } from "react-router";
import { myOrders, orderPaypal } from "../../apollo/server";
import FlashMessage from "../../components/FlashMessage";
import Footer from "../../components/Footer/Footer";
import { Header } from "../../components/Header";
import { PaymentOrderCard } from "../../components/Orders";
import ConfigurableValues from "../../config/constants";
import UserContext from "../../context/User";
import useStyles from "./styles";
import Analytics from "../../utils/analytics";
const ORDER_PAYPAL = gql`
  ${orderPaypal}
`;

const ORDERS = gql`
  ${myOrders}
`;

function Paypal() {
  const { SERVER_URL, PAYPAL_KEY } = ConfigurableValues();
  const classes = useStyles();
  const navigate = useNavigate();
  const client = useApolloClient();
  let query = new URLSearchParams(useLocation().search);
  const id = query.get("id") ?? null;
  const [loader, setLoader] = useState(false);
  const [mainError, setMainError] = useState({});
  const { clearCart } = useContext(UserContext);
  const { data, loading, error } = useQuery(ORDER_PAYPAL, {
    variables: {
      id: id,
    },
  });
  const showMessage = useCallback((messageObj) => {
    setMainError(messageObj);
  }, []);
  useEffect(async () => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_PAYPAL);
  }, []);
  const toggleSnackbar = useCallback(() => {
    setMainError({});
  }, []);
  async function handleResponse() {
    await clearCart();
    const result = await client.query({
      query: ORDERS,
      fetchPolicy: "network-only",
    });
    const order = result.data.orders.find(
      (item) => item.orderId === data.orderPaypal.orderId
    );
    setLoader(false);
    navigate(`/order-detail/${order._id}`, { replace: true });
  }

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

  const order = data?.orderPaypal ?? undefined;

  return (
    <Grid container className={classes.root}>
      <FlashMessage
        open={Boolean(mainError.type)}
        severity={mainError.type}
        alertMessage={mainError.message}
        handleClose={toggleSnackbar}
        alive={mainError.alive || false}
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
                  width: "50%",
                  height: "auto",
                  textAlign: "center",
                  alignSelf: "center",
                }}
              >
                <PayPalButton
                  style={{ width: "100%", color: "blue" }}
                  amount={order?.orderAmount}
                  options={{
                    clientId: PAYPAL_KEY,
                    disableFunding: "credit,card",
                  }}
                  onSuccess={async (details, data) => {
                    setLoader(true);
                    return await fetch(
                      `${SERVER_URL}paypal/paypal-transaction-complete?id=${
                        order?.orderId
                      }&paymentDetails=${JSON.stringify(details)}`,
                      {
                        method: "GET",
                      }
                    )
                      .then((response) => response.json())
                      .then((result) => {
                        if (!result.error) {
                          handleResponse();
                        } else {
                          setLoader(false);
                          showMessage({
                            type: "error",
                            message: result.message,
                            alive: true,
                          });
                        }
                      });
                  }}
                />
              </Box>
            </Box>
          </>
        )}
      </Grid>
      <Footer />
    </Grid>
  );
}

export default React.memo(Paypal);
