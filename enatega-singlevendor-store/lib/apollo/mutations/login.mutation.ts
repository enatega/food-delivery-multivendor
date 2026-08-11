import { gql } from "@apollo/client";

export const STORE_LOGIN = gql`
  mutation RestaurantLogin(
    $username: String!
    $password: String!
    $notificationToken: String
  ) {
    restaurantLogin(
      username: $username
      password: $password
      notificationToken: $notificationToken
    ) {
      token
      restaurantId
    }
  }
`;
