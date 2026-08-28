export const orderStatusChanged = `subscription OrderStatusChanged($userId:String!){
    orderStatusChanged(userId:$userId){
      userId
      origin
      rawOrder{
        _id
      orderId
      restaurant{
        _id
        name
        image
        address
        location{coordinates}
      }
      deliveryAddress{
        location{coordinates}
        deliveryAddress
        id
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
        phone
        location {
            coordinates
          }
      }
      review{
        _id
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      orderState
      tipping
      taxationAmount
      createdAt
      completionTime
      preparationTime
      orderDate
      expectedTime
      isPickedUp
      deliveryType
      deliveryCharges
      acceptedAt
      pickedAt
      deliveredAt
      cancelledAt
      assignedAt
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
      }
    }
  }`

export const paymentSuccess = `subscription PaymentSuccess($userId: String!) {
subscriptionPaymentSuccess(userId: $userId) {
userId
orderId
orderObjId
orderStatus
paymentStatus
paymentMethod
}
}`

export const orderTracking = `query SingleVendorOrderTracking($id: ID!) {
  orderTracking(id: $id) {
    orderId
    status
    riderLocation { latitude longitude accuracy heading speed recordedAt }
    eta {
      phase source readyAt baseArrivalAt estimatedArrivalAt windowStartAt windowEndAt
      durationSeconds distanceMeters encodedPolyline calculatedAt lastLocationAt version
      origin { latitude longitude }
      destination { latitude longitude }
    }
  }
}`

export const subscriptionOrderTracking = `subscription SingleVendorOrderTrackingUpdated($id: String!) {
  subscriptionOrderTracking(id: $id) {
    orderId
    status
    riderLocation { latitude longitude accuracy heading speed recordedAt }
    eta {
      phase source readyAt baseArrivalAt estimatedArrivalAt windowStartAt windowEndAt
      durationSeconds distanceMeters encodedPolyline calculatedAt lastLocationAt version
      origin { latitude longitude }
      destination { latitude longitude }
    }
  }
}`
