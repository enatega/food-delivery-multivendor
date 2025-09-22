// /// <reference lib="webworker" />

// import { precacheAndRoute } from 'workbox-precaching';
// import { registerRoute } from 'workbox-routing';
// import { NetworkFirst,StaleWhileRevalidate  } from 'workbox-strategies';
// import { BackgroundSyncPlugin } from 'workbox-background-sync';
// import { ExpirationPlugin } from 'workbox-expiration';

// /* eslint-env serviceworker */
// declare const self: ServiceWorkerGlobalScope;

// // 👇 Injected by Workbox at build time
// precacheAndRoute(self.__WB_MANIFEST);

// // ✅ Background Sync Plugin for GraphQL mutations
// const bgSyncPlugin = new BackgroundSyncPlugin('graphql-mutations-queue', {
//   maxRetentionTime: 24 * 60, // Retry for max of 24 Hours
// });


// // ✅ Cache GraphQL Queries
// registerRoute(
//   ({ url, request }) =>
//     url.pathname.includes('/graphql') && request.method === 'GET',
//   new NetworkFirst({
//     cacheName: 'graphql-cache',
//     networkTimeoutSeconds: 3,
//     plugins: [
//       new ExpirationPlugin({
//         maxEntries: 50,
//         maxAgeSeconds: 60 * 60, // 1 hour
//       }),
//     ],
//   }),
// );

// // ✅ Background Sync for Mutations (usually the same POST path)
// registerRoute(
//   ({ url, request }) =>
//     url.pathname.startsWith('/graphql') && request.method === 'POST',
//   new NetworkFirst({
//     plugins: [bgSyncPlugin],
//   }),
//   'POST'
// );


// registerRoute(
//     ({ request }) => request.method === 'GET' && (
//       request.destination === 'script' ||
//       request.destination === 'style' ||
//       request.destination === 'image' ||
//       request.destination === 'document' // HTML pages
//     ),
//     new StaleWhileRevalidate({
//       cacheName: 'static-resources',
//       plugins: [
//         new ExpirationPlugin({
//           maxEntries: 60,
//           maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
//         }),
//       ],
//     })
//   );

//   self.addEventListener('install', (event) => {
//     console.log('[Service Worker] Installed');
//     self.skipWaiting();
//   });
  
//   self.addEventListener('activate', (event) => {
//     console.log('[Service Worker] Activated');
//   });
  
  