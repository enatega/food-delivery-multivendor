export const getOrders = `query Orders($page:Int){
    allOrders(page:$page){
      _id
      deliveryAddress
      deliveryCharges
      orderAmount
      paidAmount
      paymentMethod
      orderId
      user{
        _id
        name
        email
        phone
      }
      items{
        _id
        food{
          _id
          title
          description
          image
        }
        variation{
          _id
          title
          price
          discounted
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
            price
          }
        }
        specialInstructions
        quantity
      }
      reason
      status
      paymentStatus
      orderStatus
      createdAt
      review{
        _id
        rating
        description
      }
      rider{
        _id
        name
      }
    }
  }`

export const reviews = `query Reviews($restaurant:String!){
    reviews(restaurant:$restaurant){
      _id
      order{
        _id
        orderId
        items{
          title
        }
        user{
          _id
          name
          email
        }
      }
      restaurant{
        _id
        name
        image
      }
      rating
      description
      createdAt
    }
  }
`

export const getOrdersByDateRange = `query GetOrdersByDateRange($startingDate: String!, $endingDate: String!, $restaurant: String!) {
    getOrdersByDateRange(startingDate: $startingDate, endingDate: $endingDate, restaurant: $restaurant) {
      totalAmountCashOnDelivery
      countCashOnDeliveryOrders
    }
    
  }
`

export const getOrdersByRestaurant = `query ordersByRestId($restaurant:String!,$page:Int,$rows:Int,$search:String){
    ordersByRestId(restaurant:$restaurant,page:$page,rows:$rows,search:$search){
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
        details
        label
      }
      items{
        _id
        title
        description
        image
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
          description
          title
          quantityMinimum
          quantityMaximum
        }
        specialInstructions
        isActive
        createdAt
        updatedAt
      }
      user{
        _id
        name
        phone
        email
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      status
      paymentStatus
      reason
      isActive
      createdAt
      deliveryCharges
      tipping
      taxationAmount
      rider{
        _id
        name
        username
        available
      }
    }
  }`

export const getDashboardTotal = `query GetDashboardTotal($startingDate: String, $endingDate: String,$restaurant:String!){
    getDashboardTotal(starting_date: $startingDate, ending_date: $endingDate,restaurant:$restaurant){
      totalOrders
      totalSales
    }
  }`
export const getDashboardSales = `query GetDashboardSales($startingDate: String, $endingDate: String,$restaurant:String!){
    getDashboardSales(starting_date: $startingDate, ending_date: $endingDate,restaurant:$restaurant){
      orders{
        day
        amount
      }
    }
  }`
export const getDashboardOrders = `query GetDashboardOrders($startingDate: String, $endingDate: String,$restaurant:String!){
    getDashboardOrders(starting_date: $startingDate, ending_date: $endingDate,restaurant:$restaurant){
      orders{
        day
        count
      }
    }
  }`

export const getDashboardData = `query GetDashboardData($startingDate: String, $endingDate: String){
    getDashboardData(starting_date: $startingDate, ending_date: $endingDate){
      totalOrders
      totalUsers
      totalSales
      orders{
        day
        count
        amount
      }
    }
  }`

export const getConfiguration = `query GetConfiguration{
    configuration{
      _id
      email
      emailName
      password
      enableEmail
      clientId
      clientSecret
      sandbox
      publishableKey
      secretKey
      currency
      currencySymbol
      deliveryRate
      twilioAccountSid
      twilioAuthToken
      twilioPhoneNumber
      twilioEnabled
      formEmail
      sendGridApiKey
      sendGridEnabled   
      sendGridEmail
      sendGridEmailName
      sendGridPassword
      dashboardSentryUrl
      webSentryUrl
      apiSentryUrl
      customerAppSentryUrl
      restaurantAppSentryUrl
      riderAppSentryUrl
      googleApiKey
      cloudinaryUploadUrl
      cloudinaryApiKey
      webAmplitudeApiKey
      appAmplitudeApiKey
      webClientID
      androidClientID
      iOSClientID
      expoClientID
     
      googleMapLibraries
      googleColor    
      termsAndConditions
      privacyPolicy
      testOtp
      firebaseKey
      authDomain
      projectId
      storageBucket
      msgSenderId
      appId
      measurementId
      isPaidVersion
      skipEmailVerification
      skipMobileVerification
    }
  }`

export const orderCount = `
query OrderCount($restaurant:String!){
  orderCount(restaurant:$restaurant)
}`

export const getActiveOrders = `query GetActiveOrders($restaurantId:ID){
  getActiveOrders(restaurantId:$restaurantId){
    _id
    zone{
      _id
    }
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
      details
      label
    }
    items{
      _id
      title
      description
      image
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
        description
        title
        quantityMinimum
        quantityMaximum
      }
      specialInstructions
      isActive
      createdAt
      updatedAt
    }
    user{
      _id
      name
      phone
      email
    }
    paymentMethod
    paidAmount
    orderAmount
    orderStatus
    isPickedUp
    status
    paymentStatus
    reason
    isActive
    createdAt
    deliveryCharges
    rider{
      _id
      name
      username
      available
    }
  }
}`

