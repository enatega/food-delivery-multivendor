import { Button, Grid, Paper, Typography } from "@mui/material";
import clsx from "clsx";
import React from "react";
import useStyles from "./styles";

function SupportCard() {
  const classes = useStyles();
  return (
    <Paper className={classes.cardContainer}>
      <Grid container className={classes.center}>
        <Grid item xs={12}>
          <Typography variant="h5" color="textSecondary" className={classes.textBold}>
            Need support
          </Typography>
          <Typography variant="body2" className={clsx(classes.disabledText, classes.mv2)}>
            Questions regarding your order? Reach out to us.
          </Typography>
        </Grid>
        <Button
          variant="outlined"
          color="primary"
          disableElevation
          disableRipple
          disableFocusRipple
          disableTouchRipple
          className={clsx(classes.btnBase, classes.mv2)}
        >
          <Typography variant="body2" color="primary" className={clsx(classes.textBold, classes.smallText)}>
            HELP CENTER
          </Typography>
        </Button>
      </Grid>
    </Paper>
  );
}

export default SupportCard;
