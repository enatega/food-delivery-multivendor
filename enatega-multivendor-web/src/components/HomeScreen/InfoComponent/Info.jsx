import {
    Box,
    Divider,
    Typography,
    Grid,
    useTheme,
    useMediaQuery,
    Button
  } from "@mui/material";
  import React from "react";
  import useStyle from "./styles.js";


const Info = () => {
  const classes = useStyle();
  return (
    <Box
    className={classes.mainContainer}
    alignItems={"center"}
    >
     <Box>
      <Typography
      variant="h3"
      className={classes.mainText}>
      Connecting Riders, Restaurants, and Customers for Seamless Food Delivery

      </Typography>
     </Box>


     <Box>
     <Typography className={classes.secondaryText}>
     Join the platform that delivers convenience, flexibility, and growth for everyone involved. Whether you’re a Rider looking to earn, a Restaurant aiming to expand, or a Customer craving delicious meals, we’ve got you covered!
     </Typography>

     </Box>

     <Box>
        <Button variant="filled" className={classes.greenButton} >Register Your Restuarant</Button>
        <Button variant="filled" className={classes.yellowButton} >Sign Up for a Rider</Button>
        <Button variant="filled" className={classes.blueButton}>Order Food Now</Button>


     </Box>

    </Box>
  )
}

export default Info
