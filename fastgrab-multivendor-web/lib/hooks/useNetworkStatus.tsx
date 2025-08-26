import { useEffect, useState } from "react";

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true); // Default to true

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard

    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    updateOnlineStatus(); // Set initial value

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  return isOnline;
};

export default useNetworkStatus;
