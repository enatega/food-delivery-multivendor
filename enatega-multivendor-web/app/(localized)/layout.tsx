"use client";

// Core
import { ApolloProvider } from "@apollo/client";

// Prime React
import { PrimeReactProvider } from "primereact/api";

// Context
import { ToastProvider } from "@/lib/context/global/toast.context";

// Configuration
// import { FontawesomeConfig } from '@/lib/config';

// Styles
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./global.css";

// Apollo
import AuthProvider from "@/lib/context/auth/auth.context";
import { ConfigurationProvider } from "@/lib/context/configuration/configuration.context";
import { useSetupApollo } from "@/lib/hooks/useSetApollo";
import { UserProvider } from "@/lib/context/User/User.context";
// Layout
import AppLayout from "@/lib/ui/layouts/global";
import { FontawesomeConfig } from "@/lib/config";
import { LocationProvider } from "@/lib/context/Location/Location.context";
import { UserAddressProvider } from "@/lib/context/address/address.context";
import { SearchUIProvider } from "@/lib/context/search/search.context";
import NotificationInitializer from "../NotificationInitialzer";
import FirebaseForegroundHandler from "@/lib/config/FirebaseForegroundHandler";
import { useEffect,useRef } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Apollo
  const client = useSetupApollo();

  // Constants
  const value = {
    ripple: true,
  };

  //  useEffect(()=>{
  //  if ("serviceWorker" in navigator) {
  //   window.addEventListener("load", () => {
  //     navigator.serviceWorker
  //       .register("/sw.js")
  //       .then((registration) => {
  //         console.log("Service Worker registered with scope:", registration.scope);
  //       })
  //       .catch((error) => {
  //         console.error("Service Worker registration failed:", error);
  //       });
  //   });
  // }
  //  },[])
   
  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     navigator.serviceWorker
  //       .getRegistration("/sw.js")
  //       .then((existingReg) => {
  //         if (!existingReg) {
  //           navigator.serviceWorker
  //             .register("/sw.js")
  //             .then((registration) => {
  //               console.log("✅ SW registered with scope:", registration.scope);
  //             })
  //             .catch((error) => {
  //               console.error("❌ SW registration failed:", error);
  //             });
  //         } else {
  //           console.log("ℹ️ SW already registered:", existingReg.scope);
  //         }
  //       });
  //   }
  // }, []); // ✅ Runs only once on mount

  const hasRegistered = useRef(false); // ✅ Persist across renders
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        if (hasRegistered.current) return; // ✅ Prevent duplicate registration
        hasRegistered.current = true;

        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("✅ Service Worker registered:", registration.scope);
            return registration.update()
          })
          .catch((error) => {
            console.error("❌ SW registration failed:", error);
          });
      });
    }
  }, []);

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.register('/sw.js')
  //     .then((registration) => {
  //       console.log('SW registered successfully');
  //       return registration.update(); // Force check for updates
  //     })
  //     .catch((error) => {
  //       console.log('SW registration failed ',error);
  //     });
  // }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <FontawesomeConfig />
      </head>
      <body className={"flex flex-col flex-wrap"}>
        <PrimeReactProvider value={value}>
          <ApolloProvider client={client}>
            <ConfigurationProvider>
              <ToastProvider>
                <AuthProvider>
                  <UserProvider>
                    <LocationProvider>
                      <UserAddressProvider>
                        <SearchUIProvider>
                          <AppLayout>
                            <NotificationInitializer/>
                            <FirebaseForegroundHandler/>
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
      </body>
    </html>
  );
}
