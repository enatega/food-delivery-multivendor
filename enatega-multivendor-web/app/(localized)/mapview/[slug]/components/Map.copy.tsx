"use client";
import { FC, useMemo } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Loader from "./Loader";
import DisplayError from "./DisplayError";

interface GoogleMapComponentProps {
  apiKey: string;
  data: Array<{
    name: string;
    location: { coordinates: [number, number] };
    image: string;
    address: string;
  }>;
}

const GoogleMapComponent: FC<GoogleMapComponentProps> = ({ apiKey, data }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const center = useMemo(() => {
    if (data.length > 0) {
      const [lng, lat] = data[0].location.coordinates;
      return { lat : Number(lat), lng : Number(lng) };
    }
    return { lat: 33.6844, lng: 73.0479 }; // Default to Islamabad
  }, [data]);



  return (
    !isLoaded 
    ? 
        <Loader message='Loading Map' />
    :
    loadError 
    ?
        <DisplayError />
    :
        <GoogleMap
        zoom={12}
        center={center}
        mapContainerStyle={{ width: "100%", height: "100vh" }}
        options={{
            zoomControl: false, 
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            cameraControl: false,
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
                    title={restaurant.name}
                />
                );
            })}
        </GoogleMap>
  );
};

export default GoogleMapComponent;