import { Grid, Typography, Box } from "@mui/material";
import React, { useState } from "react";
import useStyle from "./styles";
import { DeliveryCard } from "../../Checkout";
import { useLocationContext } from "../../../context/Location";
import { ReactComponent as Address } from "../../../assets/images/Address.svg";
import { useTranslation } from 'react-i18next';

function AddressCard() {
  const { t } = useTranslation();
  const classes = useStyle();
  const [selectedAddress, setSelectedAddress] = useState();
  const { setLocation } = useLocationContext();

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

  return (
    <Grid container item xs={12} className={classes.mainContainer}>
      <Grid
        item
        xs={12}
        sm={10}
        md={8}
        lg={6}
        className={classes.profileContainer}
      >
        <Box className={classes.headerBar}>
          <Typography className={classes.titleText}>{t('myAddresses')}</Typography>
        </Box>
        <Box style={{ margin: "30px auto", textAlign: "center" }}>
          <Address />
        </Box>
        <DeliveryCard
          selectedAddress={selectedAddress}
          setSelectedAddress={setDeliveryAddress}
          isProfile={true}
        />
      </Grid>
    </Grid>
  );
}

export default React.memo(AddressCard);
