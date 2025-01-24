import React from "react";
import { Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SingleLink = ({ name, route }) => {
  const { t } = useTranslation();
  return (
    <RouterLink to={route} style={{ textDecoration: "none" }}>
      <Typography
        variant="body2"
        style={{
          fontWeight: 700,
          marginTop: 2,
          color: "#5AC12F",
          display: "flex",
        }}
        sx={{
          justifyContent: {
            xs: "center",
            md: "left",
          },
        }}
      >
        {t(name)}
      </Typography>
    </RouterLink>
  );
};

export default SingleLink;
