export const createFood = `
  mutation CreateFood($foodInput:FoodInput!){
      createFood(
          foodInput:$foodInput
      ){
        _id
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
        createdAt
        updatedAt
      }
      }
    }`

export const editFood = `
    mutation EditFood($foodInput:FoodInput!){
        editFood(
            foodInput:$foodInput
        ){
            _id
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
              createdAt
              updatedAt
            }
        }
      }`

export const deleteFood = `
      mutation DeleteFood($id:String!,$restaurant:String!,$categoryId:String!){
        deleteFood(id:$id,restaurant:$restaurant,categoryId:$categoryId){
          _id
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
            createdAt
            updatedAt
          }
        }
      }`

export const createCategory = `
mutation CreateCategory($category:CategoryInput){
  createCategory(category:$category){
    _id
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
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
}`

export const editCategory = `
      mutation EditCategory($category:CategoryInput){
        editCategory(category:$category){
          _id
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
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
          }
        }
      }`

export const deleteCategory = `
      mutation DeleteCategory($id:String!,$restaurant:String!){
        deleteCategory(id:$id,restaurant:$restaurant){
                _id
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
                    createdAt
                    updatedAt
                  }
                  createdAt
                  updatedAt
                }
        }
      }`

export const saveEmailConfiguration = `mutation SaveEmailConfiguration($configurationInput:EmailConfigurationInput!){
  saveEmailConfiguration(configurationInput:$configurationInput){
    _id
    email
    emailName
    password
    enableEmail
  }
}`
export const saveFormEmailConfiguration = `mutation  SaveFormEmailConfiguration($configurationInput:FormEmailConfigurationInput!){
  saveFormEmailConfiguration(configurationInput: $configurationInput) {
    _id
    formEmail

  }
}`
export const saveSendGridApiKey = `mutation SaveSendGridApiKey($configurationInput: SendGridConfigurationInput!) {
  saveSendGridConfiguration(configurationInput: $configurationInput) {
    _id
    sendGridApiKey
    sendGridEnabled
    sendGridEmail
    sendGridEmailName
    sendGridPassword 
  }
}`

export const saveFirebaseConfiguration = `
  mutation SaveFirebaseConfiguration(
    $configurationInput:FirebaseConfigurationInput!
  ) {
    saveFirebaseConfiguration(configurationInput: $configurationInput) {
      _id
      firebaseKey
      authDomain
      projectId
      storageBucket
      msgSenderId
      appId
      measurementId
      vapidKey
    }
  }
`

export const saveSentryConfiguration = `
  mutation SaveSentryConfiguration($configurationInput: SentryConfigurationInput!) {
    saveSentryConfiguration(configurationInput: $configurationInput) {
      _id
      dashboardSentryUrl
      webSentryUrl
      apiSentryUrl
      customerAppSentryUrl
      restaurantAppSentryUrl
      riderAppSentryUrl
    }
  }
`
export const saveGoogleApiKeyConfiguration = `
  mutation SaveGoogleApiKeyConfiguration(
    $configurationInput: GoogleApiKeyConfigurationInput!
  ) {
    saveGoogleApiKeyConfiguration(configurationInput: $configurationInput) {
      _id
      googleApiKey
    }
  }
`
export const saveCloudinaryConfiguration = `mutation SaveCloudinaryConfiguration($configurationInput: CloudinaryConfigurationInput!) {
  saveCloudinaryConfiguration(configurationInput: $configurationInput) {
    _id
    cloudinaryUploadUrl
    cloudinaryApiKey
 
  }
}
`
export const saveAmplitudeApiKeyConfiguration = `
  mutation SaveAmplitudeApiKeyConfiguration(
    $configurationInput: AmplitudeApiKeyConfigurationInput!
  ) {
    saveAmplitudeApiKeyConfiguration(configurationInput: $configurationInput) {
      _id
      webAmplitudeApiKey
      appAmplitudeApiKey
    }
  }
`
export const saveGoogleClientIDConfiguration = `mutation SaveGoogleClientIDConfiguration($configurationInput: GoogleClientIDConfigurationInput!) {
  saveGoogleClientIDConfiguration(configurationInput: $configurationInput) {
    _id
    webClientID
    androidClientID
    iOSClientID
    expoClientID
  }
}
`
export const saveWebConfiguration = `
  mutation SaveWebConfiguration($configurationInput: WebConfigurationInput!) {
    saveWebConfiguration(configurationInput: $configurationInput) {
      _id
    
      googleMapLibraries
      googleColor
    }
  }
`

