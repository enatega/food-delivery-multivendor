import { Box, Grid, Typography, useTheme } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import ConfigurationContext from "../../../context/Configuration";
import useStyles from "./styles";

function ActiveOrderCard(props) {
  const theme = useTheme();
  const classes = useStyles();
  const configuration = useContext(ConfigurationContext);

  return (
    <RouterLink
      to={{ pathname: `/order-detail/${props._id}` }}
      className={classes.link}
    >
      <Box pt={theme.spacing(4)}>
        <Box display="flex" justifyContent="space-between">
          <Typography
            variant="body2"
            color="textSecondary"
            className={classes.textBold}
          >
            {props.restaurant?.name ?? "..."}
          </Typography>
          <Typography variant="body2" className={classes.disabledText}>
            {`${configuration.currencySymbol} ${parseFloat(
              props.orderAmount
            ).toFixed(2)}`}
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          pt={theme.spacing(1)}
        >
          <Box display="flex">
            {props.rider ? (
              <>
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
                  {props.rider.name}
                </Typography>
              </>
            ) : (
              <Typography
                className={`${classes.textBold} ${classes.smallText}`}
                color="textSecondary"
              >
                {props.orderStatus}
              </Typography>
            )}
          </Box>
          <ChevronRightIcon color="primary" />
        </Box>
        <Typography
          gutterBottom
          className={`${classes.disabledText} ${classes.smallText}`}
        >
          {new Date(props.createdAt).toDateString()}
        </Typography>
        {props.items.map((item) => (
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
      </Box>
    </RouterLink>
  );
}

export default React.memo(ActiveOrderCard);
