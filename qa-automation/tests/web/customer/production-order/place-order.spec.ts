import { expect, test, type Page, type Response } from '@playwright/test'

import { openCustomerWeb } from '../support/customer-web.js'

/**
 * REAL production order flow against the configured backend.
 *
 * The platform is COD-only with no real vendors/riders/payment, and the owner
 * has authorised writing to the production database. Even so, this suite is
 * split so nothing is written by accident:
 *
 *   CW-P1-PROD-200  builds a REAL cart from REAL production data (login, zone,
 *                   browse, add to cart). Always runs. No write.
 *   CW-P1-PROD-201  places a REAL COD order. Opt-in only: runs when
 *                   QA_PLACE_REAL_ORDER=true. Requires the local Customer Web
 *                   checkout to load Google Maps, i.e. the Maps API key must
 *                   allow http://localhost:3000 (and 127.0.0.1:3000).
 *
 * Lives in the `customer-production-order` project and is never in per-push CI.
 */

// The QA account's real, serviceable delivery zone (Islamabad, E-11).
const ZONE = {
  latitude: 33.702333897366515,
  longitude: 72.98212442547083,
  deliveryAddress: 'Automation order zone, Islamabad'
}

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

type ChosenItem = {
  restaurant: RestaurantCandidate
  foodId: string
  title: string
  quantity: number
}

function waitForOperation(page: Page, operationName: string) {
  return page.waitForResponse((response) => {
    if (!response.url().endsWith('/graphql')) return false
    try {
      const body = response.request().postDataJSON() as {
        operationName?: string
      }
      return body.operationName === operationName
    } catch {
      return false
    }
  })
}

async function readJson<T>(response: Response): Promise<T> {
  expect(response.ok()).toBe(true)
  return (await response.json()) as T
}

function isOpenNow(restaurant: RestaurantCandidate) {
  if (restaurant.isActive === false || restaurant.isAvailable === false) {
    return false
  }
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

// Prefer the simplest possible order: an in-stock variation whose required
// add-on groups are all zero, so no modal option selection is needed.
function findSimpleFood(menu: MenuResult) {
  const restaurant = menu.data?.restaurant
  const addons = restaurant?.addons ?? []
  const requiredGroups = (variationAddons: string[] | undefined) =>
    (variationAddons ?? []).filter((addonId) => {
      const addon = addons.find((item) => item._id === addonId)
      return (addon?.quantityMinimum ?? 0) > 0
    }).length

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
      if (variation?.price) {
        return {
          foodId: food._id,
          title: food.title ?? '',
          price: variation.price
        }
      }
    }
  }
  return undefined
}

async function seedZone(page: Page) {
  await page.addInitScript((zone) => {
    for (const key of [
      'cartItems',
      'restaurant',
      'restaurant-slug',
      'cart-product-store-id',
      'cart-product-store-slug',
      'currentShopType',
      'orderInstructions',
      'newOrderInstructions',
      'applied_coupon',
      'coupon_text',
      'is_coupon_applied',
      'coupon_restaurant_id'
    ]) {
      localStorage.removeItem(key)
    }
    localStorage.setItem('location', JSON.stringify(zone))
  }, ZONE)
}

