import { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Network Status:", state.isConnected);
      setIsConnected(state.isConnected);

      console.log("running again")
    });

    return () => unsubscribe();
  }, []);

  return { isConnected,setIsConnected };
};

export default useNetworkStatus;
