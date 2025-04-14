import { gql } from "@apollo/client";

export const subscriptionRiderLocation = gql`
  subscription SubscriptionRiderLocation($riderId: String!) {
    subscriptionRiderLocation(riderId: $riderId) {
      _id
      location {
        coordinates
      }
    }
  }
`;

export const orderStatusChanged = gql`
  subscription OrderStatusChanged($userId: String!) {
    orderStatusChanged(userId: $userId) {
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
          id
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
            title
            description
            quantityMinimum
            quantityMaximum
          }
        }
        user {
          _id
          name
          phone
        }
        rider {
          _id
          name
        }
        review {
          _id
        }
        paymentMethod
        paidAmount
        orderAmount
        orderStatus
        tipping
        taxationAmount
        createdAt
        completionTime
        preparationTime
        orderDate
        expectedTime
        isPickedUp
        deliveryCharges
        acceptedAt
        pickedAt
        deliveredAt
        cancelledAt
        assignedAt
        instructions
      }
    }
  }
`;

export const SUBSCRIPTION_NEW_MESSAGE = gql`
  subscription SubscriptionNewMessage($order: ID!) {
    subscriptionNewMessage(order: $order) {
      id
      message
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
    }
  }
`;
