import {
  Box,
  Divider,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import Card from "./Card";
import {ReactComponent as CustomerIcon} from '../../../assets/icons/CustomerIcon.svg'
import {ReactComponent as RestuarantIcon} from '../../../assets/icons/RestuarantIcon.svg'
import {ReactComponent as RiderIcon} from '../../../assets/icons/RiderIcon.svg'
import useStyle from "./styles";

const CardComponent = () => {

  let classes=useStyle()
  let functionalityList = [
    {
      icon: RestuarantIcon,
      heading: "For Restaurants",
      ticksList: [
        {
          heading: "Register – ",
          text: "List your restaurant easily.",
        },
        {
          heading: "Receive Orders –",
          text: " Manage them with our user-friendly dashboard.",
        },
        {
          heading: "Grow – ",
          text: "Attract more customers and boost sales.",
        },
      ],
    },

    {
        icon: RiderIcon,
        heading: "For Riders",
        ticksList: [
          {
            heading: "Register – ",
            text: "List your restaurant easily.",
          },
          {
            heading: "Receive Orders –",
            text: " Manage them with our user-friendly dashboard.",
          },
          {
            heading: "Grow – ",
            text: "Attract more customers and boost sales.",
          },
        ],
      },


      {
        icon: CustomerIcon,
        heading: "For Customers",
        ticksList: [
          {
            heading: "Register – ",
            text: "List your restaurant easily.",
          },
          {
            heading: "Receive Orders –",
            text: " Manage them with our user-friendly dashboard.",
          },
          {
            heading: "Grow – ",
            text: "Attract more customers and boost sales.",
          },
        ],
      },
  ];
  return (
    <Box className={classes.mainContainer}>
      <Typography className={classes.mainText}>How It Works for Everyone</Typography>
      <Grid container className={classes.cardBox} xs={11} md={10} gap={1} alignItems={"center"} >
        {
            functionalityList.map((item)=>
            {
                return (<Grid item md={3.9} xs={12} style={{margin:"0 auto"}} >
                <Card Icon={item.icon} heading={item.heading} ticksList={item.ticksList}
                />
                </Grid>)
            })
        }
      </Grid>
    </Box>
  );
};

export default CardComponent;
