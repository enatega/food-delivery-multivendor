import { Box, Typography, Grid, Button } from "@mui/material";
import React from "react";
import useStyle from "./styles.js";
import DoubleMobile from "../../../assets/images/DoubleMobile.png";
import { useTranslation } from "react-i18next";

const OrderFavorites = () => {
  const { t } = useTranslation();
  let classes = useStyle();
  return (
    <Box
      className={classes.mainBox}
      sx={{
        height: {
          md: "280px",
          xs: "auto",
        },
      }}
    >
      <Grid container xs={11} md={10} className={classes.container}>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography className={classes.head}>{t("orderText")}</Typography>

            <Typography className={classes.text}>
              {t("orderSubText1")}
            </Typography>
            <Typography className={classes.text}>
              {t("orderSubText2")}
            </Typography>
            <Typography className={classes.text}>
              {t("orderSubText3")}
            </Typography>

            <Box>
              <Button></Button>
              <Button></Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6} justifyItems={"center"}>
          <Box
            style={{
              zIndex: 2,
            }}
            sx={{
              transform: {
                md: "rotate(6.49deg) translateY(-90px)",
                xs: "rotate(0deg)",
              },
              height: {},
            }}
          >
            <img
              src={DoubleMobile}
              alt="image"
              className={classes.phoneImg}
              style={{
                objectFit: "cover",
                width: "490px",
                height: "480px",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderFavorites;
