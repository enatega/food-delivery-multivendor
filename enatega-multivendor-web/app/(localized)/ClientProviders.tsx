"use client";

import { ApolloProvider } from "@apollo/client";
import { PrimeReactProvider } from "primereact/api";
import { useEffect, useMemo, useRef } from "react";

import { ToastProvider } from "@/lib/context/global/toast.context";
import AuthProvider from "@/lib/context/auth/auth.context";
import { ConfigurationProvider } from "@/lib/context/configuration/configuration.context";
import { useSetupApollo } from "@/lib/hooks/useSetApollo";
import { UserProvider } from "@/lib/context/User/User.context";
import AppLayout from "@/lib/ui/layouts/global";
import { LocationProvider } from "@/lib/context/Location/Location.context";
import { UserAddressProvider } from "@/lib/context/address/address.context";
import { SearchUIProvider } from "@/lib/context/search/search.context";
import NotificationInitializer from "../NotificationInitialzer";
import FirebaseForegroundHandler from "@/lib/config/FirebaseForegroundHandler";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = useSetupApollo();
  const hasRegistered = useRef(false);
  const primeReactConfig = useMemo(() => ({ ripple: true }), []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const registerServiceWorker = () => {
      if (hasRegistered.current) return;
      hasRegistered.current = true;

      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => registration.update())
        .catch((error) => {
          console.error("Service worker registration failed:", error);
        });
    };

    window.addEventListener("load", registerServiceWorker, { once: true });

    return () => {
      window.removeEventListener("load", registerServiceWorker);
    };
  }, []);

  return (
    <PrimeReactProvider value={primeReactConfig}>
      <ApolloProvider client={client}>
        <ConfigurationProvider>
          <ToastProvider>
            <AuthProvider>
              <UserProvider>
                <LocationProvider>
                  <UserAddressProvider>
                    <SearchUIProvider>
                      <AppLayout>
                        <NotificationInitializer />
                        <FirebaseForegroundHandler />
                        {children}
                      </AppLayout>
                    </SearchUIProvider>
                  </UserAddressProvider>
                </LocationProvider>
              </UserProvider>
            </AuthProvider>
          </ToastProvider>
        </ConfigurationProvider>
      </ApolloProvider>
    </PrimeReactProvider>
  );
}
