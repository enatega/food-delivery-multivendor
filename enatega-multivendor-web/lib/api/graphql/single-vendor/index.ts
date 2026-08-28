import { gql } from "@apollo/client";

export const SINGLE_VENDOR_DISCOVERY = gql`
  query SingleVendorDiscovery($previewLimit: Int, $dealLimit: Int) {
    singleVendorDiscovery(previewLimit: $previewLimit, dealLimit: $dealLimit) {
      catalogVersion
      banners {
        _id
        title
        description
        action
        screen
        file
        parameters
        buttonText
      }
      categories {
        id
        name
        icon
        image
        description
        itemCount
        viewType
        pagination {
          totalItems
          hasMore
        }
        items {
          id
          title
          description
          image
          isOutOfStock
          variations {
            id
            title
            price
            isOutOfStock
            deal {
              id
              discountType
              discountValue
              isActive
            }
          }
        }
      }
      deals {
        limitedTime {
          items {
            id
            title
            description
            image
            isOutOfStock
            variations {
              id
              title
              price
              isOutOfStock
              deal {
                id
                discountType
                discountValue
                isActive
              }
            }
          }
          totalCount
          hasMore
        }
        weekly {
          items {
            id
            title
            description
            image
            isOutOfStock
            variations {
              id
              title
              price
              isOutOfStock
              deal {
                id
                discountType
                discountValue
                isActive
              }
            }
          }
          totalCount
          hasMore
        }
        newOffers {
          items {
            id
            title
            description
            image
            isOutOfStock
            variations {
              id
              title
              price
              isOutOfStock
              deal {
                id
                discountType
                discountValue
                isActive
              }
            }
          }
          totalCount
          hasMore
        }
      }
    }
  }
`;

export const SINGLE_VENDOR_CONFIGURATION = gql`
  query SingleVendorConfiguration {
    configuration: publicConfiguration {
      _id
      currency
      currencySymbol
      deliveryRate
      twilioEnabled
      publishableKey
      appAmplitudeApiKey
      customerAppSentryUrl
      termsAndConditions
      privacyPolicy
      skipMobileVerification
      skipEmailVerification
      costType
    }
  }
`;

export const SINGLE_VENDOR_PROFILE = gql`
  query SingleVendorProfile {
    profile {
      _id
      name
      phone
      phoneIsVerified
      email
      emailIsVerified
      notificationToken
      userType
      isActive
      isOrderNotification
      isOfferNotification
      addresses {
        _id
        label
        deliveryAddress
        details
        location {
          coordinates
        }
        selected
      }
      favourite
      stripe_plan_id
    }
  }
`;

export const SINGLE_VENDOR_LOGIN = gql`
  mutation LoginSingleVendor(
    $email: String
    $password: String
    $type: String!
    $appleId: String
    $idToken: String
    $name: String
    $notificationToken: String
  ) {
    login(
      email: $email
      password: $password
      type: $type
      appleId: $appleId
      idToken: $idToken
      name: $name
      notificationToken: $notificationToken
    ) {
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
`;
export const SINGLE_VENDOR_EMAIL_EXISTS = gql`
  mutation EmailExistSingleVendor($email: String!) {
    emailExist(email: $email) {
      _id
    }
  }
`;
export const SINGLE_VENDOR_PHONE_EXISTS = gql`
  mutation PhoneExistSingleVendor($phone: String!) {
    phoneExist(phone: $phone) {
      _id
    }
  }
`;

export const SINGLE_VENDOR_CATEGORIES = gql`
  query GetRestaurantCategoriesSingleVendor {
    getRestaurantCategoriesSingleVendor {
      id
      name
      icon
      image
      description
      itemCount
      viewType
    }
  }
`;

export const SINGLE_VENDOR_BANNERS = gql`
  query SingleVendorBanners {
    banners {
      _id
      title
      description
      action
      screen
      file
      parameters
      buttonText
      slug
      shopType
    }
  }
`;

