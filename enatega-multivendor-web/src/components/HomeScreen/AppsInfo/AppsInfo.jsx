import { Box, Grid } from "@mui/material";
import { React } from "react";
import OrderSection from "../../../assets/images/OrderSection.svg";
import RiderSection from "../../../assets/images/RiderSection.svg";
import RestuarantSection from "../../../assets/images/RestuarantSection.svg";
import useStyle from "./styles";
import { useTranslation } from "react-i18next";

import ImageComponent from "../ImageComponent/ImageComponent";

import Card from "./Card";

const AppsInfo = () => {
  let classes = useStyle();
  const { t } = useTranslation();
  let ticks = [
    {
      heading: t("earnMore"),
      text: t("earnMoreText"),
    },
    {
      heading: t("flexible"),
      text: t("flexibleText"),
    },
    {
      heading: t("intsaPay"),
      text: t("intsaPayText"),
    },
  ];

  let restuarantTicks = [
    {
      heading: t("reactCust"),
      text: t("reactCustText"),
    },
    {
      heading: t("easyOrder"),
      text: t("easyOrdertText"),
    },
    {
      heading: t("incrRevenue"),
      text: t("incrRevenueText"),
    },
  ];
  let orderTicks = [
    {
      heading: t("expMenu"),
      text: t("expMenu"),
    },
    {
      heading: t("track"),
      text: t("trackText"),
    },
    {
      heading: t("mulPlat"),
      text: t("mulPlatText"),
    },
  ];

  let RiderButtons = [
    {
      text:t("signupDelivering"),
      color: "#FF9900",
      link: "/becomearider",
      textColor: "white",
    },
  ];

  let RestuarantButtons = [
    {
      text:t("registerRestaurant"),
      color: "#5AC12F",
      link: "/becomeavendor",
      textColor: "white",
    },
  ];

  let OrderButtons = [
    {
      text: "Order Online Now ",
      color: "#5AC12F",
      link: "/restaurant-list",
      textColor: "white",
    },
    {
      text: "Download Our App",
      color: "white",
      link: "https://play.google.com/store/apps/details?id=com.enatega.multivendor",
      textColor: "green",
      isOutline: true,
    },
  ];
  return (
    <Box className={classes.mainContainer}>
      <Grid
        container
        md={10}
        xs={11}
        spacing={4}
        className={classes.container}
        alignItems={"center"}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            order: { xs: 2, md: 1 },
          }}
        >
          {" "}
          <ImageComponent image={RiderSection} />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            order: { xs: 1, md: 2 },
          }}
        >
          <Card
            heading={t("BecomeRider")}
            ticksList={ticks}
            buttons={RiderButtons}
          />
        </Grid>
      </Grid>

      <Grid
        container
        md={10}
        xs={12}
        spacing={4}
        className={classes.container}
        alignItems={"center"}
      >
        <Grid item xs={12} md={6}>
          <Card
            heading={t("growRestuarant")}
            ticksList={restuarantTicks}
            buttons={RestuarantButtons}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          {" "}
          <ImageComponent image={RestuarantSection} />
        </Grid>
      </Grid>

      <Grid
        container
        md={10}
        xs={12}
        spacing={4}
        className={classes.container}
        alignItems={"center"}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            order: { xs: 2, md: 1 },
          }}
        >
          {" "}
          <ImageComponent image={OrderSection} />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            order: { xs: 1, md: 2 },
          }}
        >
          <Card
            heading={t("OrderFood")}
            ticksList={orderTicks}
            buttons={OrderButtons}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppsInfo;
