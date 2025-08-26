import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    // `cypress/plugins/index.js` is required to load your plugins
  },
  retries: 3,
  video: false,
  videoCompression: 32,
  videosFolder: 'cypress/videos',
});
