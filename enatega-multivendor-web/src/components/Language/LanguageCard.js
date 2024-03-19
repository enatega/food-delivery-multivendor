import { useMutation } from "@apollo/client";
import {
  Button,
  CircularProgress,
  Grid,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import gql from "graphql-tag";
import React, { useCallback, useRef, useState } from "react";
import { updateUser } from "../../apollo/server";
import FlashMessage from "../FlashMessage";
import useStyle from "./styles";
//import { Link as RouterLink } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
console.log(i18n);

const UPDATEUSER = gql`
  ${updateUser}
`;
const languageTypes = [
  { value: "English", code: "en", index: 0 },
  { value: "français", code: "fr", index: 1 },
  { value: "ភាសាខ្មែរ", code: "km", index: 2 },
  { value: "中文", code: "zh", index: 3 },
  { value: "Deutsche", code: "de", index: 4 },
  { value: "arabic", code: "ar", index: 5 },
];
function LanguageCard() {
  const { t } = useTranslation();
  const theme = useTheme();
  const formRef = useRef(null);
  const classes = useStyle();

  const [error, setError] = useState({});
  const [mutate, { loading }] = useMutation(UPDATEUSER, {
    onCompleted,
    onError,
  });
  console.log(mutate);
  function onError(error) {
    setError({ type: "error", message: error.message });
  }

  function onCompleted({ updateUser }) {
    if (updateUser) {
      setError({ type: "success", message: "User's Info Updated" });
    }
  }

  const toggleSnackbar = useCallback(() => {
    setError({});
  }, []);

  const currentLang = localStorage.getItem("enatega-language");
  const [selectedLanguage, setSelectedLanguage] = useState(
    currentLang ? currentLang : "en"
  );
  console.log(selectedLanguage);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    localStorage.setItem("enatega-language", event.target.value);
    const savedLanguage = localStorage.getItem("enatega-language");
    console.log("Saved language in localStorage:", savedLanguage);
  };

  return (
    <Grid
      container
      item
      xs={12}
      className={`${classes.mainContainer} ${classes.root}`}
    >
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
        {/* <Divider light orientation="horizontal" className={classes.MH3} /> */}
        <Box className={classes.headerBar}>
          <Typography className={classes.titleText}>
            {t("selectLanguage")}
          </Typography>
        </Box>
        <form ref={formRef} className={classes.formMargin}>
          <RadioGroup
            name="language"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {languageTypes.map((lang) => (
              <FormControlLabel
                key={lang.code}
                value={lang.code}
                control={<Radio color="primary" />}
                label={lang.value}
                checked={lang.code === localStorage.getItem("enatega-language")}
              />
            ))}
          </RadioGroup>

          <Grid item xs={12} className={classes.btnContainer}>
            <Button
              disableElevation
              disabled={loading}
              variant="contained"
              color="primary"
              className={classes.btn}
              onClick={(e) => {
                e.preventDefault();
                window.location.reload();
              }}
            >
              {loading ? (
                <CircularProgress size={25} color="secondary" />
              ) : (
                <Typography
                  variant="caption"
                  style={{ color: theme.palette.common.black }}
                  className={classes.textBold}
                >
                  {t("saveButton")}
                </Typography>
              )}
            </Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}

export default React.memo(LanguageCard);