export const SINGLE_VENDOR_CATALOG = gql`
  query GetAllCategoriesWithSubCategoriesDataSeeAllSingleVendor {
    getAllCategoriesWithSubCategoriesDataSeeAllSingleVendor {
      categoryId
      categoryName
      items {
        id
        title
        image
        description
        isOutOfStock
        variations {
          id
          title
          price
          isOutOfStock
          deal {
            id
            discountType
            discountValue
            isActive
          }
        }
        subCategory
      }
      subCategories {
        subCategoryId
        subCategoryName
        items {
          id
          title
          image
          description
          isOutOfStock
          variations {
            id
            title
            price
            isOutOfStock
            deal {
              id
              discountType
              discountValue
              isActive
            }
          }
          subCategory
        }
      }
    }
  }
`;

export const SINGLE_VENDOR_CATEGORY = gql`
  query GetCategoryItemsSingleVendor(
    $categoryId: ID!
    $skip: Int
    $limit: Int
    $search: String
  ) {
    getCategoryItemsSingleVendor(
      categoryId: $categoryId
      skip: $skip
      limit: $limit
      search: $search
    ) {
      categoryId
      categoryName
      items {
        id
        title
        description
        image
        isOutOfStock
        variations {
          id
          title
          price
          isOutOfStock
          deal {
            id
            discountType
            discountValue
            isActive
          }
        }
      }
      pagination {
        currentPage
        totalPages
        totalItems
        hasMore
      }
    }
  }
`;

export const SINGLE_VENDOR_PRODUCT = gql`
  query GetFoodDetails($foodId: ID!, $categoryId: ID) {
    getFoodDetails(foodId: $foodId, categoryId: $categoryId) {
      id
      title
      description
      image
      isPopular
      isOutOfStock
      cartQuantity
      usage
      ingredients
      nutritionDetail
      categoryId
      nutritions {
        name
        quantity
      }
      variations {
        id
        title
        price
        isOutOfStock
        cartQuantity
        isSelected
        actualUnitPrice
        discountedUnitPrice
        deal {
          id
          discountType
          discountValue
          isActive
        }
        addons {
          id
          title
          description
          isSelected
          options {
            id
            title
            description
            price
            isSelected
          }
        }
      }
    }
  }
`;

export const SINGLE_VENDOR_SIMILAR_PRODUCTS = gql`
  query GetSimilarFoods($foodId: ID!, $skip: Int, $limit: Int) {
    getSimilarFoods(foodId: $foodId, skip: $skip, limit: $limit) {
      items {
        id
        title
        description
        image
        categoryId
        isOutOfStock
        variations {
          id
          title
          price
          isOutOfStock
          deal {
            id
            discountType
            discountValue
            isActive
          }
        }
      }
      pagination {
        totalItems
        hasMore
      }
    }
  }
`;

export const SINGLE_VENDOR_LIMITED_DEALS = gql`
  query GetLimitedTimeFoodsDeals {
    getLimitedTimeFoodsDeals {
      items {
        id
        title
        description
        image
        categoryId
        variations {
          id
          title
          price
          outofstock
          deal {
            id
            title
            discountType
            discountValue
            isActive
          }
        }
      }
    }
  }
`;

export const SINGLE_VENDOR_WEEKLY_DEALS = gql`
  query GetWeeklyFoodsDeals {
    getWeeklyFoodsDeals {
      items {
        id
        title
        description
        image
        categoryId
        variations {
          id
          title
          price
          outofstock
          deal {
            id
            title
            discountType
            discountValue
            isActive
          }
        }
      }
    }
  }
`;

export const SINGLE_VENDOR_SEARCH = gql`
  query SearchSingleVendorFoods($search: String!, $skip: Int, $limit: Int) {
    searchSingleVendorFoods(search: $search, skip: $skip, limit: $limit) {
      items {
        id
        title
        description
        subCategory
        categoryId
        image
        isOutOfStock
        variations {
          id
          title
          price
          isOutOfStock
          deal {
            id
            discountType
            discountValue
            isActive
          }
        }
      }
      totalCount
      hasMore
    }
  }
`;

