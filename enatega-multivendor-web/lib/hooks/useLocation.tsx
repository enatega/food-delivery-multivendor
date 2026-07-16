"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from "react";

// Interfaces
import { ILocation } from "@/lib/utils/interfaces";

// Hooks
import { useConfig } from "../context/configuration/configuration.context";
import { reverseGeocode } from "../api/google-maps";

type LocationCallback = (error: string | null, location?: ILocation) => void;

export default function useLocation() {
  // Toast Context

  const { SERVER_URL } = useConfig();

  const latLngToGeoString = useCallback(async ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }): Promise<string> => {
    const location = await reverseGeocode({
      serverUrl: SERVER_URL,
      latitude,
      longitude,
    });
    return location.formattedAddress || "";
  }, [SERVER_URL]);

  const getCurrentLocation = useCallback((callback?: LocationCallback): void => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const location = await reverseGeocode({
            serverUrl: SERVER_URL,
            latitude,
            longitude,
          });

          callback &&
            callback(null, {
              label: "Home",
              latitude,
              longitude,
              deliveryAddress: location.formattedAddress || "",
            });
        } catch (error) {
          callback &&
            callback(error instanceof Error ? error.message : String(error));
        }
      },
      (error) => {
        callback && callback(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, [SERVER_URL]);

  return {
    getCurrentLocation,
    latLngToGeoString,
  };
}
