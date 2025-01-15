import React from "react";
import useStyles from "./style";
import { Typography, Box } from "@mui/material";
import { useTranslation } from 'react-i18next';


const FormCard = ({ heading, descriptionText, children }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <Box className={classes.cardContainer}>
      {heading && (
        <div>
          {React.isValidElement(heading) ? (
            heading
          ) : (
            <Typography className={classes.heading}>{t(heading)}</Typography>
          )}
        </div>
      )}
      {descriptionText && (
        <Box className={classes.descriptionBox}>
          <Typography
            variant="caption"
            color="text.disabled"
            className={classes.description}
          >
            {t(descriptionText)}
          </Typography>
        </Box>
      )}
      <div className={classes.formContent}>{children}</div>
    </Box>
  );
};

export default FormCard;
