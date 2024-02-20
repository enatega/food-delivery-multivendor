import { Box, Button, Grid, useMediaQuery, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useCallback, useRef } from "react";
import Card from "../Card/Card";
import Title from "../Title/Title";
import useStyles from "./styles";

function RestaurantSection(props) {
  const theme = useTheme();
  const extraSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const small = useMediaQuery(theme.breakpoints.down("md"));
  const classes = useStyles(extraSmall);
  const ref = useRef([]);

  const ScrollLeft = useCallback((index1) => {
    ref.current[index1].scrollTo({
      left: ref.current[index1].scrollLeft + 500,
      behavior: "smooth",
    });
  }, []);

  const ScrollRight = useCallback((index1) => {
    ref.current[index1].scrollTo({
      left: ref.current[index1].scrollLeft - 500,
      behavior: "smooth",
    });
  }, []);

  return (
    <Grid container item className={classes.mainContainer}>
      <Grid item sm={1} />
      <Grid item xs={12} sm={10}>
        {props.restaurantSections.map((section, index1) => (
          <Box
            style={{ marginTop: "50px", position: "relative", width: "100%" }}
            key={section._id}
          >
            {section.restaurants.length > 4 && (
              <Button
                className={classes.nextButtonStyles}
                style={{
                  left: "-2vw",
                }}
                onClick={() => ScrollRight(index1)}
              >
                <ArrowBackIcon style={{ color: "black", fontSize: 40 }} />
              </Button>
            )}
            <Box className={classes.divider} />

            <Title title={section.name} />
            <Box
              style={{
                overflow: "auto",
                whiteSpace: "nowrap",
                marginLeft: small ? "0px" : "40px",
                marginRight: small ? "0px" : "40px",
              }}
              ref={(el) => (ref.current[index1] = el)}
              className={classes.restauranCardContainer}
            >
              {section.restaurants.map((data, index) => (
                <Box
                  style={{
                    display: "inline-block",
                    marginRight: small ? "4px" : "25px",
                  }}
                  key={index}
                >
                  <Card
                    data={data}
                    cardImageHeight="144px"
                    showMessage={props.showMessage}
                    checkCart={props.checkCart}
                    isSmall={true}
                    index={index}
                  />
                </Box>
              ))}
            </Box>
            {section.restaurants.length > 4 && (
              <Button
                className={classes.nextButtonStyles}
                style={{
                  right: "-2vw",
                }}
                onClick={() => ScrollLeft(index1)}
              >
                <ArrowForwardIcon
                  style={{ color: small ? "00FFFFFF" : "black", fontSize: 40 }}
                />
              </Button>
            )}
          </Box>
        ))}
      </Grid>
      <Grid item sm={1} />
    </Grid>
  );
}

export default React.memo(RestaurantSection);