export const getRidersByZone = `query RidersByZone($id:String!){
  ridersByZone(id:$id){
    _id
    name
    username
    password
    phone
    available
    zone{
      _id
      title
    }
  }
}`

export const getZones = `query Zones{
    zones{
    _id
    title
    description
    location{coordinates}
    isActive
    }
}`

export const getVendors = `query Vendors{
    vendors{
      _id
      email
      userType
      restaurants{
        _id
        orderId
        orderPrefix
        slug
        name
        image
        address
        location{coordinates}
        zone{
          _id
          title
        }
        shopType
      }
    }
}`

export const getVendor = `query GetVendor($id:String!){
    getVendor(id:$id){
        _id
        email
        userType
        restaurants{
          _id
          orderId
          orderPrefix
          slug
          name
          image
          address
          location{coordinates}
          shopType
        }
    }
}`

export const getTaxation = `query Taxes{
    taxes {
      _id
      taxationCharges
      enabled
      }
    }`

export const getCoupons = `query Coupons{
    coupons {
      _id
      title
      discount
      enabled
    }
  }`

  export const getCuisines = `query Cuisines{
    cuisines {
      _id
      name
      description
    }
  }`

export const getTipping = `query Tips{
    tips {
      _id
      tipVariations
      enabled
    }
  }`

export const getAddons = `query Addons{
    addons{
    _id
    title
    description
    options{
      _id
      title
      description
      price
    }
    quantityMinimum
    quantityMaximum
  }}`

export const getOptions = `query Options{
    options {
      _id
      title
      description
      price
    }
  }
  `
export const getPaymentStatuses = `query{
    getPaymentStatuses
  }`

export const restaurantByOwner = `query RestaurantByOwner($id:String){
  restaurantByOwner(id:$id){
  _id
  email
  userType
  restaurants{
    _id
    orderId
    orderPrefix
    name
    slug
    image
    address
    username
    password
    location{coordinates}
    shopType
    }
  }
}`

export const restaurantList = `query RestaurantList{
  restaurantList{
    _id
    name
    address
  }
}`

export const restaurants = `query Restaurants{
  restaurants{
    _id
    name
    image
    orderPrefix
    slug
    address
    deliveryTime
    minimumOrder
    isActive
    commissionRate
    tax
    owner{
      _id
      email
    }
    shopType
  }
}
`

export const getRestaurantProfile = `query Restaurant($id:String){
      restaurant(id:$id)
      {
      _id
      orderId
      orderPrefix
      slug
      name
      image
      address
      location{coordinates}
      deliveryBounds{
        coordinates
      }
      username
      password
      deliveryTime
      minimumOrder
      tax
      isAvailable
      stripeDetailsSubmitted
      openingTimes{
        day
        times{
          startTime
          endTime
        }
      }
      owner{
        _id
        email
      }
      shopType
      cuisines
    }
}`

export const getRestaurantDetail = `query Restaurant($id:String){
      restaurant(id:$id){
      _id
      orderId
      orderPrefix
      slug
      name
      image
      address
      location{coordinates}
      deliveryTime
      minimumOrder
      tax
      categories{
        _id
        title
        foods{
          _id
          title
          description
          variations{
            _id
            title
            price
            discounted
            addons
          }
          image
          isActive
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
      shopType
    }
}`

export const getOffers = `query Offers{
  offers{
    _id
    name
    tag
    restaurants{
      _id
      name
    }
  }
}`

export const getSections = `query Sections{
  sections{
    _id
    name
    enabled
    restaurants{
      _id
      name
    }
  }
}`

export const pageCount = `
query PageCount($restaurant:String!){
  pageCount(restaurant:$restaurant)
}
`
export const getUsers = `query{
    users{
      _id
      name
      email
      phone
      addresses{
        location{coordinates}
        deliveryAddress
      }
    }
  }`

export const getRiders = `query{
    riders{
      _id
      name
      username
      password
      phone
      available
      zone{
        _id
        title
      }
    }
  }`

export const getAvailableRiders = `query{
    availableRiders{
      _id
      name
      username
      phone
      available
      zone{
        _id
      }
    }
  }`

export const withdrawRequestQuery = `query GetWithdrawRequests($offset:Int){
      getAllWithdrawRequests(offset:$offset){
          success
          message
          data{
            _id
            requestId
            requestAmount
            requestTime
            rider{
              _id
              name
              currentWalletAmount
            }
            status
          }
          pagination{
            total
          }
      }
  }`
