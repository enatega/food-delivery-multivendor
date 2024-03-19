import { Divider, Grid, Paper, Typography, useTheme } from "@mui/material";
import clsx from "clsx";
import React from "react";
import useStyles from "./styles";
import { useTranslation } from 'react-i18next';
function DetailCard(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation()

  return (
    <Grid container item xs={12}>
      <Grid item xs={1} />
      <Grid item xs={10} sm={6} md={4}>
        <Typography
          className={`${classes.heading} ${classes.textBold}`}
          textAlign="center"
          color={theme.palette.primary.main}
        >
          {t('orderDetail')}
        </Typography>
        <Divider
          orientation="horizontal"
          flexItem
          style={{ backgroundColor: theme.palette.primary.main }}
          variant="middle"
        />

        <Paper
          style={{ padding: theme.spacing(5) }}
          elevation={1}
          className={classes.mt3}
        >
          {/* first box */}
          <Grid container>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                className={`${clsx(classes.disabledText)} ${clsx(
                  classes.smallText
                )} ${clsx(classes.textBold)}`}
              >
                {t('orderFrom')}:
              </Typography>
            </Grid>
            <Grid item xs={6} className={classes.ph1}>
              <Typography
                variant="body2"
                color="textSecondary"
                className={`${clsx(classes.textBold)} ${clsx(
                  classes.smallText
                )}`}
              >
                {props.restaurant?.name ?? "..."}
              </Typography>
            </Grid>
          </Grid>
          <Grid container className={classes.mv2}>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                className={`${clsx(classes.disabledText)} ${clsx(
                  classes.smallText
                )} ${clsx(classes.textBold)}`}
              >
                {t('orderNo')}:
              </Typography>
            </Grid>
            <Grid item xs={6} className={classes.ph1}>
              <Typography
                variant="body2"
                color="textSecondary"
                className={`${clsx(classes.textBold)} ${clsx(
                  classes.smallText
                )}`}
              >
                {props.orderId ?? "..."}
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                className={`${clsx(classes.disabledText)} ${clsx(
                  classes.smallText
                )} ${clsx(classes.textBold)}`}
              >
                {!!props.isPickedUp ? "Pick Up Address:" : t('deliveryAddress')+":"}
              </Typography>
            </Grid>
            <Grid item xs={6} className={classes.ph1}>
              {!!props.isPickedUp ? (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className={`${clsx(classes.textBold)} ${clsx(
                    classes.smallText
                  )}`}
                >
                  {props.restaurant?.address ?? "..."}
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className={`${clsx(classes.textBold)} ${clsx(
                    classes.smallText
                  )}`}
                >
                  {props.deliveryAddress?.deliveryAddress ?? "..."}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default DetailCard;
