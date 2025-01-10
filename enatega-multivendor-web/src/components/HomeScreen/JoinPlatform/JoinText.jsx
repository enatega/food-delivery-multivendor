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
import Tick from "../TickComponent/Tick";
import useStyle from "./styles.js";

  
  const JoinText = () => {
    let classes=useStyle()
     let ticks=[
        {
            heading:"For Riders: ",
            text:"Earn on your schedule, get quick payouts, and enjoy easy-to-use tools for managing deliveries. "
        },
        {
            heading:"For Restaurants : ",
            text:"Boost your reach, streamline order management, and grow your revenue with real-time analytics. "
        },
        {
            heading:"For Customers : ",
            text:"Enjoy a wide range of restaurants, fast delivery, and a user-friendly app and website."
        },
     ]


    return (
      <Box>

        <Typography className={classes.mainText}>
        Why Join Our Platform?

        </Typography>

        <Typography className={classes.secondaryText}>
        We’re not just a food delivery platform – we’re a community built to benefit everyone. Here’s why thousands of Riders, Restaurants, and Customers trust us:
        </Typography>

        {ticks.map((item)=>
        {
            return <Tick key={item.heading} heading={item.heading} text={item.text} />
        })}
      </Box>
    )
  }
  
  export default JoinText
  