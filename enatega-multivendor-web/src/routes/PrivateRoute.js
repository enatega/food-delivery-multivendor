import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import UserContext from "../context/User";

function PrivateRoute({ children }) {
  const { isLoggedIn } = useContext(UserContext);
  const location = useLocation();

  if (!isLoggedIn)
    return (
      <Navigate
        to={{
          pathname: `/login/?redirect=${location.pathname}`,
        }}
        state={{ from: location.pathname }}
      />
    );
  return children;
}

export default PrivateRoute;
