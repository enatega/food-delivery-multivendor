import { useMutation } from "@apollo/client";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import gql from "graphql-tag";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import FlashMessage from "../../components/FlashMessage";
import Analytics from "../../utils/analytics";
import useStyles from "./styles";
import VerifyEmailIcon from "../../assets/images/emailLock.png";
import { LoginWrapper } from "../Wrapper";
import { createUser, sendOtpToEmail } from "../../apollo/server";
import UserContext from "../../context/User";
import OtpInput from "react-otp-input";
import { useTranslation } from 'react-i18next';
import ConfigurableValues from "../../config/constants";

const SEND_OTP_TO_EMAIL = gql`
  ${sendOtpToEmail}
`;
const CREATEUSER = gql`
  ${createUser}
`;
function VerifyEmail() {
  const { t } = useTranslation();
  const formRef = useRef();
  const theme = useTheme();
  const classes = useStyles();
  const navigate = useNavigate();
  const { state: user } = useLocation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setTokenAsync } = useContext(UserContext);
  const [otpError, setOtpError] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [otp, setOtp] = useState("");
  const { SKIP_EMAIL_VERIFICATION } = ConfigurableValues()
  const handleBackNavigation = () => {
    // Use history.push to navigate to the desired route
    navigate("/registration");
  };

  useEffect(() => {
    // Add an event listener for the popstate event
    window.addEventListener("popstate", handleBackNavigation);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
    };
  });
  const [otpFrom, setOtpFrom] = useState(
    Math.floor(100000 + Math.random() * 900000).toString()
  );
  const [createUser, { loading: createLoading }] = useMutation(CREATEUSER, {
    onCompleted: onCompletedCreate,
    onError: onErrorCreate,
  });
  const [sendOtp] = useMutation(SEND_OTP_TO_EMAIL, {
    onCompleted: onCompletedOtp,
    onError: onErrorOtp,
  });

  function onErrorOtp(e) {
    setLoading(false);
    setError(e.message);
  }

  function onCompletedOtp(e) {
    console.log("otp sent");
  }

  function onErrorCreate(e) {
    setLoading(false);
    setError(e.message);
  }
  async function onCompletedCreate({ createUser }) {
    try {
      await Analytics.identify(
        {
          userId: createUser.userId,
          name: createUser.name,
          email: createUser.email,
        },
        createUser.userId
      );
      await Analytics.track(Analytics.events.USER_CREATED_ACCOUNT, {
        userId: createUser.userId,
        name: createUser.name,
        email: createUser.email,
      });
      navigate("/", {
        replace: true,
      });
      setTokenAsync(createUser.token);
    } catch (e) {
      setError("Something went wrong");
      console.log(e);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    sendOtp({
      variables: { email: user?.email, otp: otpFrom },
    });
    setSeconds(30);
  }, [otpFrom, user?.email, sendOtp]);

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

  const toggleSnackbar = useCallback(() => {
    setError("");
  }, []);

  const onCodeFilled = useCallback((code) => {
    if (SKIP_EMAIL_VERIFICATION || code === otpFrom) {
      createUser({
        variables: {
          phone: user.phone,
          email: user.email,
          password: user.password,
          name: user.name,
          picture: "",
        },
      });
    } else {
      setOtpError(true);
    }
  },[SKIP_EMAIL_VERIFICATION, createUser, otpFrom, user.email, user.name, user.password, user.phone]);

  const resendOtp = () => {
    setOtpFrom(Math.floor(100000 + Math.random() * 900000).toString());
  };
  const handleCreateUser = useCallback((val) => {
    setOtp(val);
    if (val.length === 6) {
      onCodeFilled(val);
    }
  },[onCodeFilled]);

  useEffect(()=>{
    let timer = null
    if(!SKIP_EMAIL_VERIFICATION) return
    setOtp('111111')
    timer = setTimeout(()=>{
      handleCreateUser('111111')
    },3000)
    return ()=>{timer && clearTimeout(timer)}
  },[SKIP_EMAIL_VERIFICATION,handleCreateUser])

  return user?.email ? (
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
      {createLoading ? (
        <CircularProgress color="primary" />
      ) : (
        <form ref={formRef}>
          <Box mt={theme.spacing(2)} />
          <Typography variant="h5" className={classes.font700}>
            {t('verifyEmail')}
          </Typography>
          <Box mt={theme.spacing(2)} />
          <Typography
            variant="caption"
            className={`${classes.caption} ${classes.fontGrey}`}
          >
            {t('enterOtp')}
          </Typography>
          <Box mt={theme.spacing(2)} />
          <OtpInput
            value={otp}
            onChange={handleCreateUser}
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
          <Box mt={theme.spacing(8)} />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="email"
            disableElevation
            className={classes.btnBase}
            disabled={seconds !== 0}
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
                {t('resendCode')}
              </Typography>
            )}
          </Button>
          <Box mt={theme.spacing(2)} />
          <Typography variant="caption" className={`${classes.caption}`}>
            {seconds === 0 ? "" : `${t('retryAfter')} ${seconds}s`}
          </Typography>
        </form>
      )}
    </LoginWrapper>
  ) : (
    <Navigate to="/login" />
  );
}

export default VerifyEmail;
