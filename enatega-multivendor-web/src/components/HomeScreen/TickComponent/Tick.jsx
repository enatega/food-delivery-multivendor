import { Box, Typography } from "@mui/material";
import React from "react";
import useStyle from "./styles";
import { ReactComponent as Logo } from "../../../assets/icons/CheckIcon.svg";

const Tick = ({ heading, text, toggleColor }) => {
  let classes = useStyle();
  return (
    <Box className={classes.main}>
      <Typography className={classes.text}>
        <Logo
          className={classes.logo}
          style={{ backgroundColor: toggleColor ? "white" : "#EFF9EA" }}
        />
        <span
          className={classes.head}
          style={{ color: toggleColor ? "white" : "black" }}
        >
          {heading}
        </span>
        {text}
      </Typography>
    </Box>
  );
};

export default Tick;
