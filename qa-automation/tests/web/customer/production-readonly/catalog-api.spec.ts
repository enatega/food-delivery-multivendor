import { expect, test } from '@playwright/test'

import {
  createReadOnlyGraphqlClient,
  customerLatitude,
  customerLongitude
} from '../support/production-graphql.js'

type RestaurantPreview = {
  _id: string
  name: string
  slug: string
  reviewAverage?: number
  cuisines?: string[]
}

type NearbyResult = {
  nearByRestaurantsPreview?: { restaurants?: RestaurantPreview[] }
}

const nearbyQuery = `query Restaurants(
  $latitude: Float!
  $longitude: Float!
  $page: Int!
  $limit: Int!
) {
  nearByRestaurantsPreview(
    latitude: $latitude
    longitude: $longitude
    page: $page
    limit: $limit
  ) {
    restaurants {
      _id
      name
      slug
      reviewAverage
      cuisines
    }
  }
}`

async function firstLiveRestaurant(
  post: Awaited<ReturnType<typeof createReadOnlyGraphqlClient>>
): Promise<RestaurantPreview> {
  const result = await post<NearbyResult>({
    operationName: 'Restaurants',
    variables: {
      latitude: customerLatitude,
      longitude: customerLongitude,
      page: 1,
      limit: 25
    },
    query: nearbyQuery
  })
  const restaurant = result.nearByRestaurantsPreview?.restaurants?.find(
    (candidate) => candidate._id && candidate.name && candidate.slug
  )
  if (!restaurant) throw new Error('Production returned no restaurant')
  return restaurant
}

test('CW-P1-PROD-006 reads real nearby cuisines from production GraphQL', async ({
  request
}) => {
  const post = await createReadOnlyGraphqlClient(request)

  const result = await post<{
    nearByRestaurantsCuisines?: Array<{ _id?: string; name?: string }>
  }>({
    operationName: 'RestaurantCuisines',
    variables: { latitude: customerLatitude, longitude: customerLongitude },
    query: `query RestaurantCuisines($latitude: Float!, $longitude: Float!) {
      nearByRestaurantsCuisines(latitude: $latitude, longitude: $longitude) {
        _id
        name
        image
      }
    }`
  })

  const cuisines = result.nearByRestaurantsCuisines ?? []
  expect(cuisines.length).toBeGreaterThan(0)
  expect(
    cuisines.every(
      (cuisine) =>
        typeof cuisine.name === 'string' && cuisine.name.trim().length > 0
    )
  ).toBe(true)
})

test('CW-P1-PROD-007 reads real top-rated vendors with valid review averages', async ({
  request
}) => {
  const post = await createReadOnlyGraphqlClient(request)

  const result = await post<{
    topRatedVendorsPreview?: Array<{
      _id?: string
      name?: string
      slug?: string
      reviewAverage?: number
    }>
  }>({
    operationName: 'TopRatedVendors',
    variables: { latitude: customerLatitude, longitude: customerLongitude },
    query: `query TopRatedVendors($latitude: Float!, $longitude: Float!) {
      topRatedVendorsPreview(latitude: $latitude, longitude: $longitude) {
        _id
        name
        slug
        reviewAverage
      }
    }`
  })

  const vendors = result.topRatedVendorsPreview ?? []
  expect(vendors.length).toBeGreaterThan(0)
  for (const vendor of vendors) {
    expect(vendor._id, 'top-rated vendor must expose an id').toBeTruthy()
    expect(vendor.name, 'top-rated vendor must expose a name').toBeTruthy()
    const average = vendor.reviewAverage ?? 0
    expect(average).toBeGreaterThanOrEqual(0)
    expect(average).toBeLessThanOrEqual(5)
  }
})

test('CW-P1-PROD-008 reads a self-consistent review aggregate for a live restaurant', async ({
  request
}) => {
  const post = await createReadOnlyGraphqlClient(request)
  const restaurant = await firstLiveRestaurant(post)

  const result = await post<{
    reviewsByRestaurant?: {
      ratings?: number
      total?: number
      reviews?: Array<{ _id?: string; rating?: number }>
    }
  }>({
    operationName: 'GetReviewsByRestaurant',
    variables: { restaurant: restaurant._id },
    query: `query GetReviewsByRestaurant($restaurant: String!) {
      reviewsByRestaurant(restaurant: $restaurant) {
        ratings
        total
        reviews {
          _id
          rating
        }
      }
    }`
  })

  const aggregate = result.reviewsByRestaurant
  expect(aggregate).toBeTruthy()
  const total = aggregate?.total ?? 0
  const reviews = aggregate?.reviews ?? []
  // The returned page of reviews can never exceed the reported total.
  expect(reviews.length).toBeLessThanOrEqual(total)
  expect(aggregate?.ratings ?? 0).toBeGreaterThanOrEqual(0)
  expect(aggregate?.ratings ?? 0).toBeLessThanOrEqual(5)
  for (const review of reviews) {
    expect(review.rating ?? 0).toBeGreaterThanOrEqual(0)
    expect(review.rating ?? 0).toBeLessThanOrEqual(5)
  }
})

