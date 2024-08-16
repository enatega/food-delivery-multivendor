import { ApolloProvider } from "@apollo/client";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom";
import setupAplloClient from "./apollo/index";
import App from "./App";
import   {
  ConfigurationProvider,
} from "./context/Configuration";
import { LocationProvider } from "./context/Location";
import { UserProvider } from "./context/User";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import theme from "./utils/theme";


function Main() {
 

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
