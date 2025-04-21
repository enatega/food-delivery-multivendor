'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { ToastContext } from '@/lib/context/global/toast.context';
import {
  IGoogleMapsContext,
  IGoogleMapsProviderProps,
} from '../../utils/interfaces';

export const GoogleMapsContext = createContext<IGoogleMapsContext>(
  {} as IGoogleMapsContext
);

export const GoogleMapsProvider: React.FC<IGoogleMapsProviderProps> = ({
  apiKey,
  libraries,
  children,
}) => {
  const { showToast } = useContext(ToastContext);

  // Add a state to track loading more explicitly
  const [manualIsLoaded, setManualIsLoaded] = useState(false);

  // Use the hook from @react-google-maps/api
  const { isLoaded: hookIsLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: libraries || ['places'],
  });

  useEffect(() => {
    console.log('GoogleMapsProvider - API Key:', apiKey);
    console.log('GoogleMapsProvider - Libraries:', libraries);

    const loadGoogleMapsScript = (key: string) => {
      return new Promise<void>((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.querySelector(
          'script[src^="https://maps.googleapis.com/maps/api/js"]'
        );

        if (existingScript) {
          console.log('Google Maps script already exists');
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          console.log('Google Maps script loaded manually');
          setManualIsLoaded(true);
          resolve();
        };

        script.onerror = (error) => {
          console.error('Google Maps script load error:', error);
          showToast({
            type: 'error',
            title: 'Google Maps',
            message: 'Failed to load Google Maps script.',
          });
          reject(error);
        };

        document.head.appendChild(script);
      });
    };

    // Only try to load if an API key is provided
    if (apiKey) {
      loadGoogleMapsScript(apiKey).catch(console.error);
    } else {
      console.warn('No Google Maps API key provided');
    }
  }, [apiKey, libraries]);

  // Combine loading states
  const isLoaded = hookIsLoaded || manualIsLoaded;

  useEffect(() => {
    console.log('Google Maps Loading States:');
    console.log('Hook isLoaded:', hookIsLoaded);
    console.log('Manual isLoaded:', manualIsLoaded);
    console.log('Combined isLoaded:', isLoaded);
  }, [hookIsLoaded, manualIsLoaded, isLoaded]);

  const value: IGoogleMapsContext = {
    isLoaded,
  };

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
};