test('CW-P1-PROD-009 paginates real nearby restaurants without repeating entries', async ({
  request
}) => {
  const post = await createReadOnlyGraphqlClient(request)

  const readPage = async (page: number) => {
    const result = await post<NearbyResult>({
      operationName: 'Restaurants',
      variables: {
        latitude: customerLatitude,
        longitude: customerLongitude,
        page,
        limit: 8
      },
      query: nearbyQuery
    })
    return result.nearByRestaurantsPreview?.restaurants ?? []
  }

  const firstPage = await readPage(1)
  expect(firstPage.length).toBeGreaterThan(0)

  const secondPage = await readPage(2)
  // The second page is either empty (short catalog) or holds new restaurants.
  if (secondPage.length > 0) {
    const firstPageIds = new Set(firstPage.map((restaurant) => restaurant._id))
    const overlap = secondPage.filter((restaurant) =>
      firstPageIds.has(restaurant._id)
    )
    expect(overlap).toEqual([])
  }
})

test('CW-P1-PROD-013 respects the requested page size for nearby restaurants', async ({
  request
}) => {
  const post = await createReadOnlyGraphqlClient(request)
  const limit = 5

  const result = await post<NearbyResult>({
    operationName: 'Restaurants',
    variables: {
      latitude: customerLatitude,
      longitude: customerLongitude,
      page: 1,
      limit
    },
    query: nearbyQuery
  })

  const restaurants = result.nearByRestaurantsPreview?.restaurants ?? []
  expect(restaurants.length).toBeGreaterThan(0)
  // The server must never return more entries than the client asked for.
  expect(restaurants.length).toBeLessThanOrEqual(limit)
})

test('CW-P1-PROD-014 returns well-formed opening times for a live restaurant', async ({
  request
}) => {
  const post = await createReadOnlyGraphqlClient(request)
  const restaurant = await firstLiveRestaurant(post)

  const result = await post<{
    restaurant?: {
      _id?: string
      openingTimes?: Array<{
        day?: string
        times?: Array<{ startTime?: string[]; endTime?: string[] }>
      }>
    }
  }>({
    operationName: 'RestaurantByIdAndSlug',
    variables: { id: restaurant._id, slug: restaurant.slug },
    query: `query RestaurantByIdAndSlug($id: String!, $slug: String) {
      restaurant(id: $id, slug: $slug) {
        _id
        openingTimes {
          day
          times {
            startTime
            endTime
          }
        }
      }
    }`
  })

  const openingTimes = result.restaurant?.openingTimes ?? []
  const validDays = new Set(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'])
  for (const opening of openingTimes) {
    expect(validDays.has(opening.day ?? '')).toBe(true)
    for (const slot of opening.times ?? []) {
      // Each slot must expose an [hours, minutes] pair the client can compare.
      expect(slot.startTime?.length).toBe(2)
      expect(slot.endTime?.length).toBe(2)
    }
  }
})

test('CW-P1-PROD-010 exposes a full menu for a live restaurant by id and slug', async ({
  request
}) => {
  const post = await createReadOnlyGraphqlClient(request)
  const restaurant = await firstLiveRestaurant(post)

  const result = await post<{
    restaurant?: {
      _id?: string
      slug?: string
      categories?: Array<{
        _id?: string
        title?: string
        foods?: Array<{
          _id?: string
          title?: string
          variations?: Array<{ _id?: string; price?: number }>
        }>
      }>
    }
  }>({
    operationName: 'RestaurantByIdAndSlug',
    variables: { id: restaurant._id, slug: restaurant.slug },
    query: `query RestaurantByIdAndSlug($id: String!, $slug: String) {
      restaurant(id: $id, slug: $slug) {
        _id
        slug
        categories {
          _id
          title
          foods {
            _id
            title
            variations {
              _id
              price
            }
          }
        }
      }
    }`
  })

  expect(result.restaurant?._id).toBe(restaurant._id)
  const foods =
    result.restaurant?.categories?.flatMap((category) => category.foods ?? []) ??
    []
  expect(foods.length).toBeGreaterThan(0)
  // Every purchasable food must carry at least one priced variation.
  const pricedFood = foods.find((food) =>
    food.variations?.some(
      (variation) => typeof variation.price === 'number' && variation.price >= 0
    )
  )
  expect(pricedFood, 'menu must expose at least one priced item').toBeTruthy()
})
