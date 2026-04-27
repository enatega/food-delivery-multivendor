import React, { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { Marker } from "@react-google-maps/api";
import { SUBSCRIPTION_RIDER_LOCATION } from "@/lib/api/graphql/subscription/riderLocation";
import { RIDER } from "@/lib/api/graphql/queries/rider";
import RiderMarker from "../../../../../assets/rider_icon.png";

interface TrackingRiderProps {
  id: string;
  onLocationUpdate?: (location: { lat: number; lng: number }) => void;
}

const TrackingRider = ({ id, onLocationUpdate }: TrackingRiderProps) => {
  const { loading, error, data, subscribeToMore } = useQuery(RIDER, {
    variables: { id },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: SUBSCRIPTION_RIDER_LOCATION,
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

  // Calculate rider coordinates (memoized to prevent unnecessary recalculations)
  const riderCoordinates = useMemo(() => {
    if (!data?.rider?.location?.coordinates ||
      data.rider.location.coordinates.length < 2) {
      return null;
    }

    const lat = parseFloat(data.rider.location.coordinates[1]);
    const lng = parseFloat(data.rider.location.coordinates[0]);

    if (isNaN(lat) || isNaN(lng)) {
      return null;
    }

    return { lat, lng };
  }, [data?.rider?.location?.coordinates]);

  // Notify parent of location updates - this hook must be called before any conditional returns
  useEffect(() => {
    if (onLocationUpdate && riderCoordinates) {
      onLocationUpdate(riderCoordinates);
    }
  }, [riderCoordinates, onLocationUpdate]);

  // Early returns after all hooks
  if (loading) return null;
  if (error) {
    console.error("Error fetching rider data:", error);
    return null;
  }

  if (!riderCoordinates) {
    console.error("Invalid rider coordinates:", data?.rider?.location);
    return null;
  }

  return (
    <Marker
      position={riderCoordinates}
      icon={{
        url: RiderMarker.src,
        scaledSize: new window.google.maps.Size(40, 40),
      }}
    />
  );
};

export default TrackingRider;
