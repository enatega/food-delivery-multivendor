"use client";
import { FC, useEffect, useMemo, useRef } from "react";
import { GoogleMap, Marker , useLoadScript } from "@react-google-maps/api";
import Loader from "./Loader";
import DisplayError from "./DisplayError";
import { useRouter } from "next/navigation";
import './map.css'
import { darkMapStyle } from "@/lib/utils/mapStyles/mapStyle";
import { useTheme } from "@/lib/providers/ThemeProvider";

interface MapProps {
  apiKey: string;
  data: Array<{
    _id: string;
    name: string;
    location: { coordinates: [number, number] };
    image: string;
    address: string;
  }>;
  center: { lat: number; lng: number } | null;
}

const Map: FC<MapProps> = ({ apiKey, data, center }) => {
  const router = useRouter();
  const mapRef = useRef<google.maps.Map | null>(null);
  const { theme } = useTheme();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const defaultCenter = useMemo(() => {
    
    if (data.length > 0) {
      const [lng, lat] = data[0].location.coordinates;
      return { lat: Number(lat), lng: Number(lng) };
    }
    return { lat: 33.6844, lng: 73.0479 }; // Default to Islamabad
  }, [data]);


  const getRedirectUrl = (item) => {
    return `/${item.shopType === "restaurant" ? "restaurant" : "store"}/${item?.slug}/${item._id}`;
  };

  useEffect(() => {
    if (center && mapRef.current) {
      mapRef.current.panTo(center); 
    }
  }, [center]);

  return !isLoaded ? (
    <Loader message="Loading Map" />
  ) : loadError ? (
    <DisplayError />
  ) : (
    <>
    {/* Light mode */}
    <GoogleMap
      mapContainerClassName="block dark:hidden"
      zoom={12} 
      center={center || defaultCenter}
      mapContainerStyle={{ width: "100%", height: "100vh" }}
      options={{
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        cameraControl: false,
        gestureHandling: "auto",
      }}
      onLoad={(map) => {
        mapRef.current = map
      }} 
    >
      {data.map((restaurant, index) => {
        const { coordinates } = restaurant.location;
        if (!coordinates || coordinates.length !== 2) {
          console.warn(`Invalid coordinates for restaurant: ${restaurant.name}`);
          return null;
        }

        return (
          <Marker
            key={index}
            position={{
              lat: Number(coordinates[1]),
              lng: Number(coordinates[0]),
            }}
            icon={{
              url: restaurant.image,
              scaledSize: new window.google.maps.Size(50, 50),
            }}
            label={{
              text: restaurant.name,
              color: "#333",
              fontSize: "12px",
              fontWeight: "bold",
              className: "map-view-marker-label",
            }}
            title={restaurant.name}
            onClick={() => router.push(getRedirectUrl(restaurant))}

          >
          </Marker>
        );
      })}
    </GoogleMap>

    {/* Dark mode */}
    <GoogleMap
      mapContainerClassName="hidden dark:block"
      zoom={12} 
      center={center || defaultCenter}
      mapContainerStyle={{ width: "100%", height: "100vh" }}
      options={{
        zoomControl: false, // Disable default zoom controls
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        cameraControl: false,
        gestureHandling: "auto",
        styles: theme === "dark" ? darkMapStyle : null,
        disableDefaultUI: true,
      }}
      onLoad={(map) => {
        mapRef.current = map
      }} 
    >
      {data.map((restaurant, index) => {
        const { coordinates } = restaurant.location;
        if (!coordinates || coordinates.length !== 2) {
          console.warn(`Invalid coordinates for restaurant: ${restaurant.name}`);
          return null;
        }

        return (
          <Marker
            key={index}
            position={{
              lat: Number(coordinates[1]),
              lng: Number(coordinates[0]),
            }}
            icon={{
              url: restaurant.image,
              scaledSize: new window.google.maps.Size(50, 50),
            }}
            label={{
              text: restaurant.name,
              color: "#333",
              fontSize: "12px",
              fontWeight: "bold",
              className: "map-view-marker-label",
            }}
            title={restaurant.name}
            onClick={() => router.push(getRedirectUrl(restaurant))}

          >
          </Marker>
        );
      })}
    </GoogleMap>
    </>
  );
};

export default Map;