// Real login (via saved session) -> real zone -> real browse -> real cart.
async function buildRealCart(page: Page): Promise<ChosenItem> {
  const restaurantsPromise = waitForOperation(page, 'Restaurants')
  await openCustomerWeb(page, '/discovery')
  const restaurantsResponse = await readJson<{
    data?: { nearByRestaurantsPreview?: { restaurants?: RestaurantCandidate[] } }
  }>(await restaurantsPromise)

  const openRestaurants = (
    restaurantsResponse.data?.nearByRestaurantsPreview?.restaurants ?? []
  )
    .filter(isOpenNow)
    .sort((a, b) => (a.minimumOrder ?? 0) - (b.minimumOrder ?? 0))
  expect(
    openRestaurants.length,
    'no open restaurants for this zone right now'
  ).toBeGreaterThan(0)

  let chosen: ChosenItem | undefined
  for (const restaurant of openRestaurants.slice(0, 8)) {
    const menuPromise = waitForOperation(page, 'RestaurantByIdAndSlug')
    await openCustomerWeb(
      page,
      `/restaurant/${restaurant.slug}/${restaurant._id}`
    )
    const menu = await readJson<MenuResult>(await menuPromise)
    if (menu.errors?.length) continue

    const food = findSimpleFood(menu)
    if (!food) continue

    const minimumOrder =
      menu.data?.restaurant?.minimumOrder ?? restaurant.minimumOrder ?? 0
    const quantity = Math.max(1, Math.ceil(minimumOrder / food.price))
    chosen = { restaurant, foodId: food.foodId, title: food.title, quantity }
    break
  }
  expect(chosen, 'no restaurant with a simple in-stock item found').toBeTruthy()
  if (!chosen) throw new Error('unreachable')

  await page
    .getByTestId(`product-card-${chosen.foodId}`)
    .filter({ visible: true })
    .first()
    .click()
  const productDialog = page.getByRole('dialog').filter({ visible: true }).last()
  await expect(productDialog).toBeVisible()
  for (let i = 1; i < chosen.quantity; i += 1) {
    await productDialog
      .getByRole('button', { name: 'Increase product quantity' })
      .click()
  }
  const addToCart = productDialog.getByTestId('add-to-cart')
  await expect(addToCart).toBeEnabled()
  await addToCart.click()
  await expect(productDialog).toBeHidden()

  return chosen
}

test('CW-P1-PROD-200 builds a real cart from real production data', async ({
  page
}) => {
  test.setTimeout(150_000)
  await seedZone(page)

  const chosen = await buildRealCart(page)

  await page
    .getByTestId('customer-cart-trigger')
    .filter({ visible: true })
    .first()
    .click()
  const cart = page.getByTestId('customer-cart')
  await expect(cart).toBeVisible()
  await expect(cart.getByTestId(`cart-item-${chosen.foodId}`)).toBeVisible()
  await expect(
    cart
      .getByTestId(`cart-item-${chosen.foodId}`)
      .getByTestId('cart-item-quantity')
  ).toHaveText(String(chosen.quantity))

  console.log(
    `Built real cart at "${chosen.restaurant.name}": ${chosen.quantity}x ${chosen.title}`
  )
})

test('CW-P1-PROD-201 places a real COD pickup order end to end', async ({
  page
}) => {
  test.skip(
    process.env.QA_PLACE_REAL_ORDER !== 'true',
    'Opt-in: set QA_PLACE_REAL_ORDER=true and ensure the Maps API key allows http://localhost:3000'
  )
  test.setTimeout(180_000)
  await seedZone(page)

  const chosen = await buildRealCart(page)

  await page
    .getByTestId('customer-cart-trigger')
    .filter({ visible: true })
    .first()
    .click()
  const cart = page.getByTestId('customer-cart')
  await expect(cart).toBeVisible()
  await cart.getByTestId('go-to-checkout').click()
  // The first visit compiles the checkout route in development mode.
  await expect(page).toHaveURL(/\/order\/checkout$/, { timeout: 30_000 })
  await expect(page.getByTestId('checkout-page')).toBeVisible()

  // Pickup skips the delivery-address step; Cash (COD) needs no payment gateway.
  await page.getByRole('button', { name: /pickup/i }).click()
  await page.locator('input[name="payment"]').first().check()

  const placeOrderButton = page
    .getByTestId('place-order')
    .filter({ visible: true })
    .first()
  // Checkout may render before the restaurant query returns. The order button
  // must remain disabled until validation has the restaurant contract it needs.
  await expect(placeOrderButton).toBeEnabled()

  const placeOrderPromise = waitForOperation(page, 'PlaceOrder')
  await placeOrderButton.click()
  const placeOrderResult = await readJson<{
    data?: {
      placeOrder?: { _id?: string; orderId?: string; orderStatus?: string }
    }
    errors?: Array<{ message?: string }>
  }>(await placeOrderPromise)

  expect(placeOrderResult.errors ?? []).toEqual([])
  const order = placeOrderResult.data?.placeOrder
  expect(order?._id, 'backend returned no order id').toBeTruthy()
  expect(order?.orderId).toBeTruthy()

  await expect(page).toHaveURL(new RegExp(`/order/${order?._id}/tracking/?$`), {
    timeout: 30_000
  })

  console.log(
    `Placed real order ${order?.orderId} (${order?._id}) at "${chosen.restaurant.name}" ` +
      `- ${chosen.quantity}x ${chosen.title}, status ${order?.orderStatus}`
  )
})
