/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import { gql, useLazyQuery } from "@apollo/client";
import {
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Autocomplete from "@mui/material/Autocomplete";
import { restaurantList } from "../../../apollo/server";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import React, { useEffect, useState, useCallback, useRef } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import LocationIcon from "../../../assets/icons/LocationIcon";
import { useLocationContext } from "../../../context/Location";
import { useLocation } from "../../../hooks";
import FlashMessage from "../../FlashMessage";
import useStyle from "./styles";
import MarkerImage from "../../../assets/images/marker.png";
import { mapStyles } from "../../../screens/OrderDetail/mapStyles";
import SearchIcon from "@mui/icons-material/Search";
import { SearchRestaurant } from "../../RestaurantComponent";
import { useNavigate } from "react-router-dom";
import RestMarker from "../../../assets/images/rest-map-2.png";
import { useTranslation } from "react-i18next";

const autocompleteService = { current: null };
const RESTAURANTS = gql`
  ${restaurantList}
`;

function SearchContainer({
  isHome,
  search: searchProp,
  setSearch: setSearchProp,
}) {
  const { t } = useTranslation();
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
  const [loading, setLoading] = useState(false);
  const [map, setMap] = React.useState(false);
  const fetchRef = useRef(false);

  const [fetchRestaurants, { data }] = useLazyQuery(RESTAURANTS, {
    fetchPolicy: "network-only",
  });
  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    []
  );
  const locationCallback = (error, data) => {
    setLoading(false);
    if (error) {
      setAlertError(error);
      setOpen(true);
      return;
    }
    setSearch(data.deliveryAddress);
    setLocation(data);
  };
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    loadMap();
    return () => {
      setMap(false);
    };
  }, []);
  const loadMap = async () => {
    setTimeout(() => {
      setMap(true);
    }, 100);
  };
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

  useEffect(() => {
    if (!location) return;
    if (fetchRef.current) return;
    const variables = {
      longitude: parseFloat(location.longitude) || null,
      latitude: parseFloat(location.latitude) || null,
    };
    fetchRestaurants({ variables });
    fetchRef.current = true;
  }, [location]);

  const handleLocationButtonClick = () => {
    setLoading(true);
    getCurrentLocation(locationCallback);
  };

  window.onload = () => {
    handleLocationButtonClick();
  };

  const { restaurants } = data?.nearByRestaurants ?? {};
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Grid container className={classes.mainContainer}>
        <FlashMessage
          severity={loading ? "info" : "error"}
          alertMessage={alertError}
          open={open}
          handleClose={handleClose}
        />
        <Grid className={classes.temp}>
          {map && (
            <GoogleMap
              mapContainerStyle={{
                height: "100%",
                width: "100%",
                flex: 1,
                //zIndex: 10
              }}
              zoom={10}
              center={{
                lat: parseFloat(location?.latitude) || 33.6844,
                lng: parseFloat(location?.longitude) || 73.0479,
              }}
              options={{
                styles: mapStyles,
                zoomControl: true,
                zoomControlOptions: {
                  position: window.google.maps.ControlPosition.RIGHT_CENTER,
                },
              }}
            >
              {location && (
                <Marker
                  position={{
                    lat: location?.latitude,
                    lng: location?.longitude,
                  }}
                  icon={MarkerImage}
                />
              )}
              {restaurants?.map((item) => {
                return (
                  <Marker
                    key={item._id}
                    position={{
                      lat: parseFloat(item.location.coordinates[1]),
                      lng: parseFloat(item.location.coordinates[0]),
                    }}
                    onClick={() => {
                      navigateTo(`/restaurant/${item.slug}`);
                    }}
                    title={item.name}
                    icon={RestMarker}
                  />
                );
              })}
            </GoogleMap>
          )}
          {mobile ? (
            <Grid
              container
              className={
                isHome
                  ? classes.mobileheadingContainer
                  : classes.mobileheadingContainerNotHome
              }
            >
              <Box className={classes.mobileBox}>
                <Grid container alignItems="center">
                  <Grid
                    item
                    xs={12}
                    md={9}
                    style={{
                      marginTop: "2rem",
                      marginBottom: "2rem",
                    }}
                  >
                    {isHome ? (
                      <Autocomplete
                        id="google-map"
                        getOptionLabel={(option) =>
                          typeof option === "string"
                            ? option
                            : option.description
                        }
                        filterOptions={(x) => x}
                        options={options}
                        autoComplete
                        InputLabelProps={{ style: { display: "none" } }}
                        freeSolo
                        includeInputInList
                        filterSelectedOptions
                        style={{ width: "100%" }}
                        value={
                          loading
                            ? "Loading ..."
                            : search
                            ? search
                            : location
                            ? location.deliveryAddress
                            : ""
                        }
                        onChange={(event, newValue) => {
                          if (newValue) {
                            const b = new window.google.maps.Geocoder();
                            b.geocode({ placeId: newValue.place_id }, (res) => {
                              const location = res[0].geometry.location;
                              setLocation({
                                label: "Home",
                                deliveryAddress: newValue.description,
                                latitude: location.lat(),
                                longitude: location.lng(),
                              });
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
                            className={classes.textField}
                            variant="outlined"
                            placeholder="Enter your full address"
                            fullWidth
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <>
                                  {params.InputProps.endAdornment}
                                  <InputAdornment
                                    position="end"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setValue(search?.deliveryAddress ?? "");
                                      setSearch(
                                        location?.deliveryAddress ?? ""
                                      );
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
                                      <>
                                        <LocationIcon
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setLoading(true);
                                            getCurrentLocation(
                                              locationCallback
                                            );
                                          }}
                                        />
                                        {/* <MenuIcon /> */}
                                      </>
                                    )}
                                  </InputAdornment>
                                </>
                              ),
                            }}
                          />
                        )}
                        renderOption={(props, option) => {
                          const matches =
                            option.structured_formatting
                              ?.main_text_matched_substrings;
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
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {option.structured_formatting?.secondary_text}
                                </Typography>
                              </Grid>
                            </Grid>
                          );
                        }}
                      />
                    ) : (
                      <SearchRestaurant
                        search={searchProp}
                        setSearch={setSearchProp}
                      />
                    )}
                  </Grid>
                  {isHome ? (
                    <Grid
                      item
                      xs={12}
                      md={3}
                      style={{
                        paddingLeft: "10px",
                        textAlign: "center",
                        marginBottom: mobile ? 20 : 0,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        disableElevation
                        className={classes.button}
                        style={{ fontSize: "0.7rem" }}
                        onClick={(e) => {
                          e.preventDefault();
                          if (location) {
                            navigateTo("/restaurant-list");
                          }
                        }}
                      >
                        {t("findRestaurants")}
                      </Button>
                    </Grid>
                  ) : null}
                </Grid>
              </Box>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
      {mobile ? null : (
        <Grid container className={classes.headingContainer}>
          <Grid item xs={1} md={1} />
          <Grid
            container
            item
            xs={20}
            sm={15}
            md={10}
            lg={7}
            style={{ marginBottom: "8%" }}
          >
            <Grid container item xs={12} className={classes.searchContainer}>
              <Grid item xs={12} sm={isHome ? 9 : 12}>
                {isHome ? (
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
                    value={
                      loading
                        ? "Loading ..."
                        : search
                        ? search
                        : location
                        ? location.deliveryAddress
                        : ""
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        const b = new window.google.maps.Geocoder();
                        b.geocode({ placeId: newValue.place_id }, (res) => {
                          const location = res[0].geometry.location;
                          setLocation({
                            label: "Home",
                            deliveryAddress: newValue.description,
                            latitude: location.lat(),
                            longitude: location.lng(),
                          });
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
                        style={{
                          color: "initial",
                          backgroundColor: theme.palette.common.white,
                          borderRadius: 10,
                          border: "none",
                        }}
                        variant="outlined"
                        placeholder="Enter your full address"
                        onKeyPress={(event) => { if(event.key === 'Enter'){
                          if (location) {
                            navigateTo("/restaurant-list");
                          }
                         } }}
                        InputLabelProps={{ style: { display: "none" } }}
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
                                  <LocationIcon
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setLoading(true);
                                      getCurrentLocation(locationCallback);
                                    }}
                                  />
                                )}
                              </InputAdornment>
                            </>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => {
                      const matches =
                        option.structured_formatting
                          ?.main_text_matched_substrings;
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
                              {option.structured_formatting?.secondary_text}
                            </Typography>
                          </Grid>
                        </Grid>
                      );
                    }}
                  />
                ) : (
                  <Grid>
                    <Grid>
                      <SearchRestaurant
                        search={searchProp}
                        setSearch={setSearchProp}
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>
              {isHome ? (
                <Grid
                  item
                  xs={12}
                  sm={3}
                  style={{ paddingLeft: "10px", textAlign: "center" }}
                  
                >
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
                    {t("findRestaurants")}
                  </Button>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

// function CategorySmallCard({ image, title }) {
//   const theme = useTheme();
//   return (
//     <Box flexDirection={"column"} justifyContent="center">
//       <Box
//         display="flex"
//         justifyContent={"center"}
//         alignItems="center"
//         style={{
//           minHeight: 65,
//           width: 65,
//           borderRadius: 27,
//           backgroundColor: theme.palette.common.white,
//         }}
//       >
//         <img src={image} alt="icon" />
//       </Box>
//       <Typography
//         align="center"
//         style={{ color: theme.palette.primary.main, marginTop: 3 }}
//       >
//         {title}
//       </Typography>
//     </Box>
//   );
// }

export default React.memo(SearchContainer);
