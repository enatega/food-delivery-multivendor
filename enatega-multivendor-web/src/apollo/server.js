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
`;
export const login = `
mutation Login($email:String,$password:String,$type:String!,$appleId:String,$name:String,$notificationToken:String){
  login(email:$email,password:$password,type:$type,appleId:$appleId,name:$name,notificationToken:$notificationToken){
   userId
   token
   tokenExpiration
   name
   email
   phone
 }
}
`;

export const emailExist = `
  mutation EmailExist($email:String!){
    emailExist(email:$email){
      _id
    }
  }`;

export const phoneExist = `
mutation PhoneExist($phone:String!){
  phoneExist(phone:$phone){
    _id
  }
}`;

export const sendOtpToEmail = `
  mutation SendOtpToEmail($email: String!, $otp: String!) {
    sendOtpToEmail(email: $email, otp: $otp) {
      result
    }
  }
  `;
export const sendOtpToPhoneNumber = `
mutation SendOtpToPhoneNumber($phone: String!, $otp: String!) {
  sendOtpToPhoneNumber(phone: $phone, otp: $otp) {
    result
  }
}
`;
export const resetPassword = `mutation ResetPassword($password:String!,$email:String!){
  resetPassword(password:$password,email:$email){
    result
  }
}`;
export const createUser = `
  mutation CreateUser($phone:String,$email:String,$password:String,$name:String,$notificationToken:String,$appleId:String){
      createUser(userInput:{
          phone:$phone,
          email:$email,
          password:$password,
          name:$name,
          notificationToken:$notificationToken,
          appleId:$appleId
      }){
          userId
          token
          tokenExpiration
          name
          email
          phone
      }
    }`;

export const updateUser = `
    mutation UpdateUser($name:String!,$phone:String,$phoneIsVerified:Boolean,$emailIsVerified:Boolean){
        updateUser(updateUserInput:{name:$name,phone:$phone,phoneIsVerified:$phoneIsVerified,emailIsVerified:$emailIsVerified}){
          _id
          name
          phone
          phoneIsVerified
          emailIsVerified
        }
      }`;

export const updateNotificationStatus = `
        mutation UpdateNotificationStatus($offerNotification:Boolean!,$orderNotification:Boolean!){
          updateNotificationStatus(offerNotification:$offerNotification,orderNotification:$orderNotification){
            _id
            notificationToken
            isOrderNotification
            isOfferNotification
          }
        }`;

export const profile = `
        query{
          profile{
            _id
            name
            phone
            phoneIsVerified
            email
            emailIsVerified
            notificationToken
            isOrderNotification
            isOfferNotification
            addresses{
              _id
              label
              deliveryAddress
              details
              location{coordinates}
              selected
            }
            favourite
          }
        }`;

export const order = `query Order($id:String!){
  order(id:$id){
    _id
    orderId
    deliveryAddress{
      location{coordinates}
      deliveryAddress
      details
      label
    }
    items{
      title
      food
      description
      image
      quantity
      variation{
        title
        price
        discounted
      }
      addons{
        title
        options{
          title
          description
          price
        }
      }
    }
    user{
      _id
      name
      email
    }
    paymentMethod
    orderAmount
    orderDate
    expectedTime
    isPickedUp
    preparationTime
  }
}
`;
export const orderPaypal = `query OrderPaypal($id:String!){
  orderPaypal(id:$id){
    _id
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
      details
      label
    }
    deliveryCharges
    orderId
    user{
      _id
      phone
      email
      name
    }
    items{
      _id
      food
      variation{
        _id
        title
        price
      }
      addons{
        _id
        title
        description
        quantityMinimum
        quantityMaximum
        options{
          _id
          title
          description
          price
        }
      }
      quantity
    }
    taxationAmount
    tipping
    paymentStatus
    paymentMethod
    orderAmount
    paidAmount
    orderStatus
    orderDate
    expectedTime
    isPickedUp
    createdAt
    preparationTime
  }
}
`;

export const orderStripe = `query OrderStripe($id:String!){
  orderStripe(id:$id){
    _id
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
      details
      label
    }
    deliveryCharges
    orderId
    user{
      _id
      phone
      email
      name
    }
    items{
      _id
      food
      variation{
        _id
        title
        price
      }
      addons{
        _id
        title
        description
        quantityMinimum
        quantityMaximum
        options{
          _id
          title
          description
          price
        }
      }
      quantity
    }
    taxationAmount
    tipping
    paymentStatus
    paymentMethod
    orderAmount
    paidAmount
    orderStatus
    orderDate
    expectedTime
    isPickedUp
    createdAt
    preparationTime
  }
}
`;

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

export const myOrders = `query Orders($offset:Int){
  orders(offset:$offset){
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
    cancelledAt
    assignedAt
    deliveredAt
    acceptedAt
    pickedAt
    preparationTime
  }
}
`;

export const placeOrder = `
mutation PlaceOrder($restaurant:String!,$orderInput:[OrderInput!]!,$paymentMethod:String!,$couponCode:String,$tipping:Float!, $taxationAmount: Float!,$address:AddressInput!, $orderDate: String!,$isPickedUp: Boolean!, $deliveryCharges: Float!){
  placeOrder(restaurant:$restaurant,orderInput: $orderInput,paymentMethod:$paymentMethod,couponCode:$couponCode,tipping:$tipping, taxationAmount: $taxationAmount, address:$address, orderDate: $orderDate, isPickedUp: $isPickedUp, deliveryCharges: $deliveryCharges) {
    _id
    orderId
    restaurant{
      _id
      name
      image
      slug
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
    orderDate
    expectedTime
    isPickedUp
    deliveryCharges
    tipping
    taxationAmount
    createdAt
    completionTime
    preparationTime
  }
}`;

export const pushToken = `mutation PushToken($token:String){
  pushToken(token:$token){
    _id
    notificationToken
  }
}`;

export const forgotPassword = `mutation ForgotPassword($email:String!, $otp:String!){
  forgotPassword(email:$email,otp:$otp){
    result
  }
}`;

export const getConfiguration = `query Configuration{
  configuration{
    _id
    currency
    currencySymbol
    deliveryRate
    twilioEnabled
    webClientID
    googleApiKey
    webAmplitudeApiKey
    googleMapLibraries
    googleColor
    webSentryUrl
    publishableKey
    clientId
    skipEmailVerification
    skipMobileVerification
    costType
    vapidKey
  }
}`;

export const getConfigurationSpecific = `query Configuration{
  configuration{
    webAmplitudeApiKey
  }
}`;

export const getCoupon = `mutation Coupon($coupon:String!){
  coupon(coupon:$coupon){
    _id
    title
    discount
    enabled
  }
}`;

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
}`;

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
}`;

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
}`;

