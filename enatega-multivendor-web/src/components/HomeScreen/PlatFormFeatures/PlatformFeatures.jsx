import {
  Box,
  Divider,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import React from "react";
import Tick from "../TickComponent/Tick";
import useStyle from "./style.js";

const PlatformFeatures = () => {
  let classess = useStyle();

  let ticksList = [
    {
      heading: "List Real-Time Order Tracking: ",
      text: " Know exactly where your food is. restaurant easily.",
    },
    {
      heading: "Secure Payments :",
      text: " For Riders, Restaurants, and Customers.",
    },
    {
      heading: "24/7 Support:",
      text: " Always here to assist you.",
    },
    {
      heading: "Customizable Menus:",
      text: " Restaurants can manage offerings effortlessly.",
    },
  ];

  return (
    <Box className={classess.mainContainer}>
      <Grid
        container
        md={10}
        xs={11}
        spacing={2}
        className={classess.container}
        alignItems={"center"}
      >
        <Grid item md={6} xs={12}>
          <Typography className={classess.header}>
            Platform Features That Make Us Stand Out
          </Typography>
          <Typography className={classess.text}>
            We provide cutting-edge features to ensure your experience is smooth
            and hassle-free:
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <Box>
            {ticksList.map((item) => {
              return (
                <Tick
                  heading={item.heading}
                  text={item.text}
                  toggleColor={true}
                />
              );
            })}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlatformFeatures;
