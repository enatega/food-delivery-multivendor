import { gql } from "@apollo/client";

export const ORDER_TRACKING = gql`query OrderDetails($orderDetailsId: String!) {
  orderDetails(id: $orderDetailsId) {
   _id
    orderId
    restaurant {
      _id
      name
      image
      slug
      shopType
      address
      location {
        coordinates
        __typename
      }
      __typename
    }
    deliveryAddress {
      location {
        coordinates
        __typename
      }
      deliveryAddress
      __typename
    }
    items {
      _id
      title
      food
      description
      quantity
      image
      variation {
        _id
        title
        price
        discounted
        __typename
      }
      addons {
        _id
        options {
          _id
          title
          description
          price
          __typename
        }
        title
        description
        quantityMinimum
        quantityMaximum
        __typename
      }
      __typename
    }
    user {
      _id
      name
      phone
      __typename
    }
    rider{
      _id
    }
    review {
      _id
    }
    paymentMethod
    paidAmount
    orderAmount
    discountAmount
    orderStatus
    deliveryCharges
    tipping
    taxationAmount
    orderDate
    expectedTime
    isPickedUp
    createdAt
    completionTime
    cancelledAt
    assignedAt
    deliveredAt
    acceptedAt
    pickedAt
    preparationTime
    selectedPrepTime
    instructions
    eta {
      phase
      source
      readyAt
      baseArrivalAt
      estimatedArrivalAt
      windowStartAt
      windowEndAt
      durationSeconds
      distanceMeters
      encodedPolyline
      origin { latitude longitude }
      destination { latitude longitude }
      calculatedAt
      lastLocationAt
      version
    }
    __typename
  }
}`;

export const ORDER_LIVE_TRACKING = gql`
  query OrderTracking($id: ID!) {
    orderTracking(id: $id) {
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
        phase
        source
        readyAt
        baseArrivalAt
        estimatedArrivalAt
        windowStartAt
        windowEndAt
        durationSeconds
        distanceMeters
        encodedPolyline
        origin { latitude longitude }
        destination { latitude longitude }
        calculatedAt
        lastLocationAt
        version
      }
    }
  }
`;
