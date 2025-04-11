import { gql } from "@apollo/client";

export const SAVE_TOKEN = gql`
  mutation saveRestaurantToken($token: String, $isEnabled: Boolean) {
    saveRestaurantToken(token: $token, isEnabled: $isEnabled) {
      _id
      notificationToken
      enableNotification
    }
  }
`;
