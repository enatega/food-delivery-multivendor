'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from 'react';
import Geocode from 'react-geocode';
import { ILocation } from '../utils/interfaces';
import { useConfiguration } from './useConfiguration';
import { ToastContext } from '@/lib/context/global/toast.context';

type LocationCallback = (error: string | null, location?: ILocation) => void;

export default function useLocation() {
  // Toast Context
  const { showToast } = useContext(ToastContext);

  const { GOOGLE_MAPS_KEY } = useConfiguration();

  const latLngToGeoString = async ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }): Promise<string> => {
    const location = await Geocode.fromLatLng(
      latitude.toString(),
      longitude.toString()
    );
    return location.results[0].formatted_address;
  };

  const getCurrentLocation = (callback: LocationCallback): void => {
    navigator.geolocation.getCurrentPosition(
      async (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        try {
          const location = await Geocode.fromLatLng(
            latitude.toString(),
            longitude.toString()
          );
          callback(null, {
            label: 'Home',
            latitude,
            longitude,
            deliveryAddress: location.results[0].formatted_address,
          });
        } catch (error) {
          callback(error instanceof Error ? error.message : String(error));
        }
      },
      (error: GeolocationPositionError) => {
        callback(error.message);
        showToast({
          type: 'error',
          title: 'Current Location',
          message: error.message,
        });
      }
    );
  };

  useEffect(() => {
    if (!GOOGLE_MAPS_KEY) return;
    Geocode.setApiKey(GOOGLE_MAPS_KEY);
    Geocode.setLanguage('en');
    Geocode.enableDebug(false);
  }, [GOOGLE_MAPS_KEY]);

  return {
    getCurrentLocation,
    latLngToGeoString,
  };
}
