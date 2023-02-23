import { Box, Divider, Menu, MenuItem, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import CartIcon from "../../assets/icons/CartIcon";
import HeartIcon from "../../assets/icons/HeartIcon";
import HeartActiveIcon from "../../assets/icons/HeartActiveIcon";
import ProfileIcon from "../../assets/icons/ProfileIcon";
import useStyle from "./styles";
import { ReactComponent as Logo } from "../../assets/images/logo.svg";

function DHeader({
  navitems,
  title,
  close,
  open,
  anchor,
  name,
  favLength = 0,
  cartCount = 0,
  mobile,
}) {
  const theme = useTheme();
  const classes = useStyle();
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
          <Divider flexItem orientation="vertical" light />
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={(event) => open(event)}
          >
            <ProfileIcon />
            {!mobile && (
              <Typography
                variant="button"
                color="textSecondary"
                noWrap
                className={`${classes.ml} ${classes.font700}`}
                style={{ maxWidth: 70 }}
              >
                {name}
              </Typography>
            )}

            {anchor === null ? (
              <ExpandMoreIcon color="primary" />
            ) : (
              <ExpandLessIcon color="primary" />
            )}
          </Button>
          <Divider flexItem orientation="vertical" light />
          <Menu
            id="long-menu"
            anchorEl={anchor}
            keepMounted
            open={Boolean(anchor)}
            onClose={close}
            getcontentanchorel={null}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            style={{ marginTop: "40px" }}
          >
            {navitems.map((item, index) => (
              <Box key={index}>
                <RouterLink to={item.link} className={classes.linkDecoration}>
                  <MenuItem
                    className={classes.menuItem}
                    onClick={() => close(item.title)}
                  >
                    <Typography color="textSecondary" variant="body2">
                      {item.title}
                    </Typography>
                  </MenuItem>
                </RouterLink>
                {index === 1 && <Divider light />}
              </Box>
            ))}
          </Menu>
          <Box display="flex" alignItems="center">
            <Box mr={theme.spacing(3)} ml={theme.spacing(3)}>
              <RouterLink to="/favourite">
                {favLength > 0 ? <HeartActiveIcon /> : <HeartIcon />}
              </RouterLink>
            </Box>
            {cartCount && (
              <>
                <Divider orientation="vertical" light />
                <RouterLink to="/checkout" className={classes.linkDecoration}>
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    ml={theme.spacing(3)}
                  >
                    <CartIcon />
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      className={classes.cartText}
                    >
                      {cartCount}
                    </Typography>
                  </Box>
                </RouterLink>
              </>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default React.memo(DHeader);
