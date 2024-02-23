import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useCallback, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlashMessage from "../../components/FlashMessage";
import { isValidEmailAddress } from "../../utils/customFunction";
import { LoginWrapper } from "../Wrapper";
import useStyles from "./styles";
import RegistrationIcon from "../../assets/images/emailLock.png";
import { Avatar } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { gql, useMutation } from "@apollo/client";
import { phoneExist } from "../../apollo/server";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';

const PHONE = gql`
  ${phoneExist}
`;

function Registration() {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const formRef = useRef(null);
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passError, setPassError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [fNameError, setFNameError] = useState("");
  const [lNameError, setLNameError] = useState("");
  const [phone, setPhone] = useState("");
  
  const [phoneError, setPhoneError] = useState(null);
  const [PhoneEixst] = useMutation(PHONE, {
    onCompleted,
    onError,
  });
  const handleBackNavigation = () => {
    // Use history.push to navigate to the desired route
    navigate("/new-login");
  };

  useEffect(() => {
    // Add an event listener for the popstate event
    window.addEventListener("popstate", handleBackNavigation);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
    };
  });
  function onCompleted({ phoneExist }) {
    if (phoneExist?._id !== null) {
      setError("Phone number already assocaited with some other user");
      setLoading(false);
    } else {
      navigate("/verify-email", {
        replace: true,
        state: {
          email: formRef.current["email"].value.toLowerCase().trim(),
          password: formRef.current["userPass"].value,
          name:
            formRef.current["firstName"].value +
            " " +
            formRef.current["lastName"].value,
          phone: `+${phone}`,
          picture: "",
        },
      });
    }
  }
  function onError({ error }) {
    setError("Something went wrong");
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const clearErrors = () => {
    setEmailError("");
    setFNameError("");
    setFNameError("");
    setPassError("");
    setError("");
  };

  const handleAction = () => {
    clearErrors();
    let validate = true;
    const emailValue = formRef.current["email"].value;
    const firstNameValue = formRef.current["firstName"].value;
    const lastNameValue = formRef.current["lastName"].value;
    const userPass = formRef.current["userPass"].value;
    const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;

    if (!isValidEmailAddress(emailValue)) {
      setEmailError(t('emailErr2'));
      validate = false;
    }
    if (!firstNameValue.trim()) {
      setFNameError(t('firstnameErr2'));
      validate = false;
    }
    if (!lastNameValue.trim()) {
      setLNameError(t('lastnameErr2'));
      validate = false;
    }
    if (!userPass) {
      setPassError(t('passwordErr2'));
      validate = false;
    }
    if (!phone) {
      setPhoneError(t('mobileErr2'));
      validate = false;
    }
    if (!passRegex.test(userPass)) {
      setPassError(
       t('passwordErr1')
      );
      validate = false;
    }
    if (validate) {
      setLoading(true);
      PhoneEixst({ variables: { phone: `+${phone}` } });
    } else {
      setError(t('generalErr'));
    }
  };


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
      <Box mt={theme.spacing(1)} />
      <Typography variant="h5" className={classes.font700}>
        {t('letsGetStarted')}
      </Typography>
      <Box mt={theme.spacing(1)} />
      <Typography
        variant="caption"
        className={`${classes.caption} ${classes.fontGrey}`}
      >
        {t('createAccount')}
      </Typography>
      <Box mt={theme.spacing(3)} />
      <form ref={formRef}>
        <TextField
          name={"email"}
          defaultValue={state?.email ?? ""}
          error={Boolean(emailError)}
          helperText={emailError}
          variant="outlined"
          label="Email"
          fullWidth
          InputLabelProps={{
            style: {
              color: theme.palette.grey[500],
            },
          }}
        />
        <Box className={classes.rowField}>
          <TextField
            style={{ width: "45%" }}
            name={"firstName"}
            error={Boolean(fNameError)}
            helperText={fNameError}
            variant="outlined"
            label="First Name"
            fullWidth
            InputLabelProps={{
              style: {
                color: theme.palette.grey[600],
              },
            }}
          />
          <TextField
            style={{ width: "45%" }}
            name={"lastName"}
            error={Boolean(lNameError)}
            helperText={lNameError}
            variant="outlined"
            label="Last Name"
            fullWidth
            InputLabelProps={{
              style: {
                color: theme.palette.grey[600],
              },
            }}
          />
        </Box>
        <TextField
          name={"userPass"}
          InputLabelProps={{
            style: {
              color: theme.palette.grey[600],
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="large"
                >
                  {showPassword ? (
                    <Visibility color="primary" />
                  ) : (
                    <VisibilityOff color="primary" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={Boolean(passError)}
          helperText={passError}
          fullWidth
          variant="outlined"
          label="Password"
          type={showPassword ? "text" : "password"}
        />
        <Box className={classes.rowField}>
          <PhoneInput
            placeholder="Enter phone number"
            country={"pk"}
            value={phone}
            onChange={(phone) => setPhone(phone)}
            containerStyle={{
              textAlign: "center",
              marginRight: theme.spacing(2),
              margin: "auto",
            }}
            inputStyle={{
              paddingLeft: 10,
              width: "85%",
              float: "right",
              borderColor: theme.palette.grey[200],
              height: 50,
            }}
            dropdownStyle={{
              position: "absolute",
              top: "-60px",
              left: "60px",
            }}
          />
        </Box>
        <Typography variant="caption" style={{ color: "red" }}>
          {phoneError}
        </Typography>
        <Box mt={theme.spacing(4)} />
        <Button
          variant="contained"
          fullWidth
          type="email"
          disableElevation
          disabled={loading}
          className={classes.btnBase}
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
              {t('continue')}
            </Typography>
          )}
        </Button>
      </form>
    </LoginWrapper>
  );
}

export default Registration;
