import {
  Box,
  Divider,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import useStyles from "./styles";

function Footer() {
  const classes = useStyles();
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("md"));

  const redirectHandler = (link) => {
    window.open(link, "_blank");
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
              color: "#6FCF97",
              marginBottom: 20,
            }}
            align="center"
          >
            Enatega
          </Typography>
          <Typography
            variant="body2"
            style={{ fontWeight: 500, color: "#fff", fontSize: 15 }}
          >
            Enatega is an open-source delivery management platform for the
            future. We prioritize innovation, flexibility, and affordability,
            and offer a scalable, customizable solution that streamlines your
            delivery processes.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6.5} align="center">
        <Box style={{ margin: small ? "2rem 0rem 4rem 0rem" : 0 }}>
          <Typography
            variant="body2"
            style={{ fontWeight: 700, fontSize: "1.4rem" }}
          >
            Links
          </Typography>
          <RouterLink
            to={"/"}
            style={{
              textDecoration: "none",
            }}
          >
            <Typography
              variant="body2"
              style={{ fontWeight: 700, marginTop: 10, color: "black" }}
            >
              Home
            </Typography>
          </RouterLink>
          <RouterLink to="/privacy" style={{ textDecoration: "none" }}>
            <Typography
              variant="body2"
              style={{ fontWeight: 700, marginTop: 10, color: "black" }}
            >
              Privacy Policy
            </Typography>
          </RouterLink>
          <RouterLink to="/terms" style={{ textDecoration: "none" }}>
            <Typography
              variant="body2"
              style={{ fontWeight: 700, marginTop: 10, color: "black" }}
            >
              Terms and Conditions
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
            Enatega – © 2022 All Rights Reserved
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
          Follow Us
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
            <FacebookIcon style={{ color: "#90EA93" }} />
          </Box>
          <Box
            className={classes.iconContainer}
            style={{ marginLeft: 10 }}
            onClick={() => redirectHandler("https://twitter.com/NinjasCode1")}
          >
            <TwitterIcon style={{ color: "#90EA93" }} />
          </Box>
          <Box
            className={classes.iconContainer}
            style={{ marginLeft: 10 }}
            onClick={() =>
              redirectHandler("https://www.instagram.com/enatega.nb/")
            }
          >
            <InstagramIcon style={{ color: "#90EA93" }} />
          </Box>
          <Box
            className={classes.iconContainer}
            style={{ marginLeft: 10 }}
            onClick={() =>
              redirectHandler("https://www.linkedin.com/company/14583783")
            }
          >
            <LinkedInIcon style={{ color: "#90EA93" }} />
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
            <GitHubIcon style={{ color: "#90EA93" }} />
          </Box>
        </Box>
        <Typography
          variant="body2"
          style={{ fontWeight: 700, display: "inline" }}
        >
          Powered By{" "}
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
              backgroundColor: "#000",
              color: "#fff",
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
          Enatega – © 2022 All Rights Reserved
        </Typography>
      </Grid>
    </Grid>
  );
}

export default Footer;
