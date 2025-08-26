'use client';

// Core
import { createContext, useState } from 'react';

// Interface
import {
  IProvider,
  VendorLayoutContextData,
  VendorLayoutContextProps,
} from '@/lib/utils/interfaces';

// Costants
import { SELECTED_VENDOR } from '@/lib/utils/constants';
// Methods
import { onUseLocalStorage } from '@/lib/utils/methods';

export const VendorLayoutContext = createContext<VendorLayoutContextProps>(
  {} as VendorLayoutContextProps
);

export const VendorLayoutProvider = ({ children }: IProvider) => {
  const [vendorLayoutContextData, setVendorLayoutContextData] =
    useState<VendorLayoutContextData>({
      vendorId: onUseLocalStorage('get', SELECTED_VENDOR),
    } as VendorLayoutContextData);

  // Handlers

  const onSetVendorLayoutContextData = (
    data: Partial<VendorLayoutContextData>
  ) => {
    setVendorLayoutContextData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  const value: VendorLayoutContextProps = {
    vendorLayoutContextData,
    onSetVendorLayoutContextData,
  };

  return (
    <VendorLayoutContext.Provider value={value}>
      {children}
    </VendorLayoutContext.Provider>
  );
};
