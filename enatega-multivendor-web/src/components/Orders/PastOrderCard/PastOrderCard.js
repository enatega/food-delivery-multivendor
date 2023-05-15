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

function PastOrderCard({ item }) {
  const theme = useTheme();
  const classes = useStyles();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const configuration = useContext(ConfigurationContext);
  const { setCartRestaurant, addCartItem } = useContext(UserContext);
  const small = useMediaQuery(theme.breakpoints.down("sm"));

  const STATUS_ORDER = [
    "PENDING",
    "ACCEPTED",
    "ASSIGNED",
    "PICKED",
    "DELIVERED",
    "CANCELLED",
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
    <Grid item xs={12} className={classes.card}>
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Box
            style={{ display: small ? "block" : "flex" }}
            alignItems="center"
          >
            <Typography
              variant="body2"
              color="textSecondary"
              className={classes.textBold}
            >
              {item.restaurant?.name ?? "..."}
            </Typography>
            <Box display="flex">
              <Status isEta={false} first={true} last={false} isActive={true} />
              <Status
                firstCol="#90EA93"
                secondCol="#C4C4C4"
                isEta={STATUS_ORDER.indexOf(item.orderStatus) < 1}
                first={false}
                last={false}
                isActive={true}
              />
              <Status
              firstCol="#90EA93"
              secondCol="#C4C4C4"
                isEta={STATUS_ORDER.indexOf(item.orderStatus) < 2}
                first={false}
                last={false}
                isActive={true}
              />
              <Status
              firstCol="#90EA93"
              secondCol="#C4C4C4"
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
              style={{ color: "black", }}
            >
              {/* {props?.items?.length} item(s) |
              {`${configuration.currencySymbol} ${parseFloat(
                props.orderAmount
              ).toFixed(2)}`} */}
              {item?.orderStatus === "CANCELLED"
                ? "Your order has been cancelled"
                : item?.orderStatus === "DELIVERED"
                ? "Order completed successfully. Thankyou for placing order"
                : null}
            </Typography>
              <Box ml={theme.spacing(1)} />
              {/* <Typography
                className={`${classes.textBold} ${classes.smallText}`}
                color="textSecondary"
              >
                {item.rider?.name ?? "..."}
              </Typography> */}
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
            style={{
              maxWidth: "auto",
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: 0,
              padding: `0px ${theme.spacing(1)}`,
            }}
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
                color="#3C8F7C"
                className={classes.textBold}
              >
                REORDER
              </Typography>
            )}
          </Button>
        </Box>
        <Box>
          <img
            src={item.restaurant.image}
            alt="Restaurant"
            className={classes.img}
          />
        </Box>
      </Box>

      {/* {item.items.map((item) => (
        <Grid item key={item._id}>
          <Typography
            variant="caption"
            className={`${classes.disabledText} ${classes.smallText}`}
          >
            {`${item.quantity}x ${item.title}${
              item.variation.title ? `(${item.variation.title})` : ""
            }`}
          </Typography>
          {item.addons.map((addon) =>
            addon.options.map((option) => (
              <Typography
                className={`${classes.disabledText} ${classes.smallText}`}
              >
                +{option.title}
              </Typography>
            ))
          )}
        </Grid>
      ))} */}
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
            color="#3C8F7C"
            style={{ fontWeight: 600 }}
          >
            {item?.orderStatus}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
}

export default React.memo(PastOrderCard);
