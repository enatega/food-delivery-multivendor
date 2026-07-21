import { gql } from "@apollo/client";

export const CHAT = gql`
  query Chat($order: ID!) {
    chat(order: $order) {
      id
      message
      image
      user {
        id
        name
      }
      createdAt
    }
  }
`;
