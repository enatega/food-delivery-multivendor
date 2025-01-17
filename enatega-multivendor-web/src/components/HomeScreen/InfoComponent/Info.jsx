import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import React from "react";
import useStyle from "./styles.js";
import { useTranslation } from "react-i18next";

const Info = () => {
  let { t } = useTranslation();
  const classes = useStyle();
  return (
    <Box className={classes.mainContainer} alignItems={"center"}>
      <Box>
        <Typography className={classes.mainText} sx={{
          fontSize:
          {
            sm:"32px",
            md:"42px"
          }
        }}>
          {t("connectText")}
        </Typography>
      </Box>

      <Box>
        <Typography className={classes.secondaryText}>
          {t("connectSubText")}
        </Typography>
      </Box>

      <Box>
        <Button variant="filled"  className={classes.greenButton}>
          {t("registerRestaurant")}
        </Button>
        <Button variant="filled" className={classes.yellowButton}>
          {t("signUpRider")}
        </Button>
        <Button variant="filled" className={classes.blueButton}>
          {t("orderFoodNow")}
        </Button>
      </Box>
    </Box>
  );
};

export default Info;
