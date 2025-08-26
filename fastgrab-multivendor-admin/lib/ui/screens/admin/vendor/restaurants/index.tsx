import VendorRestaurantsForm from '@/lib/ui/screen-components/protected/vendor/restaurants/add-form';
import VendorRestaurantsMain from '@/lib/ui/screen-components/protected/vendor/restaurants/view/main';
import React from 'react';

export default function VendorRestaurantScreen() {
  return (
    <div className="screen-container">
      <VendorRestaurantsMain />
      <VendorRestaurantsForm />
    </div>
  );
}
