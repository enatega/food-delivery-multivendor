import { useContext } from 'react';
import { UserContext } from '@/lib/context/global/user-context';

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
