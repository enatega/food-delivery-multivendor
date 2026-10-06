# Customer Web Discovery-to-Cart Tasks

## Task 1: GraphQL fixtures

**Acceptance criteria:**

- [x] Fixture matches `Restaurants` and `RestaurantByIdAndSlug`.
- [x] Required and optional product choices are represented.

**Verification:** `npm run typecheck`

## Task 2: Discovery and menu

**Acceptance criteria:**

- [x] Mock restaurant appears on discovery.
- [x] Selecting it opens the expected restaurant route and menu.
- [x] No production host is contacted.

**Verification:** `npm run test:web:mock -- --grep "CW-P1-030|CW-P1-035"`

## Task 3: Product configuration

**Acceptance criteria:**

- [x] Required add-on prevents adding until selected.
- [x] Quantity and displayed total recalculate.

**Verification:** `npm run test:web:mock -- --grep "CW-P1-041|CW-P1-044"`

## Task 4: Cart behavior

**Acceptance criteria:**

- [x] Configured product enters the cart.
- [x] Quantity controls update the count.
- [x] Removing the final quantity restores the empty-cart state.

**Verification:** `npm run test:web:mock -- --grep "CW-P1-050|CW-P1-051|CW-P1-053"`
