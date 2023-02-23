/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from "@mui/material";
import React, {useEffect} from "react";
import Footer from "../../components/Footer/Footer";
import { Header } from "../../components/Header";
import { PasswordCard, ProfileCard } from "../../components/Profile";
import useStyles from "./styles";
import Analytics from "../../utils/analytics";

function Profile() {
  const classes = useStyles();
  useEffect(async()=>{
    await Analytics.track(Analytics.events.NAVIGATE_TO_PROFILE)
  },[])
  return (
    <Grid container className={classes.root}>
      <Header />
      <Grid container item className={classes.marginHeader}>
        <ProfileCard />
      </Grid>
      <Grid container item>
        <PasswordCard />
      </Grid>
      <Footer />
    </Grid>
  );
}

export default Profile;
