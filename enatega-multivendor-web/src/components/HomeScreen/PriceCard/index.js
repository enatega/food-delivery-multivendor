import { Typography, Box, Divider, Button, useTheme } from "@mui/material";
import useStyle from "./styles";
import { useTranslation } from "react-i18next";

export default function PriceCard({ price, offer, desc, center }) {
  const { t } = useTranslation();
  const classes = useStyle();
  const theme = useTheme();
  return (
    <Box className={`${classes.container}`}>
      <Box className={classes.top}>
        <Box>
          <Typography
            variant="h5"
            style={{
              fontWeight: 900,
              color: theme.palette.common.white,
              fontSize: 30,
            }}
            align="center"
          >
            $
            <Typography
              variant="body1"
              style={{
                color: theme.palette.common.white,
                display: "inline",
                fontSize: 30,
                marginBottom: "5%",
              }}
              align="center"
            >
              {price}
            </Typography>
          </Typography>
          <Typography
            variant="h5"
            style={{ fontWeight: 600, color: theme.palette.common.white }}
            align="center"
          >
            {offer[0]}
            <Typography
              variant="body1"
              style={{
                color: theme.palette.common.white,
                display: "inline",
                fontSize: 25,
              }}
              align="center"
            >
              {offer[1]}
            </Typography>
          </Typography>
        </Box>
      </Box>
      <Box className={classes.outsideBottom}>
        <Box
          className={classes.bottom}
          style={{
            backgroundColor: center ? "#DDE6EB" : theme.palette.primary.main,
          }}
        >
          <Box
            style={{ width: "70%" }}
            display="flex"
            flexDirection="column"
            alignItems={"center"}
          >
            <Typography variant="body2" align="center" style={{ fontSize: 18 }}>
              {desc[0]}
            </Typography>
            <Divider
              variant="horizontal"
              style={{
                width: "90%",
                marginTop: 10,
                borderBottomWidth: 2,
                backgroundColor: theme.palette.common.black,
              }}
            />

            <Typography
              variant="body2"
              style={{ marginTop: 10, fontSize: 18 }}
              align="center"
            >
              {desc[1]}
            </Typography>
            <Box mt={5} mb={2}>
              <Button
                style={{
                  backgroundColor: center
                    ? theme.palette.button.main
                    : theme.palette.common.white,
                  color: center
                    ? theme.palette.common.white
                    : theme.palette.common.black,
                  width: 140,
                  fontWeight: 700,
                }}
                variant="contained"
                disableElevation
                onClick={() =>
                  window.open("https://enatega.com/#contact", "_blank")
                }
              >
                {t("getQuote")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
