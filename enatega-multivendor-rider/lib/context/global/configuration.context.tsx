"use client";

// Core
import React, { useEffect, useState } from "react";

// Interfaces§
import {
  IConfiguration,
  IConfigurationProviderProps,
} from "@/lib/utils/interfaces";

// API
import { GET_CONFIGURATION } from "@/lib/api/graphql";

// Hooks
import { useQuery } from "@apollo/client";
import { useContext } from "react";
import { AuthContext } from "@/lib/context/global/auth.context";
import { useRiderMode } from "@/lib/context/global/rider-mode.context";
import { RIDER_SERVER_MODES } from "@/lib/mode/rider-mode";

export const ConfigurationContext = React.createContext<
  IConfiguration | undefined
>({
  _id: "",
  riderAppSentryUrl: "",
  currency: "",
  currencySymbol: "",
});

export const ConfigurationProvider: React.FC<IConfigurationProviderProps> = ({
  children,
}) => {
  const { isAuthReady, token } = useContext(AuthContext);
  const { mode } = useRiderMode();
  const requiresAuthentication = mode === RIDER_SERVER_MODES.SINGLE;
  const [configuration, setConfiguration] = useState<
    IConfiguration | undefined
  >();
  // API

  // Fetch configuration immediately with useQuery (the previous lazy query +
  // 300 ms debounce delayed the first render — currency symbol showed blank).
  const { loading, error, data } = useQuery<{ configuration: IConfiguration }>(
    GET_CONFIGURATION,
    {
      skip: !isAuthReady || (requiresAuthentication && !token),
    },
  );

  // Use Effect
  useEffect(() => {
    try {
      const nextConfiguration: IConfiguration | undefined =
        loading || error || !data
          ? {
              _id: "",
              riderAppSentryUrl: "",
              currency: "",
              currencySymbol: "",
            }
          : data?.configuration;

      setConfiguration(nextConfiguration);
    } catch (err) {
      if (__DEV__) {
        console.log("Configuration error: ", err);
      }
      setConfiguration(undefined);
    }
  }, [loading, error, data]);

  return (
    <ConfigurationContext.Provider value={configuration}>
      {children}
    </ConfigurationContext.Provider>
  );
};
