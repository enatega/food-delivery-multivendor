import React, { useRef, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  CircularProgress,
} from "@mui/material";
import useStyles from "./styles";
import { ReactComponent as WhatsAppIcon } from "../../../assets/icons/whatsapp.svg";
import { ReactComponent as EmailIcon } from "../../../assets/icons/email.svg";
import { ReactComponent as LocationOnIcon } from "../../../assets/icons/location.svg";
import { gql, useMutation } from "@apollo/client";
import { sendFormSubmission } from "../../../apollo/server";
import FlashMessage from "../../FlashMessage";

const SEND_FORM_SUBMISSION = gql`
  ${sendFormSubmission}
`;

export default function Contact() {
  const classes = useStyles();
  const formRef = useRef(null);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [mutateForm, { loading: formLoading }] = useMutation(
    SEND_FORM_SUBMISSION,
    {
      onError,
      onCompleted,
    }
  );
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("md"));

  function clearContactFields() {
    formRef.current["name"].value = "";
    formRef.current["email"].value = "";
    formRef.current["message"].value = "";
  }

  function onError(error) {
    console.log("Error while submitting form:", error);
    setFormMessage(error.message);
  }

  function onCompleted(data) {
    console.log(
      "Form Submission Successful Response:",
      data.sendFormSubmission
    );
    clearContactFields();
    setFormMessage(data.sendFormSubmission.message);
  }

  const validateEmailAddress = () => {
    const emailValue = formRef.current["email"].value;
    const reEmail = /\S+@\S+\.\S+/;
    if (reEmail.test(emailValue)) {
      setEmailError("");
      return true;
    }
    setEmailError("Invalid Email format");
    return false;
  };

  const validateName = () => {
    if (!!formRef.current["name"].value) {
      setNameError("");
      return true;
    }
    setNameError("Name is not given");
    return false;
  };

  const validateMessage = () => {
    if (!!formRef.current["message"].value) {
      setMessageError("");
      return true;
    }
    setNameError("Message is not given");
    return false;
  };

  const handleFormSubmission = () => {
    const [name, email, message] = [
      formRef.current["name"].value,
      formRef.current["email"].value,
      formRef.current["message"].value,
    ];
    if (validateEmailAddress() && validateName() && validateMessage()) {
      mutateForm({
        variables: {
          name,
          email,
          message,
        },
      });
    }
  };

  return (
    <Box style={{ width: "90%", margin: "auto" }}>
      <FlashMessage
        open={!!formMessage}
        alertMessage={formMessage}
        handleClose={() => setFormMessage("")}
      />
      <Grid
        container
        spacing={3}
        style={{
          alignItems: "center",
          margin: small ? "2rem 0rem 2rem 0rem" : 0,
        }}
      >
        <Grid item xs={12} md={4} style={{ order: small ? 2 : 1 }}>
          <Box className={classes.contactInfo}>
            <Box className={classes.bg}>
              <Box className={classes.contactIcon}>
                <Box className={classes.iconContainer}>
                  <WhatsAppIcon style={{ color: theme.palette.primary.main }} />
                </Box>
                <Typography style={{ color: theme.palette.common.white }}>
                  (+92) 3339461270
                </Typography>
              </Box>
              <Box className={[classes.margin, classes.contactIcon]}>
                <Box className={classes.iconContainer}>
                  <EmailIcon style={{ color: theme.palette.primary.main }} />
                </Box>
                <Typography style={{ color: theme.palette.common.white }}>
                  sharan@ninjascode.com
                </Typography>
              </Box>
              <Box className={classes.contactIcon}>
                <Box className={classes.iconContainer}>
                  <LocationOnIcon
                    style={{ color: theme.palette.primary.main }}
                  />
                </Box>
                <Typography style={{ color: theme.palette.common.white }}>
                  Islamabad, Pakistan
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          style={{
            padding: small ? "2.5rem" : "5rem",
            order: small ? 1 : 2,
            position: "relative",
          }}
        >
          <Typography className={small ? classes.bgTextSmall : classes.bgText}>
            Contact
          </Typography>
          <form ref={formRef}>
            <Grid
              container
              spacing={6}
              style={{ marginTop: small ? "2px" : 0 }}
            >
              <Grid item xs={12} md={6}>
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  style={{ width: "100%" }}
                >
                  <TextField
                    id="name"
                    label="Name"
                    variant="outlined"
                    className={classes.textField}
                    error={!!nameError}
                    helperText={nameError}
                    InputProps={{
                      style: {
                        borderRadius: 20,
                        border: "1px solid lightgray",
                        background: "white",
                        color: "textSecondary",
                      },
                    }}
                    InputLabelProps={{
                      style: {
                        color: "#B8B8B8",
                      },
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="flex-start">
                  <TextField
                    type="email"
                    id="email"
                    label="Email"
                    variant="outlined"
                    className={classes.textField}
                    error={!!emailError}
                    helperText={emailError}
                    InputProps={{
                      style: {
                        borderRadius: 20,
                        border: "1px solid lightgray",
                        color: "textSecondary",
                        background: "white",
                      },
                    }}
                    InputLabelProps={{
                      style: {
                        color: "#B8B8B8",
                      },
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="message"
                  label="Message"
                  className={classes.textArea}
                  multiline
                  error={!!messageError}
                  helperText={messageError}
                  rows={4}
                  style={{ width: "100%" }}
                  InputProps={{
                    style: {
                      borderRadius: 20,
                      border: "1px solid lightgray",
                      color: "textSecondary",
                      background: "white",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      color: "#B8B8B8",
                    },
                  }}
                />
                <Grid item xs={12} sx={{ mt: 3 }} align="center">
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: theme.palette.common.black,
                      color: theme.palette.primary.main,
                      fontWeight: 700,
                      width: 140,
                      fontSize: 12,
                      borderRadius: 10,
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleFormSubmission();
                    }}
                  >
                    {formLoading ? (
                      <CircularProgress color="primary" size={18} />
                    ) : (
                      <Typography variant="caption" className={classes.font700}>
                        Submit
                      </Typography>
                    )}
                  </Button>
                </Grid>
                <Grid item xs={12} sx={{ mt: 3 }} align="center">
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.common.black,
                      fontWeight: 700,
                      width: 140,
                      fontSize: 12,
                      borderRadius: 10,
                    }}
                    onClick={() =>
                      window.open(
                        "https://calendly.com/sharan-gohar/15min",
                        "_blank"
                      )
                    }
                  >
                    <Typography variant="caption" className={classes.font700}>
                      Set a meeting
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}
