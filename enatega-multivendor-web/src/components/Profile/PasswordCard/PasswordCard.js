import { gql, useMutation } from "@apollo/client";
import {
  Button,
  CircularProgress,
  Grid,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
import { changePassword } from "../../../apollo/server";
import FlashMessage from "../../FlashMessage";
import useStyle from "./styles";
import PasswordIcon from "@mui/icons-material/Password";
import { useTranslation } from 'react-i18next';

const CHANGE_PASSWORD = gql`
  ${changePassword}
`;

function PasswordCard() {
  const { t } = useTranslation();
  const theme = useTheme();
  const formRef = useRef(null);
  const classes = useStyle();
  const [passError, setPassError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [error, setError] = useState({});
  const [mutate, { loading }] = useMutation(CHANGE_PASSWORD, {
    onError,
    onCompleted,
  });

  function onError(error) {
    setError({ type: "error", message: error.message });
  }

  function onCompleted(data) {
    if (data.changePassword) {
      clearErrors();
      setError({ type: "success", message: "Password Updated" });
    } else {
      setError({ type: "error", message: "Invalid password" });
    }
  }

  const clearErrors = useCallback(() => {
    setPassError("");
    setConfirmError("");
    setError({});
  }, []);

  const handleAction = () => {
    console.log(passError + " " + confirmError);
    clearErrors();
    let validate = true;
    const oldPassword = formRef.current["currentPassword"].value;
    const newPassword = formRef.current["newPassword"].value;
    if (!oldPassword) {
      setPassError("Password is required");
      validate = false;
      return;
    }
    if (!newPassword) {
      setConfirmError("Password is required");
      validate = false;
      return;
    }
    if (validate) {
      mutate({ variables: { oldPassword, newPassword } });
    } else {
      setError({ type: "error", message: "Something is missing" });
    }
  };

  const toggleSnackbar = useCallback(() => {
    setError({});
  }, []);

  return (
    <Grid container item xs={12} className={classes.mainContainer}>
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
        <Box className={classes.headerBar}>
          <Typography className={classes.titleText}>{t('passwordInfo')}</Typography>
        </Box>
        {/* <Divider light orientation="horizontal" className={classes.MH3} /> */}
        <form ref={formRef} className={classes.formMargin}>
          <Box className={classes.fieldWrapper}>
            <PasswordIcon style={{ marginRight: 10 }} />
            <input
              name="currentPassword"
              className={classes.textField}
              type="password"
              placeholder={t('currentPassword')}
            />
          </Box>
          <Box className={classes.fieldWrapper}>
            <PasswordIcon style={{ marginRight: 10 }} />

            <input
              type="password"
              name="newPassword"
              className={classes.textField}
              placeholder={t('newPassword')}
              autoComplete="off"
            />
          </Box>
          <Grid item xs={12} className={classes.btnContainer}>
            <Button
              disableElevation
              disabled={loading}
              variant="contained"
              className={classes.btn}
              onClick={(e) => {
                e.preventDefault();
                handleAction();
              }}
            >
              {loading ? (
                <CircularProgress size={25} />
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

export default React.memo(PasswordCard);
