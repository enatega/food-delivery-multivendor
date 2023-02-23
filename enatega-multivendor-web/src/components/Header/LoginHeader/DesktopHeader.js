import { Box, Divider } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import CartIcon from "../../../assets/icons/CartIcon";
import ProfileIcon from "../../../assets/icons/ProfileIcon";
import useStyle from "./styles";
import { ReactComponent as Logo } from "../../../assets/images/logo.svg";
import { useTheme } from "@emotion/react";

function LoginDesktopHeader({ title, showIcon, showCart = false }) {
  const classes = useStyle();
  const theme = useTheme();
  const location = useLocation();
  return (
    <AppBar elevation={0} position="fixed">
      <Toolbar className={classes.toolbar}>
        <RouterLink
          to={location.pathname === "/checkout" ? "/restaurant-list" : "/"}
          className={classes.linkDecoration}
        >
          <Logo height={50} width={50} />

          <Typography
            variant="h6"
            color={theme.palette.common.black}
            className={classes.font700}
            style={{ marginLeft: "8px" }}
          >
            {title}
          </Typography>
        </RouterLink>
        <Box className={classes.flex}>
          {showIcon && (
            <>
              <Divider flexItem orientation="vertical" light />
              <RouterLink to={"/login"} className={classes.linkDecoration}>
                <Button aria-controls="simple-menu" aria-haspopup="true">
                  <ProfileIcon />
                  <Typography
                    variant="button"
                    color="textSecondary"
                    className={`${classes.ml} ${classes.font700}`}
                  >
                    {"Login"}
                  </Typography>
                </Button>
              </RouterLink>
              <Divider flexItem orientation="vertical" light />
            </>
          )}
          {showCart && (
            <Box style={{ alignSelf: "center" }}>
              <RouterLink to="/" className={classes.linkDecoration}>
                <Button>
                  <CartIcon />
                </Button>
              </RouterLink>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default React.memo(LoginDesktopHeader);
