import { Box, Grid } from "@mui/material";
import React from "react";
import ImageComponent from "../ImageComponent/ImageComponent";
import PlatformSection from "../../../assets/images/PlatformSection.svg";
import JoinText from "./JoinText";
import useStyle from "./styles.js";

const JoinPlatform = () => {
  let classes = useStyle();
  return (
    <Box className={classes.mainContainer}>
      <Grid container md={10} xs={11} spacing={2} className={classes.container}>
        <Grid className={classes.joinContainer} xs={12} md={6}>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <JoinText />
          </Box>
        </Grid>
        <Grid xs={12} md={6}>
          <ImageComponent image={PlatformSection} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default JoinPlatform;
