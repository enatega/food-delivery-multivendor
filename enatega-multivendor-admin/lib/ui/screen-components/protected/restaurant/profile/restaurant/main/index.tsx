import React, { useContext } from 'react';
import { ProfileLogoSVG } from '@/lib/utils/assets/svgs/profile';
import { IInfoItemProps } from '@/lib/utils/interfaces/profile/restaurant.profile.interface';
import { Avatar } from 'primereact/avatar';
import { ProfileContext } from '@/lib/context/restaurant/profile.context';
import RestaurantProfileSkeleton from '@/lib/ui/useable-components/custom-skeletons/restaurant.profile.skeleton';
import Image from 'next/image';

const InfoItem: React.FC<IInfoItemProps> = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-2">{label}</p>
    <p className="font-medium">{value || 'N/A'}</p>
  </div>
);

const RestaurantMain: React.FC = () => {
  // Context
  const { restaurantProfileResponse } = useContext(ProfileContext);
  const restaurant = restaurantProfileResponse?.data?.restaurant;

  if (restaurantProfileResponse.loading) return <RestaurantProfileSkeleton />;

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="bg-white p-8 w-full border-2 border-dotted rounded border-inherit">
        <div className="flex items-center mb-6">
          <ProfileLogoSVG width="55" height="55" strokeColor="#1E1E1E" />
          <div className="ml-2">
            <h1 className="text-xs text-gray-500">Store Name</h1>
            <h2 className="text-2xl font-bold">{restaurant?.name || 'N/A'}</h2>
          </div>
        </div>
        <hr className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoItem label="Email" value={restaurant?.username} />
          <InfoItem label="Password" value={restaurant?.password} />
          <div className="md:row-span-4">
            <p className="text-xs text-gray-500 mb-4">Images</p>
            <div className="flex space-x-2">
              {restaurant?.image ? (
                <Image
                  src={restaurant?.image}
                  alt="Store logo"
                  className="object-cover rounded"
                  width={96}
                  height={96}
                />
              ) : (
                <Avatar label="I" className="w-24 h-24" />
              )}
              {restaurant?.logo ? (
                <Image
                  src={restaurant?.logo}
                  alt="Store logo"
                  className="object-cover rounded"
                  width={96}
                  height={96}
                />
              ) : (
                <Avatar label="L" className="w-24 h-24" />
              )}
            </div>
          </div>
          <InfoItem label="Name" value={restaurant?.name} />
          <InfoItem label="Address" value={restaurant?.address} />
          <InfoItem
            label="Delivery Time"
            value={restaurant?.deliveryTime?.toString()}
          />
          <InfoItem
            label="Min Order"
            value={restaurant?.minimumOrder?.toString()}
          />
          <InfoItem
            label="Service Charges"
            value={restaurant?.tax?.toString()}
          />
          <InfoItem label="Order Prefix" value={restaurant?.orderPrefix} />
          <InfoItem label="Shop Category" value={restaurant?.shopType} />
        </div>
      </div>
    </div>
  );
};

export default RestaurantMain;
