/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { GoogleMap, Marker } from "@react-google-maps/api";
import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "../../../hooks";
import FlashMessage from "../../FlashMessage";
import useStyle from "./styles";
import MarkerImage from "../../../assets/images/marker.png";
import ClearIcon from "@mui/icons-material/Clear";
import PlacesAutocomplete from "react-places-autocomplete";

import ConfigurableValues from "../../../config/constants";

import { useTranslation } from "react-i18next";



function AddressModal({
  toggleModal,
  isVisible,
  regionDetail,
  changeAddress,
  settingRegionDetail,
  setShowDetail,
}) {
  console.log(settingRegionDetail);


  const { GOOGLE_MAPS_KEY } = ConfigurableValues();

  const theme = useTheme();

  const classes = useStyle();
  const [region, setRegion] = useState(null);
  const [mainError, setMainError] = useState({});
  const [locationName, setLocationName] = useState("");
  const { t } = useTranslation();
  const { getCurrentLocation } = useLocation();
  const { latLngToGeoString } = useLocation();
  const [loading, setLoading] = useState();
  const handleLocationSelection = (selectedLocation) => {
    const apiKey = GOOGLE_MAPS_KEY;

    setLocationName(selectedLocation);
    const encodedLocation = encodeURIComponent(selectedLocation);

    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${apiKey}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK" && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          const latitude = location.lat;
          const longitude = location.lng;
          setRegion({
            lat: latitude,
            lng: longitude,
          });
        } else {
          console.error("Location not found");
        }
      });
  };

  useEffect(() => {
    if (regionDetail) {
      console.log(regionDetail);
      setRegion({
        lat: regionDetail.lat,
        lng: regionDetail.lng,
      });
      setLocationName(regionDetail.location);
    }
  }, [regionDetail]);

  const toggleSnackbar = useCallback(() => {
    setMainError({});
  }, []);

  const handleClearClick = () => {
    setLocationName("");
  };

  const changeCoordinates = async (coordinates, index) => {
    setLoading(true);
    (async () => {
      const { latLng } = coordinates;
      const regionChange = {
        lat: latLng.lat(),
        lng: latLng.lng(),
      };
      const geoCodeData = await latLngToGeoString({
        latitude: latLng.lat(),
        longitude: latLng.lng(),
      }); // pass a callback
      setLocationName(geoCodeData);
      setRegion(regionChange);
      return;
    })().finally(() => {
      setLoading(false);
    });
  };

  const submitAddress = useCallback(() => {
    if (region) {
      changeAddress((prev) => {
        return {
          ...prev,
          lat: region.lat,
          lng: region.lng,
          location: locationName,
        };
      });
    }
    toggleModal();
  }, [locationName, region]);
  const locationCallback = (error, data) => {
    setLoading(false);
    if (error) {
      setMainError({ type: "error", message: error });
      return;
    }
    setRegion({
      lat: data.latitude,
      lng: data.longitude,
    });
    setLocationName(data.deliveryAddress);
  };
  return (
    <>
      <FlashMessage
        open={Boolean(mainError.message)}
        severity={mainError.type}
        alertMessage={mainError.message}
        handleClose={toggleSnackbar}
      />
      <Dialog
        onClose={toggleModal}
        open={isVisible}
        scroll="body"
        fullWidth={true}
        maxWidth="sm"
        className={classes.root}
      >
        <Box display="flex" justifyContent="flex-end">
          <IconButton
            size="medium"
            onClick={() => {
              toggleModal();
              setShowDetail();
            }}
            className={classes.closeContainer}
          >
            <CloseIcon color="primary" />
          </IconButton>
        </Box>
        <DialogTitle>
          <Box component="div">
            <Typography
              variant="h5"
              color="textSecondary"
              className={clsx(classes.boldText, classes.title)}
            >
              {t("exactLocation")}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <PlacesAutocomplete
            value={locationName}
            onChange={setLocationName}
            onSelect={handleLocationSelection}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <TextField
                  variant="outlined"
                  label={t("yourArea")}
                  fullWidth
                  {...getInputProps()}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {loading ? (
                          <CircularProgress size={24} />
                        ) : (
                          <>
                            {locationName && (
                              <IconButton onClick={handleClearClick}>
                                <ClearIcon color="primary" />
                              </IconButton>
                            )}
                            <IconButton
                              onClick={(e) => {
                                e.preventDefault();
                                if (!loading) {
                                  setLoading(true);
                                  getCurrentLocation(locationCallback);
                                }
                              }}
                              size="large"
                            >
                              <GpsFixedIcon color="primary" />
                            </IconButton>
                          </>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
                <div>
                  {loading ? <div>Loading...</div> : null}
                  {suggestions.map((suggestion) => {
                    const style = {
                      backgroundColor: suggestion.active
                        ? theme.palette.primary.main
                        : theme.palette.common.white,
                      color: "black",
                      fontSize: "16px",
                      padding: "10px 16px",
                    };
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, { style })}
                        key={suggestion.placeId}
                      >
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>

          <Box display="flex" className={classes.mapContainer}>
            <GoogleMap
              mapContainerStyle={{ height: "400px", width: "100%" }}
              zoom={16}
              options={{
                fullscreenControl: false,
                streetViewControl: false,
                MapTypeControlOptions: false,
                mapTypeControl: false,
              }}
              center={region}
            >
              <Marker
                position={region}
                draggable={true}
                onDragEnd={changeCoordinates}
                icon={MarkerImage}
              />
            </GoogleMap>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            className={classes.btnBase}
            onClick={(e) => {
              e.preventDefault();
              submitAddress();
            }}
          >
            {loading ? (
              <CircularProgress color="secondary" />
            ) : (
              <Typography variant="subtitle2" className={classes.boldText}>
                {t("submit")}
              </Typography>
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default React.memo(AddressModal);
