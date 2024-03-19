/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Container,
  Divider,
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
import React, { useEffect, useState } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import LocationIcon from "../../../assets/icons/LocationIcon";
import { ReactComponent as ArrowIcon } from "../../../assets/images/arrow.svg";
import RightIcon from "../../../assets/icons/RightIcon";
import { useLocationContext } from "../../../context/Location";
import { useLocation } from "../../../hooks";
import FlashMessage from "../../FlashMessage";
import useStyles from "./styles";
import { useTranslation } from 'react-i18next';
import { DeliveryCard } from "../../Checkout";

const autocompleteService = { current: null };

function Subheader() {
  const { t } = useTranslation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const spacingTop = mobile ? "52px" : "63px";
  const classes = useStyles();
  const [expand, setExpand] = useState(false);
  const { location, setLocation } = useLocationContext();
  const { getCurrentLocation } = useLocation();
  const [search, setSearch] = useState(
    location ? location.deliveryAddress : ""
  );
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [latLng, setLatLng] = useState({});
  const [loading, setLoading] = useState();
  const [selectedAddress, setSelectedAddress] = useState();

  const setDeliveryAddress = (item) => {
    setSelectedAddress(item);
    setLocation({
      _id: item?._id,
      label: item?.label,
      latitude: Number(item?.location.coordinates[1]),
      longitude: Number(item?.location.coordinates[0]),
      deliveryAddress: item?.deliveryAddress,
      details: item?.details,
    });
  };
  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    []
  );

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

  const locationCallback = (error, data) => {
    setLoading(false);
    if (error) {
      setAlertMessage(error);
      setOpen(true);
      return;
    }
    setSearch(data?.deliveryAddress ?? "");
    setValue(data?.deliveryAddress ?? "");
    setLatLng({
      lat: data.latitude,
      lng: data.longitude,
    });
  };
  return (
    <Box
      style={{
        top: spacingTop,
      }}
      className={classes.upsideContainer}
    >
      <Box
        style={{
          overflowY: "auto", // Make the inner Box scrollable
          marginTop: "60px",
          maxHeight: `calc(100vh - ${spacingTop})`, // Limit the inner Box height
        }}
        className={`${classes.root} ${classes.shadow} ${classes.mainContainer}`}
      >
        <FlashMessage alertMessage={alertMessage} open={open} setOpen={setOpen} />
        <Grid container>
          <Grid item xs={12}>
            <Button
              style={{
                display: mobile ? "block" : "flex",
              }}
              className={classes.addressBtn}
              onClick={() => setExpand(!expand)}
            >
              <Typography
                variant="body1"
                color="textSecondary"
                className={`${classes.smallText} ${classes.upperContainer}`}
                style={{
                  backgroundColor: theme.palette.primary.main,
                  fontWeight: theme.typography.fontWeightBold,
                }}
              >
                {t('deliveringTo')}
              </Typography>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "rgb(216 222 232 / 63%)",
                  justifyContent: "space-between",
                  flexGrow: 1,
                  padding: "17px",
                  borderTopRightRadius: mobile ? 0 : 20,
                  borderBottomRightRadius: mobile ? 0 : 20,
                }}
              >
                <Typography
                  variant="body1"
                  color="textSecondary"
                  className={`${classes.smallText} ${classes.mr10} ${classes.textMBold}`}
                >
                  {location?.deliveryAddress}
                </Typography>
                {!expand ? (
                  <ArrowIcon />
                ) : (
                  <ArrowIcon style={{ transform: "rotate(180deg)" }} />
                )}
              </Box>
            </Button>
          </Grid>
        </Grid>
        {expand && (
          <>
            <Box
              style={{
                width: "100%",
                padding: "20px 0px",
                display: "flex",
                marginTop: "10px",
                alignItems: "center",
              }}
            >
              <Container style={{ display: "flex", marginLeft: "0px" }}>
                <Autocomplete
                  style={{ width: "100%" }}
                  id="google-map-demo"
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.description
                  }
                  filterOptions={(x) => x}
                  options={options}
                  autoComplete
                  includeInputInList
                  filterSelectedOptions
                  value={value ? value : search ?? "Loading ..."}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      const b = new window.google.maps.Geocoder();
                      b.geocode({ placeId: newValue.place_id }, (res) => {
                        const location = res[0].geometry.location;
                        setSearch(res[0].formatted_address);
                        setLatLng({
                          lat: location.lat(),
                          lng: location.lng(),
                        });
                      });
                    } else {
                      setSearch("");
                      setLatLng({});
                    }
                    setOptions(newValue ? [newValue, ...options] : options);
                    setValue(newValue);
                  }}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      style={{
                        color: "initial",
                        backgroundColor: "#F3F4F8",
                        borderRadius: 20,
                      }}
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
                                setLoading(true);
                                getCurrentLocation(locationCallback);
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
                                <LocationIcon style={{ fill: "#3C8F7C" }} />
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
              </Container>
            </Box>
            <Box display="flex" justifyContent="center" mb={2}>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setExpand(false);
                  if (search) {
                    setLocation({
                      label: "Home",
                      latitude: latLng.lat,
                      longitude: latLng.lng,
                      deliveryAddress: search,
                    });
                  }
                }}
                className={classes.button}
              >
                <RightIcon />
              </Button>
            </Box>
            <Divider
              orientation="horizontal"
              style={{
                backgroundColor: theme.palette.common.black,
                width: "80%",
                margin: "auto",
              }}
            />
            <Box style={{ margin: "auto", width: "90%" }}>
              <DeliveryCard
                selectedAddress={selectedAddress}
                setSelectedAddress={setDeliveryAddress}
                isProfile={true}
                isModal={true}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default React.memo(Subheader);
