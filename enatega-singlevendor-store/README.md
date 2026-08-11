# Enatega Store App

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
- It uses `expo-dev-client`, so use a custom dev build on a simulator or emulator

## Production

This app does not currently expose dedicated `build:production` npm scripts.
Use EAS directly:

```bash
nvm use
npm install
eas build --profile production -p all
```

Platform-specific builds:

```bash
eas build --profile production -p ios
eas build --profile production -p android
```

## Endpoint setup

This app currently uses the committed values in `environment.ts`.
Those defaults were left unchanged here to avoid switching local setup between hosted and local backends without confirmation.

## Notes

- Expo SDK: `54`
- If you need Sentry sourcemap uploads in EAS, set `SENTRY_AUTH_TOKEN` as an EAS secret or environment variable, not in `eas.json`
