export const login = `mutation RestaurantLogin($username:String!,$password:String!){
    restaurantLogin(username:$username,password:$password){
        token
        restaurantId
    }
}`

export const acceptOrder = `mutation AcceptOrder($_id:String!, $time:String){
    acceptOrder(_id:$_id, time:$time){
        _id
      orderStatus
      preparationTime
    }
}`

export const cancelOrder = `mutation CancelOrder($_id:String!,$reason:String!){
    cancelOrder(_id:$_id,reason:$reason){
        _id
      orderStatus
    }
}`
export const orderPickedUp = `mutation OrderPickedUp($_id:String!){
  orderPickedUp(_id:$_id){
        _id
      orderStatus
    }
}`

export const saveToken = `mutation saveRestaurantToken($token:String, $isEnabled:Boolean){
  saveRestaurantToken(token:$token, isEnabled: $isEnabled ){
    _id
    notificationToken
    enableNotification
  }
}`

export const toggleAvailability = `mutation ToggleAvailability{
  toggleAvailability{
    _id
    isAvailable
  }
}`
export const muteRingOrder = `mutation muteRing($orderId:String){
  muteRing(orderId:$orderId)
}`
