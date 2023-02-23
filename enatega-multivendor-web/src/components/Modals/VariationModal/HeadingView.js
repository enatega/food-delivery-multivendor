import { Box, Typography } from "@mui/material";
import clsx from "clsx";
import React from "react";
import useStyles from "./styles";

function ItemHeadingView({ title = "Select Variation", subTitle = "Select 1", status = "Required", error = false }) {
  const classes = useStyles();
  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography style={{ fontSize: "1.25rem" }} className={classes.itemTitle}>
          {title}
        </Typography>
        <Typography className={clsx(classes.infoStyle, { [classes.itemError]: error })}>{status}</Typography>
      </Box>
      <Box>
        <Typography className={classes.priceTitle}>{subTitle}</Typography>
      </Box>
    </>
  );
}

export default React.memo(ItemHeadingView);
