import { IGoogleMapsLoaderComponentProps } from '@/lib/utils/interfaces';
import { GoogleMapsContext } from '@/lib/context/global/google-maps.context';
import { useContext } from 'react';
import CustomLoader from '../../custom-progress-indicator';

export const GoogleMapsLoader = ({
  children,
}: IGoogleMapsLoaderComponentProps) => {
  const context = useContext(GoogleMapsContext);

  // context.isLoaded is undefined when no GoogleMapsProvider is in the tree
  // (happens when no Google Maps API key is configured for this tenant).
  // Only block rendering when the provider IS present but hasn't loaded yet (=== false).
  if (context?.isLoaded === false) {
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
