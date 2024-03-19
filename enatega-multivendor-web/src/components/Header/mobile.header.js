import {
  Box,
  Divider,
  Menu,
  MenuItem,
  MenuList,
  useTheme,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import CartIcon from "../../assets/icons/CartIcon";
import HeartIcon from "../../assets/icons/HeartIcon";
import HeartActiveIcon from "../../assets/icons/HeartActiveIcon";
import ProfileIcon from "../../assets/icons/ProfileIcon";
import useStyles from "./styles";

function MHeader({
  navitems,
  title,
  close,
  open,
  anchor,
  favLength = 0,
  cartCount = 0,
}) {
  const theme = useTheme();
  const classes = useStyles();
  return (
    <AppBar elevation={0} position="fixed">
      <Toolbar className={classes.toolbar}>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={(event) => open(event)}
        >
          <ProfileIcon />
        </Button>
        <Menu
          id="long-menu"
          anchorEl={anchor}
          keepMounted
          open={Boolean(anchor)}
          onClose={close}
          getcontentanchorel={null}
          style={{ marginTop: "40px", marginLeft: "-8px" }}
        >
          <MenuList style={{ padding: 0 }}>
            {navitems.map((item, index) => (
              <Box key={index}>
                <MenuItem
                  className={classes.menuItem}
                  onClick={() => close(item.title)}
                >
                  <RouterLink to={item.link} style={{ textDecoration: "none" }}>
                    <Typography color="textSecondary" variant="body2">
                      {item.title}
                    </Typography>
                  </RouterLink>
                </MenuItem>
                {index === 2 && <Divider light />}
              </Box>
            ))}
          </MenuList>
        </Menu>
        <RouterLink to="/" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            color={theme.palette.common.black}
            className={classes.font700}
          >
            {title}
          </Typography>
        </RouterLink>
        <Box display="flex">
          <Box mr={theme.spacing(3)}>
            <RouterLink to="/favourite">
              {favLength > 0 ? <HeartActiveIcon /> : <HeartIcon />}
            </RouterLink>
          </Box>
          {cartCount && (
            <RouterLink to="/checkout">
              <CartIcon />
            </RouterLink>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default React.memo(MHeader);
