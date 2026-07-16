# Enatega Admin Dashboard

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

## Google Maps

- Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local` for the browser Google Maps SDK
- Reverse geocoding is proxied through the API at `/maps/reverse-geocode`
- Google OAuth client IDs still come from backend configuration

## Notes

- The committed `.env.example` is set up for the local API in this repo
- Use `wss://` when the API is served over `https://`
