import { gql, useMutation } from "@apollo/client";
import {
  Button,
  CircularProgress,
  Grid,
  Typography,
  Box,
  useTheme,
  IconButton,
} from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
import { changePassword } from "../../../apollo/server";
import FlashMessage from "../../FlashMessage";
import useStyle from "./styles";
import PasswordIcon from "@mui/icons-material/Password";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

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
        
        // Password validation requirements
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/; // At least 8 characters, one lowercase letter, one uppercase letter, one number
        if (!passwordRegex.test(newPassword)) {
            setConfirmError("Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number");
            validate = false;
            return;
        }

        if (!oldPassword) {
            setPassError("Current password is required");
            validate = false;
            return;
        }
        if (!newPassword) {
            setConfirmError("New password is required");
            validate = false;
            return;
        }
        if (validate) {
            mutate({ variables: { oldPassword, newPassword } });
        } else {
            setError({ type: "error", message: "Invalid password" });
        }
    };

    const toggleSnackbar = useCallback(() => {
        setError({});
    }, []);

    const handleTogglePasswordVisibility = (field) => {
        if (field === "current") {
            setShowCurrentPassword((prevShowCurrentPassword) => !prevShowCurrentPassword);
        } else if (field === "new") {
            setShowNewPassword((prevShowNewPassword) => !prevShowNewPassword);
        }
    };

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
                <form ref={formRef} className={classes.formMargin}>
                    <Box className={classes.fieldWrapper}>
                        <PasswordIcon style={{ marginRight: 10 }} />
                        <input
                            name="currentPassword"
                            className={classes.textField}
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder={t('currentPassword')}
                        />
                        <IconButton
                            onClick={() => handleTogglePasswordVisibility("current")}
                            aria-label="toggle current password visibility"
                            edge="end"
                        >
                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </Box>
                    {passError && <Typography variant="caption" color="error">{passError}</Typography>}
                    <Box className={classes.fieldWrapper}>
                        <PasswordIcon style={{ marginRight: 10 }} />
                        <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            className={classes.textField}
                            placeholder={t('newPassword')}
                            autoComplete="off"
                        />
                        <IconButton
                            onClick={() => handleTogglePasswordVisibility("new")}
                            aria-label="toggle new password visibility"
                            edge="end"
                        >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </Box>
                    {confirmError && <Typography variant="caption" color="error">{confirmError}</Typography>}
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
