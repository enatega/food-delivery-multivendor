import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import clsx from "clsx";
import React, { useContext } from "react";
import ConfigurationContext from "../../../context/Configuration";
import useStyles from "./styles";

function EmptyView() {
  const configuration = useContext(ConfigurationContext)
  const classes = useStyles();
  const theme = useTheme();
  return (
    <>
      <Box style={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="h6" color="textSecondary" className={clsx(classes.mediumFont, classes.textBold)}>
          Your cart
        </Typography>
      </Box>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: theme.spacing(2),
        }}
      >
        <Typography variant="body1" className={classes.disabledText}>
          Start adding items to your cart
        </Typography>
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
            Subtotal
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
          <Typography variant="body1" color="textSecondary" className={clsx(classes.textBold, classes.smallFont)}>
            Total (Incl. TAX)
          </Typography>
          <Typography variant="body1" color="textSecondary" className={clsx(classes.textBold, classes.smallFont)}>
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
            <Typography className={clsx(classes.checkoutText, classes.whiteText)}>GO TO CHECKOUT</Typography>
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default React.memo(EmptyView);
