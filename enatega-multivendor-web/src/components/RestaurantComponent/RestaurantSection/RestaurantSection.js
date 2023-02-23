import { Box, Button, Grid, useMediaQuery, useTheme } from "@mui/material";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import React, { useCallback, useRef } from "react";
import Card from "../Card/Card";
import Title from "../Title/Title";
import useStyles from "./styles";

function RestaurantSection(props) {
  const theme = useTheme();
  const extraSmall = useMediaQuery(theme.breakpoints.down('sm'));
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
          <Box style={{ marginTop: "50px", position: "relative" }} key={section._id}>
            {section.restaurants.length > 4 && (
              <Button
                className={classes.nextButtonStyles}
                style={{
                  left: "-2vw",
                }}
                onClick={() => ScrollRight(index1)}
              >
                <ArrowBackIosOutlinedIcon style={{ color: theme.palette.common.white}}/>
              </Button>
            )}
            <Title title={section.name} />
            <Box
              style={{
                overflow: "auto",
                whiteSpace: "nowrap",
              }}
              ref={(el) => (ref.current[index1] = el)}
              className={classes.restauranCardContainer}
            >
              {section.restaurants.map((data, index) => (
                <Box style={{ display: "inline-block", marginRight: "25px" }} key={index}>
                  <Card
                    data={data}
                    cardImageHeight="144px"
                    showMessage={props.showMessage}
                    checkCart={props.checkCart}
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
                <ArrowForwardIosOutlinedIcon style={{ color: theme.palette.common.white}}/>
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
