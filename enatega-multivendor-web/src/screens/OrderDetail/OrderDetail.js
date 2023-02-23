/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { GoogleMap, Marker } from "@react-google-maps/api";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { Header } from "../../components/Header";
import {
  DetailCard,
  StatusCard,
  AmountCard,
  ModalView,
} from "../../components/Orders";
import UserContext from "../../context/User";
import Analytics from "../../utils/analytics";
import { ORDER_STATUS } from "../../utils/constantValues";
import Background from "./Background";
import useStyles from "./styles";
import { mapStyles } from "./mapStyles";
import Promotion from "../../components/Promotion/Promotion";
import { Chat } from "../../components/Chat";
import RestMarker from "../../assets/images/rest-map-2.png";
import DestMarker from "../../assets/images/dest-map-2.png";
import TrackingRider from "../../components/Orders/OrderDetail/TrackingRider";
import { useSubscription } from "@apollo/client";
import { subscriptionOrder } from "../../apollo/server";
import gql from "graphql-tag";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function OrderDetail() {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  let { id } = useParams();
  const navigate = useNavigate();
  let destCoordinates = null;
  let restCoordinates = {};
  const queryParams = useQuery();
  const [toggleChat, setToggleChat] = useState(false);

  useSubscription(
    gql`
      ${subscriptionOrder}
    `,
    { variables: { id } }
  );

  const onLoad = useCallback(
    (map) => {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(restCoordinates);
      bounds.extend(destCoordinates);
      map.fitBounds(bounds);
      map.panToBounds(bounds);
    },
    [restCoordinates, destCoordinates]
  );

  const { loadingOrders, errorOrders, orders, clearCart } =
    useContext(UserContext);

  useEffect(async () => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_ORDER_DETAIL, {
      orderId: id,
    });
  }, []);
  useEffect(() => {
    if (!id) {
      navigate("/orders");
    }
    if (queryParams.get("clearCart")) {
      clearCart();
    }
  }, [id]);

  if (errorOrders) {
    return (
      <Grid container className={classes.spinnerContainer}>
        <Header />
        <Typography>{errorOrders.message}</Typography>
      </Grid>
    );
  }
  const order = orders.find((o) => o._id === id);
  console.log("order detail", order);
  if (loadingOrders || !order) {
    return (
      <Grid container className={classes.spinnerContainer}>
        <Header />
        <CircularProgress color="primary" size={48} />
      </Grid>
    );
  }
  restCoordinates = {
    lat: parseFloat(order.restaurant.location.coordinates[1]),
    lng: parseFloat(order.restaurant.location.coordinates[0]),
  };
  if (!ORDER_STATUS.includes(order.orderStatus)) {
    restCoordinates = {
      lat: parseFloat(order.restaurant.location.coordinates[1]),
      lng: parseFloat(order.restaurant.location.coordinates[0]),
    };
    destCoordinates = {
      lat: parseFloat(order.deliveryAddress.location.coordinates[1]),
      lng: parseFloat(order.deliveryAddress.location.coordinates[0]),
    };
  }
  return (
    <>
      <Background>
        <Grid container>
          <Header />
          {loadingOrders || !order ? (
            <CircularProgress color="primary" size={48} />
          ) : errorOrders ? (
            <Typography>Unable to load data </Typography>
          ) : order?.orderStatus !== "CANCELLED" ? (
            <Grid container item>
              {!["CANCELLED", "DELIVERED"].includes(order.orderStatus) && (
                <Grid item xs={12} className={classes.topContainer}>
                  <GoogleMap
                    mapContainerStyle={{
                      height: small ? "450px" : "500px",
                      width: "100%",
                    }}
                    zoom={14}
                    center={restCoordinates}
                    onLoad={destCoordinates && onLoad}
                    options={{
                      styles: mapStyles,
                    }}
                  >
                    <Marker position={restCoordinates} icon={RestMarker} />
                    <Marker position={destCoordinates} icon={DestMarker} />
                    {order.rider && <TrackingRider id={order.rider._id} />}
                  </GoogleMap>

                  <Container
                    disableGutters
                    maxWidth={small ? "100%" : "md"}
                    className={classes.orderStatus}
                  >
                    <StatusCard {...order} />
                  </Container>
                </Grid>
              )}
              {order?.rider && (
                <Box
                  className={classes.chat}
                  onClick={() => {
                    setToggleChat(true);
                  }}
                >
                  <Typography
                    variant="body2"
                    color="common"
                    className={(classes.textBold, classes.smallText)}
                  >
                    Chat with rider
                  </Typography>
                </Box>
              )}

              {toggleChat && (
                <Chat setToggleChat={setToggleChat} id={order?._id} />
              )}

              <Grid container style={{ marginTop: theme.spacing(20) }}>
                <DetailCard {...order} />
              </Grid>
              <Grid
                container
                style={{
                  marginTop: theme.spacing(8),
                  marginBottom: theme.spacing(8),
                }}
              >
                <AmountCard {...order} />
              </Grid>
            </Grid>
          ) : (
            <ModalView />
          )}
        </Grid>
      </Background>
      <Promotion />
      <Footer />
    </>
  );
}

export default OrderDetail;
