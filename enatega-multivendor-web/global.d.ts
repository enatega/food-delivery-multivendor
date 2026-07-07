export {};

declare global {
  interface Window {
    emailjs: any;
    __TENANT_BRANDING__?: {
      business_name?: string;
      config?: Record<string, string>;
      zone_center?: { lat: number; lng: number; title: string } | null;
      [key: string]: unknown;
    };
  }
}
