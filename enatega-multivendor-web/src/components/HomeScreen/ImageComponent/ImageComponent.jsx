import { Box } from "@mui/material";
import React from "react";

const ImageComponent = ({ image }) => {
  return (
    <Box
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <img
        src={image}
        alt=""
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
      />
    </Box>
  );
};

export default ImageComponent;
