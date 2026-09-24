import { expect, test, type Page, type Response } from '@playwright/test'

/**
 * CW-P0-SMOKE-300 — Customer Web production smoke: login through placed order.
 *
 * One continuous, fully real journey against the configured production backend:
 *
 *   login -> zone -> discovery -> restaurant menu -> cart -> checkout -> order
 *
 * Nothing is mocked or stubbed. Every step is asserted against the actual
 * GraphQL response (EmailExist, Login, Restaurants, RestaurantByIdAndSlug,
 * PlaceOrder), not just the rendered UI, so a green run proves the backend
 * contract as well as the screens.
 *
 * Deliberately self-contained. It performs its own email login instead of
 * depending on the `customer-production-auth-setup` project, and it avoids the
 * QA `data-testid` hooks that main's UI rewrite dropped, so it exercises the
 * new code as shipped.
 *
 * Set QA_STOP_BEFORE_ORDER=true to run the whole journey read-only: it stops at
 * the enabled place-order button instead of clicking it. Use that for demos,
 * headed runs and UI mode, where the test re-runs on every click.
 *
 * SAFETY: this WRITES to production — it places a real COD pickup order. It is
 * gated to its own `customer-production-order-smoke` project and refuses to
 * submit if the checkout total exceeds QA_MAX_ORDER_TOTAL. Pickup + Cash keeps
 * the order free of any delivery dispatch or payment gateway.
 *
 * In CI (.github/workflows/qa-checks.yml) it runs on every push and pull
 * request with QA_STOP_BEFORE_ORDER=true, so no order is ever placed
 * automatically. A real order is submitted only from a manual "Run workflow"
 * with the "place a REAL order" box ticked.
 */

// The QA account's real, serviceable delivery zone (Islamabad, E-11).
const ZONE = {
  latitude: 33.702333897366515,
  longitude: 72.98212442547083,
  deliveryAddress: 'Automation order zone, Islamabad'
}

// Storage is namespaced per app mode since main's single-vendor work:
// `@enatega/multi/<key>`. Seeding the bare legacy key alone no longer reaches
// the app reliably, so we write the scoped key and pin the mode.
const APP_MODE = 'MULTI'
const APP_MODE_STORAGE_KEY = '@enatega/app-mode'
const scopedKey = (key: string) => `@enatega/${APP_MODE.toLowerCase()}/${key}`

const CART_KEYS = [
  'cartItems',
  'restaurant',
  'restaurant-slug',
  'restaurantData',
  'cart-product-store-id',
  'cart-product-store-slug',
  'currentShopType',
  'orderInstructions',
  'newOrderInstructions',
  'applied_coupon',
  'coupon_text',
  'is_coupon_applied',
  'coupon_restaurant_id'
]

type OpeningTime = {
  day?: string
  times?: Array<{ startTime?: string[]; endTime?: string[] }>
}

type RestaurantCandidate = {
  _id: string
  name: string
  slug: string
  minimumOrder?: number
  isActive?: boolean
  isAvailable?: boolean
  openingTimes?: OpeningTime[]
}

type MenuResult = {
  data?: {
    restaurant?: {
      minimumOrder?: number
      addons?: Array<{ _id?: string; quantityMinimum?: number }>
      categories?: Array<{
        foods?: Array<{
          _id?: string
          title?: string
          isOutOfStock?: boolean
          variations?: Array<{
            _id?: string
            price?: number
            addons?: string[]
            isOutOfStock?: boolean
          }>
        }>
      }>
    }
  }
  errors?: Array<{ message?: string }>
}

