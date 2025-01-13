'use client';

// React imports
import { useContext } from 'react';

// Context imports
import CustomTab from '@/lib/ui/useable-components/custom-tab';

// Constants
import { RESTAURANTS_TABS } from '@/lib/utils/constants';

// Context
import { RestaurantsContext } from '@/lib/context/super-admin/restaurants.context';

export default function RestaurantsScreenSubHeader() {
  const { currentTab, onSetCurrentTab } = useContext(RestaurantsContext);

  return (
    <div className="sticky top-0 z-0 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <CustomTab
          options={RESTAURANTS_TABS}
          selectedTab={currentTab}
          setSelectedTab={onSetCurrentTab}
          className="w-full sm:w-auto"
        />
      </div>
    </div>
  );
}
