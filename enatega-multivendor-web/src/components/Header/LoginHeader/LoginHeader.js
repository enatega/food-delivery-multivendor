import React from "react";
import { useLocation } from "react-router";
import LoginDesktopHeader from "./DesktopHeader";

const TITLE = "Enatega";

const REGISTRATION_PATH = [
  "/login",
  "/new-login",
  "/registration",
  "/login-email",
  "/forgot-password",
  "/email-sent",
  "/phone-number",
  "/verify-email"
];

function Header({ showIcon = false }) {
  const location = useLocation();
  const showCart = !REGISTRATION_PATH.includes(location.pathname);

  return (
    <LoginDesktopHeader showIcon={showIcon} title={TITLE} showCart={showCart} />
  );
}

export default React.memo(Header);