export const saveAppConfiguration = `
  mutation SaveAppConfiguration($configurationInput: AppConfigurationsInput!) {
    saveAppConfigurations(configurationInput: $configurationInput) {
      _id
    
      termsAndConditions
      privacyPolicy
      testOtp
    }
  }
`
export const saveDeliveryRateConfiguration = `mutation SaveDeliveryRateConfiguration($configurationInput: DeliveryCostConfigurationInput!) {
  saveDeliveryRateConfiguration(configurationInput: $configurationInput) {
    _id
    deliveryRate
    costType
  }
}`;

export const savePaypalConfiguration = `mutation SavePaypalConfiguration($configurationInput:PaypalConfigurationInput!){
  savePaypalConfiguration(configurationInput:$configurationInput){
    _id
    clientId
    clientSecret
    sandbox
  }
}`

export const saveStripeConfiguration = `mutation SaveStripeConfiguration($configurationInput:StripeConfigurationInput!){
  saveStripeConfiguration(configurationInput:$configurationInput){
    _id
    publishableKey
    secretKey
  
  }
}`

export const saveTwilioConfiguration = `mutation saveTwilioConfiguration($configurationInput:TwilioConfigurationInput!){
  saveTwilioConfiguration(configurationInput:$configurationInput){
    _id
    twilioAccountSid
    twilioAuthToken
    twilioPhoneNumber
    twilioEnabled
  }
}`

export const saveVerificationToggles = `mutation SaveVerificationsToggle($configurationInput:VerificationConfigurationInput!){
  saveVerificationsToggle(configurationInput: $configurationInput) {
    skipEmailVerification
    skipMobileVerification
  }
}`

export const saveCurrencyConfiguration = `mutation SaveCurrencyConfiguration($configurationInput:CurrencyConfigurationInput!){
  saveCurrencyConfiguration(configurationInput:$configurationInput){
    _id
    currency
    currencySymbol
  }
}`

export const ownerLogin = `mutation ownerLogin($email:String!,$password:String!){
  ownerLogin(email:$email,password:$password){
    userId
    token
    email
    userType
    restaurants{
      _id
      orderId
      name
      image
      address
    }
  }
}`

export const createSection = `mutation CreateSection($section:SectionInput!){
  createSection(section:$section){
      _id
      name
      enabled
      restaurants{
        _id
        name
      }
    }
}`
export const editSection = `mutation editSection($section:SectionInput!){
  editSection(section:$section){
      _id
      name
      enabled
      restaurants{
        _id
        name
      }
    }
}`

export const deleteSection = `mutation DeleteSection($id:String!){
  deleteSection(id:$id)
}`

export const deleteVendor = `mutation DeleteVendor($id:String!){
  deleteVendor(id:$id)
}`

export const updateOrderStatus = `mutation UpdateOrderStatus($id:String!,$status:String!,$reason:String){
  updateOrderStatus(id:$id,status:$status,reason:$reason){
    _id
    orderStatus
  }
}
`
export const updateStatus = `mutation UpdateStatus($id:String!,$orderStatus:String!){
  updateStatus(id:$id,orderStatus:$orderStatus){
    _id
    orderStatus
  }
}
`

export const uploadToken = `mutation UploadToken($id:String!,$pushToken:String!){
  uploadToken(id:$id,pushToken:$pushToken){
    _id
    pushToken
  }
}`

export const resetPassword = `mutation ResetPassword($password:String!,$token:String!){
  resetPassword(password:$password,token:$token){
    result
  }
}`

export const createRider = `
mutation CreateRider($riderInput:RiderInput!){
    createRider(
        riderInput:$riderInput
    ){
    _id
    name
    username
    password
    phone
    available
      zone{
        _id
      }
    }
  }`

export const editRider = `
    mutation EditRider($riderInput:RiderInput!){
        editRider(
          riderInput:$riderInput
        ){
          _id
          name
          username
          phone
          zone{
            _id
          }
        }
      }`
export const deleteRider = `
      mutation DeleteRider($id:String!){
        deleteRider(id:$id){
          _id
        }
      }`

