'use client';

// React imports
import { useContext } from 'react';

// Context imports
import CustomTab from '@/lib/ui/useable-components/custom-tab';

// Constants
import { RESTAURANTS_TABS } from '@/lib/utils/constants';

// Context
import { RestaurantsContext } from '@/lib/context/super-admin/restaurants.context';
//
import { useConfiguration } from '@/lib/hooks/useConfiguration';

export default function RestaurantsScreenSubHeader() {
  const { currentTab, onSetCurrentTab } = useContext(RestaurantsContext);

  const { IS_MULTIVENDOR } = useConfiguration();

  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        {IS_MULTIVENDOR && (
          <CustomTab
            options={RESTAURANTS_TABS}
            selectedTab={currentTab}
            setSelectedTab={onSetCurrentTab}
            className="w-full sm:w-auto"
          />
        )}
      </div>
    </div>
  );
}
