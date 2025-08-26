"use client";

// Interfaces
import { IUserAddress, IUserAddressProps } from "@/lib/utils/interfaces";

// Core
import React, { ReactNode, useContext } from "react";

const UserAddressContext = React.createContext({} as IUserAddressProps);

export const UserAddressProvider = ({ children }: { children: ReactNode }) => {
  const [userAddress, setUserAddress] = React.useState<IUserAddress | null>(
    null
  );

  const value: IUserAddressProps = {
    userAddress,
    setUserAddress,
  };

  return (
    <UserAddressContext.Provider value={value}>
      {children}
    </UserAddressContext.Provider>
  );
};
export const ConfigurationConsumer = UserAddressContext.Consumer;
export const useUserAddress = () => useContext(UserAddressContext);
