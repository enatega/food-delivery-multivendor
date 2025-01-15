import React from "react";
import { Typography, Grid ,Box } from "@mui/material";
import useStyles from "./styles";

const PlaceholderComponent = ({ imageSrc, formComponent, imageText }) => {
  const classes = useStyles();

  return (
    <Grid className={classes.mainContainer} container md={12} xs={11} gap={2} >
      <Grid className={classes.imageContainer} item xs={12} sm={8} md={5} alignItems={"center"}>
        <Box className={classes.imgCont} alignItems={"center"} justifyContent={"center"}>
        <img 
          src={imageSrc} 
          alt="Placeholder" 
          className={`${classes.image} ${imageText ? classes.smallerImage : ''}`} 
        />
        {imageText && (
          <Typography className={classes.imageText}>{imageText}</Typography>
          )}
          </Box>
      </Grid>
      <Grid item xs={12} sm={8} md={5}>
        {formComponent}
      </Grid>
    </Grid>
  );
};

export default PlaceholderComponent;