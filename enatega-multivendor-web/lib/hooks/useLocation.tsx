"use client";

import { useCallback } from "react";

// Interfaces
import { ILocation } from "@/lib/utils/interfaces";

// Hooks
import { reverseGeocode } from "../api/google-maps";
import { useAppMode } from "@/lib/mode";

type LocationCallback = (error: string | null, location?: ILocation) => void;

export default function useLocation() {
  // Toast Context

  const { mode } = useAppMode();

  const latLngToGeoString = useCallback(
    async ({
      latitude,
      longitude,
    }: {
      latitude: number;
      longitude: number;
    }): Promise<string> => {
      const location = await reverseGeocode({
        mode,
        latitude,
        longitude,
      });
      return location.formattedAddress || "";
    },
    [mode],
  );

  const getCurrentLocation = useCallback(
    (callback?: LocationCallback): void => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const location = await reverseGeocode({
              mode,
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
        },
      );
    },
    [mode],
  );

  return {
    getCurrentLocation,
    latLngToGeoString,
  };
}
