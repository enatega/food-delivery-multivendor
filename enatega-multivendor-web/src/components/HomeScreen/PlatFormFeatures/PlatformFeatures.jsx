import {
  Box,
  Typography,
  Grid,
} from "@mui/material";
import React from "react";
import Tick from "../TickComponent/Tick";
import useStyle from "./style.js";
import { useTranslation } from "react-i18next";

const PlatformFeatures = () => {
  const {t} =useTranslation()
  let classess = useStyle();

  let ticksList = [
    {
      heading: t("listReal"),
      text: t("listRealText"),
    },
    {
      heading: t("securePayment"),
      text:t("securePaymentText"),
    },
    {
      heading: t("twoFour"),
      text: t("twoFourText"),
    },
    {
      heading: t("custMenu"),
      text: t("custMenuText"),
    },
  ];

  return (
    <Box className={classess.mainContainer}>
      <Grid
        container
        md={10}
        xs={11}
        spacing={2}
        className={classess.container}
        alignItems={"center"}
      >
        <Grid item md={6} xs={12}>
          <Typography className={classess.header}>
            {t("platformFeatureText")}
          </Typography>
          <Typography className={classess.text}>
           {t("platformFeatureSubText")}
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <Box>
            {ticksList.map((item) => {
              return (
                <Tick
                  heading={item.heading}
                  text={item.text}
                  toggleColor={true}
                />
              );
            })}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlatformFeatures;
