/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Hidden,
  Typography,
  useTheme,
  Link as MaterialLink,
} from "@mui/material";
import React from "react";
import AppStoreIcon from "../../assets/icons/AppStoreIcon";
import PlayStoreIcon from "../../assets/icons/PlayStoreIcon";
import useStyles from "./styles";

export default function Promotion() {
  const theme = useTheme();
  const classes = useStyles();
  return (
    <Box
      display="flex"
      height={theme.spacing(10)}
      width="100%"
      justifyContent="center"
      alignItems="center"
      className={classes.bottomContainer}
    >
      <Hidden smDown>
        <img
          style={{ width: "139px", minHeight: "1px" }}
          alt="delivery status"
          src="https://images.deliveryhero.io/image/foodpanda/phones-app-banner/foodpanda.png?width=139&amp;height=98"
        />
        <Typography variant="body1" className={classes.smallText}>
          Download our free app!
        </Typography>
      </Hidden>
      <MaterialLink
        target="__blank"
        href="https://apps.apple.com/pk/app/enatega-multivendor/id1526488093"
      >
        <AppStoreIcon />
      </MaterialLink>
      <Box pl={theme.spacing(2)} />
      <MaterialLink
        target="__blank"
        href="https://play.google.com/store/apps/details?id=com.enatega.multivendor"
      >
        <PlayStoreIcon />
      </MaterialLink>
    </Box>
  );
}