export const SINGLE_VENDOR_CART = gql`
  query GetUserCart {
    getUserCart {
      success
      message
      actualGrandTotal
      discountedGrandTotal
      totalDiscount
      hasDeals
      isBelowMinimumOrder
      lowOrderFees
      maxOrderAmount
      minOrderAmount
      cartId
      foods {
        categoryId
        foodId
        foodTitle
        foodImage
        variations {
          _id
          variationId
          variationTitle
          unitPrice
          quantity
          addons {
            addonId
            optionId
            title
            price
          }
          addonsTotal
          actualUnitPrice
          discountedUnitPrice
          actualItemTotal
          discountedItemTotal
          itemTotal
          dealId
          dealInfo {
            dealId
            dealTitle
            discountValue
            discountType
          }
        }
        actualFoodTotal
        discountedFoodTotal
        foodTotal
      }
    }
  }
`;

export const SINGLE_VENDOR_UPDATE_CART = gql`
  mutation UserCartData($input: CartInput!) {
    userCartData(input: $input) {
      success
      message
      actualGrandTotal
      discountedGrandTotal
      totalDiscount
      hasDeals
      isBelowMinimumOrder
      lowOrderFees
      maxOrderAmount
      minOrderAmount
      cartId
      foods {
        categoryId
        foodId
        foodTitle
        foodImage
        variations {
          _id
          variationId
          variationTitle
          unitPrice
          quantity
          addons {
            addonId
            optionId
            title
            price
          }
          addonsTotal
          actualUnitPrice
          discountedUnitPrice
          actualItemTotal
          discountedItemTotal
          itemTotal
          dealId
          dealInfo {
            dealId
            dealTitle
            discountValue
            discountType
          }
        }
        actualFoodTotal
        discountedFoodTotal
        foodTotal
      }
    }
  }
`;

export const SINGLE_VENDOR_UPDATE_CART_COUNT = gql`
  mutation UpdateUserCartCount($input: UpdateCartCountInput!) {
    updateUserCartCount(input: $input) {
      success
      message
      quantity
      itemTotal
      foodTotal
      grandTotal
      isBelowMinimumOrder
    }
  }
`;

export const SINGLE_VENDOR_CLEAR_CART = gql`
  mutation ClearCart {
    clearCart {
      success
      message
    }
  }
`;

export const SINGLE_VENDOR_CALCULATE_CHECKOUT = gql`
  query CalculateCheckout(
    $isPickup: Boolean
    $latDestination: Float
    $longDestination: Float
    $coupon: String
  ) {
    calculateCheckout(
      isPickup: $isPickup
      latDestination: $latDestination
      longDestination: $longDestination
      coupon: $coupon
    ) {
      success
      message
      cartId
      subtotal
      deliveryCharges
      originalDeliveryCharges
      deliveryDiscount
      serviceFee
      minimumOrderFee
      taxAmount
      taxPercentage
      grandTotal
      totalDiscount
      discountDetails {
        dealDiscount
      }
      hasActiveSubscription
      freeDeliveriesRemaining
      minimumOrderAmount
      isBelowMinimumOrder
      isBelowMaximumOrder
      couponDiscountAmount
      couponApplied
      priorityDeliveryFees
      creditsUsed
      maximumOrderAmount
      checkoutQuoteId
      checkoutQuoteExpiresAt
      cartRevision
      items {
        foodId
        foodTitle
        categoryId
        variationId
        variationTitle
        quantity
        unitPrice
        addons {
          id
          title
          price
          addonId
        }
        addonsTotal
        itemTotal
      }
    }
  }
`;
export const SINGLE_VENDOR_SCHEDULE = gql`
  query GetScheduleByDay {
    getScheduleByDay {
      date
      day
      dayId
      timings {
        id
        times {
          id
          startTime
          endTime
          maxOrder
        }
      }
    }
  }
`;

