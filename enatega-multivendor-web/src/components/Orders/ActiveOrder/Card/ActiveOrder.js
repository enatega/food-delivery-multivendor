/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import React, { useContext } from "react";
import UserContext from "../../../../context/User";
import { Link as RouterLink } from "react-router-dom";
import useStyles from "./styles";
import { useSubscription } from "@apollo/client";
import { subscriptionOrder } from "../../../../apollo/server";
import gql from "graphql-tag";
import { OrderCard } from "../OrderCard/OrderCard";
import { ACTIVE_STATUS } from "../../../../utils/constantValues";

function ActiveOrder(props) {
  useSubscription(
    gql`
      ${subscriptionOrder}
    `,
    { variables: { id: props._id } }
  );
  const theme = useTheme();
  const extraSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles(extraSmall);
  const { loadingOrders, errorOrders, orders } = useContext(UserContext);
  const order = orders.filter((o) => ACTIVE_STATUS.includes(o.orderStatus));
  if (loadingOrders) return <Typography>Loading...</Typography>;
  if (errorOrders) {
    if (errorOrders.message === "Unauthenticated!") {
      return null;
    }
    return <Typography>{errorOrders.message}</Typography>;
  }

  return (
    <Grid container display={"flex"}>
      <Grid item sm={1} xs={1} />
      <Grid container item xs={10} sm={10} md={10} lg={10} display={"flex"}>
        {order.map((item, index) => (
          <>{index < 4 && <OrderCard key={item._id} item={item} />}</>
        ))}
      </Grid>
      <Grid
        container
        justifyContent={"center"}
        alignItems={"center"}
        className={classes.m}
      >
        <Grid item>
          {order.length > 4 && (
            <RouterLink to={{ pathname: "/orders" }} className={classes.link}>
              <Box
                justifyContent={"center"}
                alignItems={"center"}
                className={classes.button}
              >
                <Typography variant="h5" color="white" textAlign={"center"}>
                  See More
                </Typography>
              </Box>
            </RouterLink>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default React.memo(ActiveOrder);
