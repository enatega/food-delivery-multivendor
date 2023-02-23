import { Box, Grid, Hidden } from "@mui/material";
import React, { useContext } from "react";
import UserContext from "../../../context/User";
import CartView from "./CartView";
import EmptyView from "./EmptyView";

function RestaurantCart(props) {
  const { cart } = useContext(UserContext);
  return (
    <Hidden lgDown>
      <Grid
        item
        lg={3}
        xs={false}
        style={{
          background: "#fafafa",
        }}
      >
        <Box style={{ position: "sticky", top: "175px" }}>
          {!cart.length ? <EmptyView showMessage={props.showMessage} /> : <CartView showMessage={props.showMessage} />}
        </Box>
      </Grid>
    </Hidden>
  );
}

export default React.memo(RestaurantCart);
