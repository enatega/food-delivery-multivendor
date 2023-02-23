import StopIcon from "@mui/icons-material/Stop";
import React from "react";
import useStyles from "./styles";

function ThreeDots() {
  const classes = useStyles();
  return (
    <>
      {Array(3)
        .fill(null)
        .map((item, index) => (
          <StopIcon color="primary" key={index} className={classes.dot} />
        ))}
    </>
  );
}

export default React.memo(ThreeDots);
