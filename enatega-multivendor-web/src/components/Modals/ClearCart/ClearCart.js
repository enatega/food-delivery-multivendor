import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import clsx from "clsx";
import React from "react";
import useStyles from "./styles";

function ClearCart({ isVisible, toggleModal, action }) {
  const theme = useTheme();
  const classes = useStyles();
  const extraSmall = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      onClose={toggleModal}
      open={isVisible}
      scroll="body"
      fullWidth={true}
      maxWidth="xs"
      className={classes.root}
    >
      <Box display="flex" justifyContent="flex-end">
        <IconButton size={extraSmall ? "medium" : "small"} onClick={toggleModal} className={classes.closeContainer}>
          <CloseIcon color="primary" />
        </IconButton>
      </Box>
      <DialogTitle>
        <Box component="div">
          <Typography variant="h5" color="textSecondary" className={clsx(classes.boldText, classes.MB2)}>
            Are you sure?
          </Typography>
          <Typography variant="subtitle2" className={`${classes.disabledText} ${classes.lightText}`}>
            By changing restaurant, the items you`ve added to cart will be cleared
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className={classes.btnBase}
            onClick={async (e) => {
              e.preventDefault();
              await action();
              toggleModal();
            }}
          >
            <Typography variant="subtitle2" className={classes.boldText}>
              Ok
            </Typography>
          </Button>
          <Button variant="outlined" color="primary" fullWidth className={classes.btnBase} onClick={toggleModal}>
            <Typography variant="subtitle2" color="primary" className={classes.boldText}>
              Cancel
            </Typography>
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(ClearCart);
