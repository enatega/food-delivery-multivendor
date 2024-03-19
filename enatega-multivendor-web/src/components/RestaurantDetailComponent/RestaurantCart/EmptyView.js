import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import clsx from "clsx";
import React, { useContext } from "react";
import ConfigurationContext from "../../../context/Configuration";
import useStyles from "./styles";
import RiderImage from "../../../assets/images/rider.png";
import { useTranslation } from "react-i18next";

function EmptyView() {
  const { t } = useTranslation();
  const configuration = useContext(ConfigurationContext);
  const classes = useStyles();
  const theme = useTheme();
  return (
    <>
      <Box
        style={{
          background:
            "linear-gradient(260.99deg, theme.palette.primary.main 2.79%, theme.palette.success.light 96.54%)",
          borderRadius: "20px",
          padding: "30px 20px",
        }}
        display="flex"
        alignItems={"center"}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          {/* <DeliveryIcon /> */}
          <img src={RiderImage} alt="rider" />
        </Box>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            marginLeft: "5px",
          }}
        >
          <Typography
            style={{
              ...theme.typography.body1,
              color: theme.palette.common.black,
              fontSize: "1.275rem",
              fontWeight: 600,
            }}
            align="left"
          >
            {t("yourCart")}
          </Typography>

          <Typography
            variant="h6"
            color="textSecondary"
            style={{ fontSize: "0.875rem", marginTop: 10 }}
            className={classes.textBold}
            align="center"
          >
            {t("startAdding")}
          </Typography>
        </Box>
      </Box>

      <Container>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: theme.spacing(6),
          }}
        >
          <Typography variant="body1" className={classes.smallFont}>
            {t("subTotal")}
          </Typography>
          <Typography variant="body1" className={classes.smallFont}>
            {`${configuration.currencySymbol}`} 0.00
          </Typography>
        </Box>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: theme.spacing(2),
          }}
        >
          <Typography
            variant="body1"
            color="textSecondary"
            className={clsx(classes.textBold, classes.smallFont)}
          >
            {t("total")} (Incl. TAX)
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            className={clsx(classes.textBold, classes.smallFont)}
          >
            {`${configuration.currencySymbol}`} 0.00
          </Typography>
        </Box>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: theme.spacing(2),
          }}
        >
          <Button fullWidth disabled className={classes.checkoutContainer}>
            <Typography
              className={clsx(classes.checkoutText, classes.whiteText)}
            >
              {t("goToCheckout")}
            </Typography>
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default React.memo(EmptyView);
