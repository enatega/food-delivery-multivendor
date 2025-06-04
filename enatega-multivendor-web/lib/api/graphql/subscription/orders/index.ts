import { gql } from "@apollo/client";

export const orderStatusChanged = `subscription OrderStatusChanged($userId:String!){
    orderStatusChanged(userId:$userId){
      userId
      origin
      order{
        _id
      orderId
      restaurant{
        _id
        name
        image
        slug
        address
        location {
          coordinates
        }
      }
      deliveryAddress{
        location{coordinates}
        deliveryAddress
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
      deliveryCharges
      tipping
      taxationAmount
      orderDate
      expectedTime
      isPickedUp
      createdAt
      completionTime
      preparationTime
      }
    }
  }`;

export const SUBSCRIPTION_ORDER = gql`
  subscription SubscriptionOrder($id: String!) {
    subscriptionOrder(id: $id) {
      _id
      orderStatus
      rider {
        _id
      }
      completionTime
    }
  }
`;
