import React from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
} from "@mui/material";

import {ReactComponent as EmailSend} from "../../../../assets/images/EmailSend.svg"


const FooterBottom = () => {
  return (
    <Grid
      container
      xs={11}
      md={12}
      alignItems={"end"}
      style={{
        width: "100%",
        margin: "0 auto",
      }}
    >
      <Grid item md={4} xs={12}>
        <Typography color={"white"} align="center">
          <span style={{ color: "#5AC12F" }}>Enatega </span>- © 2025 All Rights
          Reserved
        </Typography>
      </Grid>

      <Grid item md={4} xs={12} align="center">
        <Typography color={"white"}>
          Powered by :
          <span
            style={{
              color: "white",
              border: "1px solid white",
              borderRadius: "20px",
              paddingLeft: "8px",
              paddingRight: "8px",
              marginLeft: "8px",
            }}
          >
            ninjascode
          </span>
        </Typography>
      </Grid>

      <Grid item md={4} xs={12} align="center">
        <Box
          color={"white"}
          style={{
            width: "300px",
          }}
        >
          <Typography
            style={{  display: "flex" }}
            sx={{
              justifyContent: {
                xs: "center",
                sm: "left",
              },
            }}
          >
            Subscribe
          </Typography>
          <Box style={{ border:"1px solid #5AC12F",borderRadius:"5px", display:"flex",padding:"2px" }} alignItems={"center"} justifyContent={"center"}    >
          <TextField
            variant="standard"
            style={{width:"250px"}}
            disableUnderline={true}
            type={"email"}
            size="small"
            InputProps={{ disableUnderline: true }}
            placeholder="Enter Your Email Address"
            sx={{      
              input: { color: "white" }, 
              "& .MuiInputBase-input::placeholder": {
                 color: "#787878", 
              },
              "& .MuiInputBase-input:hover": {
                border:"none"
              },
              "& .MuiInputBase-input:focus": {
                border:"none"
              },
              boxShadow:"none"
            }}
          />
          <EmailSend />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default FooterBottom;
