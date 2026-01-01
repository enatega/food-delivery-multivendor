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
