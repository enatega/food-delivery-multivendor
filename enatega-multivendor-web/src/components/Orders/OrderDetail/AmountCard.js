import { Box, Divider, Grid, Paper, Typography, useTheme } from "@mui/material";
import clsx from "clsx";
import React, { useContext } from "react";
import ConfigurationContext from "../../../context/Configuration";
import { calculatePrice } from "../../../utils/customFunction";
import useStyles from "./styles";
import { useTranslation } from 'react-i18next';

export default function AmountCard(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const configuration = useContext(ConfigurationContext);
  const deliveryCharges = props.isPickedUp ? 0 : props.deliveryCharges;
  const theme = useTheme();
  return (
    <>
      <Grid container item xs={12}>
        <Grid item xs={1} />
        <Grid item xs={10} sm={6} md={4}>
          <Paper style={{ padding: theme.spacing(5) }} elevation={1}>
            <Grid container className={clsx(classes.cardRow, classes.mv2)}>
              {props.items.map((item) => (
                <React.Fragment key={item._id}>
                  <Grid item xs={1}>
                    <Typography
                      variant="caption"
                      className={`${classes.disabledText} ${classes.mediumBoldText}`}
                    >
                      {`${item.quantity}x`}
                    </Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography
                      variant="caption"
                      style={{ marginLeft: 5 }}
                      className={`${classes.disabledText} ${classes.mediumText}`}
                    >
                      {`${item.title}${
                        item.variation.title ? `(${item.variation.title})` : ""
                      }`}
                    </Typography>
                    <Box display="flex" flexDirection="column">
                      {item.addons.map((addon, index) => (
                        <Typography
                          key={index}
                          variant="caption"
                          className={`${classes.disabledText}`}
                        >
                          +{addon.options.map((option) => option.title)}
                        </Typography>
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      variant="caption"
                      className={`${classes.disabledText} ${classes.smallText}`}
                    >
                      {`${configuration.currencySymbol} ${parseFloat(
                        calculatePrice(item)
                      ).toFixed(2)}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
            <Grid container className={clsx(classes.cardRow, classes.mv2)}>
              <Grid item xs={9}>
                <Typography
                  variant="body2"
                  className={clsx(classes.disabledText, classes.smallText)}
                >
                  {t('subTotal')}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  variant="body2"
                  className={clsx(classes.disabledText, classes.smallText)}
                >
                  {`${configuration.currencySymbol} ${parseFloat(
                    props.orderAmount -
                      deliveryCharges -
                      props.taxationAmount -
                      props.tipping
                  ).toFixed(2)}`}
                </Typography>
              </Grid>
            </Grid>

            <Grid container className={clsx(classes.cardRow, classes.mv2)}>
              <Grid item xs={9}>
                <Typography
                  variant="body2"
                  className={clsx(classes.disabledText, classes.smallText)}
                >
                  {t('tip')}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  variant="body2"
                  className={clsx(classes.disabledText, classes.smallText)}
                >
                  {`${configuration.currencySymbol} ${parseFloat(
                    props.tipping
                  ).toFixed(2)}`}
                </Typography>
              </Grid>
            </Grid>
            <Grid container className={clsx(classes.cardRow, classes.mv2)}>
              <Grid item xs={9}>
                <Typography
                  variant="body2"
                  className={clsx(classes.disabledText, classes.smallText)}
                >
                  {t('taxFee')}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  variant="body2"
                  className={clsx(classes.disabledText, classes.smallText)}
                >
                  {`${configuration.currencySymbol} ${parseFloat(
                    props.taxationAmount
                  ).toFixed(2)}`}
                </Typography>
              </Grid>
            </Grid>
            {!props.isPickedUp && (
              <Grid container className={clsx(classes.cardRow, classes.mv2)}>
                <Grid item xs={9}>
                  <Typography
                    variant="body2"
                    className={clsx(classes.disabledText, classes.smallText)}
                  >
                    {t('deliveryFee')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="body2"
                    className={clsx(classes.disabledText, classes.smallText)}
                  >
                    {`${configuration.currencySymbol} ${parseFloat(
                      props.deliveryCharges
                    ).toFixed(2)}`}
                  </Typography>
                </Grid>
              </Grid>
            )}
            <Grid container className={clsx(classes.cardRow, classes.mv2)}>
              <Grid item xs={9}>
                <Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className={clsx(classes.textBold, classes.smallText)}
                  >
                    {t('total')}
                  </Typography>
                  <Typography
                    variant="caption"
                    className={classes.disabledText}
                  >
                    (Incl. TAX)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className={clsx(classes.textBold, classes.smallText)}
                >
                  {`${configuration.currencySymbol} ${parseFloat(
                    props.orderAmount
                  ).toFixed(2)}`}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
