import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlashMessage from "../../components/FlashMessage";
import { LoginWrapper } from "../Wrapper";
import useStyles from "./styles";
import RegistrationIcon from "../../assets/images/emailLock.png";
import { Avatar } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { phoneExist } from "../../apollo/server";
import { gql, useMutation } from "@apollo/client";

const PHONE = gql`
  ${phoneExist}
`;

function PhoneNumber() {
  const theme = useTheme();
  const classes = useStyles();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const formRef = useRef(null);
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [PhoneEixst] = useMutation(PHONE, {
    onCompleted,
    onError,
  });

  function onCompleted({ phoneExist }) {
    if (phoneExist?._id !== null) {
      setError("Phone number already assocaited with some other user");
      setLoading(false);
    } else {
      navigate("/verify-phone", {
        replace: true,
        state: {
          phone: `+${phone}`,
        },
      });
    }
  }
  function onError({ error }) {
    setError("Something went wrong");
  }

  const handleAction = () => {
    setError("");
    let validate = true;
    if (!phone) {
      setPhoneError("Phone number required");
      validate = false;
      return;
    }
    if (validate) {
      if (`+${phone}` !== state?.prevPhone) {
        PhoneEixst({ variables: { phone: `+${phone}` } });
      } else {
        setPhoneError("New phone number must be different from pervious one");
      }
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
        Update your phone <br /> number?
      </Typography>
      <Box mt={theme.spacing(1)} />
      <Typography
        variant="caption"
        className={`${classes.caption} ${classes.fontGrey}`}
      >
        We need this to secure your account
      </Typography>
      <Box mt={theme.spacing(4)} />
      <form ref={formRef}>
        <Box className={classes.form}>
          <PhoneInput
            placeholder="Enter phone number"
            country={"pk"}
            value={phone}
            onChange={(phone) => setPhone(phone)}
            containerStyle={{
              textAlign: "center",
              marginRight: theme.spacing(2),
              margin: "auto",
              width: "90%",
            }}
            inputStyle={{
              paddingLeft: 10,
              float: "right",
            }}
          />
        </Box>
        <Typography variant="caption" style={{ color: "red" }}>
          {phoneError}
        </Typography>
        <Box mt={theme.spacing(8)} />
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
              CONTINUE
            </Typography>
          )}
        </Button>
      </form>
    </LoginWrapper>
  );
}

export default PhoneNumber;
