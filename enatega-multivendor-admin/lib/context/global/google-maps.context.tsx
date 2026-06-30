'use client';

import React, { createContext } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
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
  const { isLoaded: hookIsLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: libraries || ['places'],
  });
  const isLoaded = hookIsLoaded;

  const value: IGoogleMapsContext = {
    isLoaded,
  };

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
};
