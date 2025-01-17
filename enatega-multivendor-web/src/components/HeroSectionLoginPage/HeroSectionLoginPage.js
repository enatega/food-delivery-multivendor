import React from "react";
import { Box, Typography } from "@mui/material";
import useStyle from "./styles";
import imageSrc from '../../assets/images/header-img.png'
import { useTranslation } from "react-i18next";


const HerosectionLoginPages = ({ headingText, descriptionText }) => {
  const classes = useStyle();
  const { t } = useTranslation()
  return (
    <Box className={classes.heroSection}>
      <img src={imageSrc} alt="Hero" className={classes.heroImage} />
      <div className={classes.overlay}></div>
      <Box className={classes.textOverlay}>
        <Typography variant="h4" className={classes.heroHeading}>
          {t(headingText)}
        </Typography>
        <Typography variant="body2" className={classes.heroDescription}>
          {t(descriptionText)}
        </Typography>
      </Box>
    </Box>
  );
};

export default HerosectionLoginPages;
