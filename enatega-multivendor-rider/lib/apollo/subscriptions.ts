import { gql } from "@apollo/client";

export const SUBSCRIPTION_NEW_MESSAGE = gql`
  subscription SubscriptionNewMessage($order: ID!) {
    subscriptionNewMessage(order: $order) {
      id
      message
      image
      user {
        id
        name
      }
      createdAt
    }
  }
`;

export const SUBSCRIPTION_ZONE_ORDERS = gql`
  subscription SubscriptionZoneOrders($zoneId: String!) {
    subscriptionZoneOrders(zoneId: $zoneId) {
      zoneId
      origin
      order {
        _id
        createdAt
        acceptedAt
        expectedTime
        pickedAt
        assignedAt
        isPickedUp
        deliveredAt
        deliveryCharges
        orderId
        restaurant {
          _id
          name
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
          label
          details
        }
        items {
          _id
          title
          food
          description
          quantity
          variation {
            _id
            title
            price
          }
          addons {
            _id
            options {
              _id
              title
              price
            }
            title
            description
            quantityMinimum
            quantityMaximum
          }
          isActive
          createdAt
        }
        user {
          _id
          name
          phone
        }
        paymentMethod
        paidAmount
        orderAmount
        paymentStatus
        orderStatus
        tipping
        taxationAmount
        reason
        isRiderRinged
        preparationTime
        rider {
          _id
          name
          username
        }
      }
    }
  }
`;

export const SUBSCRIPTION_ASSIGNED_RIDER = gql`
  subscription SubscriptionAssignRider($riderId: String!) {
    subscriptionAssignRider(riderId: $riderId) {
      order {
        _id
        orderId
        createdAt
        acceptedAt
        pickedAt
        isPickedUp
        deliveredAt
        expectedTime
        deliveryCharges
        restaurant {
          _id
          name
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
          label
          details
        }
        items {
          _id
          title
          image
          food
          description
          quantity
          variation {
            _id
            title
            price
          }
          addons {
            _id
            options {
              _id
              title
              price
            }
            title
            description
            quantityMinimum
            quantityMaximum
          }
          isActive
          createdAt
        }
        user {
          _id
          name
          phone
        }
        paymentMethod
        paidAmount
        orderAmount
        paymentStatus
        orderStatus
        tipping
        taxationAmount
        reason
        isRiderRinged
        preparationTime
        rider {
          _id
          name
          username
        }
      }
      origin
    }
  }
`;

export const SUBSCRIPTION_ORDERS = gql`
  subscription SubscriptionOrder($id: String!) {
    subscriptionOrder(id: $id) {
      _id
      orderStatus
      rider {
        _id
      }
      completionTime
      preparationTime
    }
  }
`;
