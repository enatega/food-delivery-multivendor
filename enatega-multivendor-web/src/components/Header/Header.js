import { useMediaQuery, useTheme } from "@mui/material";
import React, { useContext } from "react";
import UserContext from "../../context/User";
import DHeader from "./desktop.header";
import Analytics from "../../utils/analytics";
import { useTranslation } from 'react-i18next';
import { toTitleCase } from "../../utils/helper";
import { APP_NAME } from "../../utils/constantValues";

const TITLE = toTitleCase(APP_NAME);
const NAME = "...";


function Header() {
  const { t } = useTranslation();
  const NAVITEMS = [
    {
      title: t('titleOrders'),
      link: "/orders",
    },
    {
      title: t('titleProfile'),
      link: "/profile",
    },
    {
      title: t('titleSettings'),
      link: "/settings",
    },
    {
      title: t('titleLogout'),
      link: "/login",
    },
  ];
  const theme = useTheme();
  const { logout, loadingProfile, profile, cartCount } =
    useContext(UserContext);
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async (route) => {
    if (route === t('titleLogout')) {
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
