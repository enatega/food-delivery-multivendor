/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Autocomplete from "@mui/material/Autocomplete";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SyncLoader from "react-spinners/SyncLoader";
import LocationIcon from "../../../assets/icons/LocationIcon";
import { useLocationContext } from "../../../context/Location";
import { useLocation } from "../../../hooks";
import FlashMessage from "../../FlashMessage";
import useStyle from "./styles";
// import { NavigateNextTwoTone } from "@mui/icons-material";

const autocompleteService = { current: null };

function SearchContainer() {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const extraSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyle({ mobile, extraSmall });
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(["Loading ..."]);
  const { getCurrentLocation } = useLocation();
  const [open, setOpen] = useState();
  const { location, setLocation } = useLocationContext();
  const [search, setSearch] = useState("");
  const navigateTo = useNavigate();
  const [alertError, setAlertError] = useState(null);
  const [loading, setLoading] = useState(false)

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    []
  );
  const locationCallback = (error, data) => {
    setLoading(false)
    if (error) {
      setAlertError(error)
      setOpen(true)
      return
    }
    setSearch(data.deliveryAddress)
    setLocation(data)
  }
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);


  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];
        if (value) {
          newOptions = [value];
        }
        if (results) {
          newOptions = [...newOptions, ...results];
        }
        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Grid container className={classes.mainContainer}>
      <FlashMessage
        severity={loading ? "info" : "error"}
        alertMessage={alertError}
        open={open}
        handleClose={handleClose}
      />

      <Grid item xs={12} className={classes.headingContainer}>
        <Grid item xs={1} md={1} />
        <Grid
          container
          item
          xs={10}
          sm={10}
          md={9}
          lg={7}
          className={classes.searchContainer}
        >
          <Grid item xs={12} sm={9}>
            <Autocomplete
              id="google-map-demo"
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.description
              }
              filterOptions={(x) => x}
              options={options}
              autoComplete
              includeInputInList
              filterSelectedOptions
              value={loading ? "Loading ..." : search ? search : location ? location.deliveryAddress : ""}
              onChange={(event, newValue) => {
                if (newValue) {
                  const b = new window.google.maps.Geocoder();
                  b.geocode({ placeId: newValue.place_id }, (res) => {
                    const location = res[0].geometry.location;
                    setLocation({
                      label: "Home",
                      deliveryAddress: newValue.description,
                      latitude: location.lat(),
                      longitude: location.lng()
                    })
                  });
                } else {
                  setSearch("");
                }
                setOptions(newValue ? [...options] : options);
                setValue(newValue);
              }}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  style={{ color: "initial" }}
                  variant="outlined"
                  label="Enter your full address"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                        <InputAdornment
                          position="end"
                          onClick={(e) => {
                            e.preventDefault();
                            setValue(search?.deliveryAddress ?? "");
                            setSearch(location?.deliveryAddress ?? "");
                          }}
                        >
                          {loading ? (
                            <SyncLoader
                              color={theme.palette.primary.main}
                              size={5}
                              speedMultiplier={0.7}
                              margin={1}
                            />
                          ) : (
                            <LocationIcon onClick={(e) => {
                              e.preventDefault()
                              setLoading(true)
                              getCurrentLocation(locationCallback)
                            }} />
                          )}
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => {
                const matches =
                  option.structured_formatting.main_text_matched_substrings;
                let parts = null;
                if (matches) {
                  parts = parse(
                    option.structured_formatting.main_text,
                    matches.map((match) => [
                      match.offset,
                      match.offset + match.length,
                    ])
                  );
                }

                return (
                  <Grid {...props} container alignItems="center">
                    <Grid item>
                      <LocationOnIcon className={classes.icon} />
                    </Grid>
                    <Grid item xs>
                      {parts &&
                        parts.map((part, index) => (
                          <span
                            key={index}
                            style={{
                              fontWeight: part.highlight ? 700 : 400,
                              color: "black",
                            }}
                          >
                            {part.text}
                          </span>
                        ))}

                      <Typography variant="body2" color="textSecondary">
                        {option.structured_formatting.secondary_text}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disableElevation
              className={classes.button}
              onClick={(e) => {
                e.preventDefault();
                if (location) {
                  navigateTo("/restaurant-list");
                }
              }}
            >
              Find Restaurants
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default React.memo(SearchContainer);
