// Components
import HeaderText from '@/lib/ui/useable-components/header-text';

const LocationHeader = () => {
  return (
    <div className="w-full flex-shrink-0">
      <div className="flex w-full justify-between">
        <HeaderText className="heading" text="Location" />
      </div>
    </div>
  );
};

export default LocationHeader;
