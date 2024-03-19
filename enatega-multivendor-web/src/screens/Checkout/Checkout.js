/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { gql, useMutation } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Container,
  Dialog,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
  IconButton,
  Button,
} from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { myOrders, placeOrder } from "../../apollo/server";
import CodIcon from "../../assets/icons/CodIcon";
import RiderImage from "../../assets/images/rider.png";
import MarkerImage from "../../assets/images/marker.png";
import {
  CartItemCard,
  DeliveryCard,
  PaymentCard,
  PersonalCard,
  OrderOption,
} from "../../components/Checkout";
import CloseIcon from "@mui/icons-material/Close";

import FlashMessage from "../../components/FlashMessage";
import Footer from "../../components/Footer/Footer";
import { Header } from "../../components/Header";
import { RestaurantClose } from "../../components/Modals";
import ConfigurationContext from "../../context/Configuration";
import { useLocationContext } from "../../context/Location";
import UserContext from "../../context/User";
import { useRestaurant } from "../../hooks";
import { DAYS } from "../../utils/constantValues";
import { paypalCurrencies, stripeCurrencies } from "../../utils/currencies";
import { calculateDistance } from "../../utils/customFunction";
import useStyle from "./styles";

import Analytics from "../../utils/analytics";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { mapStyles } from "../OrderDetail/mapStyles";
import RestMarker from "../../assets/images/rest-map-2.png";
import NearMeIcon from "@mui/icons-material/NearMe";
import clsx from "clsx";

import { useLocation } from "../../hooks";
import { useTranslation } from "react-i18next";

import moment from "moment";

const PLACEORDER = gql`
  ${placeOrder}
`;
const ORDERS = gql`
  ${myOrders}
`;

const PAYMENT = {
  id: 2,
  payment: "COD",
  label: "Cash",
  icon: <CodIcon />,
};

