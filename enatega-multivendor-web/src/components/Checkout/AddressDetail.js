/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";
import clsx from "clsx";
import gql from "graphql-tag";
import React, { useCallback, useState } from "react";
import { createAddress, editAddress } from "../../apollo/server";
import useStyle from "./styles";
import MarkerImage from "../../assets/images/marker.png";
import { useTranslation } from "react-i18next";

const EDIT_ADDRESS = gql`
  ${editAddress}
`;
const CREATE_ADDRESS = gql`
  ${createAddress}
`;

function AddressDetail({
  addressDetail,
  locationModal,
  toggleDetail,
  notification,
}) {
  const isEdit = Boolean(addressDetail?.id);
  const theme = useTheme();
  const classes = useStyle();
  const [addressError, setAddressError] = useState("");
  const { t } = useTranslation();
  const [details, setDetails] = useState("");
  const [mutate, { loading }] = useMutation(
    isEdit ? EDIT_ADDRESS : CREATE_ADDRESS,
    {
      onCompleted,
      onError,
    }
  );

  function onCompleted(data) {
    if (isEdit) {
      notification({
        type: "warning",
        message: "Address updated",
      });
    } else {
      notification({
        type: "success",
        message: "Address added",
      });
    }
    toggleDetail();
  }

  function onError(error) {
    console.log(error);
    notification({
      type: "error",
      message: `An error occured. Please try again. ${error}`,
    });
  }

  const clearErrors = useCallback(() => {
    setAddressError("");
  }, []);

  const validateAddress = () => {
    clearErrors();
    const detailValue = addressDetail.location;
    if (!detailValue) {
      setAddressError("Delivery details is required");
      return false;
    }
    if (!addressDetail?.lat || !addressDetail?.lng) {
      setAddressError("Delivery address is required");
      return false;
    }
    mutate({
      variables: {
        addressInput: {
          _id: isEdit ? addressDetail?.id : "",
          latitude: `${addressDetail?.lat}`,
          longitude: `${addressDetail?.lng}`,
          deliveryAddress: addressDetail?.location.trim(),
          details: details,
          label: addressDetail?.label || "Home",
        },
      },
    });
  };

  return (
    <Grid container item xs={12} className={classes.addressBox}>
      <Grid item xs={12}>
        <GoogleMap
          mapContainerStyle={{ height: "200px", width: "100%" }}
          zoom={17}
          options={{
            zoomControl: false,
            mapTypeControl: false,
            gestureHandling: "none",
            fullscreenControl: false,
            streetViewControl: false,
            scaleControlOptions: false,
            disableDoubleClickZoom: false,
            MapTypeControlOptions: false,
          }}
          center={{
            lat: addressDetail?.lat,
            lng: addressDetail?.lng,
          }}
        >
          <Marker
            position={{
              lat: addressDetail?.lat,
              lng: addressDetail?.lng,
            }}
            icon={MarkerImage}
          />
        </GoogleMap>
      </Grid>
      <Box
        display="flex"
        justifyContent="spce-between"
        alignItems="flex-start"
        className={clsx(classes.MV2, classes.PH1)}
      >
        <Typography
          variant="body1"
          color="textSecondary"
          className={clsx(classes.boldText, classes.smallText)}
        >
          {addressDetail?.location ?? ""}
        </Typography>
        <Button
          size="small"
          variant="text"
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            locationModal();
          }}
        >
          <Typography variant="body1" className={classes.smallText}>
            {t("edit")}
          </Typography>
        </Button>
      </Box>
      <Grid item xs={12} className={classes.PH1}>
        <TextField
          name={"addressDetail"}
          variant="outlined"
          label={t("deliveryDetails")}
          error={Boolean(addressError)}
          helperText={addressError ? t("deliveryDetailError") : null}
          defaultValue={addressDetail?.detail ?? ""}
          fullWidth
          onChange={(e) => setDetails(e.currentTarget.value)}
          InputLabelProps={{
            style: {
              color: theme.palette.grey[600],
            },
          }}
        />
        <Button
          disabled={loading}
          variant="contained"
          color="primary"
          fullWidth
          className={clsx(classes.MV2, classes.btnBase)}
          onClick={(e) => {
            e.preventDefault();
            validateAddress();
          }}
        >
          {loading ? (
            <CircularProgress size={25} color="primary" />
          ) : (
            <Typography
              variant="body2"
              color="secondary"
              className={classes.boldText}
            >
              {t("submit")}
            </Typography>
          )}
        </Button>
      </Grid>
      <Grid item xs={12}></Grid>
    </Grid>
  );
}

export default React.memo(AddressDetail);
