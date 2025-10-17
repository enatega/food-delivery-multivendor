import gql from 'graphql-tag'

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

export const placeOrder = `
  mutation PlaceOrder($restaurant:String!,$orderInput:[OrderInput!]!,$paymentMethod:String!,$couponCode:String,$tipping:Float!, $taxationAmount: Float!,$address:AddressInput!, $orderDate: String!,$isPickedUp: Boolean!, $deliveryCharges: Float!, $instructions: String){
    placeOrder(restaurant:$restaurant,orderInput: $orderInput,paymentMethod:$paymentMethod,couponCode:$couponCode,tipping:$tipping, taxationAmount: $taxationAmount, address:$address, orderDate: $orderDate,isPickedUp: $isPickedUp, deliveryCharges:$deliveryCharges, instructions: $instructions) {
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
      }
      review{
        _id
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      orderDate
      expectedTime
      isPickedUp
      tipping
      taxationAmount
      createdAt
      completionTime
      preparationTime
      deliveryCharges
      acceptedAt
      pickedAt
      deliveredAt
      cancelledAt
      assignedAt
      instructions
    }
  }`

export const pushToken = `mutation PushToken($token:String){
    pushToken(token:$token){
      _id
      notificationToken
    }
  }`

export const forgotPassword = `mutation ForgotPassword($email:String!){
    forgotPassword(email:$email){
      result
    }
  }`

export const resetPassword = `mutation ResetPassword($password:String!,$email:String!){
    resetPassword(password:$password,email:$email){
      result
    }
  }`

export const getCoupon = `mutation Coupon($coupon:String!){
    coupon(coupon:$coupon){
      _id
      title
      discount
      enabled
    }
  }`

export const deleteAddress = `mutation DeleteAddress($id:ID!){
    deleteAddress(id:$id){
      _id
      addresses{
        _id
        label
        deliveryAddress
        details
        location{coordinates}
      }
    }
  }`

export const deleteBulkAddresses = `mutation DeleteBulkAddresses($ids:[ID!]!){
  deleteBulkAddresses(ids:$ids){
      _id
      addresses{
        _id
        label
        deliveryAddress
        details
        location{coordinates}
      }
    }
  }`

export const createAddress = `mutation CreateAddress($addressInput:AddressInput!){
    createAddress(addressInput:$addressInput){
      _id
      addresses{
        _id
        label
        deliveryAddress
        details
        location{coordinates}
        selected
      }
    }
  }`

export const editAddress = `mutation EditAddress($addressInput:AddressInput!){
    editAddress(addressInput:$addressInput){
      _id
      addresses{
        _id
        label
        deliveryAddress
        details
        location{coordinates}
        selected
      }
    }
  }`

export const changePassword = `mutation ChangePassword($oldPassword:String!,$newPassword:String!){
    changePassword(oldPassword:$oldPassword,newPassword:$newPassword)
  }`

export const selectAddress = `mutation SelectAddress($id:String!){
    selectAddress(id:$id){
      _id
      addresses{
        _id
        label
        deliveryAddress
        details
        location{coordinates}
        selected
      }
    }
  }`

export const reviewOrder = `mutation ReviewOrder(
    $order:String!,
    $rating:Int!,
    $description:String,
  ){
    reviewOrder(reviewInput:{
      order:$order,
      rating:$rating,
      description:$description,
    }){
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
    }
  }`

export const addFavouriteRestaurant = `mutation AddFavourite($id:String!){
    addFavourite(id:$id){
      _id
      addresses{
        _id
        label
        deliveryAddress
        details
        location{coordinates}
        selected
      }
    }
  }`

export const emailExist = `
  mutation EmailExist($email: String!) {
    emailExist(email: $email) {
      userType
      _id
      email
    }
  }`

export const phoneExist = `
  mutation PhoneExist($phone: String!) {
    phoneExist(phone: $phone) {
      userType
      _id
      phone
    }
  }`

export const sendOtpToEmail = `
  mutation SendOtpToEmail($email: String!) {
    sendOtpToEmail(email: $email) {
      result
    }
  }
  `
export const sendOtpToPhoneNumber = `
  mutation SendOtpToPhoneNumber($phone: String!) {
    sendOtpToPhoneNumber(phone: $phone) {
      result
    }
  }
  `
export const Deactivate = `
  mutation deactivated($isActive: Boolean!, $email: String!) {
    Deactivate(isActive: $isActive,email: $email) {
      isActive
    }
  }
  `
export const login = `
  mutation Login($email:String,$password:String,$type:String!,$appleId:String,$name:String,$notificationToken:String){
    login(email:$email,password:$password,type:$type,appleId:$appleId,name:$name,notificationToken:$notificationToken){
     userId
     token
     tokenExpiration
     isActive
     name
     email
     phone
     isNewUser
   }
  }
  `
export const createUser = `
    mutation CreateUser($phone:String,$email:String,$password:String,$name:String,$notificationToken:String,$appleId:String, $emailIsVerified:Boolean, $isPhoneExists:Boolean){
        createUser(userInput:{
            phone:$phone,
            email:$email,
            password:$password,
            name:$name,
            notificationToken:$notificationToken,
            appleId:$appleId,
            emailIsVerified:$emailIsVerified
            isPhoneExists:$isPhoneExists
        }){
            userId
            token
            tokenExpiration
            name
            email
            phone
        }
      }`

export const updateUser = `
      mutation UpdateUser($name:String!,$phone:String,$phoneIsVerified:Boolean,$emailIsVerified:Boolean){
          updateUser(updateUserInput:{name:$name,phone:$phone,phoneIsVerified:$phoneIsVerified,emailIsVerified:$emailIsVerified}){
            _id
            name
            phone
            phoneIsVerified
            emailIsVerified
          }
        }`

export const updateNotificationStatus = `
          mutation UpdateNotificationStatus($offerNotification:Boolean!,$orderNotification:Boolean!){
            updateNotificationStatus(offerNotification:$offerNotification,orderNotification:$orderNotification){
              _id
              notificationToken
              isOrderNotification
              isOfferNotification
            }
          }`

export const cancelOrder = `
          mutation($abortOrderId: String!){
            abortOrder(id: $abortOrderId) {
              _id
              orderStatus
            }
          }`

export const createActivity = `
   mutation createActivity(
      $groupId: String!
      $module: String!
      $screenPath: String!
      $type: String!
      $details: String!
    ) {
        createActivity(
          groupId:$groupId
          module: $module
          screenPath: $screenPath
          type: $type
          details: $details
      )
    }
`

export const VERIFY_OTP = gql`
 mutation VerifyOtp($otp: String!, $email: String, $phone: String) {
    verifyOtp(otp: $otp, email: $email, phone: $phone) {
        result
    }
}
`
