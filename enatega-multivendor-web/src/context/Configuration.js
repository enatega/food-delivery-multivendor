

// Core
import React, { useEffect, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { getConfiguration } from "../apollo/server";

// API

const GETCONFIGURATION = gql`
  ${getConfiguration}
`;

const ConfigurationContext = React.createContext({});

export const ConfigurationProvider = ({ children }) => {
  const [configuration, setConfiguration] = useState({});
  // API
  const [fetchConfiguration, res] = useLazyQuery(GETCONFIGURATION);

  // Handlers
  const onFetchConfiguration = async () => {
    const { loading, error, data } = await fetchConfiguration();

    let configuration =
      loading || error || !data.configuration ? {} : data.configuration;

    setConfiguration(configuration);
  };

  // Use Effect
  useEffect(() => {
    onFetchConfiguration();
    // eslint-disable-next-line
  }, [res.data]);


  return (
    <ConfigurationContext.Provider value={configuration}>
      {children}
    </ConfigurationContext.Provider>
  );
};
export const ConfigurationConsumer = ConfigurationContext.Consumer;
export default ConfigurationContext;
