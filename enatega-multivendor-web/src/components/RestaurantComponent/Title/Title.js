import { Typography, useMediaQuery, useTheme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  restaurantTitle: {
    color: theme.palette.common.black,
    fontWeight: 700,
  },
}));
function Title({ title }) {
  const classes = useStyles();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fontSize = mobile ? theme.typography.h5.fontSize : "1.8rem";
  return (
    <Typography
      style={{ paddingBottom: "20px", fontSize: fontSize }}
      variant="h4"
      className={classes.restaurantTitle}
    >
      {title}
    </Typography>
  );
}

export default React.memo(Title);
