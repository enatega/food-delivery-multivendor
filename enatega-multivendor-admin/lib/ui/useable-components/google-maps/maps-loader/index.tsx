// React and Hooks

// Interfaces
import { IGoogleMapsLoaderComponentProps } from '@/lib/utils/interfaces';

// Components
import { GoogleMapsContext } from '@/lib/context/global/google-maps.context';
import { useContext } from 'react';
import CustomLoader from '../../custom-progress-indicator';

export const GoogleMapsLoader = ({
  children,
}: IGoogleMapsLoaderComponentProps) => {
  const context = useContext(GoogleMapsContext);

  if (!context?.isLoaded) {
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