export const changePassword = `mutation ChangePassword($oldPassword:String!,$newPassword:String!){
  changePassword(oldPassword:$oldPassword,newPassword:$newPassword)
}`;

export const restaurantList = `query Restaurants($latitude:Float,$longitude:Float){
  nearByRestaurants(latitude:$latitude,longitude:$longitude){
    offers{
      _id
      name
      tag
      restaurants
    }
    sections{
      _id
      name
      restaurants
    }
    restaurants{
      _id
      name
      image
      slug
      address
      location{coordinates}
      deliveryTime
      minimumOrder
      tax
      reviewData{
          total
          ratings
          reviews{
            _id
          }
      }
      categories{
        _id
        title
        foods{
          _id
          title
        }
      }
      rating
      isAvailable
      openingTimes{
      day
      times{
        startTime
        endTime
      }
    }
  }
}
}`;

export const restaurant = `query Restaurant($id:String,$slug:String){
  restaurant(id:$id,slug:$slug){
    _id
    orderId
    orderPrefix
    name
    image
    slug
    address
    location{coordinates}
    deliveryTime
    minimumOrder
    tax
    reviewData{
      total
      ratings
      reviews{
        _id
        order{
          user{
            _id
            name
            email
          }
        }
        rating
        description
        createdAt
      }
    }
    categories{
      _id
      title
      foods{
        _id
        title
        image
        description
        variations{
          _id
          title
          price
          discounted
          addons
        }
      }
    }
    options{
      _id
      title
      description
      price
    }
    addons{
      _id
      options
      title
      description
      quantityMinimum
      quantityMaximum
    }
    zone{
      _id
      title
      tax
    }
    rating
    isAvailable
    openingTimes{
      day
      times{
        startTime
        endTime
      }
    }
  }
}`;

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
}`;

export const subscriptionRiderLocation = `subscription SubscriptionRiderLocation($riderId:String!){
  subscriptionRiderLocation(riderId:$riderId) {
    _id
    location {coordinates}
  }
}`;

export const rider = `query Rider($id:String){
  rider(id:$id){
    _id
    location {coordinates}
  }
}`;

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
      slug
      address
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
    orderDate
    expectedTime
    isPickedUp
    tipping
    taxationAmount
    createdAt
    completionTime
    preparationTime
  }
}`;

export const subscriptionOrder = `subscription SubscriptionOrder($id:String!){
  subscriptionOrder(id:$id){
      _id
      orderStatus
      rider{
          _id
      }
      completionTime
  }
}`;

export const getTaxation = `query Taxes{
  taxes {
    _id
    taxationCharges
    enabled
    }
  }`;

export const getTipping = `query Tips{
    tips {
      _id
      tipVariations
      enabled
    }
  }`;

export const FavouriteRestaurant = `query UserFavourite ($latitude:Float,$longitude:Float){
    userFavourite(latitude:$latitude,longitude:$longitude) {
      _id
      orderId
      orderPrefix
      name
      image
      slug
      address
      location{coordinates}
      deliveryTime
      minimumOrder
      tax
      reviewData{
        total
        ratings
        reviews{
          _id
          order{
            user{
              _id
              name
              email
            }
          }
          rating
          description
          createdAt
        }
      }
      categories{
        _id
        title
        foods{
          _id
          title
          image
          description
          variations{
            _id
            title
            price
            discounted
            addons
          }
        }
      }
      options{
        _id
        title
        description
        price
      }
      addons{
        _id
        options
        title
        description
        quantityMinimum
        quantityMaximum
      }
      rating
      isAvailable
      openingTimes{
        day
        times{
          startTime
          endTime
        }
      }
     }
  }`;

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
  }`;

export const saveNotificationTokenWeb = `mutation SaveNotificationTokenWeb($token:String!){
  saveNotificationTokenWeb(token:$token){
    success
    message
  }
}`;
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
}`;

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
}`;
