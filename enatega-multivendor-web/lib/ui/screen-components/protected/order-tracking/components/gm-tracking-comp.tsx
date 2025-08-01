"use client"
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  Marker,
} from "@react-google-maps/api";
import React from "react";

// Assets
import HomeIcon from "../../../../../assets/home_icon.png";
import RestIcon from "../../../../../assets/rest_icon.png";
import Image from "next/image";
import TrackingRider from "./trackingRider";
import { useTranslations } from "next-intl";

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
  // Determine which markers to show based on order status
  const showRestaurantMarker = ["PENDING", "ACCEPTED", "ASSIGNED"].includes(
    orderStatus
  );
  const t = useTranslations()
  const showRiderMarker = ["PICKED", "ASSIGNED"].includes(orderStatus);

  // Update map center and directions based on order status
  const mapOrigin = showRiderMarker ? undefined : origin; // Will be provided by TrackingRider component if rider is shown
  const mapDestination = destination; // Always show home location
  const mapCenter = showRiderMarker ? destination : origin; // Center on rider's current location when applicable

  return (
    <div className="relative">
      {isLoaded ?
        <GoogleMap
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
          {showRiderMarker && riderId && <TrackingRider id={riderId} />}

          {/* Directions between appropriate points */}
          {!directions && !isCheckingCache && mapOrigin && (
            <DirectionsService
              options={{
                destination: mapDestination,
                origin: mapOrigin,
                travelMode: google.maps.TravelMode.DRIVING,
              }}
              callback={directionsCallback}
            />
          )}

          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                directions,
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
      : <>
          <Image
            alt={t("map_showing_delivery_route_alt")}
            className="w-full h-64 object-cover"
            height="300"
            src="https://storage.googleapis.com/a1aa/image/jt1AynRJJVtM9j1LRb30CodA1xsK2R23pWTOmRv3nsM.jpg"
            width="1200"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#5AC12F] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
            H
          </div>{" "}
        </>
      }
    </div>
  );
}

export default GoogleMapTrackingComponent;