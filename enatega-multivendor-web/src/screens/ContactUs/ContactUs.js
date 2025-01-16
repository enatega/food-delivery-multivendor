import React, { useState, useEffect, useContext } from "react";
import { LoginHeader, Header } from "../../components/Header";
import HerosectionLoginPages from "../../components/HeroSectionLoginPage/HeroSectionLoginPage";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ContactForm from "../../components/ContactForm";
import NewFooter from "../../components/Footer/newFooter/NewFooter";
import { sendEmail } from "../../utils/emailService";
import UserContext from "../../context/User";
import Phone from "../../assets/images/Phone.png";
import Letter from "../../assets/images/Letter.png";
import { Box, Typography, Grid } from "@mui/material";
import useStyles from "./style";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ContactUs = () => {
  const { t } = useTranslation();
  const { isLoggedIn } = useContext(UserContext);
  const classes = useStyles();
  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [formState, setFormState] = useState({
    phoneForm: { firstName: "", lastName: "", phoneNumber: "", message: "" },
    emailForm: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
  });
  const [loading, setLoading] = useState({
    phoneForm: false,
    emailForm: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e, formType) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [formType]: { ...prev[formType], [name]: value },
    }));
  };

  const handleSubmit = (formType) => (e) => {
    e.preventDefault();
    const formData = formState[formType];

    if (formType === "phoneForm") {
      if (!formData.phoneNumber) {
        setAlert({
          open: true,
          severity: "error",
          message: "mobileErr1",
        });
        return;
      }

      const phoneRegex = /^\+?[0-9]{7,15}$/; // Adjust based on desired format
      if (!phoneRegex.test(formData.phoneNumber)) {
        setAlert({
          open: true,
          severity: "error",
          message: "enterValidPhone", // Replace with translation key if applicable
        });
        return;
      }
      
    }

    // Existing email form validation
    if (formType === "emailForm") {
      if (!formData.email) {
        setAlert({
          open: true,
          severity: "error",
          message: "requiredEmail",
        });
        return;
      }
    }

    // Email validation
    if (formType === "emailForm" && !formData.requiredField) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setAlert({
          open: true,
          severity: "error",
          message: "enterValidEmail",
        });
        return;
      }
    }

    setLoading((prev) => ({ ...prev, [formType]: true }));
    const templateParams = {
      ...formData,
      role: "Contact Us email",
      isWaitlist: false,
    };

    sendEmail("template_psaaqmj", templateParams)
      .then(() => {
        setAlert({
          open: true,
          severity: "success",
          message: "formSubmission",
        });
        setFormState((prev) => ({
          ...prev,
          [formType]: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            message: "",
          },
        }));
        navigate("/ThankYouPage");
      })
      .catch((error) => {
        setAlert({ open: true, severity: "error", message: error.message });
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, [formType]: false }));
      });
  };

  const handleCloseAlert = (_, reason) => {
    if (reason === "clickaway") return;
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const renderHeading = (icon, text) => (
    <Box display="flex" alignItems="center" gap={2}>
      <Box
        sx={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          height: "30px",
          width: "30px",
          borderRadius: "50%",
          border: "1.48px solid #D1D1D6",
          padding: "10px",
        }}
      >
        <img src={icon} alt={text} style={{ height: "100%", width: "100%" }} />
      </Box>
      <Typography sx={{fontSize: '32px', fontWeight: '500'}}>{t(text)}</Typography>
    </Box>
  );

  return (
    <Box>
      {isLoggedIn ? <Header /> : <LoginHeader showIcon />}
      <HerosectionLoginPages
        imageSrc={Phone}
        headingText="contactUsHeading"
        descriptionText="contactUsDescription"
      />
      <Grid container className={classes.gridContainer} md={10} xs={11} gap={5}>
        <Grid item xs={12} sm={12} md={5}>
          <ContactForm
            heading={renderHeading(Phone, "viaPhone")}
            descriptionText="viaPhoneDesctiption"
            formData={formState.phoneForm}
            onChange={(e) => handleChange(e, "phoneForm")}
            onSubmit={handleSubmit("phoneForm")}
            loading={loading.phoneForm}
            isPhoneForm
          />
        </Grid>
        <Grid item xs={12} sm={12} md={5}>
          <ContactForm
            heading={renderHeading(Letter, "vieEmail")}
            descriptionText="viaEmailDesctiption"
            formData={formState.emailForm}
            onChange={(e) => handleChange(e, "emailForm")}
            onSubmit={handleSubmit("emailForm")}
            loading={loading.emailForm}
          />
        </Grid>
      </Grid>
      <NewFooter />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert severity={alert.severity} sx={{ width: "100%" }}>
          {t(alert.message)}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactUs;
