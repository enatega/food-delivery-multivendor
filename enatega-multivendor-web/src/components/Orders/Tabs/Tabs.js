import React from "react";
import { Box, Button } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useTranslation } from 'react-i18next';
const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 15,
    width: 280,
    height: 60,
    position: "absolute",
    top: -30,
    left: "50%",
    transform: "translate(-50%, 0px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    color: theme.palette.common.black,
    width: 120,
    fontSize: "0.775rem",
    borderRadius: 12,
    fontWeight: 700,
  },
}));
const OrderTabs = ({ tab, setTab }) => {
  const classes = useStyles();
  const { t } = useTranslation()
  return (
    <Box className={classes.container}>
      <Button
        variant="text"
        className={classes.btn}
        style={{
          marginRight: 5,
          backgroundColor: tab === 0 ? "#F3F4F8" : "transparent",
        }}
        onClick={() => setTab(0)}
      >
        {t('activeOrders')}
      </Button>
      <Button
        variant="text"
        className={classes.btn}
        style={{
          marginLeft: 5,
          backgroundColor: tab === 1 ? "#F3F4F8" : "transparent",
        }}
        onClick={() => setTab(1)}
      >
        {t('pastOrders')}
      </Button>
    </Box>
  );
};
export default OrderTabs;
