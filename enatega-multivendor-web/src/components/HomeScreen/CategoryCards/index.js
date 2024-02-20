import {
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import useStyle from "./styles";
import AppStore from "../../../assets/images/AppVector.png";
import Vector from "../../../assets/images/Vector.png";
import Demo from "../../../assets/images/demo.png";
import { useTranslation } from "react-i18next";

export default function CategoryCards({
  title,
  description,
  image,
  web,
  link,
  isMobile,
  android,
  ios,
}) {
  const { t } = useTranslation();
  const classes = useStyle();
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box className={classes.container}>
      {!web ? (
        <img src={image} alt="apps" className={classes.image} />
      ) : (
        <img src={image} alt="apps" className={classes.imageWeb} />
      )}
      <Box className={classes.top}>
        <Box pb={3}>
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      </Box>
      <Box className={classes.bottom}>
        <Box style={{ width: "70%" }}>
          <Typography
            variant="body2"
            align="center"
            style={{
              fontWeight: 600,
              fontSize: 12,
              color: theme.palette.common.white,
            }}
          >
            {description[0]}
          </Typography>
          <Typography
            variant="body2"
            align="center"
            style={{
              fontWeight: 600,
              fontSize: 12,
              color: theme.palette.common.white,
            }}
          >
            {description[1]}
          </Typography>
          <br />
        </Box>
        {isMobile ? (
          <Box mt={1}>
            <Button
              className={classes.btn}
              style={{
                borderRadius: 10,
                paddingTop: "7px",
                paddingBottom: "7px",
                paddingRight: "14px",
                paddingLeft: "14px",
                color: "black",
                fontSize: small ? 9 : 14,
                backgroundColor: theme.palette.common.white,
              }}
              startIcon={
                <img src={Vector} alt="appstore" style={{ color: "black" }} />
              }
              variant="hidden"
              disableElevation
              onClick={() => window.open(android, "_blank")}
            >
              Play Store
            </Button>
            <Button
              className={classes.btn}
              style={{
                paddingTop: "7px",
                paddingBottom: "7px",
                paddingRight: "14px",
                paddingLeft: "14px",
                borderRadius: 10,
                color: "black",
                fontSize: small ? 9 : 14,
                backgroundColor: theme.palette.common.white,
                marginLeft: 8,
              }}
              startIcon={<img src={AppStore} alt="appstore" />}
              variant="contained"
              disableElevation
              onClick={() => window.open(ios, "_blank")}
            >
              Ios Store
            </Button>
          </Box>
        ) : (
          <Box mt={1}>
            <Button
              className={classes.btn}
              variant="contained"
              disableElevation
              startIcon={<img src={Demo} alt="Demo" />}
              onClick={() => window.open(link, "_blank")}
              sx={{
                width: 100,
                fontSize: small ? 9 : 14,
                p: "7px",
                borderRadius: 3,
                color: "black",
                backgroundColor: theme.palette.common.white,
              }}
            >
              {t("demo")}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
