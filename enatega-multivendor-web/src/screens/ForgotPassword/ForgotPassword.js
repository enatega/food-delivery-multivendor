import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import FlashMessage from "../../components/FlashMessage";
import Analytics from "../../utils/analytics";
import { isValidEmailAddress } from "../../utils/customFunction";
import useStyles from "./styles";
import ForgotPassIcon from "../../assets/images/emailLock.png";
import { LoginWrapper } from "../Wrapper";

function ForgotPassword(props) {
  const formRef = useRef();
  const theme = useTheme();
  const classes = useStyles();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const clearErrors = () => {
    setEmailError("");
    setError("");
  };
  const handleAction = () => {
    clearErrors();
    let validate = true;
    const emailValue = formRef.current["userEmail"].value;
    if (!isValidEmailAddress(emailValue)) {
      setEmailError("Invalid Email");
      validate = false;
      return;
    }
    if (validate) {
      navigate("/verify-forgot-otp", {
        replace: true,
        state: { email: emailValue },
      });
    } else {
      setError("Something is missing");
    }
  };
  useEffect(() => {
    const fetchTrack = async () => {
      await Analytics.track(Analytics.events.NAVIGATE_TO_FORGOT_PASSWORD);
    };
    fetchTrack();
  }, []);
  const toggleSnackbar = useCallback(() => {
    setError("");
  }, []);

  return (
    <LoginWrapper>
      <FlashMessage
        open={Boolean(error)}
        severity={"error"}
        alertMessage={error}
        handleClose={toggleSnackbar}
      />
      <Box display="flex">
        <Box m="auto">
          <Avatar
            m="auto"
            alt="email"
            src={ForgotPassIcon}
            sx={{
              width: 100,
              height: 100,
              display: "flex",
              alignSelf: "center",
            }}
          />
        </Box>
      </Box>
      <form ref={formRef}>
        <Box mt={theme.spacing(2)} />
        <Typography variant="h5" className={classes.font700}>
          Forgot your password?
        </Typography>
        <Box mt={theme.spacing(2)} />
        <Typography
          variant="caption"
          className={`${classes.caption} ${classes.fontGrey}`}
        >
          Enter your email and we'll send you a link to reset your password
        </Typography>
        <Box mt={theme.spacing(2)} />
        <TextField
          name={"userEmail"}
          defaultValue={state?.email ?? ""}
          error={Boolean(emailError)}
          helperText={emailError}
          fullWidth
          variant="outlined"
          label="Email"
          disabled
          InputLabelProps={{
            style: {
              color: theme.palette.grey[600],
            },
          }}
        />
        <Box mt={theme.spacing(8)} />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="email"
          disableElevation
          className={classes.btnBase}
          onClick={(e) => {
            e.preventDefault();
            handleAction();
          }}
        >
          <Typography
            variant="caption"
            className={`${classes.caption} ${classes.font700}`}
          >
            Reset password
          </Typography>
        </Button>
        <Box mt={theme.spacing(2)} />
        <RouterLink to="/login-email" style={{ textDecoration: "none" }}>
          <Button>
            <Typography
              variant="caption"
              color="primary"
              style={{
                textTransform: "none",
              }}
              className={classes.font700}
            >
              Back to login
            </Typography>
          </Button>
        </RouterLink>
      </form>
    </LoginWrapper>
  )
}

export default ForgotPassword;