export const SINGLE_VENDOR_PLACE_ORDER = gql`
  mutation SingleVendorPlaceOrder(
    $paymentMethod: String!
    $address: AddressInput!
    $tipping: Float!
    $orderDate: String!
    $isPickedUp: Boolean!
    $specialInstructions: String
    $couponCode: String
    $instructions: String
    $scheduleData: ScheduleData
    $isPriority: Boolean
    $idempotencyKey: String
    $checkoutQuoteId: String
  ) {
    placeOrder(
      paymentMethod: $paymentMethod
      address: $address
      tipping: $tipping
      orderDate: $orderDate
      isPickedUp: $isPickedUp
      specialInstructions: $specialInstructions
      couponCode: $couponCode
      instructions: $instructions
      scheduleData: $scheduleData
      isPriority: $isPriority
      idempotencyKey: $idempotencyKey
      checkoutQuoteId: $checkoutQuoteId
    ) {
      _id
      orderId
      paymentMethod
      paidAmount
      orderAmount
      paymentStatus
      orderStatus
      deliveryCharges
      tipping
      taxationAmount
      createdAt
      orderDate
      expectedTime
      isPickedUp
    }
  }
`;

export const SINGLE_VENDOR_ACTIVE_ORDERS = gql`
  query SingleVendorActiveOrders($limit: Int, $page: Int) {
    getUsersActiveOrders(limit: $limit, page: $page) {
      _id
      orderId
      restaurant {
        name
        image
      }
      orderAmount
      orderStatus
      createdAt
      orderDate
      expectedTime
    }
  }
`;

export const SINGLE_VENDOR_RECENT_ACTIVE_ORDER = gql`
  query SingleVendorRecentActiveOrder {
    recentActiveOrder {
      success
      message
      rawOrder {
        _id
        orderId
        orderStatus
        orderState
        orderAmount
        createdAt
        expectedTime
        completionTime
        isPickedUp
        restaurant {
          _id
          name
          image
          address
        }
        deliveryAddress {
          deliveryAddress
        }
        items {
          _id
          title
          quantity
        }
        eta {
          phase
          estimatedArrivalAt
          windowStartAt
          windowEndAt
        }
      }
    }
  }
`;

export const SINGLE_VENDOR_PAST_ORDERS = gql`
  query SingleVendorPastOrders($limit: Int, $page: Int) {
    getUsersPastOrders(limit: $limit, page: $page) {
      _id
      orderId
      restaurant {
        name
        image
      }
      orderAmount
      orderStatus
      createdAt
      completionTime
      orderDate
      deliveredAt
    }
  }
`;

export const SINGLE_VENDOR_FAVORITES = gql`
  query GetFavoriteFoodsSingleVendor($limit: Int, $skip: Int) {
    getFavoriteFoodsSingleVendor(limit: $limit, skip: $skip) {
      success
      message
      data {
        _id
        title
        image
        categoryId
        isFavourite
        isOutOfStock
        variations {
          _id
          title
          price
          discounted
          isOutOfStock
          deal {
            id
            discountType
            discountValue
            isActive
          }
        }
      }
    }
  }
`;

export const SINGLE_VENDOR_TOGGLE_FAVORITE = gql`
  mutation ToggleFavoriteFoodSingleVendor($id: ID!) {
    toggleFavoriteFoodSingleVendor(id: $id) {
      success
      message
      isFavorite
    }
  }
`;

export const SINGLE_VENDOR_VOUCHERS = gql`
  query SingleVendorVouchers {
    couponsbyRestaurant {
      _id
      title
      discount
      enabled
      couponType
    }
  }
`;

export const SINGLE_VENDOR_CREDITS = gql`
  query GetAllUserCredits {
    getAllUserCredits {
      credits
    }
  }
`;
export const SINGLE_VENDOR_MEMBERSHIP_PLANS = gql`
  query GetAllSubscriptionPlans {
    getAllSubscriptionPlans {
      plans {
        id
        amount
        interval
        intervalCount
        productName
        productId
        discountPercent
      }
    }
  }
`;
export const SINGLE_VENDOR_CREATE_MEMBERSHIP = gql`
  mutation CreateSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
      message
    }
  }
`;
export const SINGLE_VENDOR_UPDATE_MEMBERSHIP = gql`
  mutation UpdateSubscription($input: UpdateSubscriptionInput!) {
    updateSubscription(input: $input) {
      message
    }
  }
`;
export const SINGLE_VENDOR_CANCEL_MEMBERSHIP = gql`
  mutation CancelSubscription {
    cancelSubscription {
      message
    }
  }
`;
export const SINGLE_VENDOR_REFERRAL = gql`
  query GetMyReferralCode {
    getMyReferralCode
  }
`;

