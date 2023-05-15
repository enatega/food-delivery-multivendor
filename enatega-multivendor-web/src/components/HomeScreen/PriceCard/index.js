import { Typography, Box, Divider, Button, useTheme } from "@mui/material";
import useStyle from "./styles";

export default function PriceCard({ price, offer, desc, center }) {
  const classes = useStyle();
  const theme = useTheme();
  return (
    <Box className={`${classes.container}`}>
      <Box className={classes.top}>
        <Box>
          <Typography
            variant="h5"
            style={{ fontWeight: 900, color: "#fff", fontSize: 30 }}
            align="center"
          >
            $
            <Typography
              variant="body1"
              style={{
                color: "#fff",
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
            style={{ fontWeight: 600, color: "#fff" }}
            align="center"
          >
            {offer[0]}
            <Typography
              variant="body1"
              style={{
                color: "#fff",
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
                backgroundColor: "#000",
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
                  backgroundColor: center ? "#3C8F7C" : "#fff",
                  color: center ? "#fff" : "#000",
                  width: 140,
                  fontWeight: 700,
                }}
                variant="contained"
                disableElevation
                onClick={() =>
                  window.open("https://enatega.com/#contact", "_blank")
                }
              >
                Get Quote
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
