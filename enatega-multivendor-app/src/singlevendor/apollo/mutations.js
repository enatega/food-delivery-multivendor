import gql from "graphql-tag"

export const TOGGLE_FAVORITE_ITEM_SINGLE_VENDOR = gql`
mutation ToggleFavoriteFoodSingleVendor($toggleFavoriteFoodSingleVendorId: ID!) {
  toggleFavoriteFoodSingleVendor(id: $toggleFavoriteFoodSingleVendorId) {
    success
    message
    isFavorite
  }
}`