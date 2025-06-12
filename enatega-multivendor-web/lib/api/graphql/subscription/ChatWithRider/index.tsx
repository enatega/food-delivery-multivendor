import { gql } from "@apollo/client";


 export const SUBSCRIPTION_NEW_MESSAGE = gql`
  subscription SubscriptionNewMessage($order: ID!) {
    subscriptionNewMessage(order: $order) {
      id
      message
      user {
        id
        name
      }
      createdAt
    }
  }
`;