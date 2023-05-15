import { Box, Divider, Menu, MenuItem, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import useStyle from "./styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { ReactComponent as PersonIcon } from "../../assets/icons/user.svg";
import { ReactComponent as FavoriteBorderIcon } from "../../assets/icons/favourite.svg";
import { ReactComponent as LocalMallIcon } from "../../assets/icons/cart.svg";

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
    <AppBar
      elevation={0}
      position="fixed"
      style={{
        background: "transparent",
      }}
      className={classes.root}
    >
      <Toolbar className={classes.toolbar}>
        <RouterLink
          to={
            location.pathname === "/checkout"
              ? "/restaurant-list"
              : "/restaurant-list"
          }
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
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={(event) => open(event)}
          >
            <PersonIcon className={classes.icon} />
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
              <ExpandMoreIcon color="primary" className={classes.icon} />
            ) : (
              <ExpandLessIcon color="primary" className={classes.icon} />
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
            style={{
              marginTop: "48px",
            }}
            MenuListProps={{
              style: {
                background: "rgba(243, 244, 248, 0.8)",
                backdropFilter: "blur(6px)",
                padding: 0,
              },
            }}
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
              </Box>
            ))}
          </Menu>
          <Box display="flex" alignItems="center">
            <Box mr={theme.spacing(3)} ml={theme.spacing(3)}>
              <RouterLink to="/favourite">
                {favLength > 0 ? (
                  <FavoriteIcon className={classes.icon} />
                ) : (
                  <FavoriteBorderIcon className={classes.icon} />
                )}
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
                    <LocalMallIcon className={classes.icon} />
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
