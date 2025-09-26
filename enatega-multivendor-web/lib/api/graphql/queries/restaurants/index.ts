import { gql } from "@apollo/client";

export const RELATED_ITEMS = gql`
  query RelatedItems($itemId: String!, $restaurantId: String!) {
    relatedItems(itemId: $itemId, restaurantId: $restaurantId)
  }
`;

export const FOOD = gql`
  fragment FoodItem on Food {
    _id
    title
    image
    description
    subCategory
    isOutOfStock
    variations {
      _id
      title
      price
      discounted
      addons
    }
  }
`;

export const RESTAURANTS_FRAGMENT = gql`
  fragment RestaurantPreviewFields on RestaurantPreview {
    _id
    name
    image
    logo
    address
    deliveryTime
    minimumOrder
    rating
    slug
    isActive
    isAvailable
    commissionRate
    tax
    shopType
    cuisines
    reviewCount
    reviewAverage
    location {
      coordinates
    }
    openingTimes {
      day
      times {
        startTime
        endTime
      }
    }
  }
`;

export const RECENT_ORDER_RESTAURANTS = gql`
  ${RESTAURANTS_FRAGMENT}
  query GetRecentOrderRestaurants($latitude: Float!, $longitude: Float!) {
    recentOrderRestaurantsPreview(latitude: $latitude, longitude: $longitude) {
      ...RestaurantPreviewFields
    }
  }
`;

export const MOST_ORDER_RESTAURANTS = gql`
  ${RESTAURANTS_FRAGMENT}
  query GetMostOrderedRestaurants(
    $latitude: Float!
    $longitude: Float!
    $page: Int
    $limit: Int
    $shopType: String
  ) {
    mostOrderedRestaurantsPreview(
      latitude: $latitude
      longitude: $longitude
      page: $page
      limit: $limit
      shopType: $shopType
    ) {
      ...RestaurantPreviewFields
    }
  }
`;

export const NEAR_BY_RESTAURANTS_PREVIEW = gql`
  query Restaurants(
    $latitude: Float
    $longitude: Float
    $page: Int
    $limit: Int
    $shopType: String
  ) {
    nearByRestaurantsPreview(
      latitude: $latitude
      longitude: $longitude
      page: $page
      limit: $limit
      shopType: $shopType
    ) {
      restaurants {
        _id
        name
        slug
        image
        address
        deliveryTime
        minimumOrder
        rating
        isActive
        isAvailable
        commissionRate
        tax
        shopType
        cuisines
        reviewCount
        reviewAverage
        distanceWithCurrentLocation @client
        freeDelivery @client
        acceptVouchers @client
        deliveryInfo {
          deliveryFee
        }
        location {
          coordinates
        }
        openingTimes {
          day
          times {
            startTime
            endTime
          }
        }
      }
    }
  }
`;

export const GET_RESTAURANT_BY_ID_SLUG = gql`
  query RestaurantByIdAndSlug($id: String, $slug: String) {
    restaurant(id: $id, slug: $slug) {
      _id
      orderId
      orderPrefix
      isActive
      name
      image
      slug
      username
      phone
      shopType
      address
      location {
        coordinates
      }
      deliveryTime
      minimumOrder
      tax
      stripeDetailsSubmitted
      reviewData {
        total
        ratings
        reviews {
          _id
          order {
            user {
              _id
              name
              email
            }
          }
          rating
          description
          createdAt
        }
      }
      categories {
        _id
        title
        foods {
          _id
          title
          image
          description
          isOutOfStock
          subCategory
          variations {
            _id
            title
            price
            discounted
            addons
            isOutOfStock
          }
        }
      }
      options {
        _id
        title
        description
        price
        isOutOfStock
      }
      addons {
        _id
        options
        title
        description
        quantityMinimum
        quantityMaximum
      }
      zone {
        _id
        title
        tax
      }
      rating
      isAvailable
      openingTimes {
        day
        times {
          startTime
          endTime
        }
      }
    }
  }
`;

export const GET_REVIEWS_BY_RESTAURANT = gql`
  query GetReviewsByRestaurant($restaurant: String!) {
    reviewsByRestaurant(restaurant: $restaurant) {
      reviews {
        _id
        rating
        description
        isActive
        createdAt
        updatedAt
        order {
          _id
          user {
            _id
            name
            email
          }
        }
        restaurant {
          _id
          name
        }
      }
      ratings
      total
    }
  }
`;

export const GET_CATEGORIES_SUB_CATEGORIES_LIST = gql`
  query FetchCategoryDetailsByStoreId($storeId: String!) {
    fetchCategoryDetailsByStoreId(storeId: $storeId) {
      id
      label
      # slug
      url
      items {
        id
        label
        url
        # slug
      }
    }
  }
`;

export const GET_POPULAR_SUB_CATEGORIES_LIST = gql`
  query PopularItems($restaurantId: String!) {
    popularItems(restaurantId: $restaurantId) {
      id
      count
    }
  }
`;

export const GET_SUB_CATEGORIES = gql`
  query subCategories {
    subCategories {
      _id
      title
      parentCategoryId
    }
  }
`;
