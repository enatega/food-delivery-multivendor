import { Box, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  center: {
    justifyContent: "center",
    padding: theme.spacing(2, 3),
  },

  smallText: {
    fontSize: "0.875rem",
  },

  innerBottomOrder: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginTop: theme.spacing(3),
    },
  },
  heading: {
    fontSize: "2.175rem",
  },
  bottomOrder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      marginBottom: theme.spacing(3),
      padding: 10,
    },
  },
}));

export function Status({
  first,
  isEta,
  last,
  isActive,
  firstCol = "#90EA93",
  secondCol = "#C4C4C4",
}) {
  const theme = useTheme();
  const classes = useStyles();
  const small = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      className={classes.innerBottomOrder}
      ml={!small && first && theme.spacing(2)}
    >
      <Box
        sx={{
          bgcolor: isEta
            ? isActive
              ? secondCol
              : theme.palette.grey[500]
            : firstCol,
          width: small ? 25 : 20,
          height: small ? 23 : 20,
          borderRadius: 10,
        }}
      ></Box>
      {!last && (
        <Box
          sx={{
            width: 25,
            backgroundColor: isEta
              ? isActive
                ? secondCol
                : theme.palette.grey[500]
              : secondCol,
            height: "1px",
          }}
        />
      )}
    </Box>
  );
}
