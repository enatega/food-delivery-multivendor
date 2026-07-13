'use client';

// Core
import { createContext, useState, useEffect } from 'react';

// Interface
import { IProvider } from '@/lib/utils/interfaces';

// Types
import { LayoutContextProps } from '@/lib/utils/interfaces';

import { onUseLocalStorage } from '@/lib/utils/methods';

export const LayoutContext = createContext<LayoutContextProps>(
  {} as LayoutContextProps
);

export const LayoutProvider = ({ children }: IProvider) => {
  const [isSuperAdminSidebarVisible, setShowSuperAdminSidebar] =
    useState<boolean>(true);
  const [isRestaurantSidebarVisible, setRestaurantShowSidebar] =
    useState<boolean>(true);
  const [isVendorSidebarVisible, setVendorShowSidebar] =
    useState<boolean>(true);

  useEffect(() => {
    // Check if routeStack exists; if not, initialize it as an empty stack
    const existingRouteStack = onUseLocalStorage('get', 'routeStack');
    if (!existingRouteStack) {
      onUseLocalStorage('save', 'routeStack', JSON.stringify([]));
    }
  }, []);

  const onShowSuperAdminSidebarHandler = (val?: boolean) => {
    setShowSuperAdminSidebar((prevState) =>
      val === undefined ? !prevState : val
    );
  };

  const onShowRestaurantSidebarHandler = (val?: boolean) => {
    setRestaurantShowSidebar((prevState) =>
      val === undefined ? !prevState : val
    );
  };

  const onShowVendorSidebarHandler = (val?: boolean) => {
    setVendorShowSidebar((prevState) => (val === undefined ? !prevState : val));
  };

  const value: LayoutContextProps = {
    // Super Admin
    isSuperAdminSidebarVisible,
    showSuperAdminSidebar: onShowSuperAdminSidebarHandler,
    // Restaurant
    isRestaurantSidebarVisible,
    showRestaurantSidebar: onShowRestaurantSidebarHandler,
    // Vendor
    isVendorSidebarVisible,
    showVendorSidebar: onShowVendorSidebarHandler,
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};
