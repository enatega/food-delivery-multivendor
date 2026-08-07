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

export const RIDER_PUBLIC_ACCESS_USER_AGENT = `Enatega-Rider-App/${Platform.OS}`;

class PublicAccessTokenService {
  private static instance: PublicAccessTokenService;
  private nonce: string | null = null;
  private token: string | null = null;
  private expiry: number | null = null;
  private refreshPromise: Promise<void> | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private scope = "legacy";
  private scopeGeneration = 0;

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
    scope: string,
  ): Promise<void> {
    if (this.scope !== scope) {
      this.pause();
      this.scopeGeneration += 1;
      this.refreshPromise = null;
      this.nonce = null;
      this.token = null;
      this.expiry = null;
      this.scope = scope;
    }
    const generation = this.scopeGeneration;
    const stored = await this.loadFromStorage(scope);
    if (generation !== this.scopeGeneration || scope !== this.scope) return;
    this.nonce = stored.nonce;
    this.token = stored.token;
    this.expiry = stored.expiry;

    if (!this.nonce) {
      this.nonce = await this.generateNonce();
      await setSecureItem(this.key(PUBLIC_ACCESS_NONCE), this.nonce);
    }

    if (!this.token || this.isExpired()) {
      await this.refreshToken(apolloClient);
    } else {
      this.scheduleRefresh(apolloClient);
    }
  }

  private key(base: string): string {
    return this.scopedKey(base, this.scope);
  }

  private scopedKey(base: string, scope: string): string {
    const safeScope = scope.replace(/[^A-Za-z0-9._-]/g, "_");
    return `${base}.${safeScope}`;
  }

  private async loadFromStorage(scope: string): Promise<{
    nonce: string | null;
    token: string | null;
    expiry: number | null;
  }> {
    try {
      const [nonce, token, expiry] = await Promise.all([
        getSecureItem(this.scopedKey(PUBLIC_ACCESS_NONCE, scope)),
        getSecureItem(this.scopedKey(PUBLIC_ACCESS_TOKEN, scope)),
        getSecureItem(this.scopedKey(PUBLIC_ACCESS_EXPIRY, scope)),
      ]);

      return {
        nonce,
        token,
        expiry: expiry ? parseInt(expiry, 10) : null,
      };
    } catch {
      return { nonce: null, token: null, expiry: null };
    }
  }

  private async generateNonce(): Promise<string> {
    const deviceId = Device.osBuildId || Device.osInternalBuildId || "unknown";
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    const random = Array.from(bytes, (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
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
    const generation = this.scopeGeneration;
    const scope = this.scope;

    this.refreshTimer = setTimeout(async () => {
      if (generation !== this.scopeGeneration || scope !== this.scope) return;
      await this.refreshToken(apolloClient);
    }, refreshTime);
  }

  async refreshToken(
    apolloClient: ApolloClient<NormalizedCacheObject>,
  ): Promise<void> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const generation = this.scopeGeneration;
    const scope = this.scope;
    const refreshPromise = (async () => {
      const nonce = this.nonce ?? (await this.generateNonce());
      if (generation !== this.scopeGeneration || scope !== this.scope) return;
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
              "user-agent": RIDER_PUBLIC_ACCESS_USER_AGENT,
              "x-skip-public-auth": "true",
            },
          },
          fetchPolicy: "no-cache",
        });

        if (!data?.metricsGeneral?.experience || !data?.metricsGeneral?.hehe) {
          throw new Error("No data returned from metricsGeneral");
        }

        if (generation !== this.scopeGeneration || scope !== this.scope) return;

        const token = data.metricsGeneral.experience as string;
        this.token = token;
        this.expiry = new Date(data.metricsGeneral.hehe).getTime();

        await Promise.all([
          setSecureItem(this.scopedKey(PUBLIC_ACCESS_NONCE, scope), nonce),
          setSecureItem(this.scopedKey(PUBLIC_ACCESS_TOKEN, scope), token),
          setSecureItem(
            this.scopedKey(PUBLIC_ACCESS_EXPIRY, scope),
            this.expiry.toString(),
          ),
        ]);

        if (generation === this.scopeGeneration && scope === this.scope) {
          this.scheduleRefresh(apolloClient);
        }
      } finally {
        if (this.refreshPromise === refreshPromise) {
          this.refreshPromise = null;
        }
      }
    })();

    this.refreshPromise = refreshPromise;
    return refreshPromise;
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

  pause(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  async clearTokens(): Promise<void> {
    this.pause();

    this.nonce = null;
    this.token = null;
    this.expiry = null;

    await Promise.all([
      removeSecureItem(this.key(PUBLIC_ACCESS_NONCE)),
      removeSecureItem(this.key(PUBLIC_ACCESS_TOKEN)),
      removeSecureItem(this.key(PUBLIC_ACCESS_EXPIRY)),
    ]);
  }
}

export default PublicAccessTokenService.getInstance();
