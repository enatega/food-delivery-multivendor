import { gql } from "@apollo/client";

export const SUBSCRIBE_PLACE_ORDER = gql`
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
        tipping
        taxationAmount
        status
        paymentStatus
        reason
        isActive
        createdAt
        orderDate
        deliveryCharges
        isPickedUp
        preparationTime
        acceptedAt
        isRinged
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

// Per-order status subscription. Mounted per visible order card so a status
// change writes the new orderStatus/isPickedUp/rider back into the normalized
// cache (keyed by _id) and the card re-renders in real time — the same
// mechanism the customer app relies on. subscribePlaceOrder only reliably
// emits on new orders, so this is what keeps status live without a refresh.
export const SUBSCRIPTION_ORDER = gql`
  subscription SubscriptionOrder($id: String!) {
    subscriptionOrder(id: $id) {
      _id
      orderStatus
      isPickedUp
      rider {
        _id
      }
      completionTime
      preparationTime
    }
  }
`;
