import gql from 'graphql-tag'

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`

export const TOGGLE_FAVORITE_ITEM_SINGLE_VENDOR = gql`
  mutation ToggleFavoriteFoodSingleVendor($toggleFavoriteFoodSingleVendorId: ID!) {
    toggleFavoriteFoodSingleVendor(id: $toggleFavoriteFoodSingleVendorId) {
      success
      message
      isFavorite
    }
  }
`

export const UPDATE_USER_CART = gql`
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
          addons {
            addonId
            optionId
            title
            price
          }
        }
        actualFoodTotal
        discountedFoodTotal
        foodTotal
      }
    }
  }
`

export const UPDATE_USER_CART_COUNT = gql`
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
`

export const PLACE_ORDER = gql`
  mutation PlaceOrder($paymentMethod: String!, $address: AddressInput!, $tipping: Float!, $orderDate: String!, $isPickedUp: Boolean!, $specialInstructions: String, $couponCode: String, $instructions: String, $scheduleData: ScheduleData, $isPriority: Boolean) {
    placeOrder(paymentMethod: $paymentMethod, address: $address, tipping: $tipping, orderDate: $orderDate, isPickedUp: $isPickedUp, specialInstructions: $specialInstructions, couponCode: $couponCode, instructions: $instructions, scheduleData: $scheduleData, isPriority: $isPriority) {
      _id
      orderId
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
      completionTime
      orderDate
      expectedTime
      preparationTime
      isPickedUp
      acceptedAt
      pickedAt
      selectedPrepTime
      deliveredAt
      cancelledAt
      assignedAt
      isRinged
      isRiderRinged
      instructions
    }
  }
`

export const COUPON = gql`mutation Coupon($coupon: String!) {
  coupon(coupon: $coupon) {
    coupon {
      _id
      discount
      enabled
      title
    }
    message
    success
    `

export const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
      message
    }
  }
`

export const CANCEL_SUBSCRIPTION = gql`
  mutation CancelSubscription {
    cancelSubscription {
      message
    }
  }
`

export const UPDATE_SUBSCRIPTION = gql`
  mutation UpdateSubscription($input: UpdateSubscriptionInput!) {
    updateSubscription(input: $input) {
      message
    }
  }
`

export const CREATE_SUPPORT_TICKET = gql`
  mutation CreateSupportTicket($ticketInput: SupportTicketInput!) {
    createSupportTicket(ticketInput: $ticketInput) {
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
  }
`

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($messageInput: MessageInput!) {
    createMessage(messageInput: $messageInput) {
      _id
      senderType
      content
      isRead
      ticket
      createdAt
      updatedAt
    }
  }
`
