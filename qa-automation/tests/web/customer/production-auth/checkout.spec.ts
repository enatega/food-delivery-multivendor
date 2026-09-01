import { expect, test, type Page, type Response } from '@playwright/test'

import { openCustomerWeb } from '../support/customer-web.js'
import { installProductionReadOnlyGuard } from '../support/production-read-only.js'

type OpeningTime = {
  day?: string
  times?: Array<{ startTime?: string[]; endTime?: string[] }>
}

type RestaurantCandidate = {
  _id: string
  name: string
  slug: string
  isActive?: boolean
  isAvailable?: boolean
  openingTimes?: OpeningTime[]
}

type MenuResult = {
  data?: {
    restaurant?: {
      addons?: Array<{
        _id?: string
        options?: string[]
        quantityMinimum?: number
      }>
      options?: Array<{ _id?: string; isOutOfStock?: boolean }>
      categories?: Array<{
        foods?: Array<{
          _id?: string
          isOutOfStock?: boolean
          variations?: Array<{
            _id?: string
            addons?: string[]
            isOutOfStock?: boolean
          }>
        }>
      }>
    }
  }
  errors?: Array<{ message?: string }>
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
  const day = now
    .toLocaleString('en-US', { weekday: 'short' })
    .toUpperCase()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const opening = restaurant.openingTimes?.find((item) => item.day === day)

  return Boolean(
    opening?.times?.some(({ startTime, endTime }) => {
      if (!startTime || !endTime) return false
      const start = Number(startTime[0]) * 60 + Number(startTime[1])
      const end = Number(endTime[0]) * 60 + Number(endTime[1])
      return currentMinutes >= start && currentMinutes <= end
    })
  )
}

function findConfigurableFood(menu: MenuResult) {
  const restaurant = menu.data?.restaurant
  const addons = restaurant?.addons ?? []
  const options = restaurant?.options ?? []

  return restaurant?.categories
    ?.flatMap((category) => category.foods ?? [])
    .find((food) => {
      if (!food._id || food.isOutOfStock) return false
      const variation = food.variations?.find((item) => !item.isOutOfStock)
      if (!variation?._id) return false

      return (variation.addons ?? []).every((addonId) => {
        const addon = addons.find((item) => item._id === addonId)
        if (!addon) return false
        const availableOptions = (addon.options ?? []).filter((optionId) =>
          options.some(
            (option) => option._id === optionId && !option.isOutOfStock
          )
        )
        return availableOptions.length >= (addon.quantityMinimum ?? 0)
      })
    })
}

async function chooseRequiredOptions(dialog: ReturnType<Page['locator']>) {
  const sections = dialog.locator('#addon-sections > div')

  for (let index = 0; index < (await sections.count()); index += 1) {
    const section = sections.nth(index)
    const requirement = (await section.textContent())?.match(
      /(\d+)\s+required/i
    )
    if (!requirement) continue

    const requiredCount = Number(requirement[1])
    const inputs = section.locator('input:enabled')
    expect(await inputs.count()).toBeGreaterThanOrEqual(requiredCount)
    const selectedCount = await inputs.locator(':checked').count()

    for (
      let optionIndex = selectedCount;
      optionIndex < requiredCount;
      optionIndex += 1
    ) {
      await inputs.nth(optionIndex).check()
    }
  }
}

test('CW-P1-PROD-083 builds a real cart and reaches checkout without placing an order', async ({
  page
}) => {
  test.setTimeout(120_000)
  const monitor = await installProductionReadOnlyGuard(page)

  await page.addInitScript(() => {
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
    localStorage.setItem(
      'location',
      JSON.stringify({
        latitude: 33.6844,
        longitude: 73.0479,
        deliveryAddress: 'Automation checkout location'
      })
    )
  })

  const restaurantsResponsePromise = waitForOperation(page, 'Restaurants')
  await openCustomerWeb(page, '/discovery')
  const restaurantsResponse = await readJson<{
    data?: {
      nearByRestaurantsPreview?: {
        restaurants?: RestaurantCandidate[]
      }
    }
  }>(await restaurantsResponsePromise)

  const restaurants =
    restaurantsResponse.data?.nearByRestaurantsPreview?.restaurants?.filter(
      isOpenNow
    ) ?? []
  expect(restaurants.length).toBeGreaterThan(0)

  let selectedRestaurant: RestaurantCandidate | undefined
  let selectedFoodId: string | undefined

  for (const restaurant of restaurants.slice(0, 10)) {
    const menuResponsePromise = waitForOperation(
      page,
      'RestaurantByIdAndSlug'
    )
    await openCustomerWeb(
      page,
      `/restaurant/${restaurant.slug}/${restaurant._id}`
    )
    const menu = await readJson<MenuResult>(await menuResponsePromise)
    expect(menu.errors ?? []).toEqual([])

    const food = findConfigurableFood(menu)

    if (food?._id) {
      selectedRestaurant = restaurant
      selectedFoodId = food._id
      break
    }
  }

  expect(selectedRestaurant).toBeTruthy()
  expect(selectedFoodId).toBeTruthy()

  await page
    .getByTestId(`product-card-${selectedFoodId}`)
    .filter({ visible: true })
    .first()
    .click()
  const productDialog = page.getByRole('dialog').filter({ visible: true }).last()
  await expect(productDialog).toBeVisible()
  await chooseRequiredOptions(productDialog)

  const addToCart = productDialog.getByTestId('add-to-cart')
  await expect(addToCart).toBeEnabled()
  await productDialog
    .getByRole('button', { name: 'Increase product quantity' })
    .click()
  await addToCart.click()
  await expect(productDialog).toBeHidden()

  await page
    .getByTestId('customer-cart-trigger')
    .filter({ visible: true })
    .first()
    .click()

  const cart = page.getByTestId('customer-cart')
  await expect(cart).toBeVisible()
  const cartItem = cart.getByTestId(`cart-item-${selectedFoodId}`)
  await expect(cartItem.getByTestId('cart-item-quantity')).toHaveText('2')

  await cartItem.getByRole('button', { name: /increase .* quantity/i }).click()
  await expect(cartItem.getByTestId('cart-item-quantity')).toHaveText('3')
  await cartItem.getByRole('button', { name: /decrease .* quantity/i }).click()
  await expect(cartItem.getByTestId('cart-item-quantity')).toHaveText('2')

  await cart.getByTestId('go-to-checkout').click()
  await expect(page).toHaveURL(/\/order\/checkout$/)
  await expect(page.getByTestId('checkout-page')).toBeVisible()
  await expect(
    page
      .getByTestId(`checkout-item-${selectedFoodId}`)
      .getByTestId('checkout-item-quantity')
  ).toHaveText('2')

  await page.getByRole('button', { name: /pickup/i }).click()
  await expect(page.locator('input[name="payment"]').first()).toBeChecked()
  await expect(
    page.getByTestId('checkout-subtotal').filter({ visible: true }).first()
  ).toContainText(/\d/)
  await expect(
    page.getByTestId('checkout-tax').filter({ visible: true }).first()
  ).toContainText(/\d/)
  await expect(
    page.getByTestId('checkout-total').filter({ visible: true }).first()
  ).toContainText(/\d/)
  await expect(
    page.getByTestId('place-order').filter({ visible: true }).first()
  ).toBeEnabled()

  expect(monitor.blockedOperations).toEqual([])
})
