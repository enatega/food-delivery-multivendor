'use client';

import { LoyaltyType } from '@/lib/utils/types/loyalty';
import { createContext, useState, ReactNode } from 'react';

interface ILoyaltyProviderProps {
  children: ReactNode;
}

interface ILoyaltyContext {
  loyaltyType: LoyaltyType;
  setLoyaltyType: (type: LoyaltyType) => void;
  levelFormVisible: boolean;
  setLevelFormFormVisible: (status: boolean) => void;
  tierFormVisible: boolean;
  setTierFormVisible: (status: boolean) => void;
  breakdownFormVisible: boolean;
  setBreakdownFormVisible: (status: boolean) => void;
}

export const LoyaltyContext = createContext<ILoyaltyContext>(
  {} as ILoyaltyContext
);

export const LoyaltyProvider = ({ children }: ILoyaltyProviderProps) => {
  const [loyaltyType, setLoyaltyType] = useState<LoyaltyType>(
    'Customer Loyalty Program'
  );
  const [levelFormVisible, setLevelFormFormVisible] = useState<boolean>(false);
  const [tierFormVisible, setTierFormVisible] = useState<boolean>(false);
  const [breakdownFormVisible, setBreakdownFormVisible] =
    useState<boolean>(false);

  const value: ILoyaltyContext = {
    loyaltyType,
    setLoyaltyType,
    levelFormVisible,
    setLevelFormFormVisible,
    tierFormVisible,
    setTierFormVisible,
    breakdownFormVisible,
    setBreakdownFormVisible,
  };

  return (
    <LoyaltyContext.Provider value={value}>{children}</LoyaltyContext.Provider>
  );
};
