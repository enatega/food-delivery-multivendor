import { Button, Card, CardContent, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import useStyle from "./styles";

function InfoBusiness() {
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
            Office
            <Typography component="p" variant={extraSmall ? "h5" : "h4"} className={classes.bold300}>
              Take your office out to lunch
            </Typography>
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.infoContainer}>
        <Grid item xs={1} md={1} />
        <Grid
          item
          xs={10}
          sm={10}
          md={7}
          style={{ alignSelf: "flex-end", paddingTop: extraSmall ? "50px" : undefined }}
        >
          <Card className={classes.infoCard}>
            <CardContent>
              <Typography variant="h5" className={classes.infotTitle}>
                Enatega for business
              </Typography>
              <Typography className={classes.infoDescription}>
                Order lunch, fuel for meetings or late-night deliveries to the office. Your favorite restaurants coming
                to a desk near you.
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

export default React.memo(InfoBusiness);
