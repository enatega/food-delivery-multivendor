import * as SecureStore from "expo-secure-store";
import * as Device from "expo-device";
import { gql } from "@apollo/client";

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

class PublicAccessTokenService {
  private static instance: PublicAccessTokenService;
  private nonce: string | null = null;
  private token: string | null = null;
  private expiry: number | null = null;
  private refreshPromise: Promise<void> | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): PublicAccessTokenService {
    if (!PublicAccessTokenService.instance) {
      PublicAccessTokenService.instance = new PublicAccessTokenService();
    }
    return PublicAccessTokenService.instance;
  }

  async initialize(apolloClient: any): Promise<void> {
    await this.loadFromStorage();
    
    if (!this.nonce) {
      this.nonce = await this.generateNonce();
      await SecureStore.setItemAsync(KEYS.NONCE, this.nonce);
    }

    if (!this.token || this.isExpired()) {
      await this.refreshToken(apolloClient);
    } else {
      this.scheduleRefresh(apolloClient);
    }
  }

  private scheduleRefresh(apolloClient: any): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (!this.expiry) return;

    const timeUntilExpiry = this.expiry - Date.now();
    const refreshTime = Math.max(timeUntilExpiry - 30000, 1000);

    this.refreshTimer = setTimeout(async () => {
      console.log("🔄 Auto-refreshing expired token...");
      await this.refreshToken(apolloClient);
      this.scheduleRefresh(apolloClient);
    }, refreshTime);
  }

  private async generateNonce(): Promise<string> {
    const deviceId = Device.osBuildId || Device.osInternalBuildId || "";
    const random = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now().toString(36);
    return `${deviceId}-${timestamp}-${random}`;
  }

  private async loadFromStorage(): Promise<void> {
    try {
      this.nonce = await SecureStore.getItemAsync(KEYS.NONCE);
      this.token = await SecureStore.getItemAsync(KEYS.TOKEN);
      const expiryStr = await SecureStore.getItemAsync(KEYS.EXPIRY);
      this.expiry = expiryStr ? parseInt(expiryStr, 10) : null;
    } catch (error) {
      console.error("Failed to load from storage:", error);
    }
  }

  private isExpired(): boolean {
    if (!this.expiry) return true;
    return Date.now() >= this.expiry;
  }

  async refreshToken(apolloClient: any): Promise<void> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        console.log("📡 Calling metricsGeneral API...");
        const { data } = await apolloClient.mutate({
          mutation: METRICS_GENERAL,
          context: {
            headers: {
              nonce: this.nonce,
              "x-platform": "mobile",
              "x-skip-public-auth": "true",
            },
          },
          fetchPolicy: "no-cache",
        });

        if (data?.metricsGeneral) {
          this.token = data.metricsGeneral.experience;
          const expiryTime = new Date(data.metricsGeneral.hehe).getTime();
          this.expiry = expiryTime;

          await SecureStore.setItemAsync(KEYS.TOKEN, this.token);
          await SecureStore.setItemAsync(KEYS.EXPIRY, expiryTime.toString());
          
          console.log("✅ Token refreshed, expires at:", new Date(expiryTime).toISOString());
          this.scheduleRefresh(apolloClient);
        }
      } catch (error) {
        console.error("❌ Failed to refresh token:", error);
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async getToken(apolloClient: any): Promise<string | null> {
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
    this.token = null;
    this.expiry = null;
    await SecureStore.deleteItemAsync(KEYS.TOKEN);
    await SecureStore.deleteItemAsync(KEYS.EXPIRY);
  }
}

export default PublicAccessTokenService.getInstance();