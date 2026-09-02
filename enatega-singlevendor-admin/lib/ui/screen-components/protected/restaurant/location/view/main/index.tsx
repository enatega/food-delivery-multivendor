import React from 'react';
import UpdateRestaurantLocation from '../../../profile/restaurant/add-form/update-restaurant-location';

const LocationMain = () => {
  return (
    <div className="mt-7 max-h-[calc(100vh-152px)] overflow-auto rounded border dark:border-dark-600 px-8 py-8">
      <UpdateRestaurantLocation height="400px" />
    </div>
  );
};

export default LocationMain;
