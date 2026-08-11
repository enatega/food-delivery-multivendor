# Enatega Single-Vendor Client Release

This branch contains the client applications for an Enatega single-vendor
deployment. Backend services are configured separately and are not included in
this repository.

## Included applications

- `enatega-singlevendor-app` — customer mobile app
- `enatega-singlevendor-store` — store mobile app
- `enatega-singlevendor-rider` — rider mobile app
- `enatega-singlevendor-admin` — administration dashboard

Shared root assets and supporting libraries are retained for the applications
that consume them.

## Mobile mode configuration

The customer, store, and rider apps use this public Expo setting:

```env
EXPO_PUBLIC_DEFAULT_SINGLE_VENDOR=true
```

The setting is `true` in every EAS development, staging, and production
profile. If the variable is missing, the apps also default to locked
single-vendor mode.

Locked mode:

- starts directly in single-vendor mode;
- hides all single/multivendor selectors;
- ignores a previously persisted multivendor selection;
- prevents programmatic switching to the multivendor backend; and
- keeps authentication, notifications, navigation, and rider tracking scoped
  to the single-vendor backend.

To restore the original combined behavior for local development, explicitly
set:

```env
EXPO_PUBLIC_DEFAULT_SINGLE_VENDOR=false
```

Multivendor code paths and credentials remain available when the flag is
disabled.

## Setup

Use a supported Node.js LTS release and install dependencies separately in each
application.

### Customer app

```bash
cd enatega-singlevendor-app
cp .env.example .env
npm install
npm start
```

### Store app

```bash
cd enatega-singlevendor-store
cp .env.example .env
npm install
npm start
```

### Rider app

```bash
cd enatega-singlevendor-rider
cp .env.example .env
npm install
npm start
```

### Admin dashboard

```bash
cd enatega-singlevendor-admin
npm install
npm run dev
```

Before running or building a mobile app, replace the placeholder single-vendor
HTTP and WebSocket endpoints in its `.env` file. Native bundle identifiers,
application IDs, EAS project IDs, signing files, and product names are unchanged
in this release.

## Production checks

Run the checks provided by each application before producing a release build.
At minimum, validate the single-vendor GraphQL documents for the customer,
store, and rider apps and run a production build of the admin dashboard.

## License and security

See [LICENSE](LICENSE), [SECURITY.md](SECURITY.md),
[CONTRIBUTING.md](CONTRIBUTING.md), and
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
