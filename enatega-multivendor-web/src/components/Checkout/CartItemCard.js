/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import clsx from "clsx";
import gql from "graphql-tag";
import React, { useContext, useEffect, useRef, useState } from "react";
import { getCoupon, getTipping } from "../../apollo/server";
import ConfigurationContext from "../../context/Configuration";
import UserContext from "../../context/User";
import useStyles from "./styles";

const TIPPING = gql`
  ${getTipping}
`;
const GET_COUPON = gql`
  ${getCoupon}
`;

function CartItemsCard({
  restaurantData,
  setFlashMessage,
  selectedTip,
  setSelectedTip,
  setTaxValue,
  setCoupon,
  calculatePrice,
  taxCalculation,
  calculateTip,
  calculateTotal,
  isPickUp,
  deliveryCharges
}) {
  const couponRef = useRef(null);
  const [couponError, setCouponError] = useState(null);
  const [couponText, setCouponText] = useState("");
  const theme = useTheme();
  const classes = useStyles();
  const { cart } = useContext(UserContext);
  const configuration = useContext(ConfigurationContext);
  const { data: dataTip } = useQuery(TIPPING, {
    fetchPolicy: "network-only",
  });
  const [mutate, { loading: couponLoading }] = useMutation(GET_COUPON, {
    onCompleted: couponCompleted,
    onError: couponOnError,
  });

  useEffect(() => {
    if (dataTip && !selectedTip) {
      setSelectedTip(dataTip.tips.tipVariations[1]);
    }
  }, [restaurantData, dataTip]);

  useEffect(() => {
    setTaxValue(restaurantData ? +restaurantData.tax : 0);
  }, [restaurantData]);

  function couponCompleted({ coupon }) {
    if (coupon) {
      if (coupon.enabled) {
        couponRef.current = coupon;
        setCoupon(coupon);
        setCouponError("");
        setFlashMessage({
          type: "success",
          message: "Coupon applied.",
        });
      } else {
        setCouponError("Coupon not found!");
        setFlashMessage({
          type: "warning",
          message: "Coupon unavailable.",
        });
      }
    }
  }
  function couponOnError() {
    setCouponError("Coupon not found!");
    setFlashMessage({
      type: "error",
      message: "Invalid Coupon.",
    });
  }

  return <>
    <Paper style={{ background: theme.palette.common.white }}>
      <Container>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          className={classes.boldText}
          style={{
            padding: `${theme.spacing(2)} 0`,
          }}
        >
          {`Your order from ${restaurantData.name || "..."}`}
        </Typography>
      </Container>
    </Paper>
    <Box>
      <Box
        style={{
          maxHeight: theme.spacing(30),
          padding: theme.spacing(0, 1),
          overflow: "auto",
        }}
      >
        {cart?.map((foodItem, index) => (
          <Box
            key={foodItem._id + index}
            display="flex"
            justifyContent="space-between"
            pt={theme.spacing(2)}
            pb={theme.spacing(2)}
          >
            <Typography
              variant="caption"
              color="textSecondary"
              className={clsx(
                classes.flex,
                classes.boldText,
                classes.smallText
              )}
            >
              {foodItem.quantity}
              <Typography
                variant="caption"
                className={clsx(classes.smallText, classes.disableText)}
              >
                {` x ${foodItem.foodTitle} ${foodItem.variationTitle ? `(${foodItem.variationTitle})` : ''}`}
              </Typography>
              {foodItem?.optionTitles?.map((option, index) => (
                <Typography
                  key={index}
                  style={{
                    color: theme.palette.text.disabled,
                    fontSize: "0.7rem",
                  }}
                >
                  +{option}
                </Typography>
              ))}
            </Typography>
            <Typography
              variant="caption"
              align="right"
              className={clsx(classes.smallText, classes.disableText)}
            >
              {` ${configuration.currencySymbol} ${(
                parseFloat(foodItem.price) * foodItem.quantity
              ).toFixed(2)}`}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box className={classes.PH1}>
        <Divider light orientation="horizontal" />
        <Grid container item justifyContent="space-between" className={classes.MV2}>
          <Grid item xs={8} sm={9}>
            <TextField
              className={classes.textContainer}
              variant="outlined"
              label="Enter your voucher code"
              size="small"
              fullWidth
              error={!!couponError}
              helperText={couponError}
              value={couponText}
              onChange={(e) => {
                setCouponText(e.target.value);
              }}
              InputProps={{
                className: classes.inputprops,
              }}
              InputLabelProps={{
                style: {
                  fontSize: "14px",
                },
              }}
            />
          </Grid>
          <Grid item xs={3} sm={2}>
            <Button
              variant="contained"
              disabled={couponLoading}
              color="primary"
              fullWidth
              className={classes.couponBtn}
              onClick={(e) => {
                e.preventDefault();
                mutate({ variables: { coupon: couponText } });
              }}
            >
              {couponLoading ? (
                <CircularProgress size={18} />
              ) : (
                <Typography variant="caption">Apply</Typography>
              )}
            </Button>
          </Grid>
        </Grid>
        <Grid container item justifyContent="space-between" className={classes.MV1}>
          <Grid item xs={8} sm={9}>
            <Typography>Tip</Typography>
          </Grid>
          {selectedTip && (
            <Grid item xs={3} sm={2}>
              <Button
                size="small"
                variant="text"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedTip(null);
                }}
              >
                Remove
              </Button>
            </Grid>
          )}
        </Grid>
        {dataTip && (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            className={classes.tipRow}
          >
            {dataTip.tips.tipVariations.map((label, index) => (
              <Button
                key={`TIP_${index}`}
                variant={selectedTip === label ? "contained" : "outlined"}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedTip(label);
                }}
              >{`${label} %`}</Button>
            ))}
          </Box>
        )}
        <Box>
          <Divider light orientation="horizontal" className={classes.MV2} />
          <Box display="flex" justifyContent="space-between">
            <Typography
              variant="caption"
              className={clsx(classes.disableText, classes.smallText)}
            >
              Subtotal
            </Typography>
            <Typography
              variant="caption"
              className={clsx(classes.disableText, classes.smallText)}
            >
              {`${configuration.currencySymbol} ${calculatePrice(0, false)}`}
            </Typography>
          </Box>
          {!isPickUp && <Box display="flex" justifyContent="space-between" className={classes.MV1}>
            <Typography variant="caption" className={clsx(classes.disableText, classes.smallText)}>
              Delivery fee
            </Typography>
            <Typography variant="caption" className={clsx(classes.disableText, classes.smallText)}>
              {`${configuration.currencySymbol} ${(deliveryCharges).toFixed(2)}`}
            </Typography>
          </Box>}
          <Box display="flex" justifyContent="space-between">
            <Typography
              variant="caption"
              className={clsx(classes.disableText, classes.smallText)}
            >
              TAX
            </Typography>
            <Typography
              variant="caption"
              className={clsx(classes.disableText, classes.smallText)}
            >
              {`${configuration.currencySymbol} ${taxCalculation()}`}
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            className={classes.MV1}
          >
            <Typography
              variant="caption"
              className={clsx(classes.disableText, classes.smallText)}
            >
              Tip
            </Typography>
            <Typography
              variant="caption"
              className={clsx(classes.disableText, classes.smallText)}
            >
              {`${configuration.currencySymbol} ${parseFloat(
                calculateTip()
              ).toFixed(2)}`}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography
              variant="caption"
              color="primary"
              className={clsx(classes.smallText)}
            >
              Discount
            </Typography>
            <Typography
              variant="caption"
              color="primary"
              className={clsx(classes.smallText)}
            >
              {`-${configuration.currencySymbol} ${parseFloat(
                calculatePrice(0, false) - calculatePrice(0, true)
              ).toFixed(2)}`}
            </Typography>
          </Box>
          <Divider light orientation="horizontal" className={classes.MV1} />
          <Box display="flex" justifyContent="space-between">
            <Box display="flex">
              <Typography
                variant="caption"
                color="textSecondary"
                className={clsx(classes.smallText)}
              >
                {`Total `}
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                className={clsx(classes.boldText, classes.totalSmall)}
              >
                (incl. TAX)
              </Typography>
            </Box>
            <Typography
              variant="caption"
              className={clsx(classes.disableText, classes.smallText)}
            >
              {`${configuration.currencySymbol} ${calculateTotal()}`}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  </>;
}

export default React.memo(CartItemsCard);
