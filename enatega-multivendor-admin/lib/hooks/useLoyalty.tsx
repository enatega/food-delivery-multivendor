import { useContext } from 'react';
import { LoyaltyContext } from '../context/super-admin/loyalty-referral.context';

export const useLoyaltyContext = () => {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
