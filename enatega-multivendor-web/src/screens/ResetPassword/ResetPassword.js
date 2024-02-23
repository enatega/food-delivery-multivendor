/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from "@apollo/client";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import gql from "graphql-tag";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { resetPassword } from "../../apollo/server";
import FlashMessage from "../../components/FlashMessage";
import Analytics from "../../utils/analytics";
import useStyles from "./styles";
import VerifyEmailIcon from "../../assets/images/emailLock.png";
import { LoginWrapper } from "../Wrapper";

const RESET_PASSWORD = gql`
  ${resetPassword}
`;

function ResetPassword() {
  const formRef = useRef();
  const theme = useTheme();
  const classes = useStyles();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passError, setPassError] = useState("");

  const [mutate] = useMutation(RESET_PASSWORD, { onCompleted, onError });

  function onCompleted() {
    try {
      FlashMessage({
        message: "Password reset done",
      });
      setError("Password reset done successfully");
      navigate("/login", { replace: true });
    } catch (e) {
      setError("Something went wrong");
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  function onError(e) {
    setLoading(false);
    setError(e.message);
  }
  const clearErrors = () => {
    setPassError("");
    setError("");
  };
  const handleAction = () => {
    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    clearErrors();
    let validate = true;
    const newPass = formRef.current["newPassword"].value;
    const retypePass = formRef.current["retypePassword"].value;
    if (!passRegex.test(newPass) || !newPass) {
      setPassError("Invalid Password");
      validate = false;
      return;
    }
    if (!retypePass) {
      setPassError("confirm password required");
      validate = false;
      return;
    }
    if (validate) {
      if (newPass === retypePass) {
        setLoading(true);
        mutate({
          variables: {
            password: newPass,
            email: state?.email.toLowerCase().trim(),
          },
        });
      } else {
        setPassError("Password must match with confirm password");
      }
    }
  };

  useEffect(async () => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_FORGOT_PASSWORD);
  }, []);

  const toggleSnackbar = useCallback(() => {
    setError("");
  }, []);

  return state.email ? (
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
            src={VerifyEmailIcon}
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
          Set your password
        </Typography>
        <Box mt={theme.spacing(2)} />
        <Typography
          variant="caption"
          className={`${classes.caption} ${classes.fontGrey}`}
        >
          Kindly set your new password
        </Typography>
        <Box mt={theme.spacing(2)} />
        <TextField
          name={"newPassword"}
          InputLabelProps={{
            style: {
              color: theme.palette.grey[600],
            },
          }}
          defaultValue={""}
          error={Boolean(passError)}
          helperText={passError}
          fullWidth
          variant="outlined"
          label="New Password"
          type={"password"}
        />
        <Box mt={theme.spacing(2)} />
        <TextField
          name={"retypePassword"}
          InputLabelProps={{
            style: {
              color: theme.palette.grey[600],
            },
          }}
          defaultValue={""}
          error={Boolean(passError)}
          helperText={passError}
          fullWidth
          variant="outlined"
          label="Retype password"
          type={"password"}
        />
        <Box mt={theme.spacing(8)} />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="email"
          disableElevation
          disabled={loading}
          className={`${classes.btnBase} ${classes.customBtn}`}
          onClick={(e) => {
            e.preventDefault();
            handleAction();
          }}
        >
          {loading ? (
            <CircularProgress color="primary" />
          ) : (
            <Typography
              variant="caption"
              className={`${classes.caption} ${classes.font700}`}
            >
              Save
            </Typography>
          )}
        </Button>
        <Box mt={theme.spacing(2)} />
      </form>
    </LoginWrapper>
  ) : (
    <Navigate to="/login" />
  );
}

export default ResetPassword;
