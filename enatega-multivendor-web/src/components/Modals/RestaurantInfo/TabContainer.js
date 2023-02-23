import { Box } from "@mui/material";
import React from "react";

function TabContainer(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box pt={3} pb={3}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

export default React.memo(TabContainer);
