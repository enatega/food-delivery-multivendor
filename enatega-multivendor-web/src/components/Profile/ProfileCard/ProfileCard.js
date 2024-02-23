import { useMutation } from "@apollo/client";
import {
  Button,
  CircularProgress,
  Grid,
  Tooltip,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import gql from "graphql-tag";
import React, { useCallback, useContext, useRef, useState } from "react";
import { updateUser } from "../../../apollo/server";
import UserContext from "../../../context/User";
import FlashMessage from "../../FlashMessage";
import useStyle from "./styles";
import IconButton from "@mui/material/IconButton";
import VerifiedIcon from "@mui/icons-material/Verified";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import { Link as RouterLink } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { useTranslation } from 'react-i18next';

const UPDATEUSER = gql`
  ${updateUser}
`;

function ProfileCard() {
  const { t } = useTranslation();
  const theme = useTheme();
  const formRef = useRef(null);
  const classes = useStyle();
  const [nameError, setNameError] = useState("");
  // const [phoneError, setPhoneError] = useState("");
  const { profile } = useContext(UserContext);
  const [error, setError] = useState({});
  const [mutate, { loading }] = useMutation(UPDATEUSER, {
    onCompleted,
    onError,
  });
  function onError(error) {
    setError({ type: "error", message: error.message });
  }

  function onCompleted({ updateUser }) {
    if (updateUser) {
      setError({ type: "success", message: "User's Info Updated" });
    }
  }

  const clearErrors = useCallback(() => {
    setNameError("");
    // setPhoneError("");
    setError({});
  }, []);

  const handleAction = () => {
    clearErrors();
    let validate = true;
    const name = formRef.current["name"].value;

    if (!name) {
      setNameError("Name is required");
      validate = false;
      return;
    }
    if (validate) {
      mutate({
        variables: {
          name: name,
        },
      });
    } else {
      setError({ type: "error", message: "Something is missing" });
    }
  };

  const toggleSnackbar = useCallback(() => {
    setError({});
  }, []);

  return (
    <Grid
      container
      item
      xs={12}
      className={`${classes.mainContainer} ${classes.root}`}
    >
      <FlashMessage
        open={Boolean(error.type)}
        severity={error.type}
        alertMessage={error.message}
        handleClose={toggleSnackbar}
      />
      <Grid
        item
        xs={12}
        sm={10}
        md={8}
        lg={6}
        className={classes.profileContainer}
      >
        {/* <Divider light orientation="horizontal" className={classes.MH3} /> */}
        <Box className={classes.headerBar}>
          <Typography className={classes.titleText}>{t('contactInfo')}</Typography>
        </Box>
        <form ref={formRef} className={classes.formMargin}>
          <Box className={classes.fieldWrapper}>
            <EmailIcon style={{ marginRight: 10 }} />
            <input
              name="email"
              defaultValue={profile?.email ?? ""}
              className={classes.textField}
              disabled
            />
          </Box>
          <Box className={classes.fieldWrapper}>
            <PersonIcon style={{ marginRight: 10 }} />
            <input
              name="name"
              defaultValue={profile?.name ?? ""}
              className={classes.textField}
              error={Boolean(nameError)}
              helperText={nameError}
            />
          </Box>
          <Box className={classes.fieldWrapper}>
            <PhoneIcon style={{ marginRight: 10 }} />
            <input
              name="phone"
              placeholder="Mobile Number"
              defaultValue={profile?.phone ?? ""}
              className={classes.textField}
              style={{ width: "90%" }}
              disabled
            />
            <Box>
              <IconButton edge="end" size="large">
                <RouterLink
                  to="/phone-number"
                  style={{ textDecoration: "none" }}
                  state={{ prevPhone: profile?.phone }}
                >
                  <Typography component="h2" color="primary" mr={2}>
                    {t('edit')}
                  </Typography>
                </RouterLink>

                {profile?.phoneIsVerified ? (
                  <>
                    <Tooltip title="Verified">
                      <VerifiedIcon color="primary" />
                    </Tooltip>
                  </>
                ) : (
                  profile?.phone && (
                    <>
                      <RouterLink
                        to="/verify-phone"
                        style={{ textDecoration: "none" }}
                      >
                        <Typography component="h2" color="primary" mr={2}>
                          Verify?
                        </Typography>
                      </RouterLink>

                      <Tooltip title="not verified">
                        <UnpublishedIcon color="primary" />
                      </Tooltip>
                    </>
                  )
                )}
              </IconButton>
            </Box>
          </Box>

          <Grid item xs={12} className={classes.btnContainer}>
            <Button
              disableElevation
              disabled={loading}
              variant="contained"
              color="primary"
              className={classes.btn}
              onClick={(e) => {
                e.preventDefault();
                handleAction();
              }}
            >
              {loading ? (
                <CircularProgress size={25} color="secondary" />
              ) : (
                <Typography
                  variant="caption"
                  style={{ color: theme.palette.common.black }}
                  className={classes.textBold}
                >
                  {t('saveButton')}
                </Typography>
              )}
            </Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}

export default React.memo(ProfileCard);
