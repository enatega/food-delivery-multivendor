import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Marker } from "@react-google-maps/api";
import { subscriptionRiderLocation, rider } from "../../../apollo/server";
import RiderMarker from "../../../assets/images/rider-map-2.png";

const RIDER = gql`
  ${rider}
`;
const RIDER_LOCATION = gql`
  ${subscriptionRiderLocation}
`;
const TrackingRider = ({ id }) => {
  const { loading, error, data, subscribeToMore } = useQuery(RIDER, {
    variables: { id },
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: RIDER_LOCATION,
      variables: { riderId: id },
      updateQuery: (prev, { subscriptionData }) => {
        
        if (!subscriptionData.data) return prev;
        return {
          rider: {
            ...prev.rider,
            ...subscriptionData.data.subscriptionRiderLocation,
          },
        };
      },
    });
    return unsubscribe;
  }, [id, subscribeToMore]);

  if (loading) return null;
  if (error) return null;
  let riderCoordinates = {
    lat: parseFloat(data.rider.location.coordinates[1]),
    lng: parseFloat(data.rider.location.coordinates[0]),
  };
  return <Marker position={riderCoordinates} icon={RiderMarker} />;
};

export default TrackingRider;
