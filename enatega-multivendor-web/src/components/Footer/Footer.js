import {
  Box,
  Divider,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useTranslation } from "react-i18next";

import useStyles from "./styles";

function Footer() {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const redirectHandler = (link) => {
    window.open(link, "_blank");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleButtonClick = () => {  
    try {  
      window.scrollTo({ top: 0, behavior: 'smooth' });  
    } catch (error) {  
      console.error("Smooth scroll failed", error);  
      // Fallback to instant scroll  
      window.scrollTo(0, 0);  
    }  
  };  


  return (
    <Grid container alignItems="center">
      <Grid
        item
        xs={12}
        md={2.5}
        align="center"
        style={{ padding: small ? "3rem" : 0 }}
      >
        <Box className={classes.left}>
          <Typography
            variant="h4"
            style={{
              fontWeight: 900,
              color: theme.palette.success.light,
              marginBottom: 20,
            }}
            align="center"
          >
            Enatega
          </Typography>
          <Typography
            variant="body2"
            style={{
              fontWeight: 500,
              color: theme.palette.common.white,
              fontSize: 15,
            }}
          >
            {t("footerText")}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6.5} align="center">
        <Box style={{ margin: small ? "2rem 0rem 4rem 0rem" : 0 }}>
          <Typography
            variant="body2"
            style={{ fontWeight: 700, fontSize: "1.4rem" }}
          >
            {t("linksTitle")}
          </Typography>
          <RouterLink
            to={"/"}
            onClick={handleButtonClick}
            style={{
              textDecoration: "none",
            }}
          >
            <Typography
              variant="body2"
              style={{ fontWeight: 700, marginTop: 10, color: "black" }}
            >
              {t("footerLinkHome")}
            </Typography>
          </RouterLink>
          <RouterLink to="/privacy" onClick={handleButtonClick} style={{ textDecoration: "none" }}>
            <Typography
              variant="body2"
              style={{ fontWeight: 700, marginTop: 10, color: "black" }}
            >
              {t("footerLinkPP")}
            </Typography>
          </RouterLink>
          <RouterLink to="/terms" onClick={handleButtonClick} style={{ textDecoration: "none" }}>
            <Typography
              variant="body2"
              style={{ fontWeight: 700, marginTop: 10, color: "black" }}
            >
              {t("footerLinkTC")}
            </Typography>
          </RouterLink>

          <Divider
            style={{
              width: "70%",
              marginTop: 30,
              display: small ? "none" : "block",
            }}
          />
          <Typography
            variant="body2"
            style={{
              fontWeight: 700,
              marginTop: 10,
              display: small ? "none" : "block",
            }}
          >
            {t("footerEndText")}
          </Typography>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        md={3}
        align="center"
        style={{ margin: small ? "0rem 0rem 4rem 0rem" : 0 }}
      >
        <Typography
          variant="body2"
          style={{ fontWeight: 700, fontSize: "1.4rem" }}
        >
          {t("followUs")}
        </Typography>
        <Box
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            marginTop: 50,
            marginBottom: 20,
          }}
        >
          <Box
            className={classes.iconContainer}
            onClick={() => redirectHandler("https://www.facebook.com/enatega/")}
          >
            <FacebookIcon style={{ color: theme.palette.primary.main }} />
          </Box>
          <Box
            className={classes.iconContainer}
            style={{ marginLeft: 10 }}
            onClick={() => redirectHandler("https://twitter.com/NinjasCode1")}
          >
            <TwitterIcon style={{ color: theme.palette.primary.main }} />
          </Box>
          <Box
            className={classes.iconContainer}
            style={{ marginLeft: 10 }}
            onClick={() =>
              redirectHandler("https://www.instagram.com/enatega.nb/")
            }
          >
            <InstagramIcon style={{ color: theme.palette.primary.main }} />
          </Box>
          <Box
            className={classes.iconContainer}
            style={{ marginLeft: 10 }}
            onClick={() =>
              redirectHandler("https://www.linkedin.com/company/14583783")
            }
          >
            <LinkedInIcon style={{ color: theme.palette.primary.main }} />
          </Box>
          <Box
            className={classes.iconContainer}
            style={{ marginLeft: 10 }}
            onClick={() =>
              redirectHandler(
                "https://github.com/Ninjas-Code-official/Marketplace-Food-Delivery-Solution"
              )
            }
          >
            <GitHubIcon style={{ color: theme.palette.primary.main }} />
          </Box>
        </Box>
        <Typography
          variant="body2"
          style={{ fontWeight: 700, display: "inline" }}
        >
          {t("poweredBy")}{" "}
        </Typography>
        <Box
          onClick={() => redirectHandler("https://ninjascode.com/")}
          style={{
            display: "inline-block",
            cursor: "pointer",
            marginTop: "30px",
          }}
        >
          <Typography
            style={{
              display: "inline",
              backgroundColor: theme.palette.common.black,
              color: theme.palette.common.white,
              paddingTop: "5px",
              paddingLeft: "15px",
              paddingRight: "15px",
              paddingBottom: "5px",
              borderRadius: 15,
              cursor: "pointer",
              marginLeft: "5px",
            }}
          >
            ninjascode
          </Typography>
        </Box>

        <Divider
          style={{
            width: "70%",
            marginTop: 30,
            display: small ? "block" : "none",
          }}
        />
        <Typography
          variant="body2"
          style={{
            fontWeight: 600,
            marginTop: 10,
            display: small ? "block" : "none",
            fontSize: 12,
          }}
        >
          {t("footerEndText")}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default Footer;
