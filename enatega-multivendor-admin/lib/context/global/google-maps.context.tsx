'use client';

import React, { createContext, useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import {
  IGoogleMapsContext,
  IGoogleMapsProviderProps,
} from '../../utils/interfaces';

export const GoogleMapsContext = createContext<IGoogleMapsContext>(
  {} as IGoogleMapsContext
);

// Separated inner component so useJsApiLoader is ONLY called when we have a
// real, stable apiKey. This prevents "@react-google-maps/api Loader must not
// be called again with different options" — the singleton loader throws when
// called first with '' and then with the real key.
function MapsScriptLoader({
  apiKey,
  libraries,
  onLoaded,
}: {
  apiKey: string;
  libraries: string[];
  onLoaded: () => void;
}) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: libraries as never[],
  });

  useEffect(() => {
    if (isLoaded) onLoaded();
  }, [isLoaded]);

  return null;
}

export const GoogleMapsProvider: React.FC<IGoogleMapsProviderProps> = ({
  apiKey,
  libraries,
  children,
}) => {
  // Latch the first non-empty key so the loader is never re-initialized.
  const [stableKey, setStableKey] = useState('');
  // false until the script actually loads; components that read isLoaded
  // directly (e.g. UpdateRestaurantLocation) must not render GoogleMap until
  // the global `google` object exists.
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (apiKey && !stableKey) {
      setStableKey(apiKey);
    }
  }, [apiKey, stableKey]);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded }}>
      {/* MapsScriptLoader mounts once when stableKey is set; children are unaffected */}
      {stableKey && (
        <MapsScriptLoader
          apiKey={stableKey}
          libraries={libraries || ['places']}
          onLoaded={() => setIsLoaded(true)}
        />
      )}
      {children}
    </GoogleMapsContext.Provider>
  );
};
