import createNextIntlPlugin from "next-intl/plugin";
// import PWA from 'next-pwa';

/* const withPWA = PWA({
    skipWaiting: false,
    register:false,
    dest:'public',
    // disable: process.env.NODE_ENV === 'development',
    swSrc: 'public/serviceWorker.js', // Or service-worker.ts if using TS & custom build process
    buildExcludes: [
      /app-build-manifest\.json$/,
      /middleware-manifest\.json$/,     // (often fails too)
    ],
    scope: '/',
  }
);
 */

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 'upgrade-insecure-requests; media-src \'self\' https://*.amazonaws.com https://*.s3.amazonaws.com data: blob:'
          },
          // Optional: Add other security headers
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  images: {
    // domains: ["storage.googleapis.com"],
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      // Dummy
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      //////////
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "enatega.com",
      },
      {
        protocol: "https",
        hostname: "www.lifcobooks.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        hostname: "example.com",
        protocol: "https",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "t4.ftcdn.net",
      },
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol:'https',
        hostname:"images.deliveryhero.io"
      },
       {
        protocol: 'https',
        hostname: 'enatega-backend.s3.eu-north-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
    ], // Add placehold.co as an allowed domain
  },
};
// export default withPWA(withNextIntl(nextConfig));
export default withNextIntl(nextConfig);