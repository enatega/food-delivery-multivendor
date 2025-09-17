import { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected,setIsConnected };
};

export default useNetworkStatus;
