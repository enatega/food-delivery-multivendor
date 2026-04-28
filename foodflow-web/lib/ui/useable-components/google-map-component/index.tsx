"use client";
import { useEffect, useState, useCallback, useContext } from "react";
import { GoogleMap, Marker, Circle } from "@react-google-maps/api";
import styles from "./google-map-component.module.css";
import { IGoogleMapComponentProps } from "@/lib/utils/interfaces";
import { GoogleMapsContext } from "@/lib/context/global/google-maps.context";
import { darkMapStyle } from "@/lib/utils/mapStyles/mapStyle";
import { useTheme } from "@/lib/providers/ThemeProvider";

const GoogleMapComponent = ({
  center,
  circleRadius = 300, // Default radius of 300 meters
  visible,
}: IGoogleMapComponentProps) => {
  // states

  // State for storing the Google Maps instance
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  // State for controlling zoom level
  const [zoom, setZoom] = useState(15);
  const { theme } = useTheme();

  // Context
  const { isLoaded } = useContext(GoogleMapsContext);

  // useEffects

  // Clean up map instance when component becomes invisible
  useEffect(() => {
    if (!visible && mapInstance) {
      setMapInstance(null);
    }
  }, [visible, mapInstance]);

  // Define container style for the map
  const mapContainerStyle = {
    width: "100%",
    height: "360px",
    position: "relative" as const,
  };

  // Configuration for the circle overlay
  const circleOptions = {
    strokeColor: "#000",
    strokeOpacity: 0.5,
    strokeWeight: 1,
    fillColor: "#000",
    fillOpacity: 0.1,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    zIndex: 1,
  };

  // Callback when map is loaded
  const onLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);

  // Cleanup when map is unmounted
  const onUnmount = useCallback(() => {
    setMapInstance(null);
  }, []);

  // handlers

  // Handler for zoom in button
  const handleZoomIn = useCallback(() => {
    if (mapInstance) {
      const newZoom = Math.min(zoom + 1, 20); // Maximum zoom level is 20
      mapInstance.setZoom(newZoom);
      setZoom(newZoom);
    }
  }, [mapInstance, zoom]);

  // Handler for zoom out button
  const handleZoomOut = useCallback(() => {
    if (mapInstance) {
      const newZoom = Math.max(zoom - 1, 1); // Minimum zoom level is 1
      mapInstance.setZoom(newZoom);
      setZoom(newZoom);
    }
  }, [mapInstance, zoom]);

  // Don't render the component if not visible
  if (!visible) return null;

  // Show error message if maps failed to load
  // if (loadError) {
  //   return (
  //     <div
  //       style={mapContainerStyle}
  //       className="flex items-center justify-center bg-gray-100"
  //     >
  //       Error loading maps
  //     </div>
  //   );
  // }

  // Show loading state while API is being loaded
  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] bg-gray-200 rounded-md flex items-center justify-center text-gray-500"></div>
    );
  }

  return (
    <div className="map-container" style={{ position: "relative" }}>
      {/* Google Map Component */}
      {/* light mode map*/}
      <GoogleMap
        mapContainerClassName="block dark:hidden"
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: false, // Disable default zoom controls
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          cameraControl: false,
          styles: [
            {
              featureType: "all",
              elementType: "all",
              stylers: [
                { saturation: -30 }, // Slight desaturation to match the grayscale look
              ],
            },
          ],
        }}
      >
        {/* Marker at the center position */}
        <Marker position={center} />
        {/* Circle with specified radius around the center */}
        <Circle center={center} radius={circleRadius} options={circleOptions} />
      </GoogleMap>

      {/* dark mode Map */}

      <GoogleMap
        mapContainerClassName=" hidden dark:block"
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: false, // Disable default zoom controls
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          cameraControl: false,
          styles: theme === "dark" ? darkMapStyle : null,
          disableDefaultUI: true,
        }}
      >
        {/* Marker at the center position */}
        <Marker position={center} />
        {/* Circle with specified radius around the center */}
        <Circle center={center} radius={circleRadius} options={circleOptions} />
      </GoogleMap>

      {/* Custom Zoom Controls */}
      <div className={styles.zoomControls}>
        <button
          className={styles.zoomButton}
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          className={styles.zoomButton}
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          −
        </button>
      </div>
    </div>
  );
};

export default GoogleMapComponent;
