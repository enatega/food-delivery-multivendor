import { Paper } from "@mui/material";
import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Image from "../../assets/images/food-plate.png";

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    background: `url(${Image})`,
    width: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  },
}));
export default function Background({ children }) {
  const classes = useStyles();

  return <Paper className={classes.paperContainer}>{children}</Paper>;
}
