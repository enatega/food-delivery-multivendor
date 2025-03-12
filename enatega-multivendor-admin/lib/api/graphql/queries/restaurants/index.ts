import { gql } from '@apollo/client';

export const GET_RESTAURANTS_L = gql`
  query restaurants {
    restaurants {
      _id
    }
  }
`;

export const GET_RESTAURANTS = gql`
  query restaurants {
    restaurants {
      unique_restaurant_id
      _id
      name
      image
      orderPrefix
      slug
      address
      deliveryTime
      minimumOrder
      isActive
      commissionRate
      username
      tax
      owner {
        _id
        email
        isActive
      }
      shopType
    }
  }
`;

export const GET_CLONED_RESTAURANTS = gql`
  query getClonedRestaurants {
    getClonedRestaurants {
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
      username
      tax
      owner {
        _id
        email
        isActive
      }
      shopType
    }
  }
`;

export const GET_RESTAURANTS_BY_OWNER = gql`
  query RestaurantByOwner($id: String) {
    restaurantByOwner(id: $id) {
      _id
      email
      userType
      restaurants {
        unique_restaurant_id
        _id
        orderId
        orderPrefix
        name
        slug
        image
        address
        isActive
        deliveryTime
        minimumOrder
        username
        password
        location {
          coordinates
        }
        deliveryInfo {
          minDeliveryFee
          deliveryDistance
          deliveryFee
        }
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
  }
`;

export const GET_RESTAURANT_DELIVERY_ZONE_INFO = gql`
  query RestaurantDeliveryZoneInfo($id: ID!) {
    getRestaurantDeliveryZoneInfo(id: $id) {
      boundType
      deliveryBounds {
        coordinates
      }
      location {
        coordinates
      }

      circleBounds {
        radius
      }

      address
      city
      postCode
    }
  }
`;

export const GET_RESTAURANT_PROFILE = gql`
  query Restaurant($id: String) {
    restaurant(id: $id) {
      _id
      orderId
      orderPrefix
      slug
      name
      image
      phone
      logo
      address
      location {
        coordinates
      }
      deliveryBounds {
        coordinates
      }
      deliveryInfo {
        minDeliveryFee
        deliveryDistance
        deliveryFee
      }
      username
      password
      deliveryTime
      minimumOrder
      tax
      isAvailable
      stripeDetailsSubmitted
      openingTimes {
        day
        times {
          startTime
          endTime
        }
      }
      owner {
        _id
        email
      }
      shopType
      cuisines
    }
  }
`;