function requiredSecret(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required in qa-automation/.env`)
  return value
}

// Opt-out for demos and UI mode: run the entire real journey but stop at the
// checkout instead of submitting. Watching the flow should not cost a real
// order every time, and UI mode re-runs on every click.
function stopBeforeOrder() {
  return process.env.QA_STOP_BEFORE_ORDER === 'true'
}

function orderCeiling() {
  const raw = process.env.QA_MAX_ORDER_TOTAL
  if (!raw) throw new Error('QA_MAX_ORDER_TOTAL is required in qa-automation/.env')
  const ceiling = Number(raw)
  if (!Number.isFinite(ceiling) || ceiling <= 0) {
    throw new Error(`QA_MAX_ORDER_TOTAL must be a positive number, got "${raw}"`)
  }
  return ceiling
}

/**
 * Wait for a GraphQL operation and return its parsed body.
 *
 * The body is read the moment the response lands, not when the caller awaits
 * it. Chromium discards response bodies belonging to a previous page as soon as
 * a navigation commits, so holding the Response and calling .json() later fails
 * intermittently with "No data found for resource with given identifier" — and
 * this journey navigates immediately after nearly every query.
 */
function expectOperation<T>(page: Page, operationName: string, timeout = 90_000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const handler = (response: Response) => {
      if (!response.url().endsWith('/graphql')) return
      let name: string | undefined
      try {
        name = (response.request().postDataJSON() as { operationName?: string })?.operationName
      } catch {
        return
      }
      if (name !== operationName) return

      page.off('response', handler)
      clearTimeout(timer)

      void (async () => {
        try {
          if (!response.ok()) {
            // A bare status code is useless for a GraphQL failure — the reason
            // is in the body (validation errors, unknown fields, auth).
            const body = await response.text().catch(() => '<unreadable body>')
            throw new Error(
              `${response.url()} returned ${response.status()}\n${body.slice(0, 1500)}`
            )
          }
          resolve((await response.json()) as T)
        } catch (error) {
          reject(error instanceof Error ? error : new Error(String(error)))
        }
      })()
    }

    const timer = setTimeout(() => {
      page.off('response', handler)
      reject(new Error(`timed out after ${timeout}ms waiting for GraphQL "${operationName}"`))
    }, timeout)

    page.on('response', handler)
  })
}

/**
 * GraphQL errors arrive as an array, and asserting it deep-equals [] produces a
 * 17-line diff that buries the one line that matters. Name the operation and
 * surface the message instead — especially rate limiting, which is the most
 * common way a real-login journey fails and is not a product defect.
 */
function assertOperationOk(
  result: { errors?: Array<{ message?: string }> },
  operationName: string
) {
  const messages = (result.errors ?? []).map((error) => error.message ?? 'unknown error')
  if (messages.length === 0) return

  if (messages.some((message) => /too many requests/i.test(message))) {
    throw new Error(
      `${operationName} was rate limited by the backend ("${messages[0]}").\n` +
        'This journey performs a REAL login, and the backend throttles repeated\n' +
        'attempts. Wait a few minutes before retrying, and space scheduled runs\n' +
        'further apart. Nothing is wrong with the app or the test.'
    )
  }

  throw new Error(
    `${operationName} returned GraphQL errors:\n  - ${messages.join('\n  - ')}`
  )
}

function isOpenNow(restaurant: RestaurantCandidate) {
  if (restaurant.isActive === false || restaurant.isAvailable === false) return false
  const now = new Date()
  const day = now.toLocaleString('en-US', { weekday: 'short' }).toUpperCase()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  return Boolean(
    restaurant.openingTimes
      ?.find((item) => item.day === day)
      ?.times?.some(({ startTime, endTime }) => {
        if (!startTime || !endTime) return false
        const start = Number(startTime[0]) * 60 + Number(startTime[1])
        const end = Number(endTime[0]) * 60 + Number(endTime[1])
        return currentMinutes >= start && currentMinutes <= end
      })
  )
}

// Prefer the simplest orderable item: an in-stock variation whose required
// add-on groups are all optional, so the detail modal needs no option picking.
/**
 * The CHEAPEST in-stock item that can be added without choosing a required
 * addon. Taking the first such item instead let one expensive dish at the top
 * of a menu rule the whole restaurant out against QA_MAX_ORDER_TOTAL.
 */
function findSimpleFood(menu: MenuResult) {
  const restaurant = menu.data?.restaurant
  const addons = restaurant?.addons ?? []
  const requiredGroups = (variationAddons: string[] | undefined) =>
    (variationAddons ?? []).filter((addonId) => {
      const addon = addons.find((item) => item._id === addonId)
      return (addon?.quantityMinimum ?? 0) > 0
    }).length

  let cheapest: { foodId: string; title: string; price: number } | undefined
  for (const category of restaurant?.categories ?? []) {
    for (const food of category.foods ?? []) {
      if (!food._id || food.isOutOfStock) continue
      const variation = food.variations?.find(
        (item) =>
          !item.isOutOfStock &&
          typeof item.price === 'number' &&
          item.price > 0 &&
          requiredGroups(item.addons) === 0
      )
      if (variation?.price && (!cheapest || variation.price < cheapest.price)) {
        cheapest = { foodId: food._id, title: food.title ?? '', price: variation.price }
      }
    }
  }
  return cheapest
}

// Pin the app mode and delivery zone before any app script runs, and start from
// an empty cart so the run is repeatable.
async function seedZone(page: Page) {
  await page.addInitScript(
    ({ zone, mode, modeKey, cartKeys, prefix }) => {
      window.localStorage.setItem(modeKey, mode)
      for (const key of cartKeys) {
        window.localStorage.removeItem(key)
        window.localStorage.removeItem(`${prefix}${key}`)
      }
      const serialized = JSON.stringify(zone)
      window.localStorage.setItem('location', serialized)
      window.localStorage.setItem(`${prefix}location`, serialized)
    },
    {
      zone: ZONE,
      mode: APP_MODE,
      modeKey: APP_MODE_STORAGE_KEY,
      cartKeys: CART_KEYS,
      prefix: `@enatega/${APP_MODE.toLowerCase()}/`
    }
  )
}

/**
 * Next.js dev compiles each route on its first request, and the app's own
 * client-side router can navigate while our goto is still in flight. Both
 * surface as net::ERR_ABORTED or a navigation timeout, and both are transient —
 * the journey should retry rather than fail over a cold cache.
 */
async function navigate(page: Page, path: string, attempts = 3) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 120_000 })
      return
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (!/ERR_ABORTED|frame was detached|Timeout/i.test(message) || attempt >= attempts) {
        throw error
      }
      await page.waitForTimeout(2_000)
    }
  }
}

async function openHome(page: Page) {
  await navigate(page, '/')

  // A Playwright-managed dev server answers its URL health check while the
  // route is still cold-compiling, so the first document can arrive as an empty
  // shell. Give the title room, then reload once before giving up.
  try {
    await expect(page).toHaveTitle(/Enatega Multivendor/i, { timeout: 90_000 })
  } catch {
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 120_000 })
    await expect(page).toHaveTitle(/Enatega Multivendor/i, { timeout: 90_000 })
  }

  // The app bar's Login control is the first thing that proves the client
  // layout hydrated.
  await expect(
    page.getByRole('button', { name: /^login$/i }).first()
  ).toBeVisible({ timeout: 90_000 })
}

// Real email + password login against the production backend.
async function loginWithEmail(page: Page) {
  const email = requiredSecret('QA_CUSTOMER_EMAIL')
  const password = requiredSecret('QA_CUSTOMER_PASSWORD')

  await page.getByRole('button', { name: /^login$/i }).first().click()

  const dialog = page.getByTestId('customer-auth-dialog')
  await expect(dialog).toBeVisible()

  // Panel 0 (Google / choose method) -> panel 1 (email).
  await dialog.getByRole('button', { name: /^login$/i }).click()
  const emailField = dialog.getByPlaceholder('example@domain.com')
  await expect(emailField).toBeVisible()
  await emailField.fill(email)

  const emailExistsPromise = expectOperation<{
    data?: { emailExist?: boolean }
    errors?: Array<{ message?: string }>
  }>(page, 'EmailExist')
  await dialog.getByRole('button', { name: /continue with email/i }).click()
  const emailExists = await emailExistsPromise

  assertOperationOk(emailExists, 'EmailExist')
  expect(
    emailExists.data?.emailExist,
    'QA_CUSTOMER_EMAIL must belong to an existing customer on this backend'
  ).toBe(true)

  // Panel 7 (password).
  await expect(dialog.getByText(/good to see you again/i)).toBeVisible()
  await dialog.getByPlaceholder(/^password$/i).fill(password)
  // PrimeReact's <Password> opens a strength-meter overlay that swallows clicks
  // on Continue. Escape dismisses it; the dialog itself ignores Escape beyond
  // panel 3 (closeOnEscape={activePanel <= 3}), so the session stays open.
  await page.keyboard.press('Escape')

  const loginPromise = expectOperation<{
    data?: { login?: { token?: string; userId?: string } }
    errors?: Array<{ message?: string }>
  }>(page, 'Login')
  await dialog.getByRole('button', { name: /^continue$/i }).click()
  const loginResult = await loginPromise

  assertOperationOk(loginResult, 'Login')
  expect(loginResult.data?.login?.token, 'backend returned no auth token').toBeTruthy()

  // A successful login dismisses the dialog itself. Let that happen first —
  // clicking the close button while it animates out races a detaching node.
  const closedItself = await dialog
    .waitFor({ state: 'hidden', timeout: 20_000 })
    .then(() => true)
    .catch(() => false)

  if (!closedItself) {
    // Still open means the account landed on an optional profile-completion
    // panel (save phone / save email). Dismiss it explicitly.
    await page
      .getByTestId('auth-close')
      .click({ timeout: 10_000 })
      .catch(() => undefined)
    await expect(dialog).toBeHidden({ timeout: 15_000 })
  }

  // The session token must actually be persisted under the mode-scoped key.
  const storedToken = await page.evaluate(
    (key) => window.localStorage.getItem(key),
    scopedKey('token')
  )
  expect(storedToken, 'auth token was not persisted to mode-scoped storage').toBeTruthy()
}

test('CW-P0-SMOKE-300 logs in and places a real COD pickup order end to end', async ({
  page
}) => {
  test.setTimeout(420_000)
  const ceiling = orderCeiling()

  await seedZone(page)

  // ---- 1. Real login ----------------------------------------------------
  await openHome(page)
  await loginWithEmail(page)

  // ---- 2. Real discovery ------------------------------------------------
  const restaurantsPromise = expectOperation<{
    data?: { nearByRestaurantsPreview?: { restaurants?: RestaurantCandidate[] } }
    errors?: Array<{ message?: string }>
  }>(page, 'Restaurants')
  await navigate(page, '/discovery')
  const restaurantsResult = await restaurantsPromise

  assertOperationOk(restaurantsResult, 'Restaurants')
  const openRestaurants = (
    restaurantsResult.data?.nearByRestaurantsPreview?.restaurants ?? []
  )
    .filter(isOpenNow)
    .sort((a, b) => (a.minimumOrder ?? 0) - (b.minimumOrder ?? 0))
  // The query itself was asserted above, so a broken backend still fails. What
  // is left is the clock: outside trading hours nothing in the zone is open,
  // which says nothing about the code under test. This runs on every push, so
  // it is reported as a skip with its reason rather than as a failure.
  test.skip(
    openRestaurants.length === 0,
    'no open restaurants in this zone right now — retry during trading hours'
  )

  // ---- 3. Real menu -----------------------------------------------------
  let chosen:
    | { restaurant: RestaurantCandidate; foodId: string; title: string; quantity: number }
    | undefined
  // Why each candidate was passed over, so a failure or skip explains itself.
  const rejected: string[] = []
  let menusLoaded = 0
  let pricedOut = 0

  for (const restaurant of openRestaurants.slice(0, 8)) {
    const name = restaurant.name
    const menuPromise = expectOperation<MenuResult>(page, 'RestaurantByIdAndSlug')
    await navigate(page, `/restaurant/${restaurant.slug}/${restaurant._id}`)
    const menu = await menuPromise.catch(() => undefined)
    if (!menu || menu.errors?.length) {
      rejected.push(`${name}: menu query ${menu ? 'returned errors' : 'never responded'}`)
      continue
    }
    menusLoaded += 1

    const food = findSimpleFood(menu)
    if (!food) {
      rejected.push(`${name}: no in-stock item without a required addon`)
      continue
    }

    const minimumOrder = menu.data?.restaurant?.minimumOrder ?? restaurant.minimumOrder ?? 0
    const quantity = Math.max(1, Math.ceil(minimumOrder / food.price))
    if (food.price * quantity > ceiling) {
      pricedOut += 1
      rejected.push(
        `${name}: cheapest simple item ${food.price} x ${quantity} to reach the ` +
          `${minimumOrder} minimum = ${food.price * quantity}, over the ${ceiling} ceiling`
      )
      continue
    }

    chosen = { restaurant, foodId: food.foodId, title: food.title, quantity }
    break
  }

  const reasons = rejected.map((line) => `  - ${line}`).join('\n')
  // Menus that never load are a defect in the app or the backend.
  expect(menusLoaded, `no restaurant menu loaded:\n${reasons}`).toBeGreaterThan(0)
  // Menus that load but price every simple item above the ceiling are the live
  // catalogue, not the code — skip with the prices, and raise
  // QA_MAX_ORDER_TOTAL if it keeps happening. A menu with no orderable item at
  // all is NOT excused: that usually means its data changed shape.
  test.skip(
    !chosen && pricedOut > 0,
    `every open restaurant's cheapest simple item is over QA_MAX_ORDER_TOTAL right now:\n${reasons}`
  )
  expect(
    chosen,
    `no open restaurant offered a simple in-stock item under QA_MAX_ORDER_TOTAL:\n${reasons}`
  ).toBeTruthy()
  if (!chosen) throw new Error('unreachable')

  // ---- 4. Real cart -----------------------------------------------------
  await page.getByTestId(`product-card-${chosen.foodId}`).first().click()

  const productDialog = page.getByRole('dialog').filter({ visible: true }).last()
  await expect(productDialog).toBeVisible()
  for (let i = 1; i < chosen.quantity; i += 1) {
    await productDialog.getByRole('button', { name: 'Increase product quantity' }).click()
  }

  const addToCart = productDialog.getByTestId('add-to-cart')
  await expect(addToCart).toBeEnabled()
  await addToCart.click()
  await expect(productDialog).toBeHidden()

  // The app bar exposes the cart as "Show Items" once the cart is non-empty.
  await page.getByText('Show Items', { exact: true }).first().click()
  const cart = page.getByTestId('customer-cart')
  await expect(cart).toBeVisible()

  const cartLine = cart.getByTestId(`cart-item-${chosen.foodId}`)
  await expect(cartLine).toBeVisible()
  await expect(cartLine.getByTestId('cart-item-quantity')).toHaveText(
    String(chosen.quantity)
  )

  // ---- 5. Real checkout -------------------------------------------------
  await cart.getByTestId('go-to-checkout').click()
  await expect(page).toHaveURL(/\/order\/checkout$/, { timeout: 60_000 })
  await expect(page.getByTestId('checkout-page')).toBeVisible({ timeout: 60_000 })
  await expect(
    page.getByTestId(`checkout-item-${chosen.foodId}`)
  ).toBeVisible()

  // Pickup skips the delivery-address requirement; Cash needs no gateway.
  await page.getByText('Pickup', { exact: true }).first().click()
  await page.locator('input[name="payment"]').first().check()

  const totalText = await page.getByTestId('checkout-total').first().innerText()
  const total = Number(totalText.replace(/[^0-9.]/g, ''))
  expect(Number.isFinite(total), `could not parse checkout total "${totalText}"`).toBe(true)
  expect(
    total,
    `checkout total ${total} exceeds QA_MAX_ORDER_TOTAL ${ceiling} — refusing to order`
  ).toBeLessThanOrEqual(ceiling)

  // ---- 6. Real order ----------------------------------------------------
  const placeOrderButton = page.getByTestId('place-order').filter({ visible: true }).first()
  await expect(placeOrderButton).toBeEnabled()

  if (stopBeforeOrder()) {
    // Everything up to here was real: real login, real catalogue, real cart,
    // real checkout totals. Only the write is withheld.
    test.info().annotations.push({
      type: 'read-only',
      description: 'QA_STOP_BEFORE_ORDER=true — checkout reached, order not submitted'
    })
    console.log(
      `Read-only run: reached checkout at "${chosen.restaurant.name}" with ` +
        `${chosen.quantity}x ${chosen.title}, total ${total}. Order NOT placed ` +
        `(QA_STOP_BEFORE_ORDER=true).`
    )
    return
  }

  const placeOrderPromise = expectOperation<{
    data?: {
      placeOrder?: {
        _id?: string
        orderId?: string
        orderStatus?: string
        paymentMethod?: string
      }
    }
    errors?: Array<{ message?: string }>
  }>(page, 'PlaceOrder', 120_000)
  await placeOrderButton.click()
  const placeOrderResult = await placeOrderPromise

  assertOperationOk(placeOrderResult, 'PlaceOrder')
  const order = placeOrderResult.data?.placeOrder
  expect(order?._id, 'backend returned no order id').toBeTruthy()
  expect(order?.orderId, 'backend returned no human order reference').toBeTruthy()

  await expect(page).toHaveURL(new RegExp(`/order/${order?._id}/tracking/?$`), {
    timeout: 60_000
  })

  console.log(
    `Placed real order ${order?.orderId} (${order?._id}) at "${chosen.restaurant.name}" — ` +
      `${chosen.quantity}x ${chosen.title}, total ${total}, status ${order?.orderStatus}`
  )
})
