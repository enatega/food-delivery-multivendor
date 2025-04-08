import { gql } from "@apollo/client";

export const TOGGLE_AVAILIBILITY = gql`
  mutation ToggleAvailability($restaurantId: String) {
    toggleAvailability(restaurantId: $restaurantId) {
      _id
      isAvailable
    }
  }
`;
