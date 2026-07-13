import LocationHeader from '@/lib/ui/screen-components/protected/restaurant/location/view/header';
import LocationMain from '@/lib/ui/screen-components/protected/restaurant/location/view/main';

const LocationScreen = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden p-3">
      <LocationHeader />
      <LocationMain />
    </div>
  );
};

export default LocationScreen;
