import { gql } from "@apollo/client";

export const CHAT_QUERY = gql`
  query Chat($order: ID!) {
    chat(order: $order) {
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
