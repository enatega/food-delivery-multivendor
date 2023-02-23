import { Box, Button, Typography, useTheme } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import EmailIcon from "../../assets/icons/EmailIcon";
import { LoginWrapper } from "../Wrapper";
import useStyles from "./styles";

function EmailSent() {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <LoginWrapper>
      <EmailIcon />
      <Box mt={theme.spacing(1)} />
      <Typography variant="h5" className={classes.font700}>
        Check your email
      </Typography>
      <Box mt={theme.spacing(1)} />
      <Typography variant="caption" className={`${classes.caption} ${classes.fontGrey}`}>
        We sent you an email with instructions to reset your password. Don't forget to look in your spam folder.
      </Typography>
      <Box mt={theme.spacing(4)} />
      <RouterLink to="/login-email" style={{ textDecoration: "none" }}>
        <Button variant="contained" color="primary" fullWidth type="email" disableElevation className={classes.btnBase}>
          <Typography variant="caption" className={`${classes.caption} ${classes.font700}`}>
            back to login
          </Typography>
        </Button>
      </RouterLink>
    </LoginWrapper>
  );
}

export default EmailSent;
