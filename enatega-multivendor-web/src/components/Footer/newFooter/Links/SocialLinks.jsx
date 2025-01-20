import React from "react";
import { Box, Typography } from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SocialLinks = () => {
  const navigate=useNavigate()
  let { t } = useTranslation();
  let socialLinks = [
    { name: "facebook", icon: FacebookIcon, url: "/" },
    { name: "X", icon: XIcon, url: "/" },
    { name: "linkedin", icon: LinkedInIcon, url: "/" },
    { name: "Instagram", icon: InstagramIcon, url: "/" },
    { name: "Youtube", icon: YouTubeIcon, url: "/" },
  ];
  return (
    <Box
      sx={{
        marginBottom: "30px",
      }}
    >
      <Typography
        variant="h5"
        style={{
          fontWeight: 900,
          color: "#F1F1F1",
          marginBottom: 20,
          display: "flex",
        }}
        sx={{
          justifyContent: {
            xs: "center",
            md: "left",
          },
        }}
      >
        {t("letUsHelp")}
      </Typography>

      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "200px",
        }}
        sx={{
          justifyContent: {
            xs: "center",
            md: "left",
          },
          margin: {
            xs: "0 auto",
            md: "0",
          },
        }}
      >
        {socialLinks.map((item) => {
          return <Box key={item.name} onClick={
            ()=>
            {
              navigate(item.url)
            }
          } >
           <item.icon  style={{ color: "#5AC12F" , cursor:"pointer" }}  />;
          </Box>
          
        })}
      </Box>
    </Box>
  );
};

export default SocialLinks;
