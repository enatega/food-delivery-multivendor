import { gql } from '@apollo/client'

export const User = `
query Users {
  users {
    _id
   email
 }
}`

export const restaurantFragment = gql`
  fragment RestaurantFields on Restaurant {
    _id
    orderId
    orderPrefix
    name
    image
    address
    location {
      coordinates
    }
    categories {
      _id
      title
      foods {
        _id
        title
        description
        variations {
          _id
          title
          price
          discounted
          addons
        }
        image
        isActive
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
    options {
      _id
      title
      description
      price
    }
    addons {
      _id
      options
      title
      description
      quantityMinimum
      quantityMaximum
    }
    reviewData {
      reviews {
        _id
        order {
          _id
          orderId
          restaurant {
            _id
            name
            image
            address
            slug
          }
          deliveryAddress {
            deliveryAddress
            details
            label
          }
          items {
            _id
            title
            food
            description
            image
            quantity
            variation {
              _id
              title
              price
              discounted
            }
            addons {
              _id
              options {
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
            specialInstructions
            isActive
            createdAt
            updatedAt
          }
          user {
            _id
            name
            phone
            phoneIsVerified
            email
            emailIsVerified
            password
            isActive
            isOrderNotification
            isOfferNotification
            createdAt
            updatedAt
            addresses {
              _id
              deliveryAddress
              details
              label
              selected
            }
            notificationToken
            favourite
            userType
          }
          paymentMethod
          paidAmount
          orderAmount
          status
          paymentStatus
          orderStatus
          reason
          isActive
          createdAt
          updatedAt
          deliveryCharges
          tipping
          taxationAmount
          rider {
            _id
            name
            email
            username
            password
            phone
            image
            available
            isActive
            createdAt
            updatedAt
            accountNumber
            currentWalletAmount
            totalWalletAmount
            withdrawnWalletAmount
          }
          review {
            _id
            rating
            description
            isActive
            createdAt
            updatedAt
          }
          completionTime
          orderDate
          expectedTime
          preparationTime
          isPickedUp
          acceptedAt
          pickedAt
          deliveredAt
          cancelledAt
          assignedAt
          isRinged
          isRiderRinged
        }
        restaurant {
          _id
          orderId
          orderPrefix
          name
          image
          address
          username
          password
          deliveryTime
          minimumOrder
          sections
          rating
          isActive
          isAvailable
          slug
          stripeDetailsSubmitted
          commissionRate
          tax
          notificationToken
          enableNotification
          shopType
        }
        rating
        description
        isActive
        createdAt
        updatedAt
      }
      ratings
      total
    }
    zone {
      _id
      title
      tax
      description
      location {
        coordinates
      }
      isActive
    }
    username
    password
    deliveryTime
    minimumOrder
    sections
    rating
    isActive
    isAvailable
    openingTimes {
      day
      times {
        startTime
        endTime
      }
    }
    slug
    stripeDetailsSubmitted
    commissionRate
    owner {
      _id
      email
    }
    deliveryBounds {
      coordinates
    }
    tax
    notificationToken
    enableNotification
    shopType
  }
`
export const restaurantPreviewFragment = gql`
fragment RestaurantPreviewFields on RestaurantPreview{
  _id
  orderId
  orderPrefix
  name
  image
  address
  username
  password
  deliveryTime
  minimumOrder
  sections
  rating
  isActive
  isAvailable
  slug
  stripeDetailsSubmitted
  commissionRate
  tax
  notificationToken
  enableNotification
  shopType
  cuisines
  keywords
  tags
  reviewCount
  reviewAverage
  }`
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
            isActive
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
        }`

export const cities = `query GetCountryByIso($iso: String!) {
  getCountryByIso(iso: $iso) {
    cities {
      id
      name
      latitude
      longitude
    }
  }
}`

export const order = `query Order($id:String!){
  order(id:$id){
    _id
    orderId
    deliveryAddress{
      location{coordinates}
      deliveryAddress
      details
      label
      id
    }
    restaurant{
      _id
      name
      image
      address
      location{coordinates}
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
    deliveryCharges
    acceptedAt
    pickedAt
    deliveredAt
    cancelledAt
    assignedAt
  }
}
`

export const myOrders = `query Orders($offset:Int){
  orders(offset:$offset){
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
      image
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
      rating
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
    instructions
  }
}
`

export const getConfiguration = `query Configuration{
  configuration{
    _id
    currency
    currencySymbol
    deliveryRate
    twilioEnabled
    androidClientID 
    iOSClientID 
    appAmplitudeApiKey 
    googleApiKey 
    expoClientID 
    customerAppSentryUrl 
    termsAndConditions 
    privacyPolicy 
    testOtp 
    skipMobileVerification
    skipEmailVerification
  }
}`

export const restaurantList = `query Restaurants($latitude:Float,$longitude:Float,$shopType:String){
  nearByRestaurants(latitude:$latitude,longitude:$longitude,shopType:$shopType){
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
      orderId
      orderPrefix
      name
      image
      address
      location{coordinates}
      deliveryTime
      minimumOrder
      tax
      distanceWithCurrentLocation @client
      freeDelivery @client
      acceptVouchers @client
      cuisines
      reviewData{
          total
          ratings
          reviews{
            _id
            order{
              _id
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
}
}`
export const restaurantListPreview = `query Restaurants($latitude:Float,$longitude:Float,$shopType:String){
  nearByRestaurantsPreview(latitude:$latitude,longitude:$longitude,shopType:$shopType){
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
      orderId
      orderPrefix
      name
      image
      address
      username
      password
      deliveryTime
      minimumOrder
      sections
      rating
      isActive
      isAvailable
      slug
      stripeDetailsSubmitted
      commissionRate
      tax
      notificationToken
      enableNotification
      shopType
      cuisines
      keywords
      tags
      reviewCount
      reviewAverage
      openingTimes{
        day
        times {
          startTime
          endTime
        }
      }
    }
}
}`
export const topRatedVendorsInfo = gql`
${restaurantPreviewFragment}
query TopRatedVendors($latitude: Float!, $longitude: Float!) {
  topRatedVendorsPreview(latitude: $latitude, longitude: $longitude) {
    ...RestaurantPreviewFields
  }
}`

export const restaurant = `query Restaurant($id:String){
  restaurant(id:$id){
    _id
    orderId
    orderPrefix
    name
    image
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
}`

export const getCuisines = `query Cuisines{
  cuisines {
    _id
    name
    description
  }
}`

export const rider = `query Rider($id:String){
  rider(id:$id){
    _id
    location {coordinates}
  }
}`

export const getTaxation = `query Taxes{
  taxes {
    _id
    taxationCharges
    enabled
    }
  }`

export const getTipping = `query Tips{
    tips {
      _id
      tipVariations
      enabled
    }
  }`

export const FavouriteRestaurant = `query UserFavourite ($latitude:Float,$longitude:Float){
    userFavourite(latitude:$latitude,longitude:$longitude) {
      _id
      orderId
      orderPrefix
      name
      image
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
  }`

export const orderFragment = `fragment NewOrder on Order {
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
}`

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

export const recentOrderRestaurantsQuery = gql`
  ${restaurantPreviewFragment}
  query GetRecentOrderRestaurants($latitude: Float!, $longitude: Float!) {
    recentOrderRestaurantsPreview(latitude: $latitude, longitude: $longitude) {
      ...RestaurantPreviewFields
    }
  }
`;

export const mostOrderedRestaurantsQuery = gql`
  ${restaurantPreviewFragment}
  query GetMostOrderedRestaurants($latitude: Float!, $longitude: Float!) {
    mostOrderedRestaurantsPreview(latitude: $latitude, longitude: $longitude) {
      ...RestaurantPreviewFields
    }
  }
`;

export const relatedItems = `query RelatedItems($itemId: String!, $restaurantId: String!) {
  relatedItems(itemId: $itemId, restaurantId: $restaurantId)
}`

export const food = `fragment FoodItem on Food{
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
`

export const popularItems = `query PopularItems($restaurantId: String!) {
  popularItems(restaurantId: $restaurantId) {
    id
    count
  }
}
`

