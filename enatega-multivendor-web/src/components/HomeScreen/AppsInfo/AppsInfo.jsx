import {
    Box,
    Divider,
    Typography,
    Grid,
    useTheme,
    useMediaQuery,
  } from "@mui/material";
  import { React} from "react";
  import OrderSection from "../../../assets/images/OrderSection.png"
  import RiderSection from "../../../assets/images/RiderSection.png"
  import RestuarantSection from "../../../assets/images/RestuarantSection.png"
  import useStyle from "./styles";

import ImageComponent from "../ImageComponent/ImageComponent";

import Card from "./Card";
import { order } from "../../../apollo/server";

const AppsInfo = () => {
    let classes= useStyle()
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

     let restuarantTicks=[
        {
            heading:"Reach More Customers: ",
            text:"Get discovered by local food lovers."
        },
        {
            heading:"Easy Order Management: ",
            text:"Handle everything in one dashboard."
        },
        {
            heading:"Increase Revenue: ",
            text:"Attract more orders and grow your business."
        },


     ]
     let orderTicks=[
        {
            heading:"Explore Menus: ",
            text:"Find your favorite cuisines."
        },
        {
            heading:"Track Orders: ",
            text:"See where your food is in real time."
        },
        {
            heading:"Multiple Platforms: ",
            text:"Order via mobile app or web app."
        },


     ]

     let RiderButtons=[{
        text:"SignUp to Start Delivering",
        color:"#FF9900",
        link:"",
        textColor:"white"
     }]

     let RestuarantButtons=[{
        text:"Register Your Restaurant",
        color:"#5AC12F",
        link:"",
        textColor:"white"
     }]

     let OrderButtons=[{
        text:"Order Online Now ",
        color:"#5AC12F",
        link:"",
        textColor:"white"
     },
     {
        text:"Download Our App",
        color:"white",
        link:"",
        textColor:"green",
        isOutline:true
     }
    
    ]
  return (
    <Box className={classes.mainContainer}>

     <Grid container md={10} xs={11} spacing={4} className={classes.container} alignItems={"center"}>
      <Grid item xs={12} md={6}> <ImageComponent image={RiderSection}/></Grid>
      <Grid item xs={12} md={6}> 
        <Card heading="Become a Rider and Start Earning Today!" ticksList={ticks} buttons={RiderButtons}/>
      </Grid>
     </Grid>

     <Grid container md={10} xs={12} spacing={4} className={classes.container} alignItems={"center"} >
     <Grid item xs={12} md={6}> 
        <Card heading="Become a Rider and Start Earning Today!" ticksList={restuarantTicks} buttons={RestuarantButtons}/>
      </Grid>
      <Grid item xs={12} md={6}> <ImageComponent image={RestuarantSection}/></Grid>
     </Grid>


     <Grid container md={10} xs={12} spacing={4} className={classes.container} alignItems={"center"}>
      <Grid item xs={12} md={6}> <ImageComponent image={OrderSection}/></Grid>
      <Grid item xs={12} md={6}> 
        <Card heading="Become a Rider and Start Earning Today!" ticksList={orderTicks} buttons={OrderButtons}/>
      </Grid>
     </Grid>


    </Box>
  )
}

export default AppsInfo
