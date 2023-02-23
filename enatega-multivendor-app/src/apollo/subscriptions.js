export const subscriptionOrder = `subscription SubscriptionOrder($id:String!){
    subscriptionOrder(id:$id){
        _id
        orderStatus
        rider{
            _id
        }
        completionTime
    }
  }`

export const subscriptionRiderLocation = `subscription SubscriptionRiderLocation($riderId:String!){
    subscriptionRiderLocation(riderId:$riderId) {
      _id
      location {coordinates}
    }
  }`

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
        address
        location{coordinates}
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
      tipping
      taxationAmount
      createdAt
      completionTime
      orderDate
      expectedTime
      isPickedUp
      deliveryCharges
      acceptedAt
      pickedAt
      deliveredAt
      cancelledAt
      assignedAt
      }
    }
  }`

export const subscriptionNewMessage = `subscription SubscriptionNewMessage($order:ID!){
  subscriptionNewMessage(order:$order){
    id
    message
    user {
      id
      name
    }
    createdAt
  }
}`
