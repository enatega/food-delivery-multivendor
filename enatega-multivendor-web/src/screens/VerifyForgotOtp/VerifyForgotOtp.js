import { useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FlashMessage from "../../components/FlashMessage";
import { LoginWrapper } from "../Wrapper";
import useStyles from "./styles";
import RegistrationIcon from "../../assets/images/emailLock.png";
import { Avatar } from "@mui/material";
import OtpInput from "react-otp-input";
import { forgotPassword } from "../../apollo/server";

const FORGOT_PASSWORD = gql`
  ${forgotPassword}
`;
function VerifyForgotOtp() {
  const theme = useTheme();
  const classes = useStyles();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(30);
  const [otpError, setOtpError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpFrom, setOtpFrom] = useState(
    Math.floor(100000 + Math.random() * 900000).toString()
  );
  const [sendOtp] = useMutation(FORGOT_PASSWORD, { onCompleted, onError });
  const { state } = useLocation();
  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        clearInterval(myInterval);
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  useEffect(() => {
    sendOtp({ variables: { email: state?.email, otp: otpFrom } });
    setSeconds(30);
  }, [otpFrom, sendOtp, state?.email]);

  function onCompleted() {
    try {
      setLoading(true);
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

  const onCodeFilled = async (code) => {
    if (code === otpFrom) {
      navigate("/new-password", {
        replace: true,
        state: {
          email: state?.email,
        },
      });
    } else {
      setOtpError(true);
    }
  };

  const resendOtp = () => {
    setOtpFrom(Math.floor(100000 + Math.random() * 900000).toString());
  };
  const handleCode = (val) => {
    const code = val;
    setOtp(val);
    if (code.length === 6) {
      onCodeFilled(code);
    }
  };

  return (
    <LoginWrapper>
      <FlashMessage
        open={Boolean(error)}
        severity={"error"}
        alertMessage={error}
      />
      <Box display="flex">
        <Box m="auto">
          <Avatar
            m="auto"
            alt="email"
            src={RegistrationIcon}
            sx={{
              width: 100,
              height: 100,
              display: "flex",
              alignSelf: "center",
            }}
          />
        </Box>
      </Box>
      <Typography variant="h5" className={classes.font700}>
        Forgot password ?
      </Typography>
      <Box mt={theme.spacing(1)} />
      <Typography
        variant="caption"
        className={`${classes.caption} ${classes.fontGrey}`}
      >
        Please enter the otp we sent to your <br />
        email
      </Typography>
      <Box display="flex">
        <Box m="auto">
          <OtpInput
            value={otp}
            onChange={handleCode}
            numInputs={6}
            containerStyle={{
              width: "100%",
              display: "flex",
              alignSelf: "center",
            }}
            inputStyle={{
              width: 45,
              height: 45,
              margin: 5,
              borderRadius: 5,
              fontSize: theme.typography.h2,
              border: "none",
              boxShadow: theme.shadows[3],
            }}
            focusStyle={{
              outlineColor: theme.palette.grey[900],
            }}
            editable
            renderInput={(props) => <input {...props} />}
          />
          <Box mt={2} />
          {otpError && (
            <Typography variant={"h6"} style={{ color: "red", fontSize: 14 }}>
              Invalid code, please check and enter again
            </Typography>
          )}
        </Box>
      </Box>
      <Box mt={theme.spacing(8)} />
      <Button
        variant="contained"
        fullWidth
        type="email"
        disableElevation
        disabled={seconds !== 0}
        className={classes.btnBase}
        onClick={(e) => {
          e.preventDefault();
          resendOtp();
        }}
      >
        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <Typography
            variant="caption"
            className={`${classes.caption} ${classes.font700}`}
          >
            Resend Code
          </Typography>
        )}
      </Button>
      <Box mt={theme.spacing(2)} />
      <Typography variant="caption" className={`${classes.caption}`}>
        {seconds !== 0 ? `Retry after ${seconds}s` : ""}
      </Typography>
    </LoginWrapper>
  );
}

export default VerifyForgotOtp;
