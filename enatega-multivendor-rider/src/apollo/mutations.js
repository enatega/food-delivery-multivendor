export const riderLogin = `mutation RiderLogin($username:String,$password:String,$notificationToken:String){
  riderLogin(username:$username,password:$password,notificationToken:$notificationToken){
    userId
    token
  }
}`

export const updateOrderStatusRider = `mutation UpdateOrderStatusRider($id:String!,$status:String!){
  updateOrderStatusRider(id:$id,status:$status){
    _id
    orderStatus
  }
}
`

export const assignOrder = `mutation AssignOrder($id:String!){
  assignOrder(id:$id){
    _id
    orderStatus
    rider{
      _id
      name
      username
    }
  }
}`

export const updateLocation = `mutation UpdateRiderLocation($latitude:String!,$longitude:String!){
updateRiderLocation(latitude:$latitude,longitude:$longitude){
  _id
}
}`

export const toggleAvailablity = `
  mutation ToggleRider($id:String){
    toggleAvailablity(id:$id){
      _id
    }
}`

export const createWithdrawRequest = `
  mutation CreateWithdrawRequest($amount: Float!) {
  createWithdrawRequest(amount: $amount) {
    _id
    requestId
    requestAmount
    requestTime
    status
    rider {
      name
      email
      accountNumber
    }
  }
}
`

export const createEarning = `
  mutation CreateEarning($earningsInput: EarningsInput) {
  createEarning(earningsInput: $earningsInput) {
    rider {
      _id
      username
    }
    orderId
    deliveryFee
    orderStatus
    paymentMethod
    deliveryTime
    _id
  }
}
`
export const sendChatMessage = `mutation SendChatMessage($orderId: ID!, $messageInput: ChatMessageInput!) {
  sendChatMessage(message: $messageInput, orderId: $orderId) {
    success
    message
    data {
      id
      message
      user {
        id
        name
      }
      createdAt
    }
  }
}
`
