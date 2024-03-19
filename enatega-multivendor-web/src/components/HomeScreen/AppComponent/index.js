import React from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PlayStore from "../../../assets/images/play-store.png";
import AppStore from "../../../assets/images/app-store.png";
import Banner2 from "../../../assets/images/banner-2.png";
import Banner1 from "../../../assets/images/banner-1.png";
import useStyles from "./styles";
import { useTranslation } from 'react-i18next';

export default function AppComponent() {
  const { t } = useTranslation()
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("md"));
  const medium = useMediaQuery(theme.breakpoints.down("lg"));
  const classes = useStyles();
  return (
    <Box
      mb={10}
      className={classes.container}
      style={{
        width: small ? "85%" : "70%",
        marginTop: small ? "4rem" : 0,
        marginBottom: "120px",
      }}
    >
      <Typography className={small ? classes.bgTextSmall : classes.bgText}>
        APP
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        flexDirection={"column"}
        style={{
          textAlign: small ? "center" : "start",
          marginLeft: small ? 10 : 40,
          marginTop: small ? "4rem" : "2rem",
        }}
      >
        <Typography
          variant="body2"
          style={{ fontWeight: 600, fontSize: "1.4rem" }}
        >
          {t('putUsInYourPocket')}
        </Typography>
        <Typography variant="body2" className={classes.fontContainer}>
          {t('containerText')}
        </Typography>
        {medium && (
          <Box display="flex" justifyContent="center">
            <Box>
              <img src={Banner2} alt="banner2" className={classes.img1} />
            </Box>
            <Box>
              <img src={Banner1} alt="banner1" className={classes.img2} />
            </Box>
          </Box>
        )}
        <Box
          display="flex"
          alignItems="center"
          justifyContent={"center"}
          style={{ backgroundColor: "transparent", marginTop: small ? "0px" : "25px", marginBottom: medium ? "25px" : "0px"}}

          //mt={5}
        >
          <Button
            className={classes.btn}
            style={{
              width: small ? "auto" : 140,
              borderRadius: 10,
            }}
            startIcon={<img src={PlayStore} alt="playstore" />}
            variant="contained"
            disableElevation
            onClick={() =>
              window.open(
                "https://apps.apple.com/pk/app/enatega-multivendor/id1526488093",
                "_blank"
              )
            }
          >
            Ios Store
          </Button>
          <Button
            className={classes.btn}
            style={{
              marginLeft: 10,
              width: small ? "auto" : 140,
              borderRadius: 10,
            }}
            variant="contained"
            disableElevation
            startIcon={<img src={AppStore} alt="appstore" />}
            onClick={() =>
              window.open(
                "https://play.google.com/store/apps/details?id=com.enatega.multivendor",
                "_blank"
              )
            }
          >
            Play Store
          </Button>
        </Box>{" "}
      </Box>
    </Box>
  );
}
