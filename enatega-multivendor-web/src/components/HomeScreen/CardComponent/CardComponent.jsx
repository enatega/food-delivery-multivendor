import { Box, Typography, Grid } from "@mui/material";
import React from "react";
import Card from "./Card";
import { ReactComponent as CustomerIcon } from "../../../assets/icons/CustomerIcon.svg";
import { ReactComponent as RestuarantIcon } from "../../../assets/icons/RestuarantIcon.svg";
import { ReactComponent as RiderIcon } from "../../../assets/icons/RiderIcon.svg";
import useStyle from "./styles";
import { useTranslation } from "react-i18next";

const CardComponent = () => {
  const { t } = useTranslation();

  let classes = useStyle();
  let functionalityList = [
    {
      icon: RestuarantIcon,
      heading: t("ForRestaurant"),
      ticksList: [
        {
          heading: t("Register"),
          text: t("RegisterText"),
        },
        {
          heading: t("recieveOrders"),
          text: t("recieveOrdersText"),
        },
        {
          heading: t("grow"),
          text: t("growText"),
        },
      ],
    },

    {
      icon: RiderIcon,
      heading: t("ForRider"),
      ticksList: [
        {
          heading: t("signUp"),
          text: t("signUpText"),
        },
        {
          heading: t("accOrders"),
          text: t("accOrderText"),
        },
        {
          heading: t("earnMoney"),
          text: t("earnMoneyText"),
        },
      ],
    },

    {
      icon: CustomerIcon,
      heading:t("ForCustomer"),
      ticksList: [
        {
          heading: t("brMenu"),
          text: t("brMenuText"),
        },
        {
          heading: t("placeOrder"),
          text: t("placeOrderText"),
        },
        {
          heading: t("relax"),
          text: t("relaxText"),
        },
      ],
    },
  ];
  return (
    <Box className={classes.mainContainer}>
      <Typography className={classes.mainText}>
       {t("howItWorks")}
      </Typography>
      <Grid
        container
        className={classes.cardBox}
        xs={11}
        md={10}
        gap={1}
      
      
      >
        {functionalityList.map((item) => {
          return (
            <Grid item md={3.9} xs={12} sm={6} style={{ margin: "0 auto" }} >
              <Card
                Icon={item.icon}
                heading={item.heading}
                ticksList={item.ticksList}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CardComponent;
