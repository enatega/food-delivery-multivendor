import React, { createContext, useState, useEffect } from 'react';
import { ILoginResponse } from '@/lib/utils/interfaces';
import { APP_NAME } from '@/lib/utils/constants';

interface IUserContext {
  user: ILoginResponse | null;
  loading: boolean;
  setUser: (user: ILoginResponse | null) => void;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<ILoginResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem(`user-${APP_NAME}`);
    try {
      setUser(savedUser ? JSON.parse(savedUser) : null);
    } catch {
      localStorage.removeItem(`user-${APP_NAME}`);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
