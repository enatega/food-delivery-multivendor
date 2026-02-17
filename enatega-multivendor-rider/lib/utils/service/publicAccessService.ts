import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { METRICS_GENERAL } from "@/lib/apollo/mutations/metrics";
import {
  getOrCreateNonce,
  savePublicToken,
  getPublicToken,
  isTokenExpired,
} from "../publicAccessToken";

let tokenRefreshPromise: Promise<string> | null = null;

/**
 * Fetch a new public access token from metricsGeneral
 */
export const fetchPublicAccessToken = async (
  graphqlUrl: string
): Promise<string> => {
  // Prevent multiple simultaneous requests
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }

  tokenRefreshPromise = (async () => {
    try {
      const nonce = await getOrCreateNonce();

      // IMPORTANT: Use the exact same headers as in apollo/index.ts
      const platform = Platform.OS;
      const locale = (await AsyncStorage.getItem("lang")) || "en";

      // Create a temporary Apollo client for this request
      const client = new ApolloClient({
        link: createHttpLink({
          uri: graphqlUrl,
          headers: {
            "user-agent": `Yalla-Rider-App/${platform}`,
            "accept-language": locale,
            "x-platform": platform,
            nonce: nonce,
          },
        }),
        cache: new InMemoryCache(),
      });

      // Call metricsGeneral mutation
      const { data } = await client.mutate({
        mutation: METRICS_GENERAL,
      });

      console.log("📦 metricsGeneral response received:", !!data);

      if (!data?.metricsGeneral) {
        console.error("❌ No data returned from metricsGeneral");
        console.error("Response:", JSON.stringify(data));
        throw new Error("No data returned from metricsGeneral");
      }

      // Extract token and expiry from response
      const token = data.metricsGeneral.experience;
      const expiry = data.metricsGeneral.hehe;

      // Save to AsyncStorage
      await savePublicToken(token, expiry);

      console.log("✅ Public access token refreshed successfully");
      console.log("📝 Token expiry:", expiry);
      console.log("🔑 Nonce used:", nonce);

      return token;
    } catch (error: any) {
      console.error("❌ Failed to fetch public access token:");
      console.error("Error name:", error?.name);
      console.error("Error message:", error?.message);
      console.error("Network error:", error?.networkError?.message);
      console.error("GraphQL errors:", error?.graphQLErrors?.map((e: any) => e.message));
      throw error;
    } finally {
      tokenRefreshPromise = null;
    }
  })();

  return tokenRefreshPromise;
};

/**
 * Get a valid public token (refresh if expired)
 */
export const getValidPublicToken = async (
  graphqlUrl: string
): Promise<string | null> => {
  const expired = await isTokenExpired();

  if (expired) {
    console.log("🔄 Token expired, fetching new token...");
    try {
      return await fetchPublicAccessToken(graphqlUrl);
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  }

  return await getPublicToken();
};