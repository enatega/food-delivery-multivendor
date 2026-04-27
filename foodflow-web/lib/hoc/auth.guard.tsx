"use client";
// Core
import { useLayoutEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Methods
import { onUseLocalStorage } from "../utils/methods/local-storage";

const AuthGuard = <T extends object>(Component: React.ComponentType<T>) => {
  const WrappedComponent = (props: T) => {
    const [isNavigating, setIsNavigating] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const onHandleUserAuthenticate = () => {
      try {
        const authToken = onUseLocalStorage("get", "token");

        if (!authToken) {
          const previousUrl = document.referrer;
          const isSameOrigin = previousUrl.startsWith(window.location.origin);
          const previousPath =
            isSameOrigin ? new URL(previousUrl).pathname : null;

          if (previousPath && previousPath !== pathname) {
            setIsNavigating(false);
            router.back();
          } else {
            setIsNavigating(false);
            router.push("/");
          }
        }
        setIsNavigating(false);
      } catch (err) {
        console.log(err);
        setIsNavigating(false);
        router.replace("/");
      }
    };

    useLayoutEffect(() => {
      // Check if logged in
      onHandleUserAuthenticate();
    }, []);

    return isNavigating ? <></> : <Component {...props} />;
  };

  return WrappedComponent;
};

export default AuthGuard;
