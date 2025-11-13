'use client';

import { LoyaltyType } from '@/lib/utils/types/loyalty';
import { createContext, useState, ReactNode } from 'react';

interface ILoyaltyProviderProps {
  children: ReactNode;
}

interface ILoyaltyData {
  levelId?: string;
  tierId?: string;
  breakdownId?: string;
}

interface ILoyaltyContext {
  loyaltyData?: ILoyaltyData;
  setLoyaltyData: (data: ILoyaltyData) => void;
  loyaltyType: LoyaltyType;
  setLoyaltyType: (type: LoyaltyType) => void;
  levelFormVisible: boolean;
  setLevelFormVisible: (status: boolean) => void;
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
  const [loyaltyData, setLoyaltyData] = useState<ILoyaltyData>();
  const [levelFormVisible, setLevelFormVisible] = useState<boolean>(false);
  const [tierFormVisible, setTierFormVisible] = useState<boolean>(false);
  const [breakdownFormVisible, setBreakdownFormVisible] =
    useState<boolean>(false);

  const value: ILoyaltyContext = {
    loyaltyData,
    setLoyaltyData,
    loyaltyType,
    setLoyaltyType,
    levelFormVisible,
    setLevelFormVisible,
    tierFormVisible,
    setTierFormVisible,
    breakdownFormVisible,
    setBreakdownFormVisible,
  };

  return (
    <LoyaltyContext.Provider value={value}>{children}</LoyaltyContext.Provider>
  );
};
