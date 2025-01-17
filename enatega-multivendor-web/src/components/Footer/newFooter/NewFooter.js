import {
  Box,
  Grid,
} from "@mui/material";
import React from "react";
import AllLinks from "./Links/AllLinks";
import SocialLinks from "./Links/SocialLinks";
import Partner from "./Partner/Partner";
import FooterBottom from "./FooterBottom/FooterBottom";

const NewFooter = () => {
  let getnewlinks = [
    { name: "footerLinkTC", link: "/terms" },
    { name: "about", link: "/" },
    { name: "footerLinkPP", link: "/privacy" },
    { name: "contactUs", link: "/contact_us" },
  ];

  let helplinks = [
    { name: "vendors", link: "/becomeavendor" },
    { name: "drivers", link: "/becomearider" },
  ];

  return (
    <Box
      container
      alignItems="center"
      style={{
        backgroundColor: "#0D0D0D",
        paddingTop: "40px",
        paddingBottom: "40px",
        marginTop: "30px",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Box items width="100%" alignItems={"center"} justifyContent={"center"}>
        <Grid
          container
          md={10}
          xs={12}
          justifyContent="space-between"
          margin="0 auto"
          marginBottom={"40px"}
          spacing={1}
        >
          <Grid xs={12} md={6} lg={3} >
            <AllLinks heading="getToKnow" links={getnewlinks} />
          </Grid>

          <Grid xs={12} md={6} lg={3}>
            <AllLinks heading="letUsHelp" links={helplinks} />
          </Grid>
          <Grid xs={12} md={6} lg={3}>
            <SocialLinks />
          </Grid>
          <Grid xs={12} md={6} lg={3}>
            <Partner />
          </Grid>
        </Grid>

        <Grid
          container
          xs={12}
          md={10}
          justifyContent={"space-between"}
          alignItems={"center"}
          margin="0 auto"
        >
          <FooterBottom />
        </Grid>
      </Box>
    </Box>
  );
};

export default NewFooter;
