import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import Card from "../Card/Card";
import Title from "../Title/Title";
import useStyles from "./styles";
import { ReactComponent as EmptyIcon } from "../../../assets/images/empty-search.svg";
import { useTranslation } from 'react-i18next';

function RestaurantGrid(props) {
  const { t  } = useTranslation();
  const theme = useTheme();
  const extraSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles(extraSmall);

  return (
    <Box className={classes.mainContainer}>
      <Grid container style={{ paddingTop: "60px", paddingBottom: "2rem" }}>
        <Grid item sm={1} />
        <Grid item xs={12} sm={10}>
          <Box className={classes.divider} />
          <Title title= {t('allRestaurant')}/>
          <Box mt={5} />
          <Grid container rowSpacing={8} columnSpacing={{ xs: 0, md: 4 }} >
            {props.restaurants.length < 1 ? (
              <Grid container item xs={12} justifyContent="center">
                <Box display="flex" flexDirection="column" alignItems="center">
                  <EmptyIcon />
                  <Typography
                    variant="h5"
                    align="center"
                    color="textSecondary"
                    style={{ fontWeight: 800, marginTop: 15 }}
                  >
                    {props?.search
                      ? "That's not in the list"
                      : "No restaurants found"}{" "}
                  </Typography>
                  <Typography
                    variant="h5"
                    align="center"
                    color="textSecondary"
                    style={{ fontWeight: 800, marginTop: 15 }}
                  >
                    {props?.search && "yet"}
                  </Typography>
                  <Typography
                    variant="h6"
                    align="center"
                    color="textSecondary"
                    style={{ marginTop: 15 }}
                  >
                    {props?.search && "Try different search"}
                  </Typography>
                </Box>
              </Grid>
            ) : (
              props.restaurants.map((value, index) => (
                <Grid key={index} item xs={12} sm={12} md={4}>
                  <Card
                    data={value}
                    cardImageHeight="144px"
                    grid={true}
                    checkCart={props.checkCart}
                    showMessage={props.showMessage}
                    isSmall={false}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
        <Grid item sm={1} />
      </Grid>
    </Box>
  );
}

export default React.memo(RestaurantGrid);
