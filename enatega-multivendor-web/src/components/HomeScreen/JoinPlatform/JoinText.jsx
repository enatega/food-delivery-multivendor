import {
  Box,
  Typography,
} from "@mui/material";
import React from "react";
import Tick from "../TickComponent/Tick";
import useStyle from "./styles.js";
import { useTranslation } from "react-i18next";

const JoinText = () => {
  let classes = useStyle();
  const { t } = useTranslation();
  let ticks = [
    {
      heading: t("ForRider"),
      text: t("platformRiderText"),
    },
    {
      heading: t("ForRestaurant"),
      text: t("platformRestaurantText"),
    },
    {
      heading: t("ForCustomer"),
      text: t("platformCustomerText"),
    },
  ];

  return (
    <Box>
      <Typography className={classes.mainText}>{t("PlatformText")}</Typography>

      <Typography className={classes.secondaryText}>
        {t("PlatformSubtext")}
      </Typography>

      {ticks.map((item) => {
        return (
          <Tick key={item.heading} heading={item.heading} text={item.text} />
        );
      })}
    </Box>
  );
};

export default JoinText;
