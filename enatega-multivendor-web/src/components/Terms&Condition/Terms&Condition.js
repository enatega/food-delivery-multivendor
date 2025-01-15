import React from "react";
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const TermsAndConditions = ({ label, name, onChange, checked, error }) => {
  const { t } = useTranslation();
  const handleChange = (event) => {
    onChange(event);
  };

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
        label={t(label)}
        sx={{
          "& .MuiFormControlLabel-label": {
            fontSize: "12px", // Adjust this value to your desired font size
            fontWeight: "400",
          },
        }}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default TermsAndConditions;
