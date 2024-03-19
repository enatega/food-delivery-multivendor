import React from "react";
import Curve from "../../../assets/images/curve.png";
import EasyEats from "../../../assets/images/easy-eats.png";

import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  bgText: {
    position: "absolute",
    bottom: -90,
    right: 0,
    fontSize: 80,
    fontWeight: 500,
    color: theme.palette.common.black,
    mixBlendMode: "normal",
    opacity: 0.24,
  },
  bgTextSmall: {
    position: "absolute",
    bottom: -100,
    right: 0,
    fontSize: 30,
    fontWeight: 500,
    color: theme.palette.common.black,
    mixBlendMode: "normal",
    opacity: 0.24,
  },
}));

export default function CaseStudy() {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const classes = useStyle();

  return (
    <Box>
      <div
        style={{
          position: "relative",
          margin: "auto",
          width: mobile ? "80%" : "90%",
        }}
      >
        <Typography className={mobile ? classes.bgTextSmall : classes.bgText}>
          Case Study
        </Typography>
        <img
          src={Curve}
          alt="curve"
          style={{
            maxWidth: "100%",
            height: mobile ? "180px" : "auto",
          }}
        />
        <Box
          style={{
            position: "absolute",
            top: mobile ? 10 : 20,
            left: mobile ? 20 : 40,
            height: "80%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <Box>
            <Typography
              variant={mobile ? "h5" : "h3"}
              style={{ color: "white" }}
            >
              Easy Eats
            </Typography>
            <Typography
              variant="body1"
              style={{
                color: "white",
                fontSize: mobile ? 12 : 22,
                wordSpacing: mobile ? 0 : 6,
              }}
            >
              We bring great food to <br /> your dorm.
            </Typography>
          </Box>

          <Button
            style={{
              backgroundColor: "white",
              color: theme.palette.button.main,
              width: mobile ? 140 : 160,
              fontSize: mobile ? 10 : 12,
              fontWeight: 600,
              borderRadius: 10,
            }}
            variant="contained"
            disableElevation
            onClick={() =>
              window.open(
                "https://ninjascode.com/Portfolio/Easyeats/",
                "_blank"
              )
            }
          >
            Read Case Study
          </Button>
        </Box>
        <Box
          style={{
            position: "absolute",
            top: mobile ? "-100px" : "-200px",
            right: mobile ? "-400px" : "-240px",
          }}
        >
          <img
            src={EasyEats}
            alt="easy-eats"
            style={{ maxWidth: mobile ? "35%" : "80%", height: "auto" }}
          />
        </Box>
      </div>
    </Box>
  );
}
