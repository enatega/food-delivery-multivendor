export const profile = `
query Rider($id:String){
    rider(id:$id){
      _id
      name
      email
      accountNumber
      username
      available
      zone{
        _id
      }
      currentWalletAmount
      totalWalletAmount
      withdrawnWalletAmount
    }
  }`

export const configuration = `query Configuration{
    configuration{
      _id
      currency
      currencySymbol
      riderAppSentryUrl
      googleApiKey
    }
  }`

export const riderOrders = `query RiderOrders{
  riderOrders{
        _id
      orderId
      createdAt
      acceptedAt
      pickedAt
      assignedAt
      isPickedUp
      deliveredAt
      expectedTime
      deliveryCharges
      restaurant{
        _id
        name
        address
        location{coordinates}
      }
      deliveryAddress{
        location{coordinates}
        deliveryAddress
        label
        details
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
        }
        addons{
          _id
          options{
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
      user{
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
      rider{
        _id
        name
        username
      }
    }
    }`

export const riderEarnings = `
  query RiderEarnings($riderEarningsId: String, $offset:Int) {
  riderEarnings(id: $riderEarningsId, offset:$offset) {
    orderId
    deliveryFee
    orderStatus
    paymentMethod
    deliveryTime
  }
}
`

export const riderWithdrawRequest = `
query RiderWithdrawRequests($riderWithdrawRequestsId: String, $offset:Int) {
  riderWithdrawRequests(id: $riderWithdrawRequestsId, offset:$offset) {
    _id
    requestId
    requestAmount
    requestTime
    rider {
      name
      email
      accountNumber
    }
    status
  }
}
`
export const chat = `query Chat($order: ID!) {
  chat(order: $order) {
    id
    message
    user {
      id
      name
    }
    createdAt
  }
}`

export const defaultRiderCreds = `query LastOrderCreds {
  lastOrderCreds {
    riderUsername
    riderPassword
  }
}`
