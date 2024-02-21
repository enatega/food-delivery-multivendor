import { Grid, Paper, Typography } from "@mui/material";
import clsx from "clsx";
import React from "react";
import ThreeDots from "../../ThreeDots/ThreeDots";
import { DetailCard } from "../OrderDetail";
import useStyles from "./styles";
import { useTranslation } from 'react-i18next';

function PaymentOrderCard(props) {
  const { t } = useTranslation()
  const classes = useStyles();
  return (
    <Grid container item xs={12} style={{ justifyContent: "center" }}>
      <Grid item xs={10}>
        <Paper className={classes.cardContainer}>
          <Grid container className={classes.center}>
            <Grid item xs={12}>
              <Typography variant="h5" color="textSecondary" className={classes.textBold}>
                {t('personalDetail')}
              </Typography>
            </Grid>
            <ThreeDots />
            <Grid container item xs={12}>
              <Grid item xs={5}>
                <Typography variant="body2" className={clsx(classes.disabledText, classes.smallText)}>
                  {t('name')}
                </Typography>
              </Grid>
              <Grid item xs={7} className={classes.ph1}>
                <Typography variant="body2" color="textSecondary" className={clsx(classes.textBold, classes.smallText)}>
                  {props.user?.name ?? "..."}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item xs={12} className={classes.mv2}>
              <Grid item xs={5}>
                <Typography variant="body2" className={clsx(classes.disabledText, classes.smallText)}>
                  {t('email')}
                </Typography>
              </Grid>
              <Grid item xs={7} className={classes.ph1}>
                <Typography variant="body2" color="textSecondary" className={clsx(classes.textBold, classes.smallText)}>
                  {props.user?.email ?? "..."}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={5}>
                <Typography variant="body2" className={clsx(classes.disabledText, classes.smallText)}>
                  {t('phone')}
                </Typography>
              </Grid>
              <Grid item xs={7} className={classes.ph1}>
                <Typography variant="body2" color="textSecondary" className={clsx(classes.textBold, classes.smallText)}>
                  {props.user.phone ?? "..."}
                </Typography>
              </Grid>
            </Grid>
            <ThreeDots />
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={10}>
        <DetailCard {...props} />
      </Grid>
    </Grid>
  );
}

export default React.memo(PaymentOrderCard);
