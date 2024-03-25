import { gql, useMutation } from "@apollo/client";
import { Avatar } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useCallback, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { emailExist } from "../../apollo/server";
import EmailImage from "../../assets/images/email.png";
import FlashMessage from "../../components/FlashMessage";
import { LoginWrapper } from "../Wrapper";
import useStyles from "./styles";
import { useTranslation } from 'react-i18next';

function isValidEmailAddress(address) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(address);
}

const EMAIL = gql`
  ${emailExist}
`;

function NewLogin() {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const [error, setError] = useState("");
  const formRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [EmailEixst, { loading }] = useMutation(EMAIL, {
    onCompleted,
    onError,
  });

  function onCompleted({ emailExist }) {
    if (emailExist?._id !== null) {
      navigate("/login-email", {
        replace: true,
        state: {
          email: formRef.current["email"].value,
          from: location.state?.from,
        },
      });
    } else {
      navigate("/registration", {
        replace: true,
        state: {
          email: formRef.current["email"].value,
          from: location.state?.from,
        },
      });
    }
  }
  function onError({ error }) {
    setError("Something went wrong");
  }

  const handleAction = () => {
    const emailValue = formRef.current["email"].value;
    if (isValidEmailAddress(emailValue)) {
      setError("");
      EmailEixst({ variables: { email: emailValue } });
    } else {
      setError("Invalid Email");
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
            src={EmailImage}
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
        {t('whatsYourEmail')}
      </Typography>
      <Box mt={theme.spacing(1)} />
      <Typography
        variant="caption"
        className={`${classes.caption} ${classes.fontGrey}`}
      >
        {t('checkAccount')}
      </Typography>
      <Box mt={theme.spacing(4)} />
      <form ref={formRef}>
        <TextField
          name={"email"}
          error={Boolean(error)}
          helperText={error}
          variant="outlined"
          defaultValue={"demo-customer@enatega.com"}
          label="Email"
          type={"email"}
          fullWidth
          InputLabelProps={{
            style: {
              color: theme.palette.grey[600],
            },
          }}
        />
        <Box mt={theme.spacing(8)} />
        <Button
          variant="contained"
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
              {t('continue')}
            </Typography>
          )}
        </Button>
      </form>
    </LoginWrapper>
  );
}

export default NewLogin;
