import React from "react";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import deliveryImg from "../../assets/images/restaurants.jpeg";
import pickupImg from "../../assets/images/pickup.png";

import useStyles from "./styles";

const DeliveryTabs = ({ active, activeTabChange, inactiveTabChange }) => {
   const styles = useStyles();

   return (
      <Grid container className={styles.center}>
         <Grid
            item
            className={
               `${styles.box} ${active === "delivery" ? styles.activeTab : ""}`
            }
            mb={2}
            onClick={activeTabChange}
         >
            <Box className={styles.innerBox}>
               <Typography className={styles.text} component="div" variant="h6">
                  Delivery
               </Typography>
            </Box>
            <CardMedia
               component="img"
               sx={{ width: 120, height: 75 }}
               image={deliveryImg}
               alt="Delivery"
            />
         </Grid>
         <Grid
            item
            className={`${styles.box} ${active === "pickup" ? styles.activeTab : ""}`}
            mb={2}
            onClick={inactiveTabChange}
         >
            <Box className={styles.innerBox}>
               <Typography className={styles.text} component="div" variant="h6">
                  Pickup
               </Typography>
            </Box>
            <CardMedia
               component="img"
               className={styles.image}
               image={pickupImg}
               alt="Pickup"
            />
         </Grid>
      </Grid>
   );
};
export default DeliveryTabs;
