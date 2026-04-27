// React and Hooks

// Interfaces
import { IGoogleMapsLoaderComponentProps } from '@/lib/utils/interfaces';

// Components
import { GoogleMapsContext } from '@/lib/context/global/google-maps.context';
import { useContext } from 'react';
import CustomLoader from '../../custom-progress-indicator';
import { useEffect } from 'react';

export const GoogleMapsLoader = ({
  children,
}: IGoogleMapsLoaderComponentProps) => {
  const context = useContext(GoogleMapsContext);

  console.log('GoogleMapsLoader - Context:', context);
  console.log('GoogleMapsLoader - isLoaded:', context?.isLoaded);

  useEffect(() => {
    console.log('GoogleMapsLoader - Context changed:', context);
  }, [context]);

  if (!context?.isLoaded) {
    console.warn('Google Maps not loaded, showing loader');
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <CustomLoader />
      </div>
    );
  }

  return <>{children}</>;
};