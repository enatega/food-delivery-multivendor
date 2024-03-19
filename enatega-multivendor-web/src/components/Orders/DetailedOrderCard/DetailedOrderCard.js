import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import ConfigurationContext from "../../../context/Configuration";
import { Status } from "../Status/Status";
import useStyles from "./styles";
import { useTranslation } from "react-i18next";

function DetailedOrderCard(props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const small = useMediaQuery(theme.breakpoints.down("sm"));

  const configuration = useContext(ConfigurationContext);
  const STATUS_ORDER = [
    t("pending"),
    t("accepted"),
    t("assigned"),
    t("picked"),
    t("delivered"),
    t("completed"),
  ];
  return (
    <RouterLink
      to={{ pathname: `/order-detail/${props._id}` }}
      className={classes.link}
    >
      <Box className={classes.card}>
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }}>
          <Box>
            <img
              src={props.restaurant.image}
              alt="Restaurant"
              className={classes.img}
              style={{
                height: small ? "50%" : "100%",
                minWidth: small ? "100%" : "120px",
              }}
            />
          </Box>
          <Box
            flexGrow={1}
            display="flex"
            flexDirection="column"
            style={{ padding: "18px" }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexDirection={{ xs: "column", sm: "row" }}
              marginBottom={{ xs: "10px", sm: 0 }}
            >
              <Typography
                variant="body2"
                color="textSecondary"
                numberoflines={1}
                className={classes.textBold}
              >
                {(props.restaurant?.name ?? "...")
                  .slice(0, 8)
                  .replace(/\s/g, "") +
                  (props.restaurant?.name?.length > 9 ? "..." : "")}
              </Typography>
              <Box
                display="flex"
                justifyContent={{ xs: "flex-start", sm: "center" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                flexDirection={{ xs: "column", sm: "row" }}
                marginTop={{ xs: "10px", sm: 0 }}
                marginLeft={{ xs: 0, sm: "0px" }}
              >
                <Box display="flex" marginBottom={{ xs: "10px", sm: 0 }}>
                  <Status
                    firstCol={theme.palette.primary.main}
                    secondCol={theme.palette.primary.darkest}
                    isEta={false}
                    first={true}
                    last={false}
                    isActive={true}
                  />
                  <Status
                    isEta={STATUS_ORDER.indexOf(props.orderStatus) < 1}
                    first={false}
                    last={false}
                    isActive={true}
                  />
                  <Status
                    isEta={STATUS_ORDER.indexOf(props.orderStatus) < 2}
                    first={false}
                    last={false}
                    isActive={true}
                  />
                  <Status
                    isEta={STATUS_ORDER.indexOf(props.orderStatus) < 4}
                    first={false}
                    last={true}
                    isActive={true}
                  />
                </Box>
              </Box>

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                //className={classes.status}
                className={`${classes.textBold} ${classes.smallText}`}
                style={{
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: "8px",
                  padding: "6px 15px 6px 15px",
                  marginLeft: "10px",
                  boxShadow: "3px 3px 3px theme.palette.primary.lightest",
                }}
              >
                <Typography
                  variant="body2"
                  color="black"
                  style={{ fontWeight: 600 }}
                >
                  {t(props.orderStatus)} {console.log(props?.orderStatus)}
                </Typography>
              </Box>
            </Box>

            <Box display={{ xs: "block", sm: "block" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                pt={theme.spacing(1)}
                style={{ color: "black", fontWeight: 700, fontSize: 17 }}
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
                style={{ color: "black", width: "90%" }}
                pt={2}
              >
                {props.orderStatus === "PENDING"
                  ? t("orderPending")
                  : props.orderStatus === "ASSIGNED" ||
                    props.orderStatus === "ACCEPTED"
                  ? t("restaurantDeliver").slice(0, 40) + "..."
                  : props.orderStatus === "PICKED"
                  ? t("riderDeliver").slice(0, 40) + "..."
                  : null}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </RouterLink>
  );
}

export default React.memo(DetailedOrderCard);
