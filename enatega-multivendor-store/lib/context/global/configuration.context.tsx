"use client";

// Core
import { createContext, useCallback, useEffect, useState } from "react";

// Interfaces§
import {
  IConfiguration,
  IConfigurationProviderProps,
  ILazyQueryResult,
} from "@/lib/utils/interfaces";

// API
import { GET_CONFIGURATION } from "@/lib/api/graphql";

// Hooks
import { useLazyQueryQL } from "@/lib/hooks/useLazyQueryQL";

export const ConfigurationContext = createContext<IConfiguration | undefined>({
  _id: "",
  currency: "",
  currencySymbol: "",
  restaurantAppSentryUrl: "",
});

export const ConfigurationProvider: React.FC<IConfigurationProviderProps> = ({
  children,
}) => {
  const [configuration, setConfiguration] = useState<
    IConfiguration | undefined
  >();

  // API
  const { fetch, loading, error, data } = useLazyQueryQL(GET_CONFIGURATION, {
    debounceMs: 300,
  }) as ILazyQueryResult<
    { configuration: IConfiguration } | undefined,
    undefined
  >;

  // Handlers
  const onFetchConfiguration = () => {
    const configuration: IConfiguration | undefined =
      loading || error || !data
        ? {
            _id: "",
            restaurantAppSentryUrl: "",
            currency: "",
            currencySymbol: "",
          }
        : data?.configuration;

    setConfiguration(configuration);
  };

  const fetchConfiguration = useCallback(() => {
    fetch();
  }, [fetch]);

  // Use Effect
  useEffect(() => {
    fetchConfiguration();
  }, []);

  useEffect(() => {
    onFetchConfiguration();
  }, [data]);

  return (
    <ConfigurationContext.Provider value={configuration}>
      {children}
    </ConfigurationContext.Provider>
  );
};
