# Vendor mode deployment guide

Use this guide when preparing a client deployment of the customer, rider,
store, or web app.

## 1. Choose the client's mode

| Client requirement | Configuration value | Result                                                                  |
| ------------------ | ------------------- | ----------------------------------------------------------------------- |
| Single vendor only | `SINGLE`            | App always uses the single-vendor backend; the mode selector is hidden. |
| Multivendor only   | `MULTI`             | App always uses the multivendor backend; the mode selector is hidden.   |
| Both modes         | `TOGGLE`            | User can switch between single-vendor and multivendor modes.            |

If the variable is missing or invalid, the apps default to `TOGGLE`.

## 2. Configure the Expo apps

This applies to:

- `enatega-multivendor-app` (customer)
- `enatega-multivendor-rider`
- `enatega-multivendor-store`

In the required profile inside each app's `eas.json`, add
`EXPO_PUBLIC_VENDOR_MODE` to `env`:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_VENDOR_MODE": "SINGLE"
      }
    }
  }
}
```

Replace `SINGLE` with `MULTI` or `TOGGLE` according to the client requirement.
For local development, set the same variable in that app's `.env` file:

```dotenv
EXPO_PUBLIC_VENDOR_MODE=SINGLE
```

## 3. Configure the web app

Set `NEXT_PUBLIC_VENDOR_MODE` in `enatega-multivendor-web/.env` or in the web
hosting provider's deployment environment:

```dotenv
NEXT_PUBLIC_VENDOR_MODE=SINGLE
```

Replace `SINGLE` with `MULTI` or `TOGGLE` as required.

For a toggleable web deployment, also set:

```dotenv
NEXT_PUBLIC_SINGLE_VENDOR_ENABLED=true
```

## 4. Configure single-vendor endpoints

Deployments using `SINGLE` or `TOGGLE` must retain the existing single-vendor
GraphQL, WebSocket, and REST endpoint variables for the relevant app. A
`MULTI`-only deployment does not use these endpoints.

## 5. Build and verify

These are build-time variables. After changing a mode:

1. Rebuild the customer, rider, and store apps with the intended EAS profile.
2. Rebuild and redeploy the web app.
3. Confirm that `SINGLE` and `MULTI` builds do not display a selector.
4. Confirm that a `TOGGLE` build displays both options and can switch backend.
5. Test login, loading data, and placing/receiving an order against the selected
   backend before delivering the build.

The forced setting overrides any mode previously saved on the device or in the
browser, so existing installations follow the mode selected for the new build.
