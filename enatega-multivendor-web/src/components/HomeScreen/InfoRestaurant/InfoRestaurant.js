import { Button, Card, CardContent, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import useStyle from "./styles";

function InfoRestaurant() {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const extraSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyle({ mobile, extraSmall });
  return (
    <Grid container className={classes.mainContainer}>
      <Grid item xs={12} className={classes.headingContainer}>
        <Grid item xs={1} md={1} />
        <Grid item xs={10} sm={10} md={7}>
          <Typography variant="h2" className={classes.boldBackground}>
            Partners
            <Typography component="p" variant={extraSmall ? "h5" : "h4"} className={classes.bold300}>
              You prepare the food, we handle the rest
            </Typography>
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.infoContainer}>
        <Grid item xs={1} md={1} />
        <Grid item xs={10} sm={10} md={7} className={classes.modalBox}>
          <Card className={classes.infoCard}>
            <CardContent>
              <Typography variant="h5" className={classes.infotTitle}>
                List your restaurant on Enatega
              </Typography>
              <Typography className={classes.infoDescription}>
                Would you like thousands of new customers to taste your amazing food? So would we!
              </Typography>
              <Typography className={classes.infoDescription}>
                It's simple: we list your menu online, help you process orders, pick them up, and deliver them to hungry
                pandas - in a heartbeat!
              </Typography>
              <Typography className={classes.infoDescription}>
                Interested? Let's start our partnership today!
              </Typography>
              <Button variant="contained" color="primary" disableElevation className={classes.infoBtn}>
                Get started
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default React.memo(InfoRestaurant);
