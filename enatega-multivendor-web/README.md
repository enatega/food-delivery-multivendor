# Enatega Customer Web

## Requirements

- Node `v20.16.0`
- npm `>=10`

## Development

```bash
nvm use
npm install
cp .env.example .env.local
npm run dev
```

The app runs on `http://localhost:3000`.

## Production

```bash
nvm use
npm install
cp .env.example .env.local
npm run build
npm run start
```

The production server also uses port `3000` unless `PORT` is overridden.

## Backend selection

This module supports two setup styles:

- Local backend: keep `.env.local` pointed at `http://localhost:8001/`
- Hosted backend: replace the values in `.env.local` with a hosted `https://` API URL and matching `wss://` websocket URL

Examples already exist in `.env.stage` and `.env.prod`.

## Google setup

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is required for Google Maps in the browser
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is optional and only needed for Google login

## Notes

- Use `wss://` when the API is served over `https://`