function Checkout() {
  const { t } = useTranslation();
  const classes = useStyle();
  const navigate = useNavigate();
  const [isClose, setIsClose] = useState(false);
  const [mainError, setMainError] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const configuration = useContext(ConfigurationContext);
  const [addressModal, setAddressModal] = useState(false);
  const [orderOptionModal, setOrderOptionModal] = useState(false);
  const fetchRef = useRef(false);

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const {
    profile,
    clearCart,
    restaurant: cartRestaurant,
    cart,
    cartCount,
    addQuantity,
    removeQuantity,
  } = useContext(UserContext);

  const { location, setLocation } = useLocationContext();
  // const { getCurrentLocation } = useLocation();
  const theme = useTheme();
  const [minimumOrder, setMinimumOrder] = useState("");
  const [selectedTip, setSelectedTip] = useState();
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT);
  const [taxValue, setTaxValue] = useState();

  const [coupon, setCoupon] = useState({});
  const [selectedDate, handleDateChange] = useState(new Date());
  const [isPickUp, setIsPickUp] = useState(false);
  const [deliveryCharges, setDeliveryCharges] = useState(0);

  let restCoordinates = {};
  const { loading, data, error } = useRestaurant(cartRestaurant);
  const extraSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [mutateOrder, { loading: loadingOrderMutation }] = useMutation(
    PLACEORDER,
    {
      onCompleted,
      onError,
      update,
    }
  );
  useEffect(() => {
    if (!location) {
      let localStorageLocation = localStorage.getItem("location");
      localStorageLocation = JSON.parse(localStorageLocation);
      if (localStorageLocation) {
        setLocation(localStorageLocation);
      }
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (data && !!data.restaurant) {
        const latOrigin = Number(data.restaurant.location.coordinates[1]);
        const lonOrigin = Number(data.restaurant.location.coordinates[0]);
        const latDest = Number(location.latitude);
        const longDest = Number(location.longitude);
        const distance = await calculateDistance(
          latOrigin,
          lonOrigin,
          latDest,
          longDest
        );
        const amount = Math.ceil(distance) * configuration.deliveryRate;
        setDeliveryCharges(amount > 0 ? amount : configuration.deliveryRate);
      }
    })();
  }, [data, location]);

  const onLoad = useCallback(
    (map) => {
      const bounds = new window.google.maps.LatLngBounds();
      map.panToBounds(bounds);
    },
    [restCoordinates]
  );

  const isOpen = () => {
    const date = new Date();
    const day = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const todaysTimings = data.restaurant.openingTimes.find(
      (o) => o.day === DAYS[day]
    );
    const times = todaysTimings.times.filter(
      (t) =>
        hours >= Number(t.startTime[0]) &&
        minutes >= Number(t.startTime[1]) &&
        hours <= Number(t.endTime[0]) &&
        minutes <= Number(t.endTime[1])
    );

    return times.length > 0;
  };
  const toggleAdressModal = useCallback(() => {
    setAddressModal((prev) => !prev);
  }, []);

  useEffect(() => {
    if (cart && cartCount > 0) {
      if (
        data &&
        data.restaurant &&
        (!data.restaurant.isAvailable || !isOpen())
      ) {
        setIsClose((prev) => {
          if (!prev) return true;
          else return prev;
        });
      }
    }
  }, [data]);

  const setDeliveryAddress = (item) => {
    setSelectedAddress(item);
    setLocation({
      _id: item?._id,
      label: item?.label,
      latitude: Number(item?.location.coordinates[1]),
      longitude: Number(item?.location.coordinates[0]),
      deliveryAddress: item?.deliveryAddress,
      details: item?.details,
    });
  };

  const toggleCloseModal = useCallback(() => {
    setIsClose((prev) => !prev);
  }, []);

  const restaurantData = data?.restaurant ?? null;

  const showMessage = useCallback((messageObj) => {
    setMainError(messageObj);
  }, []);

  const toggleSnackbar = useCallback(() => {
    setMainError({});
  }, []);

  if (loading || loadingData) {
    return (
      <Grid container>
        <Header />
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
        <Box className={classes.spinnerContainer}>
          <Typography>Unable to fetch data</Typography>
        </Box>
      </Grid>
    );
  }
  restCoordinates = {
    lat: parseFloat(data.restaurant.location.coordinates[1]),
    lng: parseFloat(data.restaurant.location.coordinates[0]),
  };

  function update(cache, { data: { placeOrder } }) {
    console.log("update");
    if (placeOrder && placeOrder.paymentMethod === "COD") {
      const data = cache.readQuery({ query: ORDERS });
      if (data) {
        cache.writeQuery({
          query: ORDERS,
          data: { orders: [placeOrder, ...data.orders] },
        });
      }
    }
  }

  function onError(error) {
    console.log("Check-out Error", error);
    showMessage({
      type: "error",
      message: error.message,
    });
  }

  function calculateTip() {
    if (selectedTip) {
      let total = 0;
      const delivery = isPickUp ? 0 : deliveryCharges;
      total += +calculatePrice(delivery, true);
      total += +taxCalculation();
      const tipPercentage = (
        (total / 100) *
        parseFloat(selectedTip).toFixed(2)
      ).toFixed(2);
      return tipPercentage;
    } else {
      return 0;
    }
  }

  function taxCalculation() {
    const tax = taxValue ?? 0;
    if (tax === 0) {
      return tax.toFixed(2);
    }
    const delivery = isPickUp ? 0 : deliveryCharges;
    const amount = +calculatePrice(delivery, true);
    const taxAmount = ((amount / 100) * tax).toFixed(2);
    return taxAmount;
  }
  async function onCompleted(data) {
    await Analytics.track(Analytics.events.ORDER_PLACED, {
      userId: data.placeOrder.user._id,
      name: data.placeOrder.user.name,
      email: data.placeOrder.user.email,
      phoneNumber: data.placeOrder.user.phone,
      orderId: data.placeOrder.orderId,
      restaurantName: data.placeOrder.restaurant.name,
      restaurantAddress: data.placeOrder.restaurant.address,
      orderItems: data.placeOrder.items,
      orderPaymentMethod: data.placeOrder.paymentMethod,
      orderAmount: data.placeOrder.orderAmount,
      orderPaidAmount: data.placeOrder.paidAmount,
      tipping: data.placeOrder.tipping,
      orderStatus: data.placeOrder.orderStatus,
      orderDate: data.placeOrder.orderDate,
    });
    if (paymentMethod.payment === "COD") {
      await clearCart();
      navigate(`/order-detail/${data.placeOrder._id}`, { replace: true });
    } else if (paymentMethod.payment === "PAYPAL") {
      navigate(`/paypal?id=${data.placeOrder._id}`, { replace: true });
    } else if (paymentMethod.payment === "STRIPE") {
      navigate(`/stripe?id=${data.placeOrder._id}`, { replace: true });
    }
  }

  function calculatePrice(delivery = 0, withDiscount) {
    let itemTotal = 0;
    cart.forEach((cartItem) => {
      itemTotal += cartItem.price * cartItem.quantity;
    });
    if (withDiscount && coupon && coupon.discount) {
      itemTotal = itemTotal - (coupon.discount / 100) * itemTotal;
    }
    const deliveryAmount = delivery > 0 ? deliveryCharges : 0;
    return (itemTotal + deliveryAmount).toFixed(2);
  }

  function calculateTotal() {
    let total = 0;
    const delivery = isPickUp ? 0 : deliveryCharges;
    total += +calculatePrice(delivery, true);
    total += +taxCalculation();
    total += +calculateTip();
    return parseFloat(total).toFixed(2);
  }

  function transformOrder(cartData) {
    return cartData.map((food) => {
      return {
        food: food._id,
        quantity: food.quantity,
        variation: food.variation._id,
        addons: food.addons
          ? food.addons.map(({ _id, options }) => ({
              _id,
              options: options.map(({ _id }) => _id),
            }))
          : [],
        specialInstructions: food.specialInstructions,
      };
    });
  }

  function checkPaymentMethod(currency) {
    if (paymentMethod.payment === "STRIPE") {
      return stripeCurrencies.find((val) => val.currency === currency);
    }
    if (paymentMethod.payment === "PAYPAL") {
      return paypalCurrencies.find((val) => val.currency === currency);
    }
    return true;
  }

  async function onPayment() {
    if (checkPaymentMethod(configuration.currency)) {
      const items = transformOrder(cart);
      mutateOrder({
        variables: {
          restaurant: cartRestaurant,
          orderInput: items,
          paymentMethod: paymentMethod.payment,
          couponCode: coupon ? coupon.title : null,
          tipping: +calculateTip(),
          taxationAmount: +taxCalculation(),
          address: {
            label: location.label,
            deliveryAddress: location.deliveryAddress,
            details: location.details,
            longitude: "" + location.longitude,
            latitude: "" + location.latitude,
          },
          orderDate: selectedDate,
          isPickedUp: isPickUp,
          deliveryCharges: isPickUp ? 0 : deliveryCharges,
        },
      });
    } else {
      showMessage({
        type: "warning",
        message: "Payment not supported",
      });
    }
  }

  const locationCallback = (error, data) => {
    setLoadingLocation(false); // Stop loading
    if (error) {
      console.error(error);
      return;
    }

    // Create an object for the selected address using the current location data
    const selectedAddress = {
      label: "Your Location",
      deliveryAddress: data.label,
      details: data.details,
      latitude: data.coords.latitude,
      longitude: data.coords.longitude,
    };

    // Update the selected address in state
    setSelectedAddress(selectedAddress);
    setAddressModal((prev) => !prev);
  };

  const getCurrentLocation = () => {
    setLoadingLocation(true); // Start loading (optional)

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locationCallback(null, position);
        },
        (error) => {
          locationCallback(error, null);
        }
      );
    } else {
      // Geolocation is not supported by the browser
      locationCallback(new Error("Geolocation is not supported."), null);
    }
  };

  function validateOrder() {
    if (!data.restaurant.isAvailable || !isOpen()) {
      toggleCloseModal();
      return;
    }
    if (!cart.length) {
      showMessage({
        type: "error",
        message: "Cart is Empty.",
      });
      return false;
    }
    const delivery = isPickUp ? 0 : deliveryCharges;
    if (calculatePrice(delivery, true) < minimumOrder) {
      showMessage({
        type: "warning",
        message: `The minimum amount of (${configuration.currencySymbol} ${minimumOrder}) for your order has not been reached.`,
      });
      return false;
    }
    if (!location) {
      showMessage({
        alive: true,
        type: "Warning",
        message: "Select your address.",
      });
      return false;
    }
    if (!paymentMethod) {
      showMessage({
        type: "warning",
        message: "Set payment method before checkout",
      });
      return false;
    }
    if (profile.phone.length < 1) {
      showMessage({
        alive: true,
        type: "Error",
        message: t("phoneNumMissing"),
      });

      setTimeout(() => {
        navigate("/phone-number");
      }, 1000);

      return false;
    }
    if (!profile.phoneIsVerified) {
      showMessage({
        alive: true,
        type: "Error",
        message: "Phone Number is not verified",
      });

      setTimeout(() => {
        navigate("/phone-number");
      }, 1000);

      return false;
    }
    return true;
  }
  // console.log("isPickUp", isPickUp, selectedDate);
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
        <Grid container item>
          <Grid item xs={12} className={classes.topContainer}>
            <GoogleMap
              mapContainerStyle={{
                height: "450px",
                width: "100%",
              }}
              zoom={14}
              center={restCoordinates}
              onLoad={restCoordinates && onLoad}
              options={{
                styles: mapStyles,
                zoomControl: true,
                zoomControlOptions: {
                  position: window.google.maps.ControlPosition.RIGHT_CENTER,
                },
              }}
            >
              {location && (
                <Marker
                  position={{
                    lat: location?.latitude,
                    lng: location?.longitude,
                  }}
                  icon={MarkerImage}
                />
              )}
              <Marker position={restCoordinates} icon={RestMarker} />
            </GoogleMap>
          </Grid>
        </Grid>
        <Container maxWidth="md" className={classes.containerCard}>
          <Box
            className={classes.headerBar}
            display="flex"
            alignItems={"center"}
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              <img src={RiderImage} alt="rider" />
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              flexDirection="column"
              style={{
                marginLeft: "20px",
              }}
            >
              <Typography
                style={{
                  ...theme.typography.body1,
                  color: theme.palette.common.black,
                  fontSize: "1.275rem",
                  fontWeight: 600,
                }}
              >
                {t("deliveryTime")}
              </Typography>
              <Typography
                style={{
                  ...theme.typography.body1,
                  color: theme.palette.grey[600],
                  fontSize: "0.775rem",
                  fontWeight: 600,
                }}
              >
                {moment().format("DD-MM-YYYY")} | {moment().format("LT")}
              </Typography>
              <Box display="flex" mt={2} alignItems="center">
                <Typography
                  style={{
                    ...theme.typography.body1,
                    color: theme.palette.common.white,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  {isPickUp ? t("pickUp") : t("delivery")}
                </Typography>
                <Button
                  variant="contained"
                  style={{
                    marginLeft: theme.spacing(1),
                    backgroundColor: "black",
                    borderRadius: theme.spacing(1.5),
                  }}
                  onClick={() => setOrderOptionModal((prev) => !prev)}
                >
                  <Typography
                    style={{
                      color: theme.palette.common.white,
                      fontSize: "0.775rem",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {t("change")}
                  </Typography>
                </Button>
                <OrderOption
                  selectedDate={selectedDate}
                  handleDateChange={handleDateChange}
                  setIsPickUp={setIsPickUp}
                  orderOptionModal={orderOptionModal}
                  setOrderOptionModal={setOrderOptionModal}
                  isPickUp={isPickUp}
                />
              </Box>
            </Box>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2, mb: 25 }}>
            <Grid item xs={12} sm={6}>
              <CartItemCard
                setSelectedTip={setSelectedTip}
                selectedTip={selectedTip}
                setTaxValue={setTaxValue}
                setCoupon={setCoupon}
                restaurantData={restaurantData}
                setFlashMessage={showMessage}
                calculateTotal={calculateTotal}
                calculatePrice={calculatePrice}
                taxCalculation={taxCalculation}
                calculateTip={calculateTip}
                isPickUp={isPickUp}
                deliveryCharges={deliveryCharges}
                addQuantity={addQuantity}
                removeQuantity={removeQuantity}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {!isPickUp && (
                <Dialog
                  fullScreen={extraSmall}
                  onClose={toggleAdressModal}
                  open={addressModal}
                  maxWidth="md"
                  PaperProps={{
                    style: {
                      borderRadius: 30,
                      overflowY: "scroll",
                      height: extraSmall ? 500 : null,
                    },
                  }}
                >
                  <>
                    <Box display="flex" justifyContent="flex-end">
                      <IconButton
                        size={extraSmall ? "medium" : "small"}
                        onClick={toggleAdressModal}
                        className={classes.closeContainer}
                      >
                        <CloseIcon color="primary" />
                      </IconButton>
                    </Box>
                    <Box style={{ width: "90%", margin: `16px auto` }}>
                      <Box display="flex">
                        <Typography
                          style={{ color: theme.palette.primary.main }}
                          variant="caption"
                          fontWeight={800}
                        >
                          {t("deliverTo")}:
                        </Typography>
                        <Typography
                          style={{
                            color: theme.palette.common.black,
                            marginLeft: 10,
                          }}
                          variant="caption"
                          fontWeight={800}
                        >
                          {location?.label}
                        </Typography>
                      </Box>
                      <Typography
                        style={{ color: theme.palette.grey[600] }}
                        variant="caption"
                        fontWeight={600}
                      >
                        {location?.deliveryAddress}
                      </Typography>
                    </Box>

                    <Grid
                      //container
                      item
                      xs={12}
                      justifyContent="center"
                      style={{
                        background: theme.palette.common.white,
                        padding: theme.spacing(2, 0),
                        marginLeft: "20px",
                      }}
                    >
                      <Paper
                        className={classes.deliveryPaperProfile}
                        style={{ width: "90%" }}
                      >
                        <Box
                          className={clsx(
                            classes.PH1,
                            classes.PB2,
                            classes.PT2
                          )}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          onClick={(e) => {
                            e.preventDefault();
                            console.log("clicked");
                            getCurrentLocation();
                          }}
                        >
                          <Box display="flex" alignItems="center">
                            <NearMeIcon
                              width={100}
                              height={100}
                              style={{ color: theme.palette.common.black }}
                            />
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                              align="left"
                              className={clsx(classes.smallText, classes.PH1)}
                              fontWeight={600}
                            >
                              {t("currentLocation")}
                            </Typography>
                          </Box>
                          {loadingLocation && (
                            <CircularProgress color={"warning"} />
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                    <Divider
                      orientation="horizontal"
                      className={classes.divider}
                    />
                    <DeliveryCard
                      selectedAddress={selectedAddress}
                      setSelectedAddress={setDeliveryAddress}
                      isProfile={true}
                      isCheckout={true}
                      close={toggleAdressModal}
                    />
                  </>
                </Dialog>
              )}

              <PersonalCard
                toggleModal={toggleAdressModal}
                location={location}
              />
              <PaymentCard
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                validateOrder={validateOrder}
                onPayment={onPayment}
                loading={loadingOrderMutation}
                calculateTotal={calculateTotal}
              />
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Box className={classes.footerContainer}>
        <Box className={classes.footerWrapper}>
          <Footer />
        </Box>
      </Box>
      <RestaurantClose
        closeMenu={false}
        isVisible={isClose}
        toggleModal={toggleCloseModal}
        restaurant={restaurantData.name}
      />
    </Grid>
  );
}

export default Checkout;