export const toggleAvailablity = `
      mutation ToggleRider($id:String){
        toggleAvailablity(id:$id){
          _id
        }
}`

export const assignRider = ` mutation AssignRider($id:String!,$riderId:String!){
  assignRider(id:$id,riderId:$riderId){
    _id
    orderStatus
    rider{
      _id
      name
    }
  }
}`

export const updatePaymentStatus = `mutation UpdatePaymentStatus($id:String!,$status:String!){
  updatePaymentStatus(id:$id,status:$status){
    _id
    paymentStatus
    paidAmount
  }
}
`

export const createOffer = `mutation CreateOffer($offer:OfferInput!){
  createOffer(offer:$offer){
      _id
      name
      tag
      restaurants{
        _id
        name
        address
      }
    }
}`

export const editOffer = `mutation EditOffer($offer:OfferInput!){
  editOffer(offer:$offer){
      _id
      name
      tag
      restaurants{
        _id
        name
        address
      }
    }
}`

export const deleteOffer = `mutation DeleteOffer($id:String!){
  deleteOffer(id:$id)
}`

export const createOptions = `mutation CreateOptions($optionInput:CreateOptionInput){
  createOptions(optionInput:$optionInput){
    _id
    options{
      _id
      title
      description
      price
    }
  }
}`

export const createAddons = `mutation CreateAddons($addonInput:AddonInput){
  createAddons(addonInput:$addonInput){
      _id
      addons{
        _id
        options
        title
        description
        quantityMinimum
        quantityMaximum
      }
      
    }
}`
export const editAddon = `mutation editAddon($addonInput:editAddonInput){
  editAddon(addonInput:$addonInput){
      _id
      addons{
        _id
        options
        title
        description
        quantityMinimum
        quantityMaximum
      }
  }
}`

export const deleteAddon = `
      mutation DeleteAddon($id:String!,$restaurant:String!){
        deleteAddon(id:$id,restaurant:$restaurant){
          _id
          addons{
            _id
            options
            title
            description
            quantityMinimum
            quantityMaximum
          }
        }
      }`

export const deleteOption = `
      mutation DeleteOption($id:String!,$restaurant:String!){
        deleteOption(id:$id,restaurant:$restaurant){
          _id
          options{
            _id
            title
            description
            price
          }
        }
      }`
export const editOption = `mutation editOption($optionInput:editOptionInput){
  editOption(optionInput:$optionInput){
          _id
          options{
            _id
            title
            description
            price
          }
        }
      }`

export const createCoupon = `mutation CreateCoupon($couponInput:CouponInput!){
  createCoupon(couponInput:$couponInput){
    _id
    title
    discount
    enabled
  }
}`
export const editCoupon = `mutation editCoupon($couponInput:CouponInput!){
  editCoupon(couponInput:$couponInput){
        _id
        title
        discount
        enabled
        }
      }`
export const deleteCoupon = `mutation DeleteCoupon($id:String!){
        deleteCoupon(id:$id)
      }`

export const createCuisine = `mutation CreateCuisine($cuisineInput:CuisineInput!){
        createCuisine(cuisineInput:$cuisineInput){
          _id
          name
          description
          image
        shopType
        }
      }`
export const editCuisine = `mutation editCuisine($cuisineInput:CuisineInput!){
        editCuisine(cuisineInput:$cuisineInput){
          _id
          name
          description
          image
      shopType
              }
            }`
export const deleteCuisine = `mutation DeleteCuisine($id:String!){
              deleteCuisine(id:$id)
            }`

export const createBanner = `mutation CreateBanner($bannerInput:BannerInput!){
  createBanner(bannerInput:$bannerInput){
    _id
    title
    description
    action
    file
    screen
    parameters
  }
}`

export const editBanner = `mutation editBanner($bannerInput:BannerInput!){
  editBanner(bannerInput:$bannerInput){
    _id
    title
    description
    action
    file
    screen
    parameters
  }
}`

export const deleteBanner = `mutation DeleteBanner($id:String!){
  deleteBanner(id:$id)
}`

export const createTipping = `mutation CreateTipping($tippingInput:TippingInput!){
        createTipping(tippingInput:$tippingInput){
          _id
          tipVariations
          enabled
        }
      }`

