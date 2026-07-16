'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext } from 'react';
import { ILocation } from '../utils/interfaces';
import { useConfiguration } from './useConfiguration';
import { ToastContext } from '@/lib/context/global/toast.context';
import { reverseGeocode } from '@/lib/api/google-maps';

type LocationCallback = (error: string | null, location?: ILocation) => void;

export default function useLocation() {
  // Toast Context
  const { showToast } = useContext(ToastContext);

  const { SERVER_URL } = useConfiguration();

  const latLngToGeoString = useCallback(async ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }): Promise<string> => {
    const location = await reverseGeocode({
      serverUrl: SERVER_URL ?? '',
      latitude,
      longitude,
    });
    return location.formattedAddress || '';
  }, [SERVER_URL]);

  const getCurrentLocation = useCallback((callback: LocationCallback): void => {
    navigator.geolocation.getCurrentPosition(
      async (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        try {
          const location = await reverseGeocode({
            serverUrl: SERVER_URL ?? '',
            latitude,
            longitude,
          });
          callback(null, {
            label: 'Home',
            latitude,
            longitude,
            deliveryAddress: location.formattedAddress || '',
          });
        } catch (error) {
          callback(error instanceof Error ? error.message : String(error));
          showToast({
            type: 'error',
            title: 'Current Location',
            message:
              error instanceof Error
                ? error.message
                : 'Unable to fetch address.',
          });
        }
      },
      (error: GeolocationPositionError) => {
        callback(error.message);
        showToast({
          type: 'error',
          title: 'Current Location',
          message: error.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, [SERVER_URL, showToast]);

  return {
    getCurrentLocation,
    latLngToGeoString,
  };
}
