/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import React, { useContext, useMemo, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import ConfigurationContext from "../../../context/Configuration";
import UserContext from "../../../context/User";
import useStyles from "./styles";
import { calculateDistance } from '../../../utils/customFunction'

function PricingView(props) {
  const classes = useStyles();
  const theme = useTheme();
  const configuration = useContext(ConfigurationContext);
  const { cart } = useContext(UserContext);
  const { restaurantData } = props

  const [deliveryCharges, setDeliveryCharges] = useState(0)

  useEffect(() => {
    (async () => {
      const destinationObj = JSON.parse(localStorage.getItem('location'))
      const latOrigin = Number(restaurantData.location.coordinates[1])
      const lonOrigin = Number(restaurantData.location.coordinates[0])
      const latDest = Number(destinationObj.latitude)
      const longDest = Number(destinationObj.longitude)
      const distance = await calculateDistance(latOrigin, lonOrigin, latDest, longDest);
      const amount = Math.ceil(distance) * configuration.deliveryRate
      setDeliveryCharges(amount > 0 ? amount : configuration.deliveryRate);
    })()
  }, [restaurantData])
  const calculatePrice = useMemo(
    () => (amount = 0) => {
      let itemTotal = 0;
      cart.forEach((cartItem) => {
        itemTotal += cartItem.price * cartItem.quantity;
      });
      // if (withDiscount && coupon && coupon.discount) {
      //   itemTotal = itemTotal - (coupon.discount / 100) * itemTotal;
      // }
      const deliveryAmount = amount > 0 ? deliveryCharges : 0
      return (itemTotal + deliveryAmount).toFixed(2);
    },
    [deliveryCharges, cart]
  );
  const taxCalculation = useMemo(
    () => () => {
      const tax = restaurantData ? +restaurantData.tax : 0;
      if (tax === 0) {
        return tax.toFixed(2);
      }
      const amount = +calculatePrice(deliveryCharges, true);
      const taxAmount = ((amount / 100) * tax).toFixed(2);
      return taxAmount;
    },
    [restaurantData, cart, deliveryCharges]
  );

  const calculateTotal = useMemo(
    () => () => {
      let total = 0;
      total += +calculatePrice(deliveryCharges);
      total += +taxCalculation();
      return parseFloat(total).toFixed(2);
    },
    [deliveryCharges, cart]
  );

  // function calculateDistance(){
  //   const service = new window.google.maps.DistanceMatrixService();
  // // build request
  // const destinationObj = JSON.parse(localStorage.getItem('location'))
  // console.log('destinationObj', destinationObj)
  // const origin1 = { lat: Number(restaurantData.location.coordinates[1]), lng: Number(restaurantData.location.coordinates[0]) };
  // const origin2 = restaurantData.address;
  // const destinationA = destinationObj.deliveryAddress;
  // const destinationB = { lat: Number(destinationObj.latitude), lng: Number(destinationObj.longitude) };

  // const request = {
  //   origins: [origin1, origin2],
  //   destinations: [destinationA, destinationB],
  //   travelMode: window.google.maps.TravelMode.DRIVING,
  //   unitSystem: window.google.maps.UnitSystem.METRIC,
  //   avoidHighways: false,
  //   avoidTolls: false,
  // };
  // return service.getDistanceMatrix(request).then((response) => {

  //     let distance = 0;
  //     const originList = response.originAddresses;
  //     distance = response.rows[0].elements[0].distance.value;
  //     for (var i = 0; i < originList.length; i++) {
  //       var results = response.rows[i].elements;
  //       for (var j = 0; j < results.length; j++) {
  //         if(response.rows[i].elements[j].distance.value < distance){
  //           distance = response.rows[i].elements[j].distance.value
  //         }
  //       }
  //     }
  //     return distance
  //   });
  // }

  return (
    <Container
      style={{
        paddingTop: theme.spacing(2),
        background: theme.palette.common.white,
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: theme.spacing(1),
        }}
      >
        <Typography className={classes.subtotalText}>Subtotal</Typography>
        <Typography className={classes.subtotalText}>
          {`${configuration.currencySymbol} ${calculatePrice(0)}`}
        </Typography>
      </Box>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: theme.spacing(1),
        }}
      >
        <Typography className={classes.subtotalText}>Delivery fee</Typography>
        <Typography className={classes.subtotalText}>
          {`${configuration.currencySymbol} ${deliveryCharges.toFixed(2)}`}
        </Typography>
      </Box>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: theme.spacing(1),
        }}
      >
        <Typography className={classes.subtotalText}>TAX</Typography>
        <Typography className={classes.subtotalText}>
          {`${configuration.currencySymbol} ${taxCalculation()}`}
        </Typography>
      </Box>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: theme.spacing(2),
        }}
      >
        <Typography style={{ fontWeight: 700, color: theme.palette.text.secondary }} className={classes.subtotalText}>
          Total (Inc. TAX)
        </Typography>
        <Typography style={{ fontWeight: 700, color: theme.palette.text.secondary }} className={classes.subtotalText}>
          {`${configuration.currencySymbol} ${calculateTotal()}`}
        </Typography>
      </Box>
      <RouterLink to="/checkout" style={{ textDecoration: "none" }}>
        <Button
          style={{
            background: theme.palette.primary.main,
            margin: theme.spacing(2, 0),
          }}
          className={classes.checkoutContainer}
        >
          <Typography style={{ color: theme.palette.common.white }} className={classes.checkoutText}>GO TO CHECKOUT</Typography>
        </Button>
      </RouterLink>
    </Container>
  );
}

export default React.memo(PricingView);
