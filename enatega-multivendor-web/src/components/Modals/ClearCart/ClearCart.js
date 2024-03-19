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
import { useTranslation } from 'react-i18next';

function ClearCart({ isVisible, toggleModal, action }) {
  const theme = useTheme();
  const classes = useStyles();
  const extraSmall = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation()
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
            {t('areYouSure')}
          </Typography>
          <Typography variant="subtitle2" className={`${classes.disabledText} ${classes.lightText}`}>
           {t('clearCartText')}
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
              {t('ok')}
            </Typography>
          </Button>
          <Button variant="outlined" color="primary" fullWidth className={classes.btnBase} onClick={toggleModal}>
            <Typography variant="subtitle2" color="primary" className={classes.boldText}>
              {t('cancel')}
            </Typography>
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(ClearCart);
