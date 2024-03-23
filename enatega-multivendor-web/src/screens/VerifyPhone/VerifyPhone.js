import { useCallback, useEffect } from "react";
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
import { useTranslation } from 'react-i18next';
import ConfigurableValues from "../../config/constants";

const SEND_OTP_TO_PHONE = gql`
  ${sendOtpToPhoneNumber}
`;
const UPDATEUSER = gql`
  ${updateUser}
`;
function VerifyPhone() {
  const { t } = useTranslation();
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
  const { SKIP_MOBILE_VERIFICATION } = ConfigurableValues()

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

  const onCodeFilled =  useCallback((code) => {
    if (SKIP_MOBILE_VERIFICATION || code === otpFrom) {
      mutate({
        variables: {
          name: profile.name,
          phone: state?.phone ? state.phone : profile.phone,
          phoneIsVerified: true,
        },
      });
      navigate(-1, {
        replace: true,
      });
    } else {
      setOtpError(true);
      setError("Invalid Code");
    }
  },[SKIP_MOBILE_VERIFICATION, mutate, navigate, otpFrom, profile?.name, profile?.phone,  state?.phone]);

  const resendOtp = () => {
    setOtpFrom(Math.floor(100000 + Math.random() * 900000).toString());
  };
  const handleCode = useCallback((val) => {
    const code = val;
    setOtp(val);
    if (code.length === 6) {
      onCodeFilled(code);
    }
  },[onCodeFilled]);

  useEffect(()=>{
    let timer = null
    if(!SKIP_MOBILE_VERIFICATION) return
    setOtp('111111')
    timer = setTimeout(()=>{
      handleCode('111111')
    },3000)
    return ()=>{timer && clearTimeout(timer)}
  },[SKIP_MOBILE_VERIFICATION,handleCode])

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
        {t('verifyPhone')} <br /> {t('number')}
      </Typography>
      <Box mt={theme.spacing(1)} />
      <Typography
        variant="caption"
        className={`${classes.caption} ${classes.fontGrey}`}
      >
        {t('enterOtpPhone')}
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
              border: `1px solid ${theme.palette.grey[400]}`,
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
              {t('invalidCode')}
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
            {t('resendCode')}
          </Typography>
        )}
      </Button>
      <Box mt={theme.spacing(2)} />
      <Typography variant="caption" className={`${classes.caption}`}>
        {seconds !== 0 ? `${t('retryAfter')} ${seconds}s` : ""}
      </Typography>
      <Box mt={theme.spacing(2)} />
      <RouterLink to="/" style={{ textDecoration: "none" }}>
        <Typography
          variant="caption"
          color="primary"
          className={`${classes.caption}`}
        >
          {t('skipNow')}
        </Typography>
      </RouterLink>
    </LoginWrapper>
  );
}

export default VerifyPhone;
