import { getConfigurationSpecific } from "../apollo/server";
import { SERVER_URL } from "./global";

export const fetchConfiguration = async () => {
  try {
    const response = await fetch(`${SERVER_URL}graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any necessary authentication headers here
      },
      body: JSON.stringify({
        query: getConfigurationSpecific,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      return result.data?.configuration;
    } else {
      return {
        configuration: {
          webAmplitudeApiKey: "",
        },
      };
    }
  } catch (err) {
    return {
      configuration: {
        webAmplitudeApiKey: "",
      },
    };
  }
};
