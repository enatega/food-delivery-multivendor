import gql from "graphql-tag"

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
}`


export const UPDATE_USER_CART = gql`
mutation UserCartData($input: CartInput!) {
  userCartData(input: $input) {
    message
    success
  }
}`


export const UPDATE_USER_CART_COUNT = gql`
  mutation UpdateUserCartCount($input: UpdateCartCountInput!) {
    updateUserCartCount(input: $input) {
      success
      message
      quantity
      itemTotal
      foodTotal
      grandTotal
    }
  }
`
export const CREATE_SUBSCRIPTION = gql`
mutation CreateSubscription($input: CreateSubscriptionInput!) {
  createSubscription(input: $input) {
    message
  }
}`

export const CANCEL_SUBSCRIPTION = gql`
mutation CancelSubscription {
  cancelSubscription {
    message
  }
}`

export const UPDATE_SUBSCRIPTION = gql`
mutation UpdateSubscription($input: UpdateSubscriptionInput!) {
  updateSubscription(input: $input) {
    message
  }
}`

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
}`