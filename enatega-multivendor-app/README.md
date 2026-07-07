# Enatega Customer App

## Requirements

- Node `v20.16.0`
- npm
- Xcode for iOS or Android Studio for Android

## Development

```bash
nvm use
npm install
npm run ios
```

Or:

```bash
npm run android
```

## Important

- This is not an Expo Go project
- It uses native modules including `expo-dev-client` and `react-native-maps`
- Run it with a custom dev build on a simulator or emulator

## Production

Use the existing EAS build scripts:

```bash
nvm use
npm install
npm run build:production
```

Platform-specific builds:

```bash
npm run build:production:ios
npm run build:production:android
```

## Endpoint setup

The app currently uses the committed environment config in `environment.config.js`.
That file still controls whether local development targets the hosted API or a local backend.

## Notes

- Expo SDK: `53`
- If sourcemap upload is needed in CI, provide Sentry credentials through environment variables instead of committing tokens
