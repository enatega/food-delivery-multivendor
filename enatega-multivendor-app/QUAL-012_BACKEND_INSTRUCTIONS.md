# QUAL-012 — `freeDelivery` / `acceptVouchers` filters

## What was wrong

On the customer app's restaurant list (Menu screen), the **Offers → "Free Delivery"**
and **"Accept Vouchers"** filters always cleared the list.

Root cause is **backend data, not the app**:

- The app query already requests the fields
  (`src/apollo/queries.js` → `restaurantListPreview` → `nearByRestaurantsPreview.restaurants`
  selects `freeDelivery` and `acceptVouchers`).
- The filter reads them correctly (`src/screens/Menu/Menu.js` → `item?.freeDelivery`, `item?.acceptVouchers`).
- But the backend returns these as `false` / `null` for **every** restaurant — the admin
  panel has **no** UI or mutation to set them, so no restaurant is ever flagged. Filtering
  by a flag no restaurant has ⇒ empty list.

## What was fixed in the app (already done)

`src/screens/Menu/Menu.js` now builds the Offers filter options **from the data**: the
"Free Delivery" / "Accept Vouchers" options are shown only when at least one restaurant in
the current list actually has that flag `true`. So the broken "select ⇒ empty list"
experience is gone, and the options **re-appear automatically** once the backend serves the
data — no further app change required.

## What is needed from the backend (to actually enable the filters)

The customer server (e.g. `aws-server-v2.enatega.com`, a separate repo) and the admin panel
need these changes. Field names must stay exactly `freeDelivery` and `acceptVouchers`
(booleans) to match the app and the web interfaces
(`enatega-multivendor-web/lib/utils/interfaces/restaurants.interface.ts`).

### 1. Mongoose model — `Restaurant`
Add two booleans (default `false`):
```js
// models/restaurant.js
freeDelivery: { type: Boolean, default: false },
acceptVouchers: { type: Boolean, default: false },
```

### 2. GraphQL schema — types
Add the fields to the full `Restaurant` type **and** to the preview type returned by the
list resolver (the one behind `nearByRestaurantsPreview` — commonly `RestaurantPreview`):
```graphql
type Restaurant {
  # ...existing fields...
  freeDelivery: Boolean
  acceptVouchers: Boolean
}

type RestaurantPreview {
  # ...existing fields...
  freeDelivery: Boolean
  acceptVouchers: Boolean
}
```

### 3. GraphQL schema — input (so admin can set them)
Add to the restaurant create/edit input:
```graphql
input RestaurantInput {
  # ...existing fields...
  freeDelivery: Boolean
  acceptVouchers: Boolean
}
```

### 4. Resolvers
- **Create/Edit restaurant mutation:** persist `freeDelivery` / `acceptVouchers` from the input.
- **`nearByRestaurantsPreview` resolver:** make sure the mapped preview objects carry these
  fields through from each restaurant document (if the resolver hand-maps fields rather than
  spreading the whole doc, add them explicitly).

### 5. Admin panel — `enatega-multivendor-admin`
- Add two toggles ("Free delivery", "Accept vouchers") to the restaurant **create/edit** form.
- Add the fields to the admin's restaurant GraphQL **query** and **create/edit mutation**
  documents so the toggles load and save.

### 6. Backfill (optional but recommended)
Existing restaurants default to `false`. Set `freeDelivery: true` / `acceptVouchers: true`
on the restaurants that qualify (one-off script or via the new admin toggles).

## How to verify end-to-end
1. In admin, enable "Free delivery" on at least one restaurant near a test location.
2. In the customer app, open that area's restaurant list → open Filters → the **"Free Delivery"**
   option now appears (the app un-hides it because data exists).
3. Select it → only free-delivery restaurants remain (no longer empty). Repeat for
   "Accept Vouchers".
