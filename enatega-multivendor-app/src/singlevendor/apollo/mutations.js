import gql from "graphql-tag"

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