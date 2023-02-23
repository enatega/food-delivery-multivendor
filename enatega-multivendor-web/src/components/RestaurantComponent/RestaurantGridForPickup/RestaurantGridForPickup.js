import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import Card from "../Card/Card";
import Title from "../Title/Title";
import useStyles from "./styles";

function RestaurantGridForPickup(props) {
   const theme = useTheme();
   const extraSmall = useMediaQuery(theme.breakpoints.down("sm"));
   const classes = useStyles(extraSmall);

   return (
      <Grid container item className={classes.mainContainer}>
         <Grid item sm={1} />
         <Grid item xs={12} sm={10} spacing={1}>
            <Title title="All restaurants" />
            <Grid container spacing={2}>
               {props.restaurants?.length < 1 ? (
                  <Grid container item xs={12} justifyContent="center">
                     <Typography
                        variant="h5"
                        align="center"
                        color="textSecondary"
                     >
                        No restaurants found
                     </Typography>
                  </Grid>
               ) : (
                  props.restaurants?.map((value, index) => (
                     <Grid
                        tabIndex="0"
                        id={value._id}
                        className={classes.card}
                        key={index}
                        p={2}
                        item
                        xs={12}
                     >
                        <Card
                           data={value}
                           cardImageHeight="200px"
                           grid={true}
                           checkCart={props.checkCart}
                           showMessage={props.showMessage}
                        />
                     </Grid>
                  ))
               )}
            </Grid>
         </Grid>
         <Grid item sm={1} />
      </Grid>
   );
}

export default RestaurantGridForPickup;
