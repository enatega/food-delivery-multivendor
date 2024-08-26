import { getConfigurationSpecific } from "../apollo/server";
import { BACKEND_URLS } from "./constantValues";


export const fetchConfiguration = async () => {
  try {
    const response = await fetch(`${BACKEND_URLS.LIVE.SERVER_URL}graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

export const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

