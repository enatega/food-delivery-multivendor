import { gql, useMutation } from "@apollo/client";
import { Button, CircularProgress, Divider, Grid, TextField, Typography, useTheme } from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
import { changePassword } from "../../../apollo/server";
import FlashMessage from "../../FlashMessage";
import useStyle from "./styles";

const CHANGE_PASSWORD = gql`
  ${changePassword}
`;

function PasswordCard() {
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
      <Grid item xs={12}>
        <Typography variant="body2" align="center" color="textSecondary" className={classes.textBold}>
          PASSWORD
        </Typography>
      </Grid>
      <Grid item xs={12} sm={10} md={8} lg={6} className={classes.profileContainer}>
        <Divider light orientation="horizontal" className={classes.MH3} />
        <form ref={formRef}>
          <TextField
            name={"currentPassword"}
            variant="outlined"
            label="Current Password"
            type="password"
            error={Boolean(passError)}
            helperText={passError}
            fullWidth
            InputLabelProps={{
              style: {
                color: theme.palette.grey[600],
              },
            }}
          />
          <TextField
            name={"newPassword"}
            variant="outlined"
            label="New Password"
            type="password"
            error={Boolean(confirmError)}
            helperText={confirmError}
            fullWidth
            InputLabelProps={{
              style: {
                color: theme.palette.grey[600],
              },
            }}
          />
          <Grid item xs={12} className={classes.btnContainer}>
            <Button
              disableElevation
              disabled={loading}
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                handleAction();
              }}
            >
              {loading ? (
                <CircularProgress size={25} />
              ) : (
                <Typography variant="body2" color="secondary" className={classes.textBold}>
                  SAVE
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
