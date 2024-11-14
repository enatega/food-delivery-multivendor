/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import clsx from "clsx";
import gql from "graphql-tag";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { getCoupon, getTipping } from "../../apollo/server";
import ConfigurationContext from "../../context/Configuration";
import UserContext from "../../context/User";
import useStyles from "./styles";
import CartItem from "../RestaurantDetailComponent/RestaurantCart/CartItem";
import Voucher from "./Voucher";
import { useTranslation } from "react-i18next";
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
  deliveryCharges,
  addQuantity,
  removeQuantity,
}) {
  const { t } = useTranslation();
  const couponRef = useRef(null);
  const [couponError, setCouponError] = useState(null);
  const [couponText, setCouponText] = useState("");
  const theme = useTheme();
  const classes = useStyles();
  const { cart } = useContext(UserContext);
  const configuration = useContext(ConfigurationContext);
  const [voucherModal, setVoucherModal] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

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

  const mutateVoucher = (e) => {
    e.preventDefault();
    mutate({ variables: { coupon: couponText } });
  };

  function couponCompleted({ coupon }) {
    if (coupon) {
      if (coupon.enabled) {
        couponRef.current = coupon;
        setCoupon(coupon);
        setCouponError("");
        setIsCouponApplied(true);
        setFlashMessage({
          type: "success",
          message: "Coupon applied.",
        });
        setVoucherModal((prev) => !prev);
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
  const toggleVoucherModal = useCallback(() => {
    setVoucherModal((prev) => !prev);
  }, []);

  return (
    <>
      <Box>
        <Paper
          style={{
            padding: theme.spacing(0, 1),
            overflow: "auto",
            backgroundColor: theme.palette.common.white,
            boxShadow: "0px 0px 5px 1px rgba(0,0,0,0.2)",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        >
          {cart?.map((foodItem, index) => (
            <>
              <CartItem
                key={`ITEM_${index}`}
                quantity={foodItem.quantity}
                dealName={foodItem.title}
                foodTitle={foodItem.foodTitle}
                variationTitle={foodItem.variationTitle}
                optionTitles={foodItem.optionTitles}
                dealPrice={(
                  parseFloat(foodItem.price) * foodItem.quantity
                ).toFixed(2)}
                addQuantity={() => {
                  addQuantity(foodItem.key);
                }}
                removeQuantity={() => { 
                  if (foodItem.quantity > 1) {
                    removeQuantity(foodItem.key);
                  }
                }}
              />
              <Divider
                orientation="horizontal"
                style={{ backgroundColor: "rgb(72 71 71 / 66%)" }}
              />
            </>
          ))}
        </Paper>

        <Box>
          <Container
            style={{
              paddingTop: theme.spacing(2),
              background: theme.palette.common.white,
              borderRadius: 10,
              boxShadow: "0px 0px 5px 1px rgba(0,0,0,0.2)",
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 20,
              marginTop: "-5px",
            }}
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: theme.spacing(2),
              }}
              className={classes.border}
            >
              <Typography className={classes.subtotalText}>
                {t("subTotal")}
              </Typography>
              <Typography className={classes.subtotalText}>
                {`${configuration.currencySymbol} ${calculatePrice(0)}`}
              </Typography>
            </Box>
            {!isPickUp && (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: theme.spacing(2),
                }}
                className={classes.border}
              >
                <Typography className={classes.subtotalText}>
                  {t("deliveryFee")}
                </Typography>
                <Typography className={classes.subtotalText}>
                  {`${configuration.currencySymbol} ${deliveryCharges.toFixed(
                    2
                  )}`}
                </Typography>
              </Box>
            )}
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: theme.spacing(2),
              }}
              className={classes.border}
            >
              <Typography className={classes.subtotalText}>
                {t("taxFee")}
              </Typography>
              <Typography className={classes.subtotalText}>
                {`${configuration.currencySymbol} ${taxCalculation()}`}
              </Typography>
            </Box>
            <Box
              style={{
                marginTop: theme.spacing(2),
                cursor: "pointer",
              }}
              onClick={toggleVoucherModal}
            >
              <Typography
                variant="caption"
                className={classes.darkGreen}
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                {t("haveVoucher")}
              </Typography>
            </Box>
            <Divider
              orientation="horizontal"
              style={{
                backgroundColor: "rgb(72 71 71 / 66%)",
                marginTop: theme.spacing(8),
              }}
            />
            <Grid
              container
              item
              justifyContent="space-between"
              className={classes.MV1}
            >
              <Grid item xs={8}>
                <Typography className={clsx(classes.disableText)}>
                  {t("tip")}
                </Typography>
              </Grid>
              {selectedTip && (
                <Grid item xs={4}>
                  <Box display="flex" justifyContent="space-between">
                    <Button
                      size="small"
                      variant="text"
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedTip(null);
                      }}
                    >
                      <Typography
                        variant="caption"
                        className={classes.darkGreen}
                        style={{ fontSize: "12px", fontWeight: 600 }}
                      >
                        {t("remove")}
                      </Typography>
                    </Button>
                    <Typography
                      variant="caption"
                      className={clsx(classes.disableText, classes.smallText)}
                    >
                      {`${configuration.currencySymbol} ${parseFloat(
                        calculateTip()
                      ).toFixed(2)}`}
                    </Typography>
                  </Box>
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

            <Divider
              orientation="horizontal"
              style={{
                backgroundColor: "rgb(72 71 71 / 66%)",
                marginTop: theme.spacing(4),
              }}
            />

            <Box display="flex" justifyContent="space-between">
              <Typography
                variant="caption"
                color="primary"
                className={clsx(classes.smallText)}
              >
                {isCouponApplied
                  ? `Coupon is applied: ${couponText}`
                  : t("discount")}
              </Typography>
              <Typography
                variant="caption"
                color="primary"
                bold
                className={clsx(classes.smallText)}
              >
                {`-${configuration.currencySymbol} ${parseFloat(
                  calculatePrice(0, false) - calculatePrice(0, true)
                ).toFixed(2)}`}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" sx={{ pb: 4 }}>
              <Box display="flex">
                <Typography
                  variant="caption"
                  className={clsx(classes.smallText)}
                  style={{ fontWeight: 800 }}
                >
                  {t("total")}
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  className={clsx(classes.totalSmall)}
                  style={{ fontWeight: 600 }}
                >
                  (incl. TAX)
                </Typography>
              </Box>
              <Typography
                variant="caption"
                className={clsx(classes.smallText)}
                style={{ fontWeight: 600 }}
              >
                {`${configuration.currencySymbol} ${calculateTotal()}`}
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
      <Voucher
        isVisible={voucherModal}
        toggleModal={toggleVoucherModal}
        couponError={couponError}
        couponText={couponText}
        setCouponText={setCouponText}
        couponLoading={couponLoading}
        mutateVoucher={mutateVoucher}
      />
    </>
  );
}

export default React.memo(CartItemsCard);
