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
        completionTime
        preparationTime
        eta {
          phase source readyAt estimatedArrivalAt windowStartAt windowEndAt calculatedAt lastLocationAt
        }
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
      deliveryType
      preparationTime
      completionTime
      eta {
        phase source readyAt estimatedArrivalAt windowStartAt windowEndAt calculatedAt lastLocationAt
      }
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
      completionTime
      preparationTime
      eta {
        phase source readyAt estimatedArrivalAt windowStartAt windowEndAt calculatedAt lastLocationAt
      }
    }
  }
`;

export const ORDER_TRACKING = gql`
  query OrderTracking($id: ID!) {
    orderTracking(id: $id) {
      orderId
      status
      riderLocation { latitude longitude accuracy heading speed recordedAt }
      eta { phase source readyAt estimatedArrivalAt windowStartAt windowEndAt calculatedAt lastLocationAt }
    }
  }
`;

export const SUBSCRIPTION_ORDER_TRACKING = gql`
  subscription SubscriptionOrderTracking($id: String!) {
    subscriptionOrderTracking(id: $id) {
      orderId
      status
      riderLocation { latitude longitude accuracy heading speed recordedAt }
      eta { phase source readyAt estimatedArrivalAt windowStartAt windowEndAt calculatedAt lastLocationAt }
    }
  }
`;
