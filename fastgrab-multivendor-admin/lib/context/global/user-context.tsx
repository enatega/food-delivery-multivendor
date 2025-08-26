import React, { createContext, useState, useEffect } from 'react';
import { ILoginResponse } from '@/lib/utils/interfaces';
import { APP_NAME } from '@/lib/utils/constants';

interface IUserContext {
  user: ILoginResponse | null;
  setUser: (user: ILoginResponse | null) => void;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<ILoginResponse | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem(`user-${APP_NAME}`);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
