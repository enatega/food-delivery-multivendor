import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import clsx from "clsx";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import useStyles from "./styles";
import { useTranslation } from 'react-i18next';
function RestaurantClose({ isVisible, toggleModal, restaurant, closeMenu = true }) {
  const classes = useStyles();
  const { t  } = useTranslation();
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
        <IconButton size="medium" onClick={toggleModal} className={classes.closeContainer}>
          <CloseIcon color="primary" />
        </IconButton>
      </Box>
      <DialogTitle>
        <Box component="div">
          <Typography variant="h5" color="textSecondary" className={clsx(classes.boldText, classes.title)}>
            {`${restaurant} is closed Now.`}
          </Typography>
          <Typography variant="subtitle2" className={`${classes.disabledText} ${classes.lightText}`}>
            {t('restaurantCloseText')}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <RouterLink to="/" className={classes.linkBtn}>
          <Button variant="contained" color="primary" fullWidth className={classes.btnBase}>
            <Typography variant="subtitle2" className={classes.boldText}>
              {t('seeOtherRestaurants')}
            </Typography>
          </Button>
        </RouterLink>
        {closeMenu && (
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            className={classes.btnBase}
            onClick={(e) => {
              e.preventDefault();
              toggleModal();
            }}
          >
            <Typography variant="subtitle2" color="primary" className={classes.boldText}>
              {t('goToMenu')}
            </Typography>
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(RestaurantClose);
