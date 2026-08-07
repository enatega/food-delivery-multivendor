import "react-native-get-random-values";

import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const METRICS_GENERAL = gql`
  mutation MetricsGeneral {
    metricsGeneral {
      excellence
      topgun
      experience
      skydiver
      rider
      haha
      hehe
      huhu
      yoyo
      turu
    }
  }
`;

// Obfuscated storage keys
const KEYS = {
  TOKEN: "usr_prf_cache",
  NONCE: "dev_meta_id",
  EXPIRY: "sess_ttl_ts",
};

export const STORE_PUBLIC_ACCESS_USER_AGENT = `Enatega-Store-App/${Platform.OS}`;

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
      await SecureStore.setItemAsync(this.key(KEYS.NONCE), this.nonce);
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

  private scheduleRefresh(
    apolloClient: ApolloClient<NormalizedCacheObject>,
  ): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (!this.expiry) return;

    const timeUntilExpiry = this.expiry - Date.now();
    const refreshTime = Math.max(timeUntilExpiry - 30000, 1000);
    const generation = this.scopeGeneration;
    const scope = this.scope;

    this.refreshTimer = setTimeout(async () => {
      if (generation !== this.scopeGeneration || scope !== this.scope) return;
      await this.refreshToken(apolloClient);
    }, refreshTime);
  }

  private async generateNonce(): Promise<string> {
    const deviceId = Device.osBuildId || Device.osInternalBuildId || "";
    const random = Array.from(
      crypto.getRandomValues(new Uint8Array(16)),
      (byte) => byte.toString(16).padStart(2, "0"),
    ).join("");
    const timestamp = Date.now().toString(36);
    return `${deviceId}-${timestamp}-${random}`;
  }

  private async loadFromStorage(scope: string): Promise<{
    nonce: string | null;
    token: string | null;
    expiry: number | null;
  }> {
    try {
      const [nonce, token, expiryStr] = await Promise.all([
        SecureStore.getItemAsync(this.scopedKey(KEYS.NONCE, scope)),
        SecureStore.getItemAsync(this.scopedKey(KEYS.TOKEN, scope)),
        SecureStore.getItemAsync(this.scopedKey(KEYS.EXPIRY, scope)),
      ]);
      return {
        nonce,
        token,
        expiry: expiryStr ? parseInt(expiryStr, 10) : null,
      };
    } catch {
      return { nonce: null, token: null, expiry: null };
    }
  }

  private isExpired(): boolean {
    if (!this.expiry) return true;
    return Date.now() >= this.expiry;
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
              "user-agent": STORE_PUBLIC_ACCESS_USER_AGENT,
              "x-skip-public-auth": "true",
            },
          },
          fetchPolicy: "no-cache",
        });

        if (
          data?.metricsGeneral &&
          generation === this.scopeGeneration &&
          scope === this.scope
        ) {
          const token = data.metricsGeneral.experience;
          if (typeof token !== "string") return;
          this.token = token;
          const expiryTime = new Date(data.metricsGeneral.hehe).getTime();
          this.expiry = expiryTime;

          await Promise.all([
            SecureStore.setItemAsync(this.scopedKey(KEYS.NONCE, scope), nonce),
            SecureStore.setItemAsync(this.scopedKey(KEYS.TOKEN, scope), token),
            SecureStore.setItemAsync(
              this.scopedKey(KEYS.EXPIRY, scope),
              expiryTime.toString(),
            ),
          ]);

          if (generation === this.scopeGeneration && scope === this.scope) {
            this.scheduleRefresh(apolloClient);
          }
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
    this.scopeGeneration += 1;
    this.refreshPromise = null;
    this.nonce = null;
    this.token = null;
    this.expiry = null;
    await Promise.all([
      SecureStore.deleteItemAsync(this.key(KEYS.NONCE)),
      SecureStore.deleteItemAsync(this.key(KEYS.TOKEN)),
      SecureStore.deleteItemAsync(this.key(KEYS.EXPIRY)),
    ]);
  }

  async reset(
    apolloClient: ApolloClient<NormalizedCacheObject>,
  ): Promise<void> {
    const scope = this.scope;
    await this.clearTokens();
    await this.initialize(apolloClient, scope);
  }
}

export default PublicAccessTokenService.getInstance();
