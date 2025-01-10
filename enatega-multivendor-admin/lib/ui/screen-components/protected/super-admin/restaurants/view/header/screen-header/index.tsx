'use client';

// React imports
import { useContext } from 'react';

// Context imports
import { RestaurantsContext } from '@/lib/context/super-admin/restaurants.context';

// Component imports
import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Icon imports
import { faAdd } from '@fortawesome/free-solid-svg-icons';

export default function RestaurantsScreenHeader() {
  // Context
  const { onRestaurantsFormVisible } = useContext(RestaurantsContext);
  return (
    <div className="sticky top-0 z-[9999] w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text="Stores" />
        <TextIconClickable
          className="rounded border-gray-300 bg-black text-white sm:w-auto"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          title="Add Store"
          onClick={() => onRestaurantsFormVisible(true)}
        />
      </div>
    </div>
  );
}
