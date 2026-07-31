import { gql } from '@apollo/client';

export const SUBSCRIPTION_PLACE_ORDER = gql`
  subscription SubscribePlaceOrder($restaurant: String!) {
    subscribePlaceOrder(restaurant: $restaurant) {
      userId
      origin
      order {
        _id
        orderId
        restaurant {
          _id
          name
          image
          address
          location {
            coordinates
          }
        }
        deliveryAddress {
          location {
            coordinates
          }
          deliveryAddress
          details
          label
        }
        items {
          _id
          title
          description
          image
          quantity
          variation {
            _id
            title
            price
            discounted
          }
          addons {
            _id
            options {
              _id
              title
              description
              price
            }
            description
            title
            quantityMinimum
            quantityMaximum
          }
          specialInstructions
          isActive
          createdAt
          updatedAt
        }
        user {
          _id
          name
          phone
          email
        }
        paymentMethod
        paidAmount
        orderAmount
        orderStatus
        status
        paymentStatus
        reason
        isActive
        createdAt
        deliveryCharges
        rider {
          _id
          name
          username
          available
        }
      }
    }
  }
`;

export const SUBSCRIPTION_DISPATCH_ORDER = gql`
  subscription SubscriptionDispatcher {
    subscriptionDispatcher {
      _id
      zone {
        _id
      }
      orderId
      restaurant {
        _id
        name
        image
        address
        location {
          coordinates
        }
      }
      deliveryAddress {
        location {
          coordinates
        }
        deliveryAddress
      }
      user {
        name
        phone
      }
      paymentMethod
      orderStatus
      preparationTime
      expectedTime
      acceptedAt
      selectedPrepTime
      isPickedUp
      status
      isActive
      createdAt
      rider {
        _id
        name
        username
        available
      }
    }
  }
`;

export const SUBSCRIPTION_ORDER = gql`
  subscription SubscriptionOrder($id: String!) {
    subscriptionOrder(id: $id) {
      _id
      orderStatus
      rider {
        _id
      }
    }
  }
`;
