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
        shopType
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
      acceptedAt
      assignedAt
      pickedAt
      deliveredAt
      cancelledAt
      eta {
        phase source readyAt baseArrivalAt estimatedArrivalAt
        windowStartAt windowEndAt durationSeconds distanceMeters
        encodedPolyline calculatedAt lastLocationAt version
      }
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
      preparationTime
      isPickedUp
      acceptedAt
      assignedAt
      pickedAt
      deliveredAt
      cancelledAt
      eta {
        phase source readyAt baseArrivalAt estimatedArrivalAt
        windowStartAt windowEndAt durationSeconds distanceMeters
        encodedPolyline
        origin { latitude longitude }
        destination { latitude longitude }
        calculatedAt lastLocationAt version
      }
    }
  }
`;

export const SUBSCRIPTION_ORDER_TRACKING = gql`
  subscription SubscriptionOrderTracking($id: String!) {
    subscriptionOrderTracking(id: $id) {
      orderId
      status
      riderLocation {
        latitude
        longitude
        accuracy
        heading
        speed
        recordedAt
      }
      eta {
        phase source readyAt baseArrivalAt estimatedArrivalAt
        windowStartAt windowEndAt durationSeconds distanceMeters
        encodedPolyline
        origin { latitude longitude }
        destination { latitude longitude }
        calculatedAt lastLocationAt version
      }
    }
  }
`;