export const editTipping = `mutation editTipping($tippingInput:TippingInput!){
  editTipping(tippingInput:$tippingInput){
            _id
            tipVariations
            enabled
              }
            }`

export const createTaxation = `mutation CreateTaxation($taxationInput:TaxationInput!){
    createTaxation(taxationInput:$taxationInput){
          _id
        taxationCharges
        enabled
        }
      }`

export const editTaxation = `mutation editTaxation($taxationInput:TaxationInput!){
    editTaxation(taxationInput:$taxationInput){
            _id
            taxationCharges
            enabled
              }
            }`

export const createVendor = `mutation CreateVendor($vendorInput:VendorInput){
    createVendor(vendorInput:$vendorInput){
      _id
      email
      userType
    }
}`

export const editVendor = `mutation EditVendor($vendorInput:VendorInput){
  editVendor(vendorInput:$vendorInput){
    _id
    email
  }
}`

export const editRestaurant = `mutation EditRestaurant($restaurantInput:RestaurantProfileInput!){
    editRestaurant(restaurant:$restaurantInput){
      _id
      orderId
      orderPrefix
      name
      image
      logo
      slug
      address
      username
      password
      location{coordinates}
      isAvailable
      minimumOrder
      tax
      openingTimes{
        day
        times{
          startTime
          endTime
        }
      }
      shopType
    }
}`

export const createZone = `mutation CreateZone($zone:ZoneInput!){
  createZone(zone:$zone){
    _id
    title
    description
    location{coordinates}
    isActive
  }
}`

export const editZone = `mutation EditZone($zone:ZoneInput!){
  editZone(zone:$zone){
    _id
    title
    description
    location{coordinates}
    isActive
  }
}`

export const deleteZone = `mutation DeleteZone($id:String!){
  deleteZone(id:$id){
    _id
    title
    description
    location{coordinates}
    isActive
  }
}`

export const vendorResetPassword = `mutation VendorResetPassword($oldPassword: String!, $newPassword: String!){
    vendorResetPassword(oldPassword: $oldPassword, newPassword: $newPassword)
}`

export const deleteRestaurant = `mutation DeltetRestaurant($id:String!){
  deleteRestaurant(id:$id){
    _id
    isActive
  }
}`

export const updateTimings = `mutation UpdateTimings($id:String!,$openingTimes:[TimingsInput]){
  updateTimings(id:$id,
    openingTimes:$openingTimes){
    _id
    openingTimes{
      day
      times{
        startTime
        endTime
      }
    }
  }
}`

export const sendNotificationUser = `mutation SendNotificationUser($notificationTitle:String, $notificationBody: String!){
  sendNotificationUser(notificationTitle:$notificationTitle,notificationBody:$notificationBody)
}
`
export const updateCommission = `mutation UpdateCommission($id:String!,$commissionRate:Float!){
  updateCommission(id:$id,commissionRate:$commissionRate){
    _id
    commissionRate
  }
}`
export const createRestaurant = `mutation CreateRestaurant($restaurant:RestaurantInput!,$owner:ID!){
  createRestaurant(restaurant:$restaurant,owner:$owner){
    _id
    orderId
    orderPrefix
    name
    slug
    image
    logo
    address
    username
    password
    minimumOrder
    tax
    location{coordinates}
    shopType
    cuisines
  }
}`

export const updateDeliveryBoundsAndLocation = `mutation UPDATE_DELIVERY_BOUNDS_AND_LOCATION( $id: ID!
    $boundType: String!
    $bounds: [[[Float!]]]
    $circleBounds: CircleBoundsInput
    $location: CoordinatesInput!
    $address: String
    $postCode: String
    $city: String){

    result: updateDeliveryBoundsAndLocation(
      id: $id
      boundType: $boundType
      circleBounds: $circleBounds
      bounds: $bounds
      location: $location
      address: $address
      postCode: $postCode
      city: $city
    ) {
      success
      message
      data {
        _id
        deliveryBounds {
          coordinates
        }
        location {
          coordinates
        }
      }
  }
}`

export const updateWithdrawReqStatus = `mutation UpdateWithdrawRequest($id:ID!, $status:String!){
  updateWithdrawReqStatus(id:$id,status:$status){
    success
    message
    data{
      rider{
        _id
        currentWalletAmount
      }
      withdrawRequest{
        _id
        status
      }
    }
  }
}`
