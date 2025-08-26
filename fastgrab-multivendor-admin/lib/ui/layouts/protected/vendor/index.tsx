/* eslint-disable react-hooks/exhaustive-deps */
'use client';

// Core
import { useContext } from 'react';

// Context
import { LayoutContext } from '@/lib/context/global/layout.context';

// Components
import VendorAppTopbar from '@/lib/ui/screen-components/protected/layout/vendor-layout/app-bar';
import VendorSidebar from '@/lib/ui/screen-components/protected/layout/vendor-layout/side-bar';

// Interface
import { IProvider, LayoutContextProps } from '@/lib/utils/interfaces';

const VendorLayout = ({ children }: IProvider) => {
  // Context
  const { isVendorSidebarVisible } =
    useContext<LayoutContextProps>(LayoutContext);

  return (
    <div className="layout-main">
      <div className="layout-top-container">
        <VendorAppTopbar />
      </div>
      <div className="layout-main-container">
        <div className="relative left-0 z-50">
          <VendorSidebar />
        </div>
        <div
          className={`h-auto max-w-[100vw] w-full ${isVendorSidebarVisible ? 'w-[calc(100vw-260px)]' : 'w-full'}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default VendorLayout;
