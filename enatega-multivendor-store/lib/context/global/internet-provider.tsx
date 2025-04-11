import React, { createContext, useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { NoInternetIcon } from "@/lib/ui/useable-components/svg";

interface InternetContextProps {
  isConnected: boolean;
}

const InternetContext = createContext<InternetContextProps | undefined>(
  undefined,
);

export const useInternet = (): InternetContextProps => {
  // Hooks

  const context = useContext(InternetContext);
  if (!context) {
    throw new Error("useInternet must be used within an InternetProvider");
  }
  return context;
};

const InternetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isConnected) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <NoInternetIcon />
        <Text className="font-[Inter] text-black text-2xl font-bold">
          No Internet Connection
        </Text>
      </View>
    );
  }

  return (
    <InternetContext.Provider value={{ isConnected }}>
      {children}
    </InternetContext.Provider>
  );
};

export default InternetProvider;
