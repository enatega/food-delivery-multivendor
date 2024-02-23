import {
  Grid,
  Box,
  Button,
  Typography,
  useTheme,
  CircularProgress,
  Divider,
  useMediaQuery,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import ConfigurationContext from "../../../context/Configuration";
import UserContext from "../../../context/User";
import useStyles from "./styles";
import { Status } from "../Status/Status";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';
function PastOrderCard({ item }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const configuration = useContext(ConfigurationContext);
  const { setCartRestaurant, addCartItem } = useContext(UserContext);
  const small = useMediaQuery(theme.breakpoints.down("sm"));

  const STATUS_ORDER = [
    t('pending'),
    t('accepted'),
    t('assigned'),
    t('picked'),
    t('delivered'),
    t('completed'),
  ];

  const onAddToCart = async () => {
    setLoading(true);
    try {
      await setCartRestaurant(item.restaurant._id);
      item.items.forEach(async (cartItem, index) => {
        const addons = cartItem.addons.map((addon) => ({
          _id: addon._id,
          options: addon.options.map(({ _id }) => ({
            _id,
          })),
        }));
        await addCartItem(
          cartItem.food,
          cartItem.variation._id,
          cartItem.quantity,
          addons,
          index === 0
        );
      });
      navigate(`/restaurant/${item.restaurant.slug}`, {
        state: {
          id: item.restaurant._id,
          name: item.restaurant.name,
          image: item.restaurant.image,
          slug: item.restaurant.slug,
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <RouterLink
      to={{ pathname: `/order-detail/${item._id}` }}
      className={classes.link}
    >
      <Grid item xs={12} className={classes.card}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Box display={small ? "block" : "flex"} alignItems="center">
              <Typography
                variant="body2"
                color="textSecondary"
                className={classes.textBold}
              >
                {item.restaurant?.name ?? "..."}
              </Typography>
              <Box display="flex">
                <Status
                  isEta={false}
                  first={true}
                  last={false}
                  isActive={true}
                />
                <Status
                  firstCol={theme.palette.primary.main}
                  secondCol={theme.palette.primary.darkest}
                  isEta={STATUS_ORDER.indexOf(item.orderStatus) < 1}
                  first={false}
                  last={false}
                  isActive={true}
                />
                <Status
                  firstCol={theme.palette.primary.main}
                  secondCol={theme.palette.primary.darkest}
                  isEta={STATUS_ORDER.indexOf(item.orderStatus) < 2}
                  first={false}
                  last={false}
                  isActive={true}
                />
                <Status
                  firstCol={theme.palette.primary.main}
                  secondCol={theme.palette.primary.darkest}
                  isEta={STATUS_ORDER.indexOf(item.orderStatus) < 4}
                  first={false}
                  last={true}
                  isActive={true}
                />
              </Box>
            </Box>
            <Typography
              variant="body2"
              className={`${classes.textBold} ${classes.disabledText}`}
              pt={theme.spacing(1)}
            >
              {item?.items.length} item(s) |{" "}
              {`${configuration.currencySymbol} ${parseFloat(
                item.orderAmount
              ).toFixed(2)}`}
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              pt={theme.spacing(1)}
            >
              <Box display="flex">
                <Typography
                  gutterBottom
                  className={classes.smallText}
                  color={theme.palette.common.black}
                >
                  {item?.orderStatus === "CANCELLED"
                    ? t('orderCancelled')
                    : item?.orderStatus === "DELIVERED"
                    ? t('orderCompleted')
                    : null}
                </Typography>
                <Box ml={theme.spacing(1)} />
              </Box>
            </Box>
            <Typography
              gutterBottom
              className={`${classes.disabledText} ${classes.smallText}`}
            >
              {new Date(item.createdAt).toDateString()}
            </Typography>
            <Button
              disabled={loading}
              className={classes.reOrder}
              onClick={(e) => {
                e.preventDefault();
                onAddToCart();
              }}
            >
              {loading ? (
                <CircularProgress color="primary" size={15} />
              ) : (
                <Typography
                  variant="caption"
                  color={theme.palette.button.main}
                  className={classes.textBold}
                >
                  {t('reorder')}
                </Typography>
              )}
            </Button>
            {!item.review && (
              <Button
                disabled={loading}
                className={classes.review}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/order-detail/${item._id}`);
                }}
              >
                {loading ? (
                  <CircularProgress color="primary" size={15} />
                ) : (
                  <Typography
                    variant="caption"
                    color={theme.palette.button.main}
                    className={classes.textBold}
                  >
                    {t('review')}
                  </Typography>
                )}
              </Button>
            )}
          </Box>
          <Box>
            <img
              src={item.restaurant.image}
              alt="Restaurant"
              className={classes.img}
            />
          </Box>
        </Box>

        <Divider orientation="horizontal" className={classes.divider} />
        <Box display="flex" justifyContent="center">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            className={classes.status}
          >
            <Typography
              variant="body2"
              color={theme.palette.button.main}
              fontWeight={600}
            >
              {item?.orderStatus}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </RouterLink>
  );
}

export default React.memo(PastOrderCard);
