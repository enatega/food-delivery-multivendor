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
import useStyle from "./styles.js";
import DoubleMobile from "../../../assets/images/DoubleMobile.png";
import zIndex from "@mui/material/styles/zIndex.js";

const OrderFavorites = () => {
  let classes = useStyle();
  return (
    <Box className={classes.mainBox}>
      <Grid
        container
        xs={11}
        md={10}
        className={classes.container}
        alignItems={"center"}
      >
        <Grid item xs={12} md={6}>
          <Box>
            <Typography className={classes.head}>
              Order Your Favorites Anytime, Anywhere
            </Typography>

            <Typography className={classes.text}>
              Experience the convenience of having all your favorite restaurant
              meals and cuisines in one place, delivered straight to your
              door—fast and fresh. Download the Enatega App today, and turn
              every craving into a delicious reality.
            </Typography>
            <Typography className={classes.text}>
              Explore a wide range of options, from local favorites and comfort
              food to gourmet dishes, healthy eats, and more.
            </Typography>
            <Typography className={classes.text}>
              Download the Enatega App today, and turn every craving into a
              delicious reality.
            </Typography>

            <Box>
              <Button></Button>
              <Button></Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            style={{
              top: -105,
              zIndex: 2,
            }}
            sx={{
              position: {
                md: "absolute",
                xs: "block",
              },
              top: {
                md: "-105",
                xs: "0",
              },
              transform: {
                md: "rotate(6.49deg)",
                xs: "rotate(0deg)",
              },
            }}
          >
            <img
              src={DoubleMobile}
              alt="image"
              className={classes.phoneImg}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderFavorites;
