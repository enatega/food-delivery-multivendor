import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getSecureItem,
  removeSecureItem,
  setSecureItem,
} from "@/lib/services/secure-storage";
import {
  PUBLIC_ACCESS_EXPIRY,
  PUBLIC_ACCESS_NONCE,
  PUBLIC_ACCESS_TOKEN,
} from "@/lib/utils/constants";

const METRICS_GENERAL = gql`
  mutation MetricsGeneral {
    metricsGeneral {
      experience
      hehe
    }
  }
`;

class PublicAccessTokenService {
  private static instance: PublicAccessTokenService;
  private nonce: string | null = null;
  private token: string | null = null;
  private expiry: number | null = null;
  private refreshPromise: Promise<void> | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

  private constructor() {}

  private static readonly REFRESH_BUFFER_MS = 30000;

  static getInstance(): PublicAccessTokenService {
    if (!PublicAccessTokenService.instance) {
      PublicAccessTokenService.instance = new PublicAccessTokenService();
    }
    return PublicAccessTokenService.instance;
  }

  async initialize(
    apolloClient: ApolloClient<NormalizedCacheObject>,
  ): Promise<void> {
    await this.loadFromStorage();

    if (!this.nonce) {
      this.nonce = await this.generateNonce();
      await setSecureItem(PUBLIC_ACCESS_NONCE, this.nonce);
    }

    if (!this.token || this.isExpired()) {
      await this.refreshToken(apolloClient);
    } else {
      this.scheduleRefresh(apolloClient);
    }
  }

  private async loadFromStorage(): Promise<void> {
    try {
      const [nonce, token, expiry] = await Promise.all([
        getSecureItem(PUBLIC_ACCESS_NONCE),
        getSecureItem(PUBLIC_ACCESS_TOKEN),
        getSecureItem(PUBLIC_ACCESS_EXPIRY),
      ]);

      this.nonce = nonce;
      this.token = token;
      this.expiry = expiry ? parseInt(expiry, 10) : null;
    } catch {
      this.nonce = null;
      this.token = null;
      this.expiry = null;
    }
  }

  private async generateNonce(): Promise<string> {
    const deviceId = Device.osBuildId || Device.osInternalBuildId || "unknown";
    const random = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now().toString(36);
    return `${deviceId}-${timestamp}-${random}`;
  }

  private isExpired(): boolean {
    if (!this.expiry) return true;
    return Date.now() >= this.expiry;
  }

  private scheduleRefresh(
    apolloClient: ApolloClient<NormalizedCacheObject>,
  ): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (!this.expiry) return;

    const timeUntilExpiry = this.expiry - Date.now();
    const refreshTime = Math.max(
      timeUntilExpiry - PublicAccessTokenService.REFRESH_BUFFER_MS,
      1000,
    );

    this.refreshTimer = setTimeout(async () => {
      await this.refreshToken(apolloClient);
      this.scheduleRefresh(apolloClient);
    }, refreshTime);
  }

  async refreshToken(
    apolloClient: ApolloClient<NormalizedCacheObject>,
  ): Promise<void> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const nonce = this.nonce ?? (await this.generateNonce());
      this.nonce = nonce;

      try {
        const locale = (await AsyncStorage.getItem("lang")) || "en";
        const { data } = await apolloClient.mutate({
          mutation: METRICS_GENERAL,
          context: {
            headers: {
              nonce,
              "x-platform": Platform.OS,
              "accept-language": locale,
              "user-agent": `Yalla-Rider-App/${Platform.OS}`,
              "x-skip-public-auth": "true",
            },
          },
          fetchPolicy: "no-cache",
        });

        if (!data?.metricsGeneral?.experience || !data?.metricsGeneral?.hehe) {
          throw new Error("No data returned from metricsGeneral");
        }

        this.token = data.metricsGeneral.experience;
        this.expiry = new Date(data.metricsGeneral.hehe).getTime();

        await Promise.all([
          setSecureItem(PUBLIC_ACCESS_NONCE, nonce),
          setSecureItem(PUBLIC_ACCESS_TOKEN, this.token),
          setSecureItem(PUBLIC_ACCESS_EXPIRY, this.expiry.toString()),
        ]);

        this.scheduleRefresh(apolloClient);
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async getToken(
    apolloClient: ApolloClient<NormalizedCacheObject>,
  ): Promise<string | null> {
    if (!this.token || this.isExpired()) {
      await this.refreshToken(apolloClient);
    }

    return this.token;
  }

  getNonce(): string | null {
    return this.nonce;
  }

  async clearTokens(): Promise<void> {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    this.nonce = null;
    this.token = null;
    this.expiry = null;

    await Promise.all([
      removeSecureItem(PUBLIC_ACCESS_NONCE),
      removeSecureItem(PUBLIC_ACCESS_TOKEN),
      removeSecureItem(PUBLIC_ACCESS_EXPIRY),
    ]);
  }
}

export default PublicAccessTokenService.getInstance();
