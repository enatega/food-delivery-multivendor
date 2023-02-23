import { useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlashMessage from "../../components/FlashMessage";
import UserContext from "../../context/User";
import { LoginWrapper } from "../Wrapper";
import useStyles from "./styles";
import RegistrationIcon from "../../assets/images/emailLock.png";
import { Avatar } from "@mui/material";
import OtpInput from "react-otp-input";
import { Link as RouterLink } from "react-router-dom";
import { sendOtpToPhoneNumber, updateUser } from "../../apollo/server";

const SEND_OTP_TO_PHONE = gql`
  ${sendOtpToPhoneNumber}
`;
const UPDATEUSER = gql`
  ${updateUser}
`;
function VerifyPhone() {
  const theme = useTheme();
  const classes = useStyles();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const [seconds, setSeconds] = useState(30);
  const [otpError, setOtpError] = useState(false);
  const [otpFrom, setOtpFrom] = useState(
    Math.floor(100000 + Math.random() * 900000).toString()
  );
  const { profile } = useContext(UserContext);

  const [sendOtp, { loading: loadingOtp }] = useMutation(SEND_OTP_TO_PHONE, {
    onCompleted: onOtpCompleted,
    onError: onOtpError,
  });

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
    if (state?.phone) {
      sendOtp({ variables: { phone: state?.phone, otp: otpFrom } });
    } else {
      sendOtp({ variables: { phone: profile?.phone, otp: otpFrom } });
    }
    setSeconds(30);
  }, [otpFrom, sendOtp, state?.phone, profile?.phone]);

  function onOtpError(error) {
    if (error.networkError) {
      FlashMessage({
        message: error.networkError.result.errors[0].message,
      });
    } else if (error.graphQLErrors) {
      FlashMessage({
        message: error.graphQLErrors[0].message,
      });
    }
  }
  function onOtpCompleted(data) {
    FlashMessage({
      message: "OTP sent to your phone.",
    });
  }
  function onUpdateUserError(error) {
    if (error.networkError) {
      FlashMessage({
        message: error.networkError.result.errors[0].message,
      });
    } else if (error.graphQLErrors) {
      FlashMessage({
        message: error.graphQLErrors[0].message,
      });
    }
  }

  function onUpdateUserCompleted() {
    FlashMessage({
      message: "Phone number has been verified successfully!.",
    });
  }

  const [mutate, { loading: updateUserLoading }] = useMutation(UPDATEUSER, {
    onCompleted: onUpdateUserCompleted,
    onError: onUpdateUserError,
  });

  const onCodeFilled = async (code) => {
    if (code === otpFrom) {
      mutate({
        variables: {
          name: profile.name,
          phone: state?.phone ? state.phone : profile.phone,
          phoneIsVerified: true,
        },
      });
      navigate("/", {
        replace: true,
      });
    } else {
      setOtpError(true);
      setError("Invalid Code");
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
        Verify your phone <br /> number?
      </Typography>
      <Box mt={theme.spacing(1)} />
      <Typography
        variant="caption"
        className={`${classes.caption} ${classes.fontGrey}`}
      >
        Please enter the otp we sent to your <br />
        phone number
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
              backgroundColor: theme.palette.common.white,
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
        {loadingOtp || updateUserLoading ? (
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
      <Box mt={theme.spacing(2)} />
      <RouterLink to="/" style={{ textDecoration: "none" }}>
        <Typography
          variant="caption"
          color="primary"
          className={`${classes.caption}`}
        >
          {"Skip now"}
        </Typography>
      </RouterLink>
    </LoginWrapper>
  );
}

export default VerifyPhone;
