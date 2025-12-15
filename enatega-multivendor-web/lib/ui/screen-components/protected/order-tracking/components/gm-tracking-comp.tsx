"use client";
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  Marker,
} from "@react-google-maps/api";
import React, { useState, useCallback, useEffect, useRef } from "react";

// Assets
import HomeIcon from "../../../../../assets/home_icon.png";
import RestIcon from "../../../../../assets/rest_icon.png";
import Image from "next/image";
import TrackingRider from "./trackingRider";
import { useTranslations } from "next-intl";
import { darkMapStyle } from "@/lib/utils/mapStyles/mapStyle";
import { useTheme } from "@/lib/providers/ThemeProvider";

interface IGoogleMapTrackingComponent {
  isLoaded: boolean;
  origin: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
  directions: google.maps.DirectionsResult | null;
  directionsCallback: (
    result: google.maps.DirectionsResult | null,
    status: string
  ) => void;
  orderStatus: string;
  riderId?: string;
  isCheckingCache?: boolean;

}

function GoogleMapTrackingComponent({
  isLoaded,
  origin,
  destination,
  directions,
  isCheckingCache,
  directionsCallback,
  orderStatus,
  riderId,

}: IGoogleMapTrackingComponent) {
  // State to track rider's live location
  const [riderLocation, setRiderLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [riderDirections, setRiderDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [needsRiderDirections, setNeedsRiderDirections] = useState(false);
  const prevOrderStatusRef = useRef<string>(orderStatus);

  // Debounce interval for rider directions requests (in milliseconds)
  const DIRECTIONS_DEBOUNCE_INTERVAL = 30000; // 30 seconds
  const lastDirectionsRequestTimeRef = useRef<number>(0);

  // Determine which markers to show based on order status
  const showRestaurantMarker = ["PENDING", "ACCEPTED", "ASSIGNED"].includes(
    orderStatus
  );
  const t = useTranslations();
  const showRiderMarker = ["PICKED", "ASSIGNED"].includes(orderStatus);
  const { theme } = useTheme();

  // Reset directions when transitioning to PICKED status
  useEffect(() => {
    if (prevOrderStatusRef.current !== orderStatus && orderStatus === "PICKED") {
      // Order just changed to PICKED, reset directions to trigger new route calculation
      setRiderDirections(null);
      setNeedsRiderDirections(true);
      lastDirectionsRequestTimeRef.current = Date.now(); // Reset debounce timer
    }
    prevOrderStatusRef.current = orderStatus;
  }, [orderStatus]);

  // Callback for when rider location updates (with time-based debouncing)
  const onRiderLocationUpdate = useCallback((location: { lat: number; lng: number }) => {
    setRiderLocation(location);
    // When rider location updates during PICKED status, request new directions only if debounce interval has passed
    if (orderStatus === "PICKED") {
      const now = Date.now();
      const timeSinceLastRequest = now - lastDirectionsRequestTimeRef.current;

      if (timeSinceLastRequest >= DIRECTIONS_DEBOUNCE_INTERVAL) {
        setNeedsRiderDirections(true);
        lastDirectionsRequestTimeRef.current = now;
      }
    }
  }, [orderStatus]);

  // Callback for rider directions
  const riderDirectionsCallback = useCallback(
    (result: google.maps.DirectionsResult | null, status: string) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        setRiderDirections(result);
        setNeedsRiderDirections(false);
      }
    },
    []
  );

  // Determine which origin to use based on order status
  const mapOrigin = showRiderMarker ? riderLocation : origin;
  const mapDestination = destination;
  const mapCenter = showRiderMarker && riderLocation ? riderLocation : (showRiderMarker ? destination : origin);

  // Determine which directions to display
  const activeDirections = showRiderMarker ? riderDirections : directions;
  const shouldRequestRiderDirections = showRiderMarker && needsRiderDirections && riderLocation && !riderDirections;

  return (
    <div className="relative">
      {isLoaded ? (
        <GoogleMap
          options={{
            styles: theme === "dark" ? darkMapStyle : null,
            disableDefaultUI: true,
          }}
          mapContainerStyle={{
            width: "100%",
            height: "400px",
          }}
          center={mapCenter}
          zoom={13}
        >
          {/* Restaurant Marker - show only before rider pickup */}
          {showRestaurantMarker && origin && (
            <Marker
              position={origin}
              icon={{
                url: RestIcon.src,
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          )}

          {/* Home Marker - always show */}
          <Marker
            position={mapDestination}
            icon={{
              url: HomeIcon.src,
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />

          {/* Rider Marker - show only after pickup */}
          {showRiderMarker && riderId && (
            <TrackingRider
              id={riderId}
              onLocationUpdate={onRiderLocationUpdate}
            />
          )}

          {/* Directions from restaurant to destination (before pickup) */}
          {!showRiderMarker && !directions && !isCheckingCache && mapOrigin && (
            <DirectionsService
              options={{
                destination: mapDestination,
                origin: mapOrigin,
                travelMode: google.maps.TravelMode.DRIVING,
              }}
              callback={directionsCallback}
            />
          )}

          {/* Directions from rider to destination (after pickup) */}
          {shouldRequestRiderDirections && riderLocation && (
            <DirectionsService
              options={{
                destination: mapDestination,
                origin: riderLocation,
                travelMode: google.maps.TravelMode.DRIVING,
              }}
              callback={riderDirectionsCallback}
            />
          )}

          {activeDirections && (
            <DirectionsRenderer
              directions={activeDirections}
              options={{
                directions: activeDirections,
                suppressMarkers: true, // Hide default markers
                polylineOptions: {
                  strokeColor: "#5AC12F",
                  strokeOpacity: 0.8,
                  strokeWeight: 3,
                  zIndex: 10,
                },
              }}
            />
          )}
        </GoogleMap>
      ) : (
        <>
          <Image
            alt={t("map_showing_delivery_route_alt")}
            className="w-full h-64 object-cover"
            height="300"
            src="https://storage.googleapis.com/a1aa/image/jt1AynRJJVtM9j1LRb30CodA1xsK2R23pWTOmRv3nsM.jpg"
            width="1200"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-color text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
            H
          </div>{" "}
        </>
      )}
    </div>
  );
}

export default GoogleMapTrackingComponent;
