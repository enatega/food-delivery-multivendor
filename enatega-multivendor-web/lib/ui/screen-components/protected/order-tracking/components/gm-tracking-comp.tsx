"use client";

import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import HomeIcon from "../../../../../assets/home_icon.png";
import RiderIcon from "../../../../../assets/rider_icon.png";
import Image from "@/lib/ui/useable-components/safe-image";
import { darkMapStyle } from "@/lib/utils/mapStyles/mapStyle";
import { useTheme } from "@/lib/providers/ThemeProvider";
import type {
  IOrderEta,
  IRiderTrackingLocation,
} from "@/lib/utils/interfaces/orders.interface";
import {
  decodePolyline,
  trimPolylineToRider,
} from "@/lib/utils/methods/order-eta";

interface IGoogleMapTrackingComponent {
  isLoaded: boolean;
  destination: { lat: number; lng: number };
  eta?: IOrderEta | null;
  riderLocation?: IRiderTrackingLocation | null;
  requireBackendRoute?: boolean;
  showStaticLoadingImage?: boolean;
}

function GoogleMapTrackingComponent({
  isLoaded,
  destination,
  eta,
  riderLocation,
  requireBackendRoute = false,
  showStaticLoadingImage = true,
}: IGoogleMapTrackingComponent) {
  const t = useTranslations();
  const { theme } = useTheme();
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const riderCoordinate = useMemo(() => {
    if (!riderLocation) return null;
    const lat = Number(riderLocation.latitude);
    const lng = Number(riderLocation.longitude);
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  }, [riderLocation]);

  const route = useMemo(() => {
    const decoded = decodePolyline(eta?.encodedPolyline);
    const trimmed = trimPolylineToRider(decoded, riderLocation);
    if (trimmed.length > 1) return trimmed;
    if (requireBackendRoute) return [];
    return riderCoordinate ? [riderCoordinate, destination] : [];
  }, [
    destination,
    eta?.encodedPolyline,
    requireBackendRoute,
    riderCoordinate,
    riderLocation,
  ]);

  const fitRoute = useCallback(() => {
    if (!map || typeof window === "undefined" || !window.google) return;
    const bounds = new window.google.maps.LatLngBounds();
    route.forEach((point) => bounds.extend(point));
    bounds.extend(destination);
    if (riderCoordinate) bounds.extend(riderCoordinate);
    map.fitBounds(bounds, 48);
  }, [destination, map, riderCoordinate, route]);

  useEffect(() => {
    fitRoute();
  }, [fitRoute]);

  if (!isLoaded) {
    if (!showStaticLoadingImage) {
      return (
        <div
          className="flex h-80 items-center justify-center bg-gray-100 px-6 text-center dark:bg-gray-900"
          aria-live="polite"
        >
          <div>
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary-color" />
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              Loading the interactive map…
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="relative">
        <Image
          alt={t("map_showing_delivery_route_alt")}
          className="h-64 w-full object-cover"
          height="300"
          src="https://storage.googleapis.com/a1aa/image/jt1AynRJJVtM9j1LRb30CodA1xsK2R23pWTOmRv3nsM.jpg"
          width="1200"
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-b-2xl">
      <GoogleMap
        options={{
          styles: theme === "dark" ? darkMapStyle : null,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          draggable: true,
          scrollwheel: true,
          keyboardShortcuts: true,
        }}
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={riderCoordinate || destination}
        zoom={14}
        onLoad={setMap}
        onUnmount={() => setMap(null)}
      >
        <Marker
          position={destination}
          icon={{
            url: HomeIcon.src,
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        />
        {riderCoordinate && (
          <Marker
            position={riderCoordinate}
            icon={{
              url: RiderIcon.src,
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}
        {route.length > 1 && (
          <Polyline
            path={route}
            options={{
              strokeColor: "#5AC12F",
              strokeOpacity: 0.9,
              strokeWeight: 5,
              zIndex: 10,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}

export default GoogleMapTrackingComponent;
