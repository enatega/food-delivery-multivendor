import gql from 'graphql-tag'

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
      message
      success
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
  mutation PlaceOrder($paymentMethod: String!, $address: AddressInput!, $tipping: Float!, $orderDate: String!, $isPickedUp: Boolean!, $specialInstructions: String, $couponCode: String, $instructions: String, $scheduleData: ScheduleData,  $isPriority: Boolean) {
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
  }
}`