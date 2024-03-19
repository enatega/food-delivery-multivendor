import { Button, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Apple } from "@mui/icons-material";
import React from "react";
import PlayStore from "../../../assets/icons/PlayStore";
import useStyle from "./styles";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function StoreContainer() {
  const { t } = useTranslation()
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
            App
            <Typography component="p" variant={extraSmall ? "h5" : "h4"} className={classes.bold300}>
              {t('putUsInYourPocket')}
            </Typography>
          </Typography>
        </Grid>
      </Grid>
      <Grid container item xs={12} className={classes.storeContainer}>
        <Grid item xs={1} md={1} />
        <Grid container item xs={11} sm={10} md={11}>
          <Grid container item xs={12} sm={10} style={{ height: "300px" }}>
            <Grid item xs={12} style={{ alignSelf: "center" }}>
              <Typography color="textPrimary" className={classes.storeTitle}>
                Download the food you love and more
              </Typography>
              <Typography color="textPrimary" className={classes.storeDescription}>
                {t('containerText')}
              </Typography>
            </Grid>
            <Grid item>
              <RouterLink
                to={{
                  pathname: "https://apps.apple.com/pk/app/enatega-multivendor/id1526488093",
                }}
                target="_blank"
                className={classes.linkDecoration}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  className={classes.btnBase}
                  startIcon={<Apple fontSize="large" color="secondary" />}
                >
                  From ios Store
                </Button>
              </RouterLink>
              <RouterLink
                to={{
                  pathname: "https://play.google.com/store/apps/details?id=com.enatega.multivendor&hl=en_US&gl=US",
                }}
                target="_blank"
                className={classes.linkDecoration}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  className={classes.btnBase}
                  startIcon={<PlayStore color="textPrimary" />}
                >
                  From Play Store
                </Button>
              </RouterLink>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default React.memo(StoreContainer);
