import gql from 'graphql-tag'

export const GET_ALL_CATEGORIES_WITH_SUBCATEGORIES_DATA = gql`
  query GetAllCategoriesWithSubCategoriesDataSeeAllSingleVendor {
    getAllCategoriesWithSubCategoriesDataSeeAllSingleVendor {
      categoryId
      categoryName
      items {
        id
        title
        image
        description
        variations {
          id
          title
          price
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
          variations {
            id
            title
            price
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
`

export const GET_RESTAURANT_CATEGORIES_SINGLE_VENDOR = gql`
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
`

export const GET_CATEGORY_ITEMS_SINGLE_VENDOR = gql`
  query GetCategoryItemsSingleVendor($categoryId: ID!, $skip: Int, $limit: Int, $search: String) {
    getCategoryItemsSingleVendor(categoryId: $categoryId, skip: $skip, limit: $limit, search: $search) {
      categoryId
      categoryName
      items {
        id
        title
        description
        image
        variations {
          id
          title
          price
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
`

// export const GET_FOOD_DETAILS = gql`
//   query GetFoodDetails($foodId: ID!) {
//     getFoodDetails(foodId: $foodId) {
//       id
//       title
//       description
//       image
//       isPopular
//       variations {
//         id
//         title
//         price
//       }
//     }
//   }
// `

export const GET_FOOD_DETAILS = gql`
  query GetFoodDetails($foodId: ID!) {
    getFoodDetails(foodId: $foodId) {
      id
      title
      description
      image
      isPopular
      cartQuantity
      categoryId
      selectedAddonsId {
        _id
        options
      }
      selectedVariationsIds
      variations {
        id
        title
        price
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
        cartQuantity
        isSelected

        actualUnitPrice
        discountedUnitPrice
      }
    }
  }
`

export const GET_SIMILAR_FOODS = gql`
  query GetSimilarFoods($foodId: ID!, $skip: Int, $limit: Int) {
    getSimilarFoods(foodId: $foodId, skip: $skip, limit: $limit) {
      items {
        id
        title
        description
        image
        variations {
          id
          title
          price
        }
      }
      pagination {
        totalItems
        hasMore
      }
    }
  }
`

export const GET_FAVORITE_FOODS_STATUS = gql`
  query GetFavoriteFoodsStatus($foodId: String) {
    getFavoriteFoodsStatus(foodId: $foodId) {
      success
      message
      isFavorite
    }
  }
`

export const GET_SCHEDULE_BY_DAY = gql`
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
`

export const SEARCH_FOOD = gql`
  query SearchFood($search: String) {
    searchFood(search: $search) {
      id
      title
      description
      subCategory
      image
      isOutOfStock
      isFavourite
      variations {
        id
        name
        price
      }
    }
  }
`

export const GET_LIMITED_TIME_FOODS_DEALS = gql`
  query GetLimitedTimeFoodsDeals {
    getLimitedTimeFoodsDeals {
      items {
        id
        title
        description
        image
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
`
export const GET_WEEKLY_FOODS_DEALS = gql`
  query GetWeeklyFoodsDeals {
    getWeeklyFoodsDeals {
      items {
        id
        title
        description
        image
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
`

export const GET_NEW_OFFERS_FOODS_DEALS = gql`
  query GetNewOffersFoodsDeals {
    getNewOffersFoodsDeals {
      items {
        id
        title
        description
        image
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
`

export const GET_USER_CART = gql`
  query GetUserCart {
    getUserCart {
      success
      message
      grandTotal
      actualGrandTotal
      discountedGrandTotal
      totalDiscount
      hasDeals
      lowOrderFees
      maxOrderAmount
      minOrderAmount
      isBelowMinimumOrder
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
            id
            title
          }
        }
        actualFoodTotal
        discountedFoodTotal
        foodTotal
      }
      deals {
        variationId
        variationTitle
        foodId
        foodTitle
        quantity
        dealId
        dealTitle
        discountType
        discountValue
        originalPrice
        discountedPrice
        savingsPerUnit
        totalSavings
      }
    }
  }
`

export const GET_RECOMMENDED_FOODS = gql`
  query GetRecommendedFoods($foodId: ID!, $skip: Int, $limit: Int) {
    getRecommendedFoods(foodId: $foodId, skip: $skip, limit: $limit) {
      pagination {
        totalItems
        hasMore
      }
      items {
        variations {
          title
          price
          id
          deal {
            isActive
            id
            discountValue
            discountType
          }
        }
        title
        image
        id
        description
      }
    }
  }
`

