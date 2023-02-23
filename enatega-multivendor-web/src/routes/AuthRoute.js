import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import UserContext from "../context/User";

function AuthRoute({ children }) {
  const { isLoggedIn } = useContext(UserContext);
  const location = useLocation();

  if (isLoggedIn)
    return (
      <Navigate
        replace
        to={{
          pathname: location.state?.from ? location.state.from : "/",
        }}
      />
    );
  return children;
}

export default AuthRoute;
