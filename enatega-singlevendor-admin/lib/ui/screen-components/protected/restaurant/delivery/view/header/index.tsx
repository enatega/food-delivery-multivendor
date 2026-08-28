// Components
import HeaderText from '@/lib/ui/useable-components/header-text';

const DeliveryHeader = () => {
  return (
    <div className="w-full flex-shrink-0">
      <div className="flex w-full flex-col justify-between">
        <HeaderText className="heading" text="Delivery" />
        <p className="text-sm text-gray-400">
          Automatically calculate your delivery fees based on a set distance and
          then per km thereafter
        </p>
      </div>
    </div>
  );
};

export default DeliveryHeader;
