import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function FlashMessage(props) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={props.open}
      onClose={props.handleClose}
      message={props.alertMessage}
      autoHideDuration={!props.alive ? 5000 : undefined}
      key={`${props.message} top`}
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={props.handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    >
    </Snackbar>
  );
}

export default FlashMessage;
