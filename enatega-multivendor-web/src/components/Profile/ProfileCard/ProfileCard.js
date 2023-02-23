import { useMutation } from "@apollo/client";
import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import gql from "graphql-tag";
import React, { useCallback, useContext, useRef, useState } from "react";
import { updateUser } from "../../../apollo/server";
import UserContext from "../../../context/User";
import FlashMessage from "../../FlashMessage";
import useStyle from "./styles";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VerifiedIcon from "@mui/icons-material/Verified";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import { Link as RouterLink } from "react-router-dom";

const UPDATEUSER = gql`
  ${updateUser}
`;

function ProfileCard() {
  const theme = useTheme();
  const formRef = useRef(null);
  const classes = useStyle();
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
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
    setPhoneError("");
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
    <Grid container item xs={12} className={classes.mainContainer}>
      <FlashMessage
        open={Boolean(error.type)}
        severity={error.type}
        alertMessage={error.message}
        handleClose={toggleSnackbar}
      />
      <Grid item xs={12}>
        <Typography
          variant="body2"
          align="center"
          color="textSecondary"
          className={classes.textBold}
        >
          MY PROFILE
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={10}
        md={8}
        lg={6}
        className={classes.profileContainer}
      >
        <Divider light orientation="horizontal" className={classes.MH3} />
        <form ref={formRef}>
          <TextField
            name={"email"}
            variant="outlined"
            label="Email"
            value={profile?.email ?? ""}
            disabled
            fullWidth
            InputLabelProps={{
              style: {
                color: theme.palette.grey[600],
              },
            }}
          />
          <TextField
            name={"name"}
            variant="outlined"
            label="Name"
            defaultValue={profile?.name ?? ""}
            error={Boolean(nameError)}
            helperText={nameError}
            fullWidth
            InputLabelProps={{
              style: {
                color: theme.palette.grey[600],
              },
            }}
          />
          <TextField
            name={"phone"}
            variant="outlined"
            label="Mobile Number"
            defaultValue={profile?.phone ?? ""}
            error={Boolean(phoneError)}
            helperText={phoneError}
            fullWidth
            disabled
            InputLabelProps={{
              style: {
                color: theme.palette.grey[600],
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" size="large">
                    <RouterLink
                      to="/phone-number"
                      style={{ textDecoration: "none" }}
                      state={{ prevPhone: profile?.phone }}
                    >
                      <Typography component="h2" color="primary" mr={2}>
                        Edit
                      </Typography>
                    </RouterLink>

                    {profile?.phoneIsVerified ? (
                      <>
                        <Tooltip title="Verified">
                          <VerifiedIcon color="primary" />
                        </Tooltip>
                      </>
                    ) : (
                      profile?.phone && <>
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
                    )}
                  </IconButton>
                </InputAdornment>
              ),
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
                <CircularProgress size={25} color="secondary" />
              ) : (
                <Typography
                  variant="body2"
                  color="secondary"
                  className={classes.textBold}
                >
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

export default React.memo(ProfileCard);
