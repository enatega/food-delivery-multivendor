import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
const production = process.env.NODE_ENV === 'production';

if (production) {
  const httpUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const wsUrl = process.env.NEXT_PUBLIC_WS_SERVER_URL;
  if (!httpUrl?.startsWith('https://') || !wsUrl?.startsWith('wss://')) {
    throw new Error('Production requires HTTPS NEXT_PUBLIC_SERVER_URL and WSS NEXT_PUBLIC_WS_SERVER_URL.');
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: false,
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.enatega.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'enatega-backend.s3.eu-north-1.amazonaws.com' },
      { protocol: 'https', hostname: '*.s3.*.amazonaws.com' },
    ],
  },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(self)' },
        { key: 'X-Frame-Options', value: 'DENY' },
      ],
    }];
  },
  compiler: {
    removeConsole: production ? { exclude: ['error'] } : false,
  },
};

export default withNextIntl(nextConfig);