export const CALCULATE_CHECKOUT = gql`
  query CalculateCheckout($isPickup: Boolean, $latDestination: Float, $longDestination: Float, $coupon: String) {
    calculateCheckout(isPickup: $isPickup, latDestination: $latDestination, longDestination: $longDestination, coupon: $coupon) {
      success
      message
      cartId
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
        subscriptionDiscount
        freeDeliveryApplied
        couponDiscount
      }
      hasActiveSubscription
      freeDeliveriesRemaining
      appliedFreeDelivery
      minimumOrderAmount
      isBelowMinimumOrder
      isBelowMaximumOrder
      couponDiscountAmount
      couponApplied
      priorityDeliveryFees
    }
  }
`

export const ORDER_DETAILS_PAGE = gql`
  query OrderDetailsPage($orderId: ID!) {
    orderDetailsPage(orderId: $orderId) {
      success
      message
      rawOrder {
        _id
        orderId
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
        }
        user {
          _id
          name
          phone
        }
        rider {
          _id
          name
          phone
          location {
            coordinates
          }
        }
        review {
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
        instructions
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
`

export const GET_ALL_SUBSCRIPTION_PLANS = gql`
  query GetAllSubscriptionPlans {
    getAllSubscriptionPlans {
      plans {
        id
        amount
        interval
        intervalCount
        productName
        productId
      }
    }
  }
`

export const GET_FAVORITE_FOODS_SINGLE_VENDOR = gql`
  query GetFavoriteFoodsSingleVendor($limit: Int, $skip: Int) {
    getFavoriteFoodsSingleVendor(limit: $limit, skip: $skip) {
      success
      message
      data {
        _id
        title
        image
        subCategory
        isFavourite
        isActive
        createdAt
        updatedAt
        isOutOfStock
        variations {
          _id
          title
          price
          discounted
          addons
          isOutOfStock
          name
        }
      }
    }
  }
`

export const GET_SINGLE_USER_SUPPORT_TICKETS = gql`
  query GetSingleUserSupportTickets($input: SingleUserSupportTicketsInput) {
    getSingleUserSupportTickets(input: $input) {
      tickets {
        _id
        title
        description
        status
        category
        orderId
        otherDetails
        createdAt
        updatedAt
        userType
      }
      docsCount
      totalPages
      currentPage
    }
  }
`

export const GET_TICKET_MESSAGES = gql`
  query GetTicketMessages($input: TicketMessagesInput!) {
    getTicketMessages(input: $input) {
      messages {
        _id
        senderType
        content
        isRead
        ticket
        createdAt
        updatedAt
      }
      ticket {
        _id
        title
        description
        status
        category
        orderId
        otherDetails
        createdAt
        updatedAt
        userType
        user {
          _id
        }
      }
      page
      totalPages
      docsCount
    }
  }
`

export const GET_BANNERS = gql`
  query Banners {
    banners {
      _id
      title
      description
      action
      screen
      file
      parameters
    }
  }
`

export const GET_MY_REFERRAL_CODE = gql`
  query GetMyReferralCode {
    getMyReferralCode
  }
`

export const GET_SCHEDULED_ORDERS = `query ScheduledOrders($offset:Int, $limit:Int){
  scheduledOrders(offset:$offset, limit: $limit){
    _id
    orderId
      id
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
      id
      title
      food
      description
      quantity
      image
      variation{
        _id
        id
        title
        price
        discounted
      }
      addons{
        _id
        id
        options{
          _id
          id
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
      phone
    }
    review{
      _id
      rating
    }
    paymentMethod
    paidAmount
    orderAmount
    orderStatus
    paymentStatus
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
export const GET_MY_FREE_DELIVERIES = gql`
query GetMyFreeDeliveries {
  getMyFreeDeliveries
}
`


export const GET_TODAY_NOTIFICATIONS_BY_TOKEN = gql`
query TodayNotificationsByToken($skip: Int, $limit: Int) {
  todayNotificationsByToken(skip: $skip, limit: $limit) {
      total
      skip
      limit
      hasMore
      notifications {
          _id
          title
          body
          creator
          updatedAt
          createdAt
      }
  }
}
`

export const GET_PAST_NOTIFICATIONS_BY_TOKEN = gql`
query PastNotificationsByToken($skip: Int, $limit: Int) {
  pastNotificationsByToken(skip: $skip, limit: $limit) {
      total
      skip
      limit
      hasMore
      notifications {
          _id
          title
          body
          creator
          updatedAt
          createdAt
      }
  }
}
`
