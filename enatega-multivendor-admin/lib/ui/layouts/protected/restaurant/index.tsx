/* eslint-disable react-hooks/exhaustive-deps */
'use client';

// Core
import { useContext } from 'react';

// Context
import { LayoutContext } from '@/lib/context/global/layout.context';

// Components
import RestaurantAppTopbar from '@/lib/ui/screen-components/protected/layout/restaurant-layout/app-bar';
import RestaurantSidebar from '@/lib/ui/screen-components/protected/layout/restaurant-layout/side-bar';

// Interface
import { IProvider, LayoutContextProps } from '@/lib/utils/interfaces';

const RestaurantLayout = ({ children }: IProvider) => {
  // Context
  const { isRestaurantSidebarVisible } =
    useContext<LayoutContextProps>(LayoutContext);

  return (
    <div className="layout-main">
      <div className="layout-top-container">
        <RestaurantAppTopbar />
      </div>
      <div className="layout-main-container">
        <div className="relative left-0 z-50">
          <RestaurantSidebar />
        </div>
        <div
          className={`lg:ml-45 h-full w-full md:ml-${isRestaurantSidebarVisible ? 64 : 20}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default RestaurantLayout;
