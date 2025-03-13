import { gql } from '@apollo/client';

export const CREATE_RESTAURANT = gql`
  mutation CreateRestaurant($restaurant: RestaurantInput!, $owner: ID!) {
    createRestaurant(restaurant: $restaurant, owner: $owner) {
      _id
      name
      image
      username
      orderPrefix
      slug
      phone
      address
      deliveryTime
      minimumOrder
      isActive
      commissionRate
      tax
      owner {
        _id
        email
        isActive
      }
      shopType
      orderId
      logo
      password
      location {
        coordinates
      }
      cuisines
    }
  }
`;

// Delete
export const DELETE_RESTAURANT = gql`
  mutation DeleteRestaurant($id: String!) {
    deleteRestaurant(id: $id) {
      _id
      isActive
    }
  }
`;

export const HARD_DELETE_RESTAURANT = gql`
  mutation HardDeleteRestaurant($id: String!) {
    hardDeleteRestaurant(id: $id)
  }
`;

export const UPDATE_DELIVERY_BOUNDS_AND_LOCATION = gql`
  mutation updateDeliveryBoundsAndLocation(
    $id: ID!
    $boundType: String!
    $bounds: [[[Float!]]]
    $circleBounds: CircleBoundsInput
    $location: CoordinatesInput!
    $address: String
    $postCode: String
    $city: String
  ) {
    result: updateDeliveryBoundsAndLocation(
      id: $id
      boundType: $boundType
      circleBounds: $circleBounds
      bounds: $bounds
      location: $location
      address: $address
      postCode: $postCode
      city: $city
    ) {
      success
      message
      data {
        _id
        deliveryBounds {
          coordinates
        }
        location {
          coordinates
        }
      }
    }
  }
`;

export const EDIT_RESTAURANT = gql`
  mutation EditRestaurant($restaurantInput: RestaurantProfileInput!) {
    editRestaurant(restaurant: $restaurantInput) {
      _id
      orderId
      orderPrefix
      name
      phone
      image
      logo
      slug
      address
      username
      password
      location {
        coordinates
      }
      isAvailable
      minimumOrder
      tax
      openingTimes {
        day
        times {
          startTime
          endTime
        }
      }
      shopType
    }
  }
`;

export const DUPLICATE_RESTAURANT = gql`
  mutation DuplicateRestaurant($id: String!, $owner: String!) {
    duplicateRestaurant(id: $id, owner: $owner) {
      _id
      name
      image
      username
      orderPrefix
      slug
      address
      deliveryTime
      minimumOrder
      isActive
      commissionRate
      tax
      owner {
        _id
        email
        isActive
      }
      shopType
      orderId
      logo
      password
      location {
        coordinates
      }
      cuisines
    }
  }
`;

export const UPDATE_FOOD_OUT_OF_STOCK = gql`
  mutation UpdateFoodOutOfStock(
    $id: String!
    $restaurant: String!
    $categoryId: String!
  ) {
    updateFoodOutOfStock(
      id: $id
      restaurant: $restaurant
      categoryId: $categoryId
    )
  }
`;

export const UPDATE_RESTAURANT_DELIVERY = gql`
  mutation updateRestaurantDelivery(
    $id: ID!
    $minDeliveryFee: Float
    $deliveryDistance: Float
    $deliveryFee: Float
  ) {
    updateRestaurantDelivery(
      id: $id
      minDeliveryFee: $minDeliveryFee
      deliveryDistance: $deliveryDistance
      deliveryFee: $deliveryFee
    ) {
      success
      message
      data {
        _id
      }
    }
  }
`;
