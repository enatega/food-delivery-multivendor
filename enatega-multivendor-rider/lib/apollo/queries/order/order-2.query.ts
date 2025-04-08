import { restaurantPreviewFragment } from "../resturant/resturant-2.query";

export const orderFragment = `#graphql
fragment NewOrder on Order {
    _id
    orderId
    restaurant{
      _id
      name
      image
      address
      location{coordinates}
    }
    deliveryAddress{
      location{coordinates}
      deliveryAddress
      id
    }
    items{
      _id
      title
      food
      description
      quantity
      variation{
        _id
        title
        price
        discounted
      }
      addons{
        _id
        options{
          _id
          title
          description
          price
        }
        title
        description
        quantityMinimum
        quantityMaximum
      }
    }
    user{
      _id
      name
      phone
    }
    rider{
      _id
      name
    }
    review{
      _id
    }
    paymentMethod
    paidAmount
    orderAmount
    orderStatus
    orderDate
    expectedTime
    isPickedUp
    tipping
    taxationAmount
    createdAt
    completionTime
    preparationTime
    deliveryCharges
    acceptedAt
    pickedAt
    deliveredAt
    cancelledAt
    assignedAt
  }`;

export const recentOrderRestaurantsQuery = `#graphql

    ${restaurantPreviewFragment}
    query GetRecentOrderRestaurants($latitude: Float!, $longitude: Float!) {
      recentOrderRestaurantsPreview(latitude: $latitude, longitude: $longitude) {
        ...RestaurantPreviewFields
      }
    }
  `;

export const recentOrderRestaurantsPreviewQuery = `#graphql
    query GetRecentOrderRestaurants($latitude: Float!, $longitude: Float!) {
      recentOrderRestaurants(latitude: $latitude, longitude: $longitude) {
        _id
        name
        image
        deliveryTime
        tax
        shopType
        reviewData {
          total
          ratings
          reviews {
            _id
            rating
          }
        }
        categories {
          _id
          title
        }
      }
    }
  `;
