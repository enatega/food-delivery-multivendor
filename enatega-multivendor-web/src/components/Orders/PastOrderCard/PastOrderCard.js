import {
  Grid,
  Box,
  Button,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import ConfigurationContext from "../../../context/Configuration";
import UserContext from "../../../context/User";
import useStyles from "./styles";

function PastOrderCard({ item }) {
  const theme = useTheme();
  const classes = useStyles();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const configuration = useContext(ConfigurationContext);
  const { setCartRestaurant, addCartItem } = useContext(UserContext);

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
    <Grid item xs={12}>
      <Box pb={theme.spacing(4)} />
      <Box display="flex" justifyContent="space-between">
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.textBold}
        >
          {item.restaurant?.name ?? "..."}
        </Typography>
        <Typography
          variant="body2"
          className={`${classes.textBold} ${classes.disabledText}`}
        >
          {`${configuration.currencySymbol} ${parseFloat(
            item.orderAmount
          ).toFixed(2)}`}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" pt={theme.spacing(1)}>
        <Box display="flex">
          <Typography
            variant="caption"
            className={`${classes.disabledText} ${classes.smallText}`}
          >
            delivery by
          </Typography>
          <Box ml={theme.spacing(1)} />
          <Typography
            className={`${classes.textBold} ${classes.smallText}`}
            color="textSecondary"
          >
            {item.rider?.name ?? "..."}
          </Typography>
        </Box>
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
              color="primary"
              className={classes.textBold}
            >
              REORDER
            </Typography>
          )}
        </Button>
      </Box>
      <Typography
        gutterBottom
        className={`${classes.disabledText} ${classes.smallText}`}
      >
        {new Date(item.createdAt).toDateString()}
      </Typography>
      {item.items.map((item) => (
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
      ))}
    </Grid>
  );
}

export default React.memo(PastOrderCard);
