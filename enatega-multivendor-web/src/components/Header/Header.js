import { useMediaQuery, useTheme } from "@mui/material";
import React, { useContext } from "react";
import UserContext from "../../context/User";
import DHeader from "./desktop.header";
import Analytics from "../../utils/analytics";

const TITLE = "Enatega";
const NAME = "...";
const NAVITEMS = [
  {
    title: "My orders",
    link: "/orders",
  },
  {
    title: "Profile",
    link: "/profile",
  },
  {
    title: "Logout",
    link: "/login",
  },
];

function Header() {
  const theme = useTheme();
  const { logout, loadingProfile, profile, cartCount } =
    useContext(UserContext);
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async (route) => {
    if (route === "Logout") {
      logout();
      await Analytics.track(Analytics.events.USER_LOGGED_OUT);
      await Analytics.identify(null, null);
    }
    setAnchorEl(null);
  };
  return (
    <DHeader
      navitems={NAVITEMS}
      title={TITLE}
      close={handleClose}
      open={handleOpen}
      anchor={anchorEl}
      name={loadingProfile ? NAME : profile?.name}
      cartCount={cartCount}
      mobile={mobile}
    />
  );
}

export default React.memo(Header);
