import React from "react";
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

const TermsAndConditions = ({ name, onChange, checked, error }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const handleChange = (event) => {
    onChange(event);
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // For small screens

  return (
    <FormControl component="fieldset" error={!!error}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={handleChange}
            name={t(name)}
            sx={{
              "& .MuiSvgIcon-root": { fontSize: 19 }, fontWeight: '400' // Adjust this value to change checkbox size
            }}
          />
        }

        label={
          <span>
            {t('I agree to the')}{" "}
            <RouterLink
              to="/terms"
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {t("footerLinkTC")}
            </RouterLink>{" "}
            {t("and")}{" "}
            <RouterLink
              to="/privacy"
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {t("privacyPolicy")}
            </RouterLink>
          </span>
        }

        sx={{
          "& .MuiFormControlLabel-label": {
            fontSize: isSmallScreen ? "8px" : "12px", // Adjust this value to your desired font size
            fontWeight: "400",
          },
        }}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default TermsAndConditions;
