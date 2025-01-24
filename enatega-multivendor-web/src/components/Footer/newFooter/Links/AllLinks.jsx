import { Box, Typography } from "@mui/material";
import React from "react";

import { useTranslation } from "react-i18next";
import SingleLink from "./SingleLink";

const AllLinks = ({ heading, links }) => {
  const { t } = useTranslation();

  return (
    <Box alignItems={"center"} justifyContent={"center"}
      sx={{
        marginBottom: {
          xs: "30px",
        },
      }}
    >
      <Typography
        variant="h5"
        style={{
          fontWeight: 900,
          color: "#F1F1F1",
          display: "flex",
          align: "center",

          marginBottom: 20,
        }}
        sx={{
          justifyContent: {
            xs: "center",
            md: "left",
          },
        }}
      >
        {t(heading)}
      </Typography>

      {links.map((item) => {
        return <SingleLink name={item.name} route={item.link} />;
      })}
    </Box>
  );
};

export default AllLinks;
