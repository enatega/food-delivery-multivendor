import { ApolloProvider } from "@apollo/client";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import setupAplloClient from "./apollo/index";
import App from "./App";
import { ConfigurationProvider } from "./context/Configuration";
import { LocationProvider } from "./context/Location";
import { UserProvider } from "./context/User";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import theme from "./utils/theme";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import ConfigurableValues from "./config/constants";

function Main() {
  const { SENTRY_DSN } = ConfigurableValues();

  useEffect(() => {
    if (SENTRY_DSN) {
      Sentry.init({
        dsn: SENTRY_DSN,
        integrations: [new Integrations.BrowserTracing()],
        debug: true,
        tracesSampleRate: 0.1,
      });
    }
  }, [SENTRY_DSN]);

  const client = setupAplloClient();
  return (
    <ApolloProvider client={client}>
      <ConfigurationProvider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <UserProvider>
              <LocationProvider>
                <App />
              </LocationProvider>
            </UserProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </ConfigurationProvider>
    </ApolloProvider>
  );
}
ReactDOM.render(<Main />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
