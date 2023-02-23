import { Box } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import useStyles from "./styles";

function LoginMobileHeader({ title, showCart }) {
  const classes = useStyles();
  return (
    <AppBar elevation={0} position="fixed">
      <Toolbar className={classes.toolbar}>
        <Box />
        <RouterLink to="/" className={classes.linkDecoration}>
          <Typography variant="h6" color="black" className={classes.font700}>
            {title}
          </Typography>
        </RouterLink>
      </Toolbar>
    </AppBar>
  );
}

export default React.memo(LoginMobileHeader);
