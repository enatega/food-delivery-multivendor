/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useContext } from "react";
import Footer from "../../components/Footer/Footer";
import { Header } from "../../components/Header";
import useStyles from "./styles";
import Analytics from "../../utils/analytics";
import FavouritesBg from "../../assets/images/fav-bg.png";
import ProfileImage from "../../assets/images/profile.png";
import UserContext from "../../context/User";
import LanguageCard from "../../components/Language/LanguageCard";

function Settings() {
  const { profile } = useContext(UserContext);
  const classes = useStyles();
  useEffect(async () => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_PROFILE);
  }, []);
  return (
    <Grid container className={classes.root}>
      <Header />
      <Box className={classes.topContainer}>
        <Typography variant="h2" align="center" style={{ zIndex: 9999 }}>
          {profile && profile?.name[0].toUpperCase()}
        </Typography>
        <Box style={{ zIndex: 100, position: "absolute" }}>
          <img src={ProfileImage} alt="fav" />
        </Box>
        <img src={FavouritesBg} alt="fav-bg" className={classes.bg} />
      </Box>
      <Grid container item className={classes.marginHeader}>
        <LanguageCard />
      </Grid>
      <Box className={classes.footerContainer}>
        <Box className={classes.footerWrapper}>
          <Footer />
        </Box>
      </Box>
    </Grid>
  );
}

export default Settings;