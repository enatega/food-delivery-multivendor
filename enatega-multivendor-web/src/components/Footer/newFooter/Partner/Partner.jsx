import {
  Box,
  Typography, 
  Button,
} from "@mui/material";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

const Partner = () => {
  const {t} =useTranslation()
  const navigate = useNavigate();
  return (
    <Box>
      <Typography
        variant="h5"
        style={{ color: "white", display: "flex", fontWeight: 900, }}
        sx={{
          justifyContent: {
            xs: "center",
            md: "left",
          },
        }}
      >
        Partner with us
      </Typography>

      <Box
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        sx={{
          justifyContent: {
            xs: "center",
            md: "left",
          },
        }}
      >
        <Button
          
          variant="contained"
          style={{ backgroundColor: "#5AC12F", width: "230px", color: "black" ,textAlign:"left",}}
          sx={{
            margin: {
              xs: "10px auto",
              md: "10px 0 5px 0",
            },
          }}
          onClick={()=>{
            navigate("/becomeavendor")
          }}
        >
          {t("becomeVendor")}
          <ArrowForwardIosIcon
            style={{ width: "20px", height: "20px", color: "black" , }}
          />
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#5AC12F",
            marginBottom: 10,
            width: "230px",
            color: "black",
          }}
          sx={{
            margin: {
              xs: "10px auto",
              md: "5px 0 5px 0",
            },
          }}
          onClick={()=>{
            navigate("/becomearider")
          }}
        >
         {t("becomeRestaurant")}
          <ArrowForwardIosIcon
            style={{ width: "20px", height: "20px", color: "black" }}
          />
        </Button>
      </Box>
    </Box>
  );
};

export default Partner;