export const SINGLE_VENDOR_ORDER_STATUS = gql`
  subscription SingleVendorOrderStatusChanged($userId: String!) {
    orderStatusChanged(userId: $userId) {
      userId
      origin
      rawOrder {
        _id
        orderId
        orderStatus
        orderState
        paymentMethod
        paidAmount
        orderAmount
        isPickedUp
        deliveryCharges
        createdAt
        expectedTime
        rider {
          _id
          name
          phone
          location {
            coordinates
          }
        }
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
          origin {
            latitude
            longitude
          }
          destination {
            latitude
            longitude
          }
          calculatedAt
          lastLocationAt
          version
        }
      }
    }
  }
`;

export const SINGLE_VENDOR_PAYMENT_SUCCESS = gql`
  subscription SingleVendorPaymentSuccess($userId: String!) {
    subscriptionPaymentSuccess(userId: $userId) {
      userId
      orderId
      orderObjId
      orderStatus
      paymentStatus
      paymentMethod
    }
  }
`;
export const SINGLE_VENDOR_ORDER_DETAILS = gql`
  query SingleVendorOrderDetailsPage($orderId: String!) {
    orderDetailsPage(orderId: $orderId) {
      success
      message
      rawOrder {
        _id
        orderId
        orderStatus
        orderState
        paymentMethod
        paidAmount
        orderAmount
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
        scheduledAt
        assignedAt
        instructions
        restaurant {
          _id
          name
          image
          address
          location {
            coordinates
          }
        }
        deliveryAddress {
          location {
            coordinates
          }
          deliveryAddress
          id
        }
        rider {
          _id
          name
          phone
          location {
            coordinates
          }
        }
        items {
          _id
          title
          food
          description
          quantity
          variation {
            _id
            title
            price
            discounted
          }
        }
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
          origin {
            latitude
            longitude
          }
          destination {
            latitude
            longitude
          }
          calculatedAt
          lastLocationAt
          version
        }
      }
      data {
        _id
        orderId
        paidAmount
        orderAmount
        orderStatus
        paymentStatus
        deliveryCharges
        deliveryDiscount
        couponDiscount
        tipping
        taxationAmount
        orderDate
        isPriority
        isPickedUp
        completionTime
        instructions
        itemsSubTotal
        minimumOrderFee
        minimumOrderAmount
        isBelowMinimumOrder
        isBelowMaximumOrder
        freeDeliveriesRemaining
        priorityDeliveryFees
        deliverChargesAmount
        couponDiscountApplied
        creditsApplied
        rider {
          phone
        }
        deliveryAddress {
          _id
          deliveryAddress
          details
          label
          id
          location {
            coordinates
          }
        }
        items {
          _id
          food
          title
          description
          image
          quantity
          specialInstructions
          isActive
          foodImage
          foodTitle
          variationImage
          variationTitle
          variationTotal
          foodQuantity
          variation {
            title
            image
            price
            discounted
            _id
            createdAt
            updatedAt
          }
          addons {
            title
            description
            quantityMinimum
            quantityMaximum
            isActive
            options {
              title
              description
              price
              isActive
            }
          }
        }
      }
    }
  }
`;
export const SINGLE_VENDOR_TRACKING = gql`
  query SingleVendorOrderTracking($id: ID!) {
    orderTracking(id: $id) {
      orderId
      status
      riderLocation {
        latitude
        longitude
        accuracy
        heading
        speed
        recordedAt
      }
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
        calculatedAt
        lastLocationAt
        version
        origin {
          latitude
          longitude
        }
        destination {
          latitude
          longitude
        }
      }
    }
  }
`;
export const SINGLE_VENDOR_TRACKING_UPDATED = gql`
  subscription SingleVendorOrderTrackingUpdated($id: String!) {
    subscriptionOrderTracking(id: $id) {
      orderId
      status
      riderLocation {
        latitude
        longitude
        accuracy
        heading
        speed
        recordedAt
      }
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
        calculatedAt
        lastLocationAt
        version
        origin {
          latitude
          longitude
        }
        destination {
          latitude
          longitude
        }
      }
    }
  }
`;
