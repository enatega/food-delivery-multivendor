import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, {useContext} from "react";
import { Link as RouterLink } from "react-router-dom";
import ConfigurationContext from "../../../context/Configuration";
import { Status } from "../Status/Status";
import useStyles from "./styles";
import { useTranslation } from 'react-i18next';


function ActiveOrderCard(props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  const configuration = useContext(ConfigurationContext);

  const STATUS_ORDER = [
    t('pending'),
    t('accepted'),
    t('assigned'),
    t('picked'),
    t('delivered'),
    t('completed'),
  ];

  return (
    <RouterLink
      to={{ pathname: `/order-detail/${props._id}` }}
      className={classes.link}
    >
      <Box className={classes.card}>
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
                {props.restaurant?.name ?? "..."}
              </Typography>
              <Box display="flex">
                <Status
                firstCol="#3C8F7C"
                  isEta={false}
                  first={true}
                  last={false}
                  isActive={true}
                />
                <Status
                firstCol="#3C8F7C"
                  isEta={STATUS_ORDER.indexOf(props.orderStatus) < 1}
                  first={false}
                  last={false}
                  isActive={true}
                />
                <Status
                firstCol="#3C8F7C"
                  isEta={STATUS_ORDER.indexOf(props.orderStatus) < 2}
                  first={false}
                  last={false}
                  isActive={true}
                />
                <Status
                firstCol="#3C8F7C"
                  isEta={STATUS_ORDER.indexOf(props.orderStatus) < 4}
                  first={false}
                  last={true}
                  isActive={true}
                />
              </Box>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              pt={theme.spacing(1)}
              style={{color: "black", fontWeight: 700, fontSize: 17}}
            >
              <Box display="flex">
              {props?.items.length} item(s) |{" "}
            {`${configuration.currencySymbol} ${parseFloat(
              props.orderAmount
            ).toFixed(2)}`}
              </Box>
            </Box>
            <Typography
              gutterBottom
              className={classes.smallText}
              style={{ color: "black", width: small ? "130%" : "90%" }}
              pt={theme.spacing(1)}
            >
              {/* {props?.items?.length} item(s) |
              {`${configuration.currencySymbol} ${parseFloat(
                props.orderAmount
              ).toFixed(2)}`} */}
              {props.orderStatus === "PENDING"
                ? t('orderPending')
                : props.orderStatus === "ASSIGNED" ||
                  props.orderStatus === "ACCEPTED"
                ? t('restaurantDeliver')
                : props.orderStatus === "PICKED"
                ? t('riderDeliver')
                : null}
            </Typography>
            {/* <Typography
              gutterBottom
              className={`${classes.disabledText} ${classes.smallText}`}
            >
              {new Date(props.createdAt).toDateString()}
            </Typography> */}
          </Box>
          <Box>
            <img
              src={props.restaurant.image}
              alt="Restaurant"
              className={classes.img}
            />
          </Box>
        </Box>

        {/* {props.items.map((item) => (
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
              addon.options.map((option, index) => (
                <Typography
                  key={index}
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
              color="black"
              style={{ fontWeight: 600 }}
            >
              {t(props?.orderStatus)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </RouterLink>
  );
}

export default React.memo(ActiveOrderCard);
