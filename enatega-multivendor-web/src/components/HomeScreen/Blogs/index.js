import React from "react";
import {
  Box,
  Divider,
  Typography,
  Grid,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Blog1 from "../../../assets/images/blog1.png";
import Blog2 from "../../../assets/images/blog2.png";
import { useTranslation } from "react-i18next";

export default function Blogs() {
  const { t } = useTranslation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Grid container alignItems="center" style={{ position: "relative" }}>
      <Grid item xs={12} md={9}>
        <BlogComponent
          image={Blog1}
          title={"Alternative software to GloriaFood"}
          desc="GloriaFood provides restaurant businesses an online ordering solution in this post we are going to…"
        />
        <Box mt={8} />
        <BlogComponent
          image={Blog2}
          title={"How to make your own food delivery app like ubereats"}
          desc="Currently, we are using multiple food delivery apps for delivering food some of the popular food delivery apps....."
        />
      </Grid>

      <Grid item xs={12} md={3} align={mobile ? "center" : "start"}>
        <Box mt={mobile ? 10 : 0} />

        <Button
          style={{
            backgroundColor: "white",
            color: theme.palette.button.main,
            width: 160,
            margin: mobile ? "1rem 0 1rem 0" : 0,
            fontWeight: 700,
            borderRadius: 10,
          }}
          onClick={() => window.open("https://medium.com/enatega", "_blank")}
          variant="contained"
          disableElevation
        >
          {t("readAll")}
        </Button>
        <Box mt={mobile ? 5 : 0} />
      </Grid>
    </Grid>
  );
}

function BlogComponent({ title, desc }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Grid container>
      <Grid item xs={12} align="center">
        <Box mt={small ? 10 : 0} />
        <Box
          style={{
            width: small ? "90%" : "80%",
            backgroundColor: theme.palette.common.white,
            background:
              "linear-gradient(to right, theme.palette.primary.main 0%, theme.palette.common.white 20%)",
            minHeight: small ? 400 : 200,
            borderRadius: 40,
            display: "flex",
          }}
        >
          <img
            alt="blog1"
            src={Blog1}
            style={{
              height: "auto",
              width: small ? 160 : 200,
              borderRadius: small ? 40 : 0,
            }}
          />
          <Box
            style={{
              width: "100%",
              display: "flex",
              flexDirection: small ? "column" : "row",
              padding: small ? "1rem 0 1rem 0" : 0,
            }}
          >
            <Box
              display="flex"
              justifyContent="center"
              flexDirection={"column"}
              style={{ textAlign: "start", width: small ? "90%" : "60%" }}
              alignItems="center"
            >
              <Typography
                variant="body2"
                style={{
                  fontWeight: 900,
                  fontSize: small ? "1rem" : "1.4rem",
                }}
              >
                {title}
              </Typography>
              <Divider style={{ width: "70%", marginTop: 10 }} />

              <Typography
                variant="body2"
                style={{ fontWeight: 500, marginTop: 10 }}
              >
                {desc}
              </Typography>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent={small ? "flex-start" : "center"}
              style={{
                backgroundColor: "transparent",
                flexGrow: 1,
                flexWrap: "wrap",
                margin: small ? "0.5rem 0 0.5rem 0" : 0,
              }}
            >
              <Button
                style={{
                  backgroundColor: "#90B991",
                  color: theme.palette.common.white,
                  width: small ? "auto" : 160,
                  borderRadius: 10,
                }}
                variant="contained"
                disableElevation
                onClick={() =>
                  window.open("https://medium.com/enatega", "_blank")
                }
              >
                {t("readMore")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